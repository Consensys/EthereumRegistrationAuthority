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
 * Finder_v1.sol tests with either no ERAs or no domains.
 *
 * The tests in this file check the behaviour of the Finder contract when not enough
 * information is supplied: either there are no ERAs to search in, or there are no domains
 * to search for.
 */
var Web3 = require('web3');
var web3 = new Web3();


contract('Finder: No Data Tests', function(accounts) {
    let common = require('./common');

    const testDomainInfoAddress1 = "0x0000000000000000000000000000000000000011";

    let testDomainHash;
    let testDomainHashP1;
    let testDomainHashP2;
    let testDomainHashP3;


    let eraAddress;
    let finderInterface;


    async function calculateDomainHashes() {
        testDomainHash = web3.utils.keccak256(common.TEST_DOMAIN);
        testDomainHashP1 = web3.utils.keccak256(common.TEST_DOMAIN_P1);
        testDomainHashP2 = web3.utils.keccak256(common.TEST_DOMAIN_P2);
        testDomainHashP3 = web3.utils.keccak256(common.TEST_DOMAIN_P3);
    }

    async function setupEras() {
        const domainOwner = accounts[1];

        let eraInterface = await common.getDeployedERA();
        const resultAddDomain = await eraInterface.addUpdateDomain(testDomainHash, common.DONT_SET, testDomainInfoAddress1, domainOwner);
    }

    async function setupResolver() {
        finderInterface = await common.getNewFinder()
    }


    beforeEach(async function () {
        if (testDomainHash == null) {
            await calculateDomainHashes();
            await setupEras();
            await setupResolver();
        }
    });

    it("resolveDomain: zero length eraAddress array", async function() {
        let eras = [];
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(0, resolvedDomainInfo);
    });



    it("resolveDomains: zero length eraAddress array", async function() {
        let eras = [];
        let domainHashes = [];
        domainHashes[0] = testDomainHash;
        let p1DomainHashes = [];
        p1DomainHashes[0] = testDomainHashP1;
        let p2DomainHashes = [];
        p2DomainHashes[0] = testDomainHashP2;
        let p3DomainHashes = [];
        p3DomainHashes[0] = testDomainHashP3;

        let resolvedDomainInfos = await finderInterface.resolveDomains.call(eras, domainHashes, p1DomainHashes, p2DomainHashes, p3DomainHashes);
        assert.equal(0, resolvedDomainInfos[0]);
    });

    it("resolveDomains: zero length domainHash array", async function() {
        let eras = [];
        eras[0] = eraAddress;
        let domainHashes = [];
        let p1DomainHashes = [];
        let p2DomainHashes = [];
        let p3DomainHashes = [];

        let resolvedDomainInfos = await finderInterface.resolveDomains.call(eras, domainHashes, p1DomainHashes, p2DomainHashes, p3DomainHashes);
        assert.equal(0, resolvedDomainInfos[0]);
    });



});
