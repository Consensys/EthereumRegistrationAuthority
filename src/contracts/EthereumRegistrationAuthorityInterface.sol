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

/**
 * Interface for Ethereum Registration Authorities.
 */
interface EthereumRegistrationAuthorityInterface {
    /**
     * Add or update a domain record. Domain records are indexed based on the domain hash.
     * The domain hash is calculated as:
     *
     * _domainHash = keccak256(top-level domain)
     * or
     * _domainHash = keccak256(second-level domain '.' top-level domain)
     * or
     * _domainHash = keccak256(sub-domain '.' second-level domain '.' top-level domain)
     * or
     * _domainHash = keccak256(sub-domain '.' sub-domain '.' second-level domain '.' top-level domain)
     * etc
     *
     * Only the domain owner can call this function. When there is no entry for the domain, the domain owner will
     * be the owner of this registration authority.
     *
     * @param _domainHash       Keccak256 message digest of the domain to add or update.
     * @param _domainAuthority  Contract to resolve sub-domains. This contract must implement this interface.
     *                           Set this parameter to 0x01 if the domain authority contract address should not be set
     *                           or changed.
     * @param _domainInfo       Contract which holds domain information for the domain name identified by
     *                           _domainHash. Set this parameter to 0x01 if the organisation information contract
     *                           address should not be set or updated.
     * @param _domainOwner      Account entitled to update the _domainAuthority or the _domainInfo address for this domain
     *                           hash. Set this parameter to 0x01 if the domain owner address should not be set or changed.
     *                           Having this parameter 0x01 when setting a domain record for the first time indicates
     *                           the Ethereum Registration Authority contract owner is the domain owner for this
     *                           domain record.
     */
    function addUpdateDomain(uint256 _domainHash, address _domainAuthority, address _domainInfo, address _domainOwner) external;

    /**
     * Remove a domain record.
     *
     * Only the owner of this registration authority can call this function.
     *
     * @param _domainHash      Keccak256 message digest of the domain to remove.
     */
    function removeDomain(uint256 _domainHash) external;


    /**
    * Returns true if the this registration authority instance has an entry for the domain hash.
    *
    * @param _domainHash    Keccak256 message digest of the domain to check.
    * @return true if there is an entryfor the domain hash.
    */
    function hasDomain(uint256 _domainHash) external view returns (bool);

    /**
    * Fetch the contract which can be used to resolve sub-domains for this domain.
    *
    * @param _domainHash    Keccak256 message digest of the domain to check.
    * @return The address of the Ethereum Registration Authority instance which can provide information about
    *          sub-domains for this domain, or 0 if no such authority contract has been set.
    */
    function getAuthority(uint256 _domainHash) external view returns (address);

    /**
    * Fetch the contract which holds records for this domain.
    *
    * @param _domainHash    Keccak256 message digest of the domain to check.
    * @return The address of the DomainInfoInterface instance which has information for the domain, or
    *          0 if not such address has been set.
    */
    function getDomainInfo(uint256 _domainHash) external view returns (address);

    /**
    * Fetch the account which can send transactions to change the entry for this domain.
    *
    * @param _domainHash    Keccak256 message digest of the domain to check.
    * @return The address of the owner of the entry for the domain, or 0 if the owner is the owner of this Ethereum
    * Registration Authority instance.
    */
    function getDomainOwner(uint256 _domainHash) external view returns (address);


    /**
    * Get the implementation version of the contract.
    *
    * @return The version number of the contract.
    */
    function getVersion() external pure returns (uint16);



    event DomainAddUpdate(uint256 indexed _domainHash,  address _domainAuthority, address _orgInfo, address _owner);
    event DomainRemoved(uint256 indexed _domainHash);
}