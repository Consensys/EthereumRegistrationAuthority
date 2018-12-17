/*
 * Copyright 2018 ConsenSys AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
pragma solidity ^0.5.0;

import "./FinderInterface.sol";
import "./EthereumRegistrationAuthorityInterface.sol";


/**
* Resolve the DomainInfo contracts for the domains.
*/
contract Finder_v1 is FinderInterface {
    uint16 constant public VERSION_ONE = 1;



    function resolveDomain(address[] calldata _eras, uint256 _domainHash, uint256 _p1DomainHash, uint256 _p2DomainHash, uint256 _p3DomainHash) external view returns(address) {
        return resolveDomainInternal(_eras, _domainHash, _p1DomainHash, _p2DomainHash, _p3DomainHash);
    }

    function resolveDomains(address[] calldata _eras, uint256[] calldata _domainHashes, uint256[] calldata _p1DomainHashes, uint256[] calldata _p2DomainHashes, uint256[] calldata _p3DomainHashes) external view returns(address[NUMBER_OF_ADDRESSES] memory) {
        // Only fixed length arrays can be returned from Solidity code. As such, limit the number of domains that are searched for.
        require(_domainHashes.length < NUMBER_OF_ADDRESSES);

        address[NUMBER_OF_ADDRESSES] memory orgInfoAddresses;

        for (uint256 i = 0; i < _domainHashes.length; i++) {
            orgInfoAddresses[i] = resolveDomainInternal(_eras, _domainHashes[i], _p1DomainHashes[i], _p2DomainHashes[i], _p3DomainHashes[i]);
        }
        return orgInfoAddresses;
    }

    function getVersion() external pure returns (uint16) {
        return VERSION_ONE;
    }




    function resolveInternal(address _era, uint256 _domainHash, uint256 _p1DomainHash, uint256 _p2DomainHash, uint256 _p3DomainHash) private view returns(address) {
        EthereumRegistrationAuthorityInterface era = EthereumRegistrationAuthorityInterface(_era);
        if (era.hasDomain(_domainHash)) {
            return era.getDomainInfo(_domainHash);
        }

        if (_p1DomainHash == 0) {
            return address(0);
        }
        if (era.hasDomain(_p1DomainHash)) {
            address era1Address = era.getAuthority(_p1DomainHash);
            if (era1Address != address(0)) {
                EthereumRegistrationAuthorityInterface era1 = EthereumRegistrationAuthorityInterface(era1Address);
                return resolveInternal(address(era1), _domainHash, 0, 0, 0);
            }
        }

        if (_p2DomainHash == 0) {
            return address(0);
        }
        if (era.hasDomain(_p2DomainHash)) {
            address era2Address = era.getAuthority(_p2DomainHash);
            if (era2Address != address(0)) {
                EthereumRegistrationAuthorityInterface era2 = EthereumRegistrationAuthorityInterface(era2Address);
                return resolveInternal(address(era2), _domainHash, _p1DomainHash, 0, 0);
            }
        }

        if (_p3DomainHash == 0) {
            return address(0);
        }
        if (era.hasDomain(_p3DomainHash)) {
            address era3Address = era.getAuthority(_p3DomainHash);
            if (era3Address != address(0)) {
                EthereumRegistrationAuthorityInterface era3 = EthereumRegistrationAuthorityInterface(era3Address);
                return resolveInternal(address(era3), _domainHash, _p1DomainHash, _p2DomainHash, 0);
            }
        }
        return address(0);
    }


    function resolveDomainInternal(address[] memory _eras, uint256 _domainHash, uint256 _p1DomainHash, uint256 _p2DomainHash, uint256 _p3DomainHash) public view returns(address) {
        for (uint256 i = 0; i < _eras.length; i++) {
            address domainInfoAddress = resolveInternal(_eras[i], _domainHash, _p1DomainHash, _p2DomainHash, _p3DomainHash);
            if (domainInfoAddress != address(0)) {
                return domainInfoAddress;
            }
        }
        return address(0);
    }


}
