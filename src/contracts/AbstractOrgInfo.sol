pragma solidity ^0.4.18;

import "./Ownable.sol";

contract AbstractOrgInfo is Ownable {
    function addKeyValue(bytes32 _key, string _value) public;
    function removeKeyValue(bytes32 _key) public;
    function updateKeyValue(bytes32 _key, string _value) public;

    function getValue(bytes32 _key) public view returns(string);


    event AddedKeyValue(bytes32 _key);
    event RemovedKeyValue(bytes32 _key);
    event UpdatedKeyValue(bytes32 _key);

}