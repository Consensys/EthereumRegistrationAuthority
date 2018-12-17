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
* Domain Information contracts hold information pertaining to one or more domains. The information is stored as key
* value pairs. Keys are determined as shown below. The format of values is dependant on the type of information being
* stored, which depends on the key.
*
* Key Format
* ----------
* keccak256(domain name, ":", key type)
*
* The domain name is the full domain name ("server1.example.com") or the special wild card domain ("*"). Keys which
* use the wild card provide default values for all domains in this Domain Information contract.
*
* Key type is either a value defined below or a user defined values. To avoid name collision, user defined keys
* should be prefixed using reverse domain name ordering for the domain which creates the key.
*
* Defined Keys             Expected Value and Value Format
* dns.a                    IPv4 address as described in RFC 1035: https://tools.ietf.org/html/rfc1035
* dns.aaaa                 IPv6 address as described in RFC 3596: https://tools.ietf.org/html/rfc3596
* dns.txt                  Text strings as described in RFC 1035: https://tools.ietf.org/html/rfc1035
* ef.enode                 Enode address in ASCII as described here: https://github.com/ethereum/wiki/wiki/enode-url-format
*
* tech.pegasys.sc.enc      Public encryption key / key agreement key for the Enterprise Ethereum node.
* tech.pegasys.sc.size     The maximum number of nodes in a sidechain cluster. Domain names for the cluster are expected
*                           to be named sc0.domain to sc(size-1).domain.
* tech.pegasys.contact.email Email address to use to contact the owner of the domain.
*
* Example Keys
* ------------
* keccak256(pegasys.tech:dns.a)                                 The IPv4 address for pegasys.tech.
* keccak256(*.sidechain.pegasys.tech:tech.pegasys.sc.size)      The maximum number of nodes in the sidechain cluster for sidechain.pegasys.tech.
* keccak256(sc3.sidechain.pegasys.tech:ef.enode)                The enode address of node sc3.sidechain.pegasys.tech.
* keccak256(*:tech.pegasys.contact.email)                       The email address to be used to contact the owner of the DomainInfo instance.
*/
contract DomainInfoInterface {
    /**
    * Set a value against a key.
    *
    * @param _key  A key which should conform to the format described above.
    */
    function setValue(uint256 _key, bytes calldata _value) external;
    function deleteValue(uint256 _key) external;
    function getValue(uint256 _key) external view returns(bytes memory);

    function getVersion() external pure returns (uint16);
}