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
 * Tests which analyse gas usage of the Ethereum Registration Authority contract.
 *
 * The following is the gas usage shown when the tests are run:
 *
 * gas: contract deploy: 961758
 * gas: add domain: 87663
 * gas: add domain (same domain): 42419
 * gas: add domain (same domain): 42419
 * gas: add domain (none): 25104
 * gas: add domain (none): 25104
 * gas: add domain (none): 25104
 * gas: add domain (auth): 30449
 * gas: add domain (auth): 30449
 * gas: add domain (auth): 30449
 * gas: add domain (org): 30513
 * gas: add domain (org): 30513
 * gas: add domain (domain): 31665
 * gas: add domain (domain): 31665
 * gas: removeDomain (existing): 20099
 * gas: removeDomain (not existing): 24237
 * gas: removeDomain (not existing): 24237
 */
const ERAImplementation = artifacts.require("./ERA_v1.sol");
const ERAImplementation2 = artifacts.require("./ERA_v2.sol");


contract('ERA gas test', function(accounts) {
    let common = require('../test/common');

    const DONT_SET = "1";

    const testAuthAddress1 = "0x0000000000000000000000000000000000000021";
    const testOrgInfoAddress1 = "0x0000000000000000000000000000000000000123";

    const domainOwner = accounts[1];



    async function tests(eraInterface) {
        // Store and update different domains hashes each time, thus
        // ensuring new data locations are written to.
        let testDomainHash1 = "0x101";
        let result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner);
        console.log("add domain (auth, domainInfo, domainOwner) First Write: " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner, {from:domainOwner});
        console.log("add domain (auth, domainInfo, domainOwner) Subsequent Writes: " + result.receipt.gasUsed);

        testDomainHash1 = "0x102";
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, DONT_SET);
        console.log("add domain (none) First Write: " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, DONT_SET);
        console.log("add domain (none) Subsequent Writes: " + result.receipt.gasUsed);

        testDomainHash1 = "0x103";
        result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, DONT_SET, DONT_SET);
        console.log("add domain (auth) First Write: " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, DONT_SET, DONT_SET);
        console.log("add domain (auth) Subsequent Writes: " + result.receipt.gasUsed);

        testDomainHash1 = "0x104";
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, testOrgInfoAddress1, DONT_SET);
        console.log("add domain (domainInfo) First Write: " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, testOrgInfoAddress1, DONT_SET);
        console.log("add domain (domainInfo) Subsequent Writes: " + result.receipt.gasUsed);

        testDomainHash1 = "0x105";
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, domainOwner);
        console.log("add domain (domainOwner) First Write: " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, domainOwner, {from:domainOwner});
        console.log("add domain (domainOwner) Subsequent Writes: " + result.receipt.gasUsed);

        // Point to the domain with auth, domain info, and domain owner set.
        testDomainHash1 = "0x101";
        result = await eraInterface.removeDomain(testDomainHash1);
        console.log("removeDomain (when domain in use): " + result.receipt.gasUsed);
        result = await eraInterface.removeDomain(testDomainHash1);
        console.log("removeDomain (when domain not in use): " + result.receipt.gasUsed);

        await common.dumpAllDomainAddUpdateEvents(eraInterface);
    }





    it("gas test ERA v1", async function() {
        let eraInstance = await ERAImplementation.new();
        let receipt = await web3.eth.getTransactionReceipt(eraInstance.transactionHash);
        console.log("gas: contract deploy: " + receipt.gasUsed);

        let eraInterface = await common.getNewERA();
        await tests(eraInterface);
    });

    it("gas test ERA v2", async function() {
        let eraInstance = await ERAImplementation2.new();
        let receipt = await web3.eth.getTransactionReceipt(eraInstance.transactionHash);
        console.log("gas: contract deploy: " + receipt.gasUsed);

        let eraInterface = await common.getNewERAv2();
        await tests(eraInterface);
    });


});