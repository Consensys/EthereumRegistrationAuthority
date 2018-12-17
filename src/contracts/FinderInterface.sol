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
 * Interface for Ethereum Registration Authority Resolver.
 *
 * The Resolver contract provides an on-chain way of determining the addresses of OrgInfo
 * contracts for a list of domains. Doing this search on-chain should mean significantly
 * fewer JSON RPC calls.
 */
contract FinderInterface {
    uint constant public NUMBER_OF_ADDRESSES = 10;


    /**
    * Resolve the address of the DomainInfo contract for a domain, given a list of ERAs.
    *
    * @param _eras          List of ERAs to search for domain and parent domains.
    * @param _domainHash    Domain hash of the domain to search for. For example: abc.def.pegasys.tech
    * @param _p1DomainHash  If the domain corresponding to _domainHash can't be found in the ERAs, the domain hash
    *                        of the parent domain to search for. For example: def.pegasys.tech
    * @param _p2DomainHash  If the domain corresponding to _domainHash and _p1DomainHash can't be found in the ERAs,
    *                        the domain hash of the grant parent domain to search for. For example: pegasys.tech
    * @param _p3DomainHash  If the domain corresponding to _domainHash, _p1DomainHash and  _p2DomainHash can't
    *                        be found in the ERAs, the domain hash of the great grand parent domain to search for.
    *                        For example: tech
    * @return Address of the DomainInfo contract, or zero if the address can not be found.
    */
    function resolveDomain(address[] calldata _eras, uint256 _domainHash, uint256 _p1DomainHash, uint256 _p2DomainHash, uint256 _p3DomainHash) external view returns(address);


    /**
    * Resolve the addresses of the DomainInfo contracts for a set of domains, given a list of ERAs.
    *
    * @param _eras          List of ERAs to search for domain and parent domains.
    * @param _domainHashes    Domain hashes of the domains to search for. For example: abc.def.pegasys.tech
    * @param _p1DomainHashes  Domain hashes of the parent domains to search for. For example: def.pegasys.tech
    * @param _p2DomainHashes  Domain hashes of the grant parent domains to search for. For example: pegasys.tech
    * @param _p3DomainHashes  Domain hashes of the great grand parent domains to search for. For example: tech
    * @return Addresses of the DomainInfo contract. Zero is returned for a domain if the domain record can not be found.
    * NOTE: Solidity doesn't allow functions to return variable amounts of data. As such, an array
    * of 10 addresses is returned. If less than 10 domains are requested, then the array is zero filled.
    */
    function resolveDomains(address[] calldata _eras, uint256[] calldata _domainHashes, uint256[] calldata _p1DomainHashes, uint256[] calldata _p2DomainHashes, uint256[] calldata _p3DomainHashes) external view returns(address[NUMBER_OF_ADDRESSES] memory);

    function getVersion() external pure returns (uint16);
}