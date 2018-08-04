pragma solidity ^0.4.18;

import "./AbstractOrgInfo.sol";


/**

* Note: At present, no AddKeyValues is possible because the ABI doesn't support passing arrays of strings.
*/
contract OrgInfo is AbstractOrgInfo {
    mapping(bytes32=>string) public info;

    function addKeyValue(bytes32 _key, string _value) public onlyOwner {
        // Key can't exist when adding.
        require(bytes(info[_key]).length == 0);
        emit AddedKeyValue(_key);
        info[_key] = _value;
    }

    function removeKeyValue(bytes32 _key) public onlyOwner {
        // Key must exist when removing.
        require(bytes(info[_key]).length != 0);
        emit RemovedKeyValue(_key);
        delete info[_key];
    }

    function updateKeyValue(bytes32 _key, string _value) public onlyOwner {
        // Key must exist when updating.
        require(bytes(info[_key]).length != 0);
        emit UpdatedKeyValue(_key);
        info[_key] = _value;
    }

    function getValue(bytes32 _key) public view returns(string){
        return info[_key];
    }

    event AddedKeyValue(bytes32 _key);
    event RemovedKeyValue(bytes32 _key);
    event UpdatedKeyValue(bytes32 _key);
}