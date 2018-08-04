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

import "./OrgInfoInterface.sol";
import "./Ownable.sol";


/**

* Note: At present, no AddKeyValues is possible because the ABI doesn't support passing arrays of strings.
*/
contract OrgInfo_v1 is OrgInfoInterface, Ownable {
    uint16 constant private VERSION_ONE = 1;

    mapping(uint256=>bytes) private info;

    function addKeyValue(uint256 _key, bytes _value) external onlyOwner {
        // Key can't exist when adding.
        require(info[_key].length == 0);
        emit AddedKeyValue(_key);
        info[_key] = _value;
    }

    function removeKeyValue(uint256 _key) external onlyOwner {
        // Key must exist when removing.
        require(info[_key].length != 0);
        emit RemovedKeyValue(_key);
        delete info[_key];
    }

    function updateKeyValue(uint256 _key, bytes _value) external onlyOwner {
        // Key must exist when updating.
        require(info[_key].length != 0);
        emit UpdatedKeyValue(_key);
        info[_key] = _value;
    }

    function getValue(uint256 _key) external view returns(bytes){
        return info[_key];
    }

    function getVersion() external pure returns (uint16) {
        return VERSION_ONE;
    }
}