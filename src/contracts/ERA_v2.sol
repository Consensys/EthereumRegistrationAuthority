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

import "./EthereumRegistrationAuthorityInterface.sol";
import "./Ownable.sol";

/**
 * Implementation of Ethereum Registration Authority.
 *
 * See EthereumRegistrationAuthorityInterface.sol for documentation of the public API.
 */
contract ERA_v2 is EthereumRegistrationAuthorityInterface, Ownable {
    uint16 constant private VERSION = 2;

    // Zero is the default value when a storage location has not been set. It is used to indicate that a value
    // has not been set in a storage location.
    address constant private STORAGE_LOCATION_NOT_SET = address(0);

    // One is used to indicate that a location should not be set in the add or update function. Not having this
    // equal to the value used when a location is not set means that a value can be set to 0 indicating it is not
    // in use.
    address constant private DO_NOT_CHANGE = address(1);

    // Maps of Keccak256(domain name) to records.
    // Having separate maps is slightly more gas efficient than having a map with a record containing the three values.
    mapping(uint256=>address) private authorityMap;
    mapping(uint256=>address) private domainInfoMap;
    mapping(uint256=>address) private domainOwnerMap;


    // Permits modifications only by the owner of the specified domain.
    // If the owner of a domain is 0 then the owner is the owner of the ERA contract.
    modifier onlyDomainOwner(uint256 _domainHash) {
        address tempOwner = domainOwnerMap[_domainHash];
        if (tempOwner == STORAGE_LOCATION_NOT_SET) {
            tempOwner = owner;
        }
        require(tempOwner == msg.sender);
        _;
    }

    function addUpdateDomain(uint256 _domainHash, address _domainAuthority, address _domainInfo, address _domainOwner) external onlyDomainOwner(_domainHash) {
        emit DomainAddUpdate(_domainHash, _domainAuthority, _domainInfo, _domainOwner);

        if (_domainAuthority != DO_NOT_CHANGE) {
            authorityMap[_domainHash] = _domainAuthority;
        }
        if (_domainInfo != DO_NOT_CHANGE) {
            domainInfoMap[_domainHash] = _domainInfo;
        }
        if (_domainOwner != DO_NOT_CHANGE) {
            domainOwnerMap[_domainHash] = _domainOwner;
        }
    }

    function removeDomain(uint256 _domainHash) external onlyOwner {
        emit DomainRemoved(_domainHash);
        if (authorityMap[_domainHash] != STORAGE_LOCATION_NOT_SET) {
            delete authorityMap[_domainHash];
        }
        if (domainInfoMap[_domainHash] != STORAGE_LOCATION_NOT_SET) {
            delete domainInfoMap[_domainHash];
        }
        if (domainOwnerMap[_domainHash] != STORAGE_LOCATION_NOT_SET) {
            delete domainOwnerMap[_domainHash];
        }
    }

    function hasDomain(uint256 _domainHash) external view returns (bool) {
        return !(authorityMap[_domainHash] == STORAGE_LOCATION_NOT_SET && domainInfoMap[_domainHash] == STORAGE_LOCATION_NOT_SET && domainOwnerMap[_domainHash] == STORAGE_LOCATION_NOT_SET);
    }

    function getAuthority(uint256 _domainHash) external view returns (address) {
        return authorityMap[_domainHash];
    }

    function getDomainInfo(uint256 _domainHash) external view returns (address) {
        return domainInfoMap[_domainHash];
    }

    function getDomainOwner(uint256 _domainHash) external view returns (address) {
        return domainOwnerMap[_domainHash];
    }

    function getVersion() external pure returns (uint16) {
        return VERSION;
    }
}