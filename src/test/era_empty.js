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
 * ERA_v1.sol uninitialised tests.
 *
 * The tests in this file check the behaviour of the ERA contract when no domains have
 * been added to it.
 */
contract('ERA: Empty Tests', function(accounts) {
    let common = require('./common');

    // Used when assigning a domain to a dummy address.
    const testAuthAddress1 = "0x0000000000000000000000000000000000000001";
    const testDomainHash1 = "0x101";


    it("removeDomain", async function() {
        let eraInterface = await common.getDeployedERA();
        let didNotTriggerError = false;
        try {
            await eraInterface.removeDomain(testDomainHash1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called: see assert below.
            // console.log("ERROR! " + err.message);
        }
        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction removeDomain on a domain that doesn't exist didn't cause a revert to be called");
    });

    it("changeAuthority", async function() {
        let eraInterface = await common.getDeployedERA();
        let didNotTriggerError = false;
        try {
            await eraInterface.changeAuthority(testDomainHash1, testAuthAddress1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called: see assert below.
            // console.log("ERROR! " + err.message);
        }
        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction changeAuthority on a domain that doesn't exist didn't cause a revert to be called");
    });

    it("changeOrgInfo", async function() {
        let eraInterface = await common.getDeployedERA();
        let didNotTriggerError = false;
        try {
            await eraInterface.changeOrgInfo(testDomainHash1, testAuthAddress1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called: see assert below.
            // console.log("ERROR! " + err.message);
        }
        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction changeOrgInfo on a domain that doesn't exist didn't cause a revert to be called");
    });


    it("changeOwner", async function() {
        let eraInterface = await common.getDeployedERA();
        let didNotTriggerError = false;
        try {
            await eraInterface.changeOwner(testDomainHash1, testAuthAddress1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called: see assert below.
            // console.log("ERROR! " + err.message);
        }
        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction changeOwner on a domain that doesn't exist didn't cause a revert to be called");
    });

    it("hasDomain", async function() {
        let eraInterface = await common.getDeployedERA();
        const hasD = await eraInterface.hasDomain.call(testDomainHash1);
        assert.equal(hasD, false);
    });

    it("getDomainOwner", async function() {
        let eraInterface = await common.getDeployedERA();
        const domainOwner1 = await eraInterface.getDomainOwner.call(testDomainHash1);
        assert.equal(domainOwner1, 0, "Unexpectedly, call getDomainOwner on a domain that doesn't exist didn't return 0");
    });

    it("getAuthority", async function() {
        let eraInterface = await common.getDeployedERA();
        const authority = await eraInterface.getAuthority.call(testDomainHash1);
        assert.equal(authority, 0, "Unexpectedly, call getAuthority on a domain that doesn't exist didn't return 0");
    });

    it("getOrgInfo", async function() {
        let eraInterface = await common.getDeployedERA();
        const orgInf = await eraInterface.getOrgInfo.call(testDomainHash1);
        assert.equal(orgInf, 0, "Unexpectedly, call getOrgInfo on a domain that doesn't exist didn't return 0");
    });
});
