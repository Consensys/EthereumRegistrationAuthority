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
 * This file contains code which is common to many of the test files.
 */

const ResolverImplementation = artifacts.require("./Resolver_v1.sol");
const ERAImplementation = artifacts.require("./ERA_v1.sol");
const ERAImplementation2 = artifacts.require("./ERA_v2.sol");
const OrgInfoImplementation = artifacts.require("./OrgInfo_v1.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const ResolverInterface = artifacts.require("./ResolverInterface.sol");
const ERAInterface = artifacts.require("./EthereumRegistrationAuthorityInterface.sol");
const OrgInfoInterface = artifacts.require("./OrgInfoInterface.sol");


const testDomain = "aa.bb.example.com.au";
const testDomainP1 = "bb.example.com.au";
const testDomainP2 = "example.com.au";
const testDomainP3 = "com.au";


module.exports = {
    TEST_DOMAIN: testDomain,
    TEST_DOMAIN_P1: testDomainP1,
    TEST_DOMAIN_P2: testDomainP2,
    TEST_DOMAIN_P3: testDomainP3,


    getNewERA: async function() {
        let eraInstance = await ERAImplementation.new();
        let eraAddress = eraInstance.address;
        return await ERAInterface.at(eraAddress);
    },
    getNewERAv2: async function() {
        let eraInstance = await ERAImplementation2.new();
        let eraAddress = eraInstance.address;
        return await ERAInterface.at(eraAddress);
    },
    getDeployedERA: async function() {
        let eraInstance = await ERAImplementation.deployed();
        let eraAddress = eraInstance.address;
        return await ERAInterface.at(eraAddress);
    },
    getNewResolver: async function() {
        let resolverInstance = await ResolverImplementation.new();
        let resolverAddress = resolverInstance.address;
        return await ResolverInterface.at(resolverAddress);
    },
    getDeployedResolver: async function() {
        let resolverInstance = await ResolverImplementation.deployed();
        let resolverAddress = resolverInstance.address;
        return await ResolverInterface.at(resolverAddress);
    },

    getNewOrgInfo: async function() {
        let orgInfoInstance = await OrgInfoImplementation.new();
        let orgInfoAddress = orgInfoInstance.address;
        return await OrgInfoInterface.at(orgInfoAddress);
    },
    getDeployedOrgInfo: async function() {
        let orgInfoInstance = await OrgInfoImplementation.deployed();
        let orgInfoAddress = orgInfoInstance.address;
        return await OrgInfoInterface.at(orgInfoAddress);
    },



// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.

};




