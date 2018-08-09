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
 * ERA_v1.sol unitinialised tests.
 *
 * The tests in this file check the behaviour of the ERA contract when no domains have
 * been added to it.
 */
contract('ERA: Empty Tests', function(accounts) {
    let common = require('./common');

    // Used when assigning a domain to a dummy address.
    const testAuthAddress1 = "0x0000000000000000000000000000000000000001";


    const testDomainHash1 = "0x101";


    // Pass in a contract instance and expected value to retrieve the number of emitted events and run an assertion.
    function assertDomainAddedEventNum(inContract, expected) {
        inContract.DomainAdded({}, {fromBlock: 0, toBlock: "latest"}).get((error,result) => (assert.equal(expected, result.length)));
    }

    it("removeDomain", async function() {
        let eraInterface = await common.getNewERA();

        let didNotTriggerError = false;
        try {
            await eraInterface.removeDomain(testDomainHash1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction removeDomain on a domain that doesn't exist didn't cause a revert to be called");
    });
});
