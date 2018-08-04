pragma solidity ^0.4.18;

import "./AbstractResolver.sol";
import "./AbstractERA.sol";

/**
* Resolve the OrgInfo contracts for the domains.
*/
contract Resolver is AbstractResolver {



    function resolve(address _era, bytes32 _domainHash, bytes32 _p1DomainHash, bytes32 _p2DomainHash, bytes32 _p3DomainHash) public view returns(address) {
        AbstractERA era = AbstractERA(_era);
        if (era.hasDomain(_domainHash)) {
            return era.getOrgInfo(_domainHash);
        }

        if (_p1DomainHash == 0) {
            return address(0);
        }
        if (era.hasDomain(_p1DomainHash)) {
            address era1Address = era.getAuthority(_p1DomainHash);
            if (era1Address != address(0)) {
                AbstractERA era1 = AbstractERA(era1Address);
                return resolve(era1, _domainHash, 0, 0, 0);
            }
        }

        if (_p2DomainHash == 0) {
            return address(0);
        }
        if (era.hasDomain(_p2DomainHash)) {
            address era2Address = era.getAuthority(_p2DomainHash);
            if (era2Address != address(0)) {
                AbstractERA era2 = AbstractERA(era2Address);
                return resolve(era2, _domainHash, _p1DomainHash, 0, 0);
            }
        }

        if (_p3DomainHash == 0) {
            return address(0);
        }
        if (era.hasDomain(_p3DomainHash)) {
            address era3Address = era.getAuthority(_p3DomainHash);
            if (era3Address != address(0)) {
                AbstractERA era3 = AbstractERA(era3Address);
                return resolve(era3, _domainHash, _p1DomainHash, _p2DomainHash, 0);
            }
        }
        return address(0);
    }


    function resolveDomain(address[] _eras, bytes32 _domainHash, bytes32 _p1DomainHash, bytes32 _p2DomainHash, bytes32 _p3DomainHash) public view returns(address) {
        for (uint256 i = 0; i < _eras.length; i++) {
            address orgInfoAddress = resolve(_eras[i], _domainHash, _p1DomainHash, _p2DomainHash, _p3DomainHash);
            if (orgInfoAddress != address(0)) {
                return orgInfoAddress;
            }
        }
        return address(0);
    }




    function resolveDomains(address[] _eras, bytes32[] _domainHashes, bytes32[] _p1DomainHashes, bytes32[] _p2DomainHashes, bytes32[] _p3DomainHashes) public view returns(address[NUMBER_OF_ADDRESSES]) {
        // Only fixed length arrays can be returned from Solidity code. As such, limit the number of domains that are searched for.
        require(_domainHashes.length < NUMBER_OF_ADDRESSES);

        address[NUMBER_OF_ADDRESSES] memory orgInfoAddresses;

        for (uint256 i = 0; i < _domainHashes.length; i++) {
            orgInfoAddresses[i] = resolveDomain(_eras, _domainHashes[i], _p1DomainHashes[i], _p2DomainHashes[i], _p3DomainHashes[i]);
        }
        return orgInfoAddresses;
    }
}
