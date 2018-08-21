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

const FinderImplementation = artifacts.require("./Finder_v1.sol");
const ERAImplementation = artifacts.require("./ERA_v1.sol");
const ERAImplementation2 = artifacts.require("./ERA_v2.sol");
const DomainInfoImplementation = artifacts.require("./DomainInfo_v1.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const FinderInterface = artifacts.require("./FinderInterface.sol");
const ERAInterface = artifacts.require("./EthereumRegistrationAuthorityInterface.sol");
const DomainInfoInterface = artifacts.require("./DomainInfoInterface.sol");


const testDomain = "aa.bb.example.com.au";
const testDomainP1 = "bb.example.com.au";
const testDomainP2 = "example.com.au";
const testDomainP3 = "com.au";

const DONT_SET = "1";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = {
    TEST_DOMAIN: testDomain,
    TEST_DOMAIN_P1: testDomainP1,
    TEST_DOMAIN_P2: testDomainP2,
    TEST_DOMAIN_P3: testDomainP3,

    DONT_SET: DONT_SET,


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
    getNewFinder: async function() {
        let finderInstance = await FinderImplementation.new();
        let finderAddress = finderInstance.address;
        return await FinderInterface.at(finderAddress);
    },
    getDeployedResolver: async function() {
        let finderInstance = await FinderImplementation.deployed();
        let finderAddress = finderInstance.address;
        return await FinderInterface.at(finderAddress);
    },

    getNewDomainInfo: async function() {
        let domainInfoInstance = await DomainInfoImplementation.new();
        let domainInfoAddress = domainInfoInstance.address;
        return await DomainInfoInterface.at(domainInfoAddress);
    },
    getDeployedDomainInfo: async function() {
        let domainInfoInstance = await DomainInfoImplementation.deployed();
        let domainInfoAddress = domainInfoInstance.address;
        return await DomainInfoInterface.at(domainInfoAddress);
    },


    dumpAllDomainAddUpdateEvents: async function(eraInterface) {
        console.log("ContractAddress                                 Event           BlkNum DomainHash                 AuthorityAddress             OrgAddress                OwnerAddress");
        await eraInterface.DomainAddUpdate({}, {fromBlock: 0, toBlock: "latest"}).get(function(error, result){
            if (error) {
                console.log(error);
                throw error;

            }
            if (result.length === 0) {
                console.log("No events recorded");
            } else {
                var i;
                for (i = 0; i < result.length; i++) {
                    console.log(
                        result[i].address + " \t" +
                        result[i].event + " \t" +
                        result[i].blockNumber + " \t" +
                        result[i].args._domainHash + " \t" +
                        result[i].args._domainAuthority + " \t" +
                        result[i].args._orgInfo + " \t" +
                        result[i].args._owner + " \t"
                        //+
//                        result[i].blockHash + "    " +
//                        result[i].logIndex + " " +
//                        result[i].transactionHash + "  " +
//                        result[i].transactionIndex
                    );

                }
            }
        });
        // If this sleep isn't here, the Ethereum Client is shutdown before the code above finished executing.
        await sleep(100);
    },

    // Pass in a contract instance and expected value to retrieve the number of emitted events and run an assertion.
    assertDomainAddUpdateEventNum: async function(eraInterface, expectedNumEvents) {
        eraInterface.DomainAddUpdate({}, {fromBlock: 0, toBlock: "latest"}).get(function(error, result){
            if (error) {
                console.log(error);
                throw error;

            }
            assert.equal(expectedNumEvents, result.length);
        });
        // If this sleep isn't here, the Ethereum Client is shutdown before the code above finished executing.
        await sleep(100);
    }




};




