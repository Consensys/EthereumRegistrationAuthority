pragma solidity ^0.4.18;

import "./AbstractERA.sol";


/**
 *
 *
 * See AbstractERA for public function level documentation.
 */
contract ERA is AbstractERA {
    struct Record {
        address authority;
        address orgInfo;
        address owner;
    }

    mapping(bytes32=>Record) public records;

    // Permits modifications only by the owner of the specified domain.
    modifier onlyDomainOwner(bytes32 _domainHash) {
        require(records[_domainHash].owner == msg.sender);
        _;
    }


    // See overridden function for docs.
    function addDomain(bytes32 _domainHash, address _domainAuthority, address _orgInfo, address _domainOwner) public onlyOwner {
        // Check that the entry does not exist before adding it.
        require(records[_domainHash].owner == address(0));
        emit DomainAdded(_domainHash);
        records[_domainHash] = Record(_domainAuthority, _orgInfo, _domainOwner);
    }



    function addDomainAuthorityOnly(bytes32 _domainHash, address _domainAuthority, address _domainOwner) public onlyOwner {
        addDomain(_domainHash, _domainAuthority, address(0), _domainOwner);
    }

    function addDomainOrgInfoOnly(bytes32 _domainHash, address _orgInfo, address _domainOwner) public onlyOwner {
        addDomain(_domainHash, address(0), _orgInfo, _domainOwner);
    }

    function removeDomain(bytes32 _domainHash) public onlyOwner {
        // Only allow domain records to be deleted for existing domains. Throw an error to
        // indicate to the calling application that something unexpected has happened.
        require(records[_domainHash].owner != address(0));

        emit DomainRemoved(_domainHash);
        delete records[_domainHash];
    }


    function changeAuthority(bytes32 _domainHash, address _newDomainAuthority) public onlyDomainOwner(_domainHash) {
        emit DomainAuthorityChanged(_domainHash, _newDomainAuthority);
        records[_domainHash].authority = _newDomainAuthority;
    }


    function changeOrgInfo(bytes32 _domainHash, address _newOrgInfo) public onlyDomainOwner(_domainHash) {
        emit DomainInfoChanged(_domainHash, _newOrgInfo);
        records[_domainHash].orgInfo = _newOrgInfo;
    }


    // @Override
    function changeOwner(bytes32 _domainHash, address _newDomainOwner) public onlyDomainOwner(_domainHash) {
        emit DomainOwnerChanged(_domainHash, _newDomainOwner);
        records[_domainHash].owner = _newDomainOwner;
    }

    function hasDomain(bytes32 _domainHash) public view returns (bool) {
        return records[_domainHash].owner != address(0);
    }


    function getDomainOwner(bytes32 _domainHash) public view returns (address) {
        return records[_domainHash].owner;
    }

    function getAuthority(bytes32 _domainHash) public view returns (address) {
        return records[_domainHash].authority;
    }

    function getOrgInfo(bytes32 _domainHash) public view returns (address) {
        return records[_domainHash].orgInfo;
    }


    event DomainAdded(bytes32 _domainHash);
    event DomainRemoved(bytes32 _domainHash);
    event DomainAuthorityChanged(bytes32 _domainHash, address _newDomainAuthority);
    event DomainInfoChanged(bytes32 _domainHash, address _newOrgInfo);
    event DomainOwnerChanged(bytes32 _domainHash, address _newOwner);
}