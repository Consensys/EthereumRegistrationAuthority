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
pragma solidity ^0.4.23;

import "./EthereumRegistrationAuthorityInterface.sol";
import "./ownable.sol";

/**
 * Implementation of Ethereum Registration Authority.
 *
 * See EthereumRegistrationAuthorityInterface.sol for documentation of the public API.
 */
contract ERA_v2 is EthereumRegistrationAuthorityInterface, Ownable {
    uint16 constant private VERSION = 2;
    address constant private ZERO = 0;


    // Maps of Keccak256(domain name) to records.
    // Having separate maps is more gas efficient than having a map with a record containing the three values.
    mapping(uint256=>address) private authorityMap;
    mapping(uint256=>address) private orgInfoMap;
    mapping(uint256=>address) private domainOwnerMap;


    // Permits modifications only by the owner of the specified domain.
    modifier onlyDomainOwner(uint256 _domainHash) {
        address tempOwner = domainOwnerMap[_domainHash];
        if (tempOwner == 0) {
            tempOwner = owner;
        }
        require(tempOwner == msg.sender);
        _;
    }

    function addUpdateDomain(uint256 _domainHash, address _domainAuthority, address _orgInfo, address _domainOwner) external onlyDomainOwner(_domainHash) {
        emit DomainAddUpdate(_domainHash, _domainAuthority, _orgInfo, _domainOwner);

        if (_domainAuthority != 1) {
            authorityMap[_domainHash] = _domainAuthority;
        }
        if (_orgInfo != 1) {
            orgInfoMap[_domainHash] = _orgInfo;
        }
        if (_domainOwner != 1) {
            domainOwnerMap[_domainHash] = _domainOwner;
        }
    }

    function removeDomain(uint256 _domainHash) external onlyOwner {
        emit DomainRemoved(_domainHash);
        if (authorityMap[_domainHash] != ZERO) {
            delete authorityMap[_domainHash];
        }
        if (orgInfoMap[_domainHash] != ZERO) {
            delete orgInfoMap[_domainHash];
        }
        if (domainOwnerMap[_domainHash] != ZERO) {
            delete domainOwnerMap[_domainHash];
        }
    }

    function hasDomain(uint256 _domainHash) external view returns (bool) {
        return !(authorityMap[_domainHash] == ZERO && orgInfoMap[_domainHash] == ZERO && domainOwnerMap[_domainHash] == ZERO);
    }

    function getDomainOwner(uint256 _domainHash) external view returns (address) {
        return domainOwnerMap[_domainHash];
    }

    function getAuthority(uint256 _domainHash) external view returns (address) {
        return authorityMap[_domainHash];
    }

    function getDomainInfo(uint256 _domainHash) external view returns (address) {
        return orgInfoMap[_domainHash];
    }

    function getVersion() external pure returns (uint16) {
        return VERSION;
    }
}