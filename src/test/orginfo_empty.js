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
 * OrgInfo_v1.sol unitinialised tests.
 *
 * The tests in this file check the behaviour of the OrgInfo contract when no key-values have
 * been added to it.
 */
const OrgInfo = artifacts.require("./OrgInfo_v1.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const AbstractOrgInfo = artifacts.require("./OrgInfoInterface.sol");

contract('OrgInfo: Empty Tests', function(accounts) {

    const keyScnode1Enode = "tech.pegasys.scnode.1.enode";
    const valueScnode1Enode = "enode://6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301";


    it("removeKeyValue", async function () {
        let orgInfoInstance = await OrgInfo.new();
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        let didNotTriggerError = false;
        try {
            await orgInfoInterface.removeKeyValue(keyScnode1Enode);
            didNotTriggerError = true;
        } catch (err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction removeKeyValue on a key that doesn't exist didn't cause a revert to be called");
    });



    it("updateKeyValue", async function () {
        let orgInfoInstance = await OrgInfo.new();
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        let didNotTriggerError = false;
        try {
            await orgInfoInterface.updateKeyValue(keyScnode1Enode, valueScnode1Enode);
            didNotTriggerError = true;
        } catch (err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction updateKeyValue on a key that doesn't exist didn't cause a revert to be called");
    });

    it("getValue", async function () {
        let orgInfoInstance = await OrgInfo.new();
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);
        let get1 = await orgInfoInterface.getValue(keyScnode1Enode);
        assert.equal(get1, '', "Unexpectedly, transaction updateKeyValue on a key that doesn't exist didn't cause a revert to be called");
    });

});
