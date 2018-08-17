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
 * Resolver_v1.sol tests with either no ERAs or no domains.
 *
 * The tests in this file check the behaviour of the Resolver contract when not enough
 * information is supplied: either there are no ERAs to search in, or there are no domains
 * to search for.
 */
const Resolver = artifacts.require("./Resolver_v1.sol");
const ERA = artifacts.require("./ERA_v1.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const AbstractResolver = artifacts.require("./ResolverInterface.sol");
const AbstractERA = artifacts.require("./EthereumRegistrationAuthorityInterface.sol");


const SHA3 = require('sha3');
const hexy = require("hexy");


contract('Resolver: No Data Tests', function(accounts) {
    const zeroAddress = "0x0";
    const testDomainInfoAddress1 = "0x0000000000000000000000000000000000000011";
    const testDomain = "aa.bb.example.com.au";
    const testDomainP1 = "bb.example.com.au";
    const testDomainP2 = "example.com.au";
    const testDomainP3 = "com.au";

    let testDomainHash;
    let testDomainHashP1;
    let testDomainHashP2;
    let testDomainHashP3;


    let eraAddress;
    let resolverInterface;


    async function calculateDomainHashes() {
        let md = new SHA3.SHA3Hash(256); //TODO is this really SHA3 or is it KECCAK?
        md.update(testDomain, 'utf-8');
        testDomainHash = '0x' + md.digest('hex');
//        console.log("testDomainHash: " + testDomain);
//        console.log(testDomainHash);
//        console.log(hexy.hexy(new Buffer(testDomainHashBin, 'binary')));

        md = new SHA3.SHA3Hash(256); //TODO is this really SHA3 or is it KECCAK?
        md.update(testDomainP1, 'utf-8');
        testDomainHashP1 = '0x' + md.digest('hex');
//        console.log("testDomainHashP1: " + testDomainP1);
//        console.log(testDomainHashP1);

        md = new SHA3.SHA3Hash(256); //TODO is this really SHA3 or is it KECCAK?
        md.update(testDomainP2, 'utf-8');
        testDomainHashP2 = '0x' + md.digest('hex');
//        console.log("testDomainHashP2: " + testDomainP2);
//        console.log(testDomainHashP2);

        md = new SHA3.SHA3Hash(256); //TODO is this really SHA3 or is it KECCAK?
        md.update(testDomainP3, 'utf-8');
        testDomainHashP3 = '0x' + md.digest('hex');
//        console.log("testDomainHashP3: " + testDomainP3);
//        console.log(testDomainHashP3);
    }

    async function setupEras() {
        const domainOwner = accounts[4];

        //Note: transactions by default use account 0 in test rpc.
        let eraInstance = await ERA.new();
        eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);

        const resultAddDomain = await eraInterface.addUpdateDomain(testDomainHash, 0, testDomainInfoAddress1, domainOwner);
    }

    async function setupResolver() {
        let resolverInstance = await Resolver.new();
        let resolverAddress = resolverInstance.address;
        resolverInterface = await AbstractResolver.at(resolverAddress);
    }


    beforeEach(async function () {
        if (this.testDomainHash == null) {
            await calculateDomainHashes();
            await setupEras();
            await setupResolver();
        }
    });

    it("resolveDomain: zero length eraAddress array", async function() {
        let eras = [];
        let resolvedDomainInfo = await resolverInterface.resolveDomain.call(eras, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(0, resolvedDomainInfo);
    });



    it("resolveDomains: zero length eraAddress array *** TODO FAILS", async function() {
        let eras = [];
        eras[0] = eraAddress; // TODO I think there is a bug in the Truffle developer EVM: passing zero length arrays between Solidity functions.
        let domainHashes = [];
        domainHashes[0] = testDomainHash;
        let p1DomainHashes = [];
        p1DomainHashes[0] = testDomainHashP1;
        let p2DomainHashes = [];
        p2DomainHashes[0] = testDomainHashP2;
        let p3DomainHashes = [];
        p3DomainHashes[0] = testDomainHashP3;

        let resolvedDomainInfos = await resolverInterface.resolveDomains.call(eras, domainHashes, p1DomainHashes, p2DomainHashes, p3DomainHashes);
//        assert.equal(0, resolvedDomainInfos[0]);
    });

    it("resolveDomains: zero length domainHash array", async function() {
        let eras = [];
        eras[0] = eraAddress;
        let domainHashes = [];
        let p1DomainHashes = [];
        let p2DomainHashes = [];
        let p3DomainHashes = [];

        let resolvedDomainInfos = await resolverInterface.resolveDomains.call(eras, domainHashes, p1DomainHashes, p2DomainHashes, p3DomainHashes);
        assert.equal(0, resolvedDomainInfos[0]);
    });



});
