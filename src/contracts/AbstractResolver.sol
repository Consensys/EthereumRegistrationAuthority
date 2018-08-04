pragma solidity ^0.4.23; // TODO not sure what language version this should be.

/**
 * Interface for Ethereum Registration Authority Resolver.
 *
 * The Resolver contract provides an on-chain way of determining the addresses of OrgInfo
 * contracts for a list of domains. Doing this search on-chain should mean significantly
 * fewer JSON RPC calls.
 */
contract AbstractResolver {
    uint constant public NUMBER_OF_ADDRESSES = 10;

    /**
    * Resolve the address of the OrgInfo contract for a domain, given a ERAs.
    *
    * @param _era          List of ERAs to search for domain and parent domains.
    * @param _domainHash    Domain hash of the domain to search for. For example: abc.def.pegasys.tech
    * @param _p1DomainHash  Domain hash of the parent domain to search for. For example: def.pegasys.tech
    * @param _p2DomainHash  Domain hash of the grant parent domain to search for. For example: pegasys.tech
    * @param _p3DomainHash  Domain hash of the great grand parent domain to search for. For example: tech
    * @return Address of the OrgInfo contract. Zero is returned if the domain record can not be found.
    */
    function resolve(address _era, bytes32 _domainHash, bytes32 _p1DomainHash, bytes32 _p2DomainHash, bytes32 _p3DomainHash) public view returns(address);



    /**
    * Resolve the address of the OrgInfo contract for a domain, given a list of ERAs.
    *
    * @param _eras          List of ERAs to search for domain and parent domains.
    * @param _domainHash    Domain hash of the domain to search for. For example: abc.def.pegasys.tech
    * @param _p1DomainHash  Domain hash of the parent domain to search for. For example: def.pegasys.tech
    * @param _p2DomainHash  Domain hash of the grant parent domain to search for. For example: pegasys.tech
    * @param _p3DomainHash  Domain hash of the great grand parent domain to search for. For example: tech
    * @return Address of the OrgInfo contract. Zero is returned if the domain record can not be found.
    */
    function resolveDomain(address[] _eras, bytes32 _domainHash, bytes32 _p1DomainHash, bytes32 _p2DomainHash, bytes32 _p3DomainHash) public view returns(address);


    /**
    * Resolve the addresses of the OrgInfo contracts for a set of domains, given a list of ERAs.
    *
    * @param _eras          List of ERAs to search for domain and parent domains.
    * @param _domainHashes    Domain hashes of the domains to search for. For example: abc.def.pegasys.tech
    * @param _p1DomainHashes  Domain hashes of the parent domains to search for. For example: def.pegasys.tech
    * @param _p2DomainHashes  Domain hashes of the grant parent domains to search for. For example: pegasys.tech
    * @param _p3DomainHashes  Domain hashes of the great grand parent domains to search for. For example: tech
    * @return Addresses of the OrgInfo contract. Zero is returned for a domain if the domain record can not be found.
    * NOTE: Solidity doesn't allow functions to return variable amounts of data. As such, an array
    * of 10 addresses is returned. If less than 10 domains are requested, then the array is zero filled.
    */
    function resolveDomains(address[] _eras, bytes32[] _domainHashes, bytes32[] _p1DomainHashes, bytes32[] _p2DomainHashes, bytes32[] _p3DomainHashes) public view returns(address[NUMBER_OF_ADDRESSES]);
}