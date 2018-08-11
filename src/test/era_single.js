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
 * ERA_v1.sol test that when a domain is added, information added is available as expected.
 *
 * Note: transactions by default use account 0 in test rpc.
 */
contract('ERA: Testing a single domain in an ERA', function(accounts) {
    let common = require('./common');

    const domainOwner = accounts[1];


    const testAuthAddress1 = "0x0000000000000000000000000000000000000001";
    const testOrgInfoAddress1 = "0x0000000000000000000000000000000000000011";


    const testDomainHash1 = "0x101";
    const testDomainHash2 = "0x102";


    it("add one domain", async function() {
        let eraInterface = await common.getNewERA();


        //Note: transactions by default use account 0 in test rpc.
        const resultAddDomain = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner);
        //console.log("Transaction Hash");
        //console.log(resultAddDomain.tx);
        //console.log("Events");
        //console.log(resultAddDomain.logs);
        //console.log("Transaction Receipt");
        //console.log(resultAddDomain.receipt.gasUsed);

        const hasD1 = await eraInterface.hasDomain.call(testDomainHash1);
        assert.equal(hasD1, true, "Has domain one");
        const hasD2 = await eraInterface.hasDomain.call(testDomainHash2);
        assert.equal(hasD2, false, "Has domain two");

        const domainOwnerD1 = await eraInterface.getDomainOwner.call(testDomainHash1);
        assert.equal(domainOwnerD1, domainOwner, "Domain owner");

        const authAddr1 = await eraInterface.getAuthority.call(testDomainHash1);
        assert.equal(authAddr1, testAuthAddress1, "Authority address");

        const orgInfoAddr1 = await eraInterface.getOrgInfo.call(testDomainHash1);
        assert.equal(testOrgInfoAddress1, orgInfoAddr1, "Org Info address");
        //console.log("OrgInfo Address: ", orgInfoAddr1);
    });

});
