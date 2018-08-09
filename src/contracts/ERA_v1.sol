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
contract ERA_v1 is EthereumRegistrationAuthorityInterface, Ownable {
    uint16 constant private VERSION_ONE = 1;

    struct Record {
        address authority;
        address orgInfo;
        address owner;
    }
    mapping(uint256=>Record) private records;

    // Permits modifications only by the owner of the specified domain.
    modifier onlyDomainOwner(uint256 _domainHash) {
        require(records[_domainHash].owner == msg.sender);
        _;
    }


    function addDomain(uint256 _domainHash, address _domainAuthority, address _orgInfo, address _domainOwner) external onlyOwner {
        // Check that the entry does not exist before adding it.
        require(records[_domainHash].owner == address(0));
        emit DomainAdded(_domainHash);
        records[_domainHash] = Record(_domainAuthority, _orgInfo, _domainOwner);
    }

    function removeDomain(uint256 _domainHash) external onlyOwner {
        // Only allow domain records to be deleted for existing domains. Throw an error to
        // indicate to the calling application that something unexpected has happened.
        require(records[_domainHash].owner != address(0));
        emit DomainRemoved(_domainHash);
        delete records[_domainHash];
    }

    function changeAuthority(uint256 _domainHash, address _newDomainAuthority) external onlyDomainOwner(_domainHash) {
        emit DomainAuthorityChanged(_domainHash, _newDomainAuthority);
        records[_domainHash].authority = _newDomainAuthority;
    }

    function changeOrgInfo(uint256 _domainHash, address _newOrgInfo) external onlyDomainOwner(_domainHash) {
        emit DomainInfoChanged(_domainHash, _newOrgInfo);
        records[_domainHash].orgInfo = _newOrgInfo;
    }

    function changeOwner(uint256 _domainHash, address _newDomainOwner) external onlyDomainOwner(_domainHash) {
        emit DomainOwnerChanged(_domainHash, _newDomainOwner);
        records[_domainHash].owner = _newDomainOwner;
    }

    function hasDomain(uint256 _domainHash) external view returns (bool) {
        return records[_domainHash].owner != address(0);
    }

    function getDomainOwner(uint256 _domainHash) external view returns (address) {
        return records[_domainHash].owner;
    }

    function getAuthority(uint256 _domainHash) external view returns (address) {
        return records[_domainHash].authority;
    }

    function getOrgInfo(uint256 _domainHash) external view returns (address) {
        return records[_domainHash].orgInfo;
    }

    function getVersion() external pure returns (uint16) {
        return VERSION_ONE;
    }
}