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
    //***************************** Add and Remove Domains ******************************
    // Permissions: Ethereum Registration Authority owner only.


    /**
     * Top Level Domain LeDomain name, name hash: message digest(second level domain . top level domain)
     * The idea is not obfuscation - it is so the name used for look-up is a fixed length to give deterministic gas cost.
     *
     * _domainHash = message digest(top-level domain)
     * or
     * _domainHash = message digest(second-level domain '.' top-level domain)
     * or
     * _domainHash = message digest(sub-domain '.' second-level domain '.' top-level domain)
     * or
     * _domainHash = message digest(sub-domain '.' sub-domain '.' second-level domain '.' top-level domain)
     * etc
     *
     * Search algorithm:
     * Regquest
     *
     * @param _domainHash       Keccak256 message digest of a complete or partial domain name.
     * @param _domainAuthority  Contract to resolve sub-domains. Another copy of this contract.
     * @param _orgInfo          Contract which holds Organisation information for the domain name identitied by _domainHash.
     * @param _domainOwner      Account entitled to update the _domainAuthority address.
     */
    function addDomain(uint256 _domainHash, address _domainAuthority, address _orgInfo, address _domainOwner) external;

    function removeDomain(uint256 _domainHash) external;


    //***************************** Domain Record Update ******************************
    // Permissions: Domain Record owner only.

    function changeAuthority(uint256 _domainHash, address _newDomainAuthority) external;
    function changeOrgInfo(uint256 _domainHash, address _newOrgInfo) external;

    /**
     * Transfers ownership of a domain record to a new address. May only be called by the current
     * owner of the domain.
     * @param _domainHash  The domain record to transfer ownership of.
     * @param _newDomainOwner    The address of the new domain record owner.
     */
    function changeOwner(uint256 _domainHash, address _newDomainOwner) external;

    /**
    * Returns true if the ERA has a domain record for the domain hash.
    *
    * @param _domainHash Keccak256 message digest of a complete or partial domain name.
    * @return true if there is a domain record for the domain hash.
    */
    function hasDomain(uint256 _domainHash) external view returns (bool);
    function getDomainOwner(uint256 _domainHash) external view returns (address);
    function getAuthority(uint256 _domainHash) external view returns (address);
    function getOrgInfo(uint256 _domainHash) external view returns (address);


    function getVersion() external pure returns (uint16);


    event DomainAdded(uint256 _domainHash);
    event DomainRemoved(uint256 _domainHash);
    event DomainAuthorityChanged(uint256 _domainHash, address _newDomainAuthority);
    event DomainInfoChanged(uint256 _domainHash, address _newOrgInfo);
    event DomainOwnerChanged(uint256 _domainHash, address _newOwner);
}