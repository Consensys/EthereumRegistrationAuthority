pragma solidity ^0.4.23; // TODO not sure what language version this should be.

import "./ownable.sol";


/**
 * Interface for Ethereum Registration Authorities.
 */
contract AbstractERA is Ownable {
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
    function addDomain(bytes32 _domainHash, address _domainAuthority, address _orgInfo, address _domainOwner) public;
    function addDomainAuthorityOnly(bytes32 _domainHash, address _domainAuthority, address _domainOwner) public;
    function addDomainOrgInfoOnly(bytes32 _domainHash, address _orgInfo, address _domainOwner) public;
    function removeDomain(bytes32 _domainHash) public;


    //***************************** Domain Record Update ******************************
    // Permissions: Domain Record owner only.

    function changeAuthority(bytes32 _domainHash, address _newDomainAuthority) public;
    function changeOrgInfo(bytes32 _domainHash, address _newOrgInfo) public;

    /**
     * Transfers ownership of a domain record to a new address. May only be called by the current
     * owner of the domain.
     * @param _domainHash  The domain record to transfer ownership of.
     * @param _newDomainOwner    The address of the new domain record owner.
     */
    function changeOwner(bytes32 _domainHash, address _newDomainOwner) public;

    /**
    * Returns true if the ERA has a domain record for the domain hash.
    *
    * @param _domainHash Keccak256 message digest of a complete or partial domain name.
    * @return true if there is a domain record for the domain hash.
    */
    function hasDomain(bytes32 _domainHash) public view returns (bool);
    function getDomainOwner(bytes32 _domainHash) public view returns (address);
    function getAuthority(bytes32 _domainHash) public view returns (address);
    function getOrgInfo(bytes32 _domainHash) public view returns (address);


    event DomainAdded(bytes32 _domainHash);
    event DomainRemoved(bytes32 _domainHash);
    event DomainAuthorityChanged(bytes32 _domainHash, address _newDomainAuthority);
    event DomainInfoChanged(bytes32 _domainHash, address _newOrgInfo);
    event DomainOwnerChanged(bytes32 _domainHash, address _newOwner);
}