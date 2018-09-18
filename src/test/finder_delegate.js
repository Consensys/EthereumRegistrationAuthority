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
 * Finder_v1.sol tests: Check that the ERA delegation model works.
 */
const ERA = artifacts.require("./ERA_v1.sol");
const AbstractERA = artifacts.require("./EthereumRegistrationAuthorityInterface.sol");


var Web3 = require('web3');
var web3 = new Web3();

contract('Finder: Delegate', function(accounts) {
    let common = require('./common');

    const testDomainInfoAddress1 = "0x0000000000000000000000000000000000000011";

    let testDomainHash;
    let testDomainHashP1;
    let testDomainHashP2;
    let testDomainHashP3;


    let eraAddress1;
    let eraAddress2;
    let eraAddress3;
    let eraAddress4;
    let finderInterface;


    async function calculateDomainHashes() {

        testDomainHash = web3.utils.keccak256(common.TEST_DOMAIN);
        testDomainHashP1 = web3.utils.keccak256(common.TEST_DOMAIN_P1);
        testDomainHashP2 = web3.utils.keccak256(common.TEST_DOMAIN_P2);
        testDomainHashP3 = web3.utils.keccak256(common.TEST_DOMAIN_P3);
    }

    async function setupEras() {
        const domainOwner = accounts[1];

        //Note: transactions by default use account 0 in test rpc.
        let eraInstance1 = await ERA.new();
        eraAddress1 = eraInstance1.address;
        let eraInterface1 = await AbstractERA.at(eraAddress1);

        let eraInstance2 = await ERA.new();
        eraAddress2 = eraInstance2.address;
        let eraInterface2 = await AbstractERA.at(eraAddress2);

        let eraInstance3 = await ERA.new();
        eraAddress3 = eraInstance3.address;
        let eraInterface3 = await AbstractERA.at(eraAddress3);

        let eraInstance4 = await ERA.new();
        eraAddress4 = eraInstance4.address;
        let eraInterface4 = await AbstractERA.at(eraAddress4);

        await eraInterface1.addUpdateDomain(testDomainHashP3, eraAddress2, common.DONT_SET, domainOwner);
        await eraInterface2.addUpdateDomain(testDomainHashP2, eraAddress3, common.DONT_SET, domainOwner);
        await eraInterface3.addUpdateDomain(testDomainHashP1, eraAddress4, common.DONT_SET, domainOwner);
        await eraInterface4.addUpdateDomain(testDomainHash, common.DONT_SET, testDomainInfoAddress1, domainOwner);

        // console.log("ERA1: has com.au: " + await eraInterface1.hasDomain.call(testDomainHashP3));
        // console.log("ERA2: has example.com.au: " + await eraInterface2.hasDomain.call(testDomainHashP2));
        // console.log("ERA3: has bb.example.com.au: " + await eraInterface3.hasDomain.call(testDomainHashP1));
        // console.log("ERA4: has aa.bb.example.com.au: " + await eraInterface4.hasDomain.call(testDomainHash));
    }

    async function setupFinder() {
        finderInterface = await common.getNewFinder()
    }


    beforeEach(async function () {
        if (testDomainHash == null) {
            await calculateDomainHashes();
            await setupEras();
            await setupFinder();
        }
    });


    it("resolve based on an ERA which contains aa.bb.example.com.au", async function() {
        let eras = [];
        eras[0] = eraAddress4;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(testDomainInfoAddress1, resolvedDomainInfo);
    });

    it("resolve based on an ERA which contains bb.example.com.au", async function() {
        let eras = [];
        eras[0] = eraAddress3;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(testDomainInfoAddress1, resolvedDomainInfo);
    });

    it("resolve based on an ERA which contains example.com.au", async function() {
        let eras = [];
        eras[0] = eraAddress2;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(testDomainInfoAddress1, resolvedDomainInfo);
    });

    it("resolve based on an ERA which contains com.au", async function() {
        let eras = [];
        eras[0] = eraAddress1;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(testDomainInfoAddress1, resolvedDomainInfo);
    });

});
