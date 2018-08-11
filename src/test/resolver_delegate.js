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
 * Resolver_v1.sol tests with either a single ERA with a single domains.
 *
 * The tests in this file check the behaviour of the Resolver contract in the simplest
 * circumstance:
 * There is a single ERA
 * The domain hash of the domain is in the ERA.
 */
const Resolver = artifacts.require("./Resolver_v1.sol");
const ERA = artifacts.require("./ERA_v1.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const AbstractResolver = artifacts.require("./ResolverInterface.sol");
const AbstractERA = artifacts.require("./EthereumRegistrationAuthorityInterface.sol");


const SHA3 = require('sha3');
const hexy = require("hexy");


contract('Resolver: Delegate', function(accounts) {
    const zeroAddress = "0x0";

    const testOrgInfoAddress1 = "0x0000000000000000000000000000000000000011";
    const testDomain = "aa.bb.example.com.au";
    const testDomainP1 = "bb.example.com.au";
    const testDomainP2 = "example.com.au";
    const testDomainP3 = "com.au";

    let testDomainHash;
    let testDomainHashP1;
    let testDomainHashP2;
    let testDomainHashP3;


    let eraAddress1;
    let eraAddress2;
    let eraAddress3;
    let eraAddress4;
    let resolverInterface;


    async function calculateDomainHashes() {
        let md = new SHA3.SHA3Hash(256); //TODO is this really SHA3 or is it KECCAK?
        //It's KECCAK
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

        await eraInterface1.addUpdateDomain(testDomainHashP3, eraAddress2, 0, domainOwner);
        await eraInterface2.addUpdateDomain(testDomainHashP2, eraAddress3, 0, domainOwner);
        await eraInterface3.addUpdateDomain(testDomainHashP1, eraAddress4, 0, domainOwner);
        await eraInterface4.addUpdateDomain(testDomainHash, 0, testOrgInfoAddress1, domainOwner);
    }

    async function setupResolver() {
        let resolverInstance = await Resolver.new();
        let resolverAddress = resolverInstance.address;
        resolverInterface = await AbstractResolver.at(resolverAddress);
    }


    beforeEach(async function () {
        if (testDomainHash == null) {
            await calculateDomainHashes();
            await setupEras();
            await setupResolver();
        }
    });


    it("resolve based on aa.bb.example.com.au", async function() {
        let resolvedOrgInfo = await resolverInterface.resolve.call(eraAddress4, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(testOrgInfoAddress1, resolvedOrgInfo);
//        console.log("resolvedOrgInfo: " + resolvedOrgInfo);
    });

    it("resolve based on bb.example.com.au", async function() {
        let resolvedOrgInfo = await resolverInterface.resolve.call(eraAddress3, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(testOrgInfoAddress1, resolvedOrgInfo);
//        console.log("resolvedOrgInfo: " + resolvedOrgInfo);
    });

    it("resolve based on example.com.au", async function() {
        let resolvedOrgInfo = await resolverInterface.resolve.call(eraAddress2, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(testOrgInfoAddress1, resolvedOrgInfo);
//        console.log("resolvedOrgInfo: " + resolvedOrgInfo);
    });

    it("resolve based on com.au", async function() {
        let resolvedOrgInfo = await resolverInterface.resolve.call(eraAddress1, testDomainHash, testDomainHashP1, testDomainHashP2, testDomainHashP3);
        assert.equal(testOrgInfoAddress1, resolvedOrgInfo);
//        console.log("resolvedOrgInfo: " + resolvedOrgInfo);
    });

});
