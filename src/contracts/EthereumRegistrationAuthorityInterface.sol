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

/**
 * Interface for Ethereum Registration Authorities.
 */
interface EthereumRegistrationAuthorityInterface {
    /**
     * Add or update a domain record. Domain records are indexed based on the domain hash or a domain name.
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
     * @param _domainHash       Keccak256 message digest of a complete or partial domain name to add or update a record
     *                           for.
     * @param _domainAuthority  Contract to resolve sub-domains. Another copy of this contract.
     *                           Set this parameter to 0x01 if the domain authority contract address should not be set
     *                           or changed.
     * @param _orgInfo          Contract which holds organisation information for the domain name identified by
     *                           _domainHash. Set this parameter to 0x01 if the organisation information contract
     *                           address should not be set or update.
     * @param _domainOwner      Account entitled to update the _domainAuthority or the _orgInfo address for this domain
     *                           hash. Set this parameter to 0x01 if the domain owner address should not be changed.
     *                           Having this parameter 0x01 when setting a domain record for the first time indicates
     *                           the Ethereum Registration Authority contract owner is the domain owner for this
     *                           domain record.
     */
    function addUpdateDomain(uint256 _domainHash, address _domainAuthority, address _orgInfo, address _domainOwner) external;

    /**
     * Remove a domain record.
     *
     * @param _domainHash      Message digest of domain name for domain record to remove.
     */
    function removeDomain(uint256 _domainHash) external;


    /**
    * Returns true if the ERA has a domain record for the domain hash.
    *
    * @param _domainHash Keccak256 message digest of a complete or partial domain name.
    * @return true if there is a domain record for the domain hash.
    */
    function hasDomain(uint256 _domainHash) external view returns (bool);
    function getDomainOwner(uint256 _domainHash) external view returns (address);
    function getAuthority(uint256 _domainHash) external view returns (address);
    function getDomainInfo(uint256 _domainHash) external view returns (address);


    function getVersion() external pure returns (uint16);


    event DomainAddUpdate(uint256 indexed _domainHash,  address _domainAuthority, address _orgInfo, address _owner);
    event DomainRemoved(uint256 indexed _domainHash);
}