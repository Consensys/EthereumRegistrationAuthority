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

import "./DomainInfoInterface.sol";
import "./Ownable.sol";


/**
* Simple implementation for storage of domain values.
*/
contract DomainInfo_v1 is DomainInfoInterface, Ownable {
    uint16 constant private VERSION_ONE = 1;

    mapping(uint256=>bytes) private info;

    function setValue(uint256 _key, bytes calldata _value) external onlyOwner {
        info[_key] = _value;
    }

    function deleteValue(uint256 _key) external onlyOwner {
        delete info[_key];
    }

    function getValue(uint256 _key) external view returns(bytes memory){
        return info[_key];
    }

    function getVersion() external pure returns (uint16) {
        return VERSION_ONE;
    }
}