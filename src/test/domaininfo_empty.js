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
/**
 * DomainInfo_v1.sol uninitialised tests.
 *
 * The tests in this file check the behaviour of the DomainInfo contract when no key-values have
 * been added to it.
 */
var Web3 = require('web3');
var web3 = new Web3();

contract('DomainInfo: Empty Tests', function(accounts) {
    let common = require('./common');

    const keyScnode1Enode = "tech.pegasys.scnode.1.enode";
    const valueScnode1Enode = "enode://6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301";


    it("deleteValue should not cause revert", async function () {
        let domainInfoInterface = await common.getNewDomainInfo();
        let key = web3.utils.keccak256(keyScnode1Enode);

        await domainInfoInterface.deleteValue(key);
    });



    it("getValue", async function () {
        let domainInfoInterface = await common.getNewDomainInfo();
        let key = web3.utils.keccak256(keyScnode1Enode);
        let get1 = await domainInfoInterface.getValue.call(key);
        assert.equal(get1, '0x', "Unexpectedly, transaction getValue on a key that doesn't exist didn't return an empty string");
    });

});
