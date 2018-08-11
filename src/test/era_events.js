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
 * ERA_v1.sol test events are triggered as expected.
 *
 */
contract('ERA: Event Tests', function(accounts) {
    let common = require('./common');

    const domainOwner = accounts[1];

    // Used when assigning a domain to a dummy address.
    const testAuthAddress1 = "0x0000000000000000000000000000000000000001";
    const testOrgInfoAddress1 = "0x0000000000000000000000000000000000000011";
    const testDomainHash1 = "0x101";



    // Pass in a contract instance and expected value to retrieve the number of emitted events and run an assertion.
    function assertDomainAddedEventNum(inContract, expected) {
        inContract.DomainAddUpdate({}, {fromBlock: 0, toBlock: "latest"}).get((error,result) => (assert.equal(expected, result.length)));
    }


    it("add one domain", async function() {
        let eraInterface = await common.getNewERA();

        await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner);

        const expected = 1;
        eraInterface.DomainAddUpdate({}, {fromBlock: 0, toBlock: "latest"}).get((error,result) => (assert.equal(expected, result.length)));

    });
});
