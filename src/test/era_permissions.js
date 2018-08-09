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
 * ERA_v1.sol permission tests.
 *
 * The tests in this file check that functions can only be called by the
 * appropriate callers.
 *
 * Note: transactions by default use account 0 in test rpc.
 */
contract('ERA: Permission Tests', function(accounts) {
    let common = require('./common');

    const testAuthAddress1 = "0x0000000000000000000000000000000000000001";
    const testOrgInfoAddress1 = "0x0000000000000000000000000000000000000011";
    const testDomainHash1 = "0x101";

    // accounts[0], the default account for Truffle, is the ERA owner.
    const domainOwner = accounts[1];
    const notEraOwner = accounts[2];
    const notDomainOwner = notEraOwner;



    it("change owner when not owner", async function() {
        let eraInterface = await common.getNewERA();
        let didNotTriggerError = false;
        try {
            await eraInterface.transferOwnership(notEraOwner, {from: notEraOwner});
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called: see assert below.
            // console.log("ERROR! " + err.message);
        }
        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction transferOwnership from the wrong account didn't cause a revert to be called");
    });

    it("addDomain when not owner", async function() {
        let eraInterface = await common.getNewERA();
        let didNotTriggerError = false;
        try {
            await eraInterface.addDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner, {from: notEraOwner});
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called: see assert below.
            // console.log("ERROR! " + err.message);
        }
        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction addDomain from the wrong account didn't cause a revert to be called");
    });

    it("removeDomain when not owner", async function() {
        let eraInterface = await common.getNewERA();
        // Add the domain to be deleted.
        await eraInterface.addDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner);

        let didNotTriggerError = false;
        try {
            await eraInterface.removeDomain(testDomainHash1, {from: notEraOwner});
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction removeDomain from the wrong account didn't cause a revert to be called");
    });

    it("changeOwner when not owner", async function() {
        let eraInterface = await common.getNewERA();
        // Add the domain to be to have ownership change.
        await eraInterface.addDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner);
        let didNotTriggerError = false;
        try {
            await eraInterface.changeOwner(testDomainHash1, notDomainOwner, {from: notDomainOwner});
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called: see assert below.
            // console.log("ERROR! " + err.message);
        }
        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction changeOwner from the wrong account didn't cause a revert to be called");
    });

    // TODO test modifying a domain record
});
