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
 * Deploy all of the contracts listed in the ERA architecture diagram described in the
 * README.MD.
 */
var Web3 = require('web3');
var web3 = new Web3();


const ERAImplementation = artifacts.require("./ERA_v1.sol");
const DomainInfoImplementation = artifacts.require("./DomainInfo_v1.sol");
const ERAInterface = artifacts.require("./EthereumRegistrationAuthorityInterface.sol");
const DomainInfoInterface = artifacts.require("./DomainInfoInterface.sol");


contract('Example', function(accounts) {
    let common = require('../test/common');

    const domainOwner = accounts[1];



    let rootEraA;
    let rootEraB;
    let delegateEraExampleCom;
    let delegateEraSupplyCom;
    let delegateEraEduAu;
    let delegateEraUqEduAu;

    let domainInfoS1ExampleCom;
    let domainInfoS2ExampleCom;
    let domainInfoBankCoUk;
    let domainInfoAaSupplyCom;
    let domainInfoIteeUqEduAu;

    let finderInterface;


    // Message digests of domain names.
    let domainHashExampleCom  = web3.utils.keccak256("example.com");
    let domainHashS1ExampleCom  = web3.utils.keccak256("s1.example.com");
    let domainHashS2ExampleCom  = web3.utils.keccak256("s2.example.com");
    let domainHashBankCoUk  = web3.utils.keccak256("bank.co.uk");
    let domainHashSupplyCom  = web3.utils.keccak256("supply.com");
    let domainHashAaSupplyCom  = web3.utils.keccak256("aa.supply.com");
    let domainHashA1AaSupplyCom  = web3.utils.keccak256("a1.aa.supply.com");
    let domainHashA2AaSupplyCom  = web3.utils.keccak256("a2.aa.supply.com");
    let domainHashEduAu = web3.utils.keccak256("edu.au");
    let domainHashUqEduAu = web3.utils.keccak256("uq.edu.au");
    let domainHashIteeUqEduAu = web3.utils.keccak256("itee.uq.edu.au");

    // Domain Info keys
    // For all domains in the Domain Info contract, email address of owner of domains.
    let allDomainsEmailAddressKeyHash  = web3.utils.keccak256("*:tech.pegasys.contact.email");
    let allDomainsEnodeKeyHash  = web3.utils.keccak256("*:ef.enode");
    let a1AaSuplyComEnodeKeyHash  = web3.utils.keccak256("a1.aa.supply.com:ef.enode");
    let a2AaSuplyComEnodeKeyHash  = web3.utils.keccak256("a2.aa.supply.com:ef.enode");


    let ownerRootEraA = accounts[1];
    let ownerRootEraB = accounts[2];
    let ownerExampleCom = accounts[3];
    let ownerBankCoUk = accounts[4];
    let ownerSupplyCom = accounts[5];
    let ownerEduAu = accounts[6];
    let ownerUqEduAu = accounts[7];
    let ownerIteeUqEduAu = accounts[8];


    async function getNewERAFromAddress(fromAddress) {
        let eraInstance = await ERAImplementation.new({from: fromAddress});
        let eraAddress = eraInstance.address;
        return await ERAInterface.at(eraAddress);
    }

    async function getNewDomainInfoFromAddress(fromAddress) {
        let domainInfoInstance = await DomainInfoImplementation.new({from: fromAddress});
        let domainInfoAddress = domainInfoInstance.address;
        return await DomainInfoInterface.at(domainInfoAddress);
    }



    // Deploy Root ERA A.
    async function deployRootEraA() {
        rootEraA = await getNewERAFromAddress(ownerRootEraA);
    }

    // Deploy Root ERA B.
    async function deployRootEraB() {
        rootEraB = await getNewERAFromAddress(ownerRootEraB);
    }

    // Deploy the Finder contract.
    async function deployFinder() {
        // Note that this contract can be deployed by anyone: it is for public usage.
        finderInterface = await common.getDeployedFinder();
    }

    // Set-up and deploy all of the contracts for example.com and sub-domains.
    // The account ownerExampleCom is used to deploy all contracts.
    async function setupAndDeployExampleComAndSubdomains() {
        // Deploy the contracts.
        delegateEraExampleCom = await getNewERAFromAddress(ownerExampleCom);
        domainInfoS1ExampleCom = await getNewDomainInfoFromAddress(ownerExampleCom);
        domainInfoS2ExampleCom = await getNewDomainInfoFromAddress(ownerExampleCom);

        // Add domains to the delegate ERA.
        // s1.example.com: There is no delegate ERA for sub-domains. The owner of the sub-domain is the same as the ERA owner.
        await delegateEraExampleCom.addUpdateDomain(domainHashS1ExampleCom, common.DONT_SET, domainInfoS1ExampleCom.address, common.DONT_SET, {from: ownerExampleCom});
        // s2.example.com: There is no delegate ERA for sub-domains. The owner of the sub-domain is the same as the ERA owner.
        await delegateEraExampleCom.addUpdateDomain(domainHashS2ExampleCom, common.DONT_SET, domainInfoS2ExampleCom.address, common.DONT_SET, {from: ownerExampleCom});
        // example.com: Is listed in both Root ERA A and B. There is no domain info contract for example.com.
        await rootEraA.addUpdateDomain(domainHashExampleCom, delegateEraExampleCom.address, common.DONT_SET, ownerExampleCom, {from: ownerRootEraA});
        await rootEraB.addUpdateDomain(domainHashExampleCom, delegateEraExampleCom.address, common.DONT_SET, ownerExampleCom, {from: ownerRootEraB});

        // Add some information to the domain info contracts.
        await domainInfoS1ExampleCom.setValue(allDomainsEmailAddressKeyHash, "admin@example.com", {from: ownerExampleCom});
        await domainInfoS1ExampleCom.setValue(allDomainsEnodeKeyHash, "enode://10018a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301", {from: ownerExampleCom});
        await domainInfoS2ExampleCom.setValue(allDomainsEmailAddressKeyHash, "admin@example.com", {from: ownerExampleCom});
        await domainInfoS2ExampleCom.setValue(allDomainsEnodeKeyHash, "enode://10028a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301", {from: ownerExampleCom});
    }


    // Set-up and deploy all of the contracts for example.com and sub-domains.
    // The account ownerBankCoUk is used to deploy all contracts.
    async function setupAndDeployBankCoUk() {
        // Deploy the contracts.
        domainInfoBankCoUk = await getNewDomainInfoFromAddress(ownerBankCoUk);

        // List domain in root ERA B.
        await rootEraB.addUpdateDomain(domainHashBankCoUk, common.DONT_SET, domainInfoBankCoUk.address, ownerBankCoUk, {from: ownerRootEraB});

        // Add some information to the domain info contract.
        await domainInfoBankCoUk.setValue(allDomainsEmailAddressKeyHash, "admin@bank.co.uk", {from: ownerBankCoUk});
        await domainInfoBankCoUk.setValue(allDomainsEnodeKeyHash, "enode://10118a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301", {from: ownerBankCoUk});
    }


    // Set-up and deploy all of the contracts for supply.com and sub-domains.
    // The account ownerSupplyCom is used to deploy all contracts.
    async function setupAndDeploySupplyComAndSubdomains() {
        // Deploy the contracts.
        delegateEraSupplyCom = await getNewERAFromAddress(ownerSupplyCom);
        domainInfoAaSupplyCom = await getNewDomainInfoFromAddress(ownerSupplyCom);

        // Add domains to the delegate ERA.
        // aa.supply.com: There is a delegate ERA for sub-domains. The owner of the sub-domain is the same as the ERA owner.
        await delegateEraSupplyCom.addUpdateDomain(domainHashAaSupplyCom, delegateEraSupplyCom.address, common.DONT_SET, common.DONT_SET, {from: ownerSupplyCom});
        // a1.aa.supply.com: There is no delegate ERA for sub-domains. The owner of the sub-domain is the same as the ERA owner.
        await delegateEraSupplyCom.addUpdateDomain(domainHashA1AaSupplyCom, common.DONT_SET, domainInfoAaSupplyCom.address, common.DONT_SET, {from: ownerSupplyCom});
        // a2.aa.supply.com: There is no delegate ERA for sub-domains. The owner of the sub-domain is the same as the ERA owner.
        await delegateEraSupplyCom.addUpdateDomain(domainHashA2AaSupplyCom, common.DONT_SET, domainInfoAaSupplyCom.address, common.DONT_SET, {from: ownerSupplyCom});
        // supply.com: Is listed in Root ERA B. There is no domain info contract for supply.com.
        await rootEraB.addUpdateDomain(domainHashSupplyCom, delegateEraSupplyCom.address, common.DONT_SET, ownerSupplyCom, {from: ownerRootEraB});

        // Add some information to the domain info contracts.
        await domainInfoAaSupplyCom.setValue(allDomainsEmailAddressKeyHash, "admin@supply.com", {from: ownerSupplyCom});
        await domainInfoAaSupplyCom.setValue(a1AaSuplyComEnodeKeyHash, "enode://10218a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301", {from: ownerSupplyCom});
        await domainInfoAaSupplyCom.setValue(a2AaSuplyComEnodeKeyHash, "enode://10228a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301", {from: ownerSupplyCom});
    }


    // Set-up and deploy all of the contracts for edu.au and sub-domains.
    // Various owner accounts are used, depending on the level of the hierarchy.
    async function setupAndDeployEduAuAndSubdomains() {
        // Deploy the contracts.
        delegateEraEduAu = await getNewERAFromAddress(ownerEduAu);
        delegateEraUqEduAu = await getNewERAFromAddress(ownerUqEduAu);
        domainInfoIteeUqEduAu = await getNewDomainInfoFromAddress(ownerIteeUqEduAu);

        // Add domains to the delegate ERA.
        // uq.edu.au: There is a delegate ERA for sub-domains.
        await delegateEraEduAu.addUpdateDomain(domainHashUqEduAu, delegateEraUqEduAu.address, common.DONT_SET, ownerUqEduAu, {from: ownerEduAu});
        // itee.uq.edu.au: There is no delegate ERA for sub-domains.
        await delegateEraUqEduAu.addUpdateDomain(domainHashIteeUqEduAu, common.DONT_SET, domainInfoIteeUqEduAu.address, ownerIteeUqEduAu, {from: ownerUqEduAu});
        // edu.au: Is listed in Root ERA B.
        await rootEraB.addUpdateDomain(domainHashEduAu, delegateEraEduAu.address, common.DONT_SET, ownerEduAu, {from: ownerRootEraB});

        // Add some information to the domain info contracts.
        await domainInfoIteeUqEduAu.setValue(allDomainsEmailAddressKeyHash, "admin@itee.uq.edu.au", {from: ownerIteeUqEduAu});
        await domainInfoIteeUqEduAu.setValue(allDomainsEnodeKeyHash, "enode://10318a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301", {from: ownerIteeUqEduAu});
    }






    beforeEach(async function () {
        // Only run this before the first test method is executed.
        if (rootEraA == null) {
            await deployRootEraA();
            await deployRootEraB();
            await deployFinder();
            await setupAndDeployExampleComAndSubdomains();
            await setupAndDeployBankCoUk();
            await setupAndDeploySupplyComAndSubdomains();
            await setupAndDeployEduAuAndSubdomains();
        }
    });






    it("find s1.example.com using Root ERA A", async function() {
        let eras = [];
        eras[0] = rootEraA.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS1ExampleCom, domainHashExampleCom, 0, 0);
        assert.equal(domainInfoS1ExampleCom.address, resolvedDomainInfo);
    });
    it("find s1.example.com using Root ERA B", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS1ExampleCom, domainHashExampleCom, 0, 0);
        assert.equal(domainInfoS1ExampleCom.address, resolvedDomainInfo);
    });
    it("find s1.example.com using example.com ERA with both domain hash and parent domain hash", async function() {
        let eras = [];
        eras[0] = delegateEraExampleCom.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS1ExampleCom, domainHashExampleCom, 0, 0);
        assert.equal(domainInfoS1ExampleCom.address, resolvedDomainInfo);
    });
    it("find s1.example.com using example.com ERA with just domain hash", async function() {
        let eras = [];
        eras[0] = delegateEraExampleCom.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS1ExampleCom, 0, 0, 0);
        assert.equal(domainInfoS1ExampleCom.address, resolvedDomainInfo);
    });
    it("dont find s1.example.com using Root ERA A when no parent domain is specified", async function() {
        let eras = [];
        eras[0] = rootEraA.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS1ExampleCom, 0, 0, 0);
        assert.equal(0, resolvedDomainInfo);
    });
    it("dont find s1.example.com using Root ERA B when no parent domain is specified", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS1ExampleCom, 0, 0, 0);
        assert.equal(0, resolvedDomainInfo);
    });
    it("dont find s1.example.com using example.com ERA with just parent domain hash", async function() {
        let eras = [];
        eras[0] = delegateEraExampleCom.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashExampleCom, 0, 0, 0);
        assert.equal(0, resolvedDomainInfo);
    });


    it("find s2.example.com using Root ERA A", async function() {
        let eras = [];
        eras[0] = rootEraA.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS2ExampleCom, domainHashExampleCom, 0, 0);
        assert.equal(domainInfoS2ExampleCom.address, resolvedDomainInfo);
    });
    it("find s2.example.com using Root ERA B", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS2ExampleCom, domainHashExampleCom, 0, 0);
        assert.equal(domainInfoS2ExampleCom.address, resolvedDomainInfo);
    });
    it("find s2.example.com using example.com ERA with both domain hash and parent domain hash", async function() {
        let eras = [];
        eras[0] = delegateEraExampleCom.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS2ExampleCom, domainHashExampleCom, 0, 0);
        assert.equal(domainInfoS2ExampleCom.address, resolvedDomainInfo);
    });
    it("find s2.example.com using example.com ERA with just domain hash", async function() {
        let eras = [];
        eras[0] = delegateEraExampleCom.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS2ExampleCom, 0, 0, 0);
        assert.equal(domainInfoS2ExampleCom.address, resolvedDomainInfo);
    });
    it("dont find s2.example.com using Root ERA A when no parent domain is specified", async function() {
        let eras = [];
        eras[0] = rootEraA.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS2ExampleCom, 0, 0, 0);
        assert.equal(0, resolvedDomainInfo);
    });
    it("dont find s2.example.com using Root ERA B when no parent domain is specified", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashS2ExampleCom, 0, 0, 0);
        assert.equal(0, resolvedDomainInfo);
    });


    it("dont find bank.co.uk using Root ERA A", async function() {
        let eras = [];
        eras[0] = rootEraA.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashBankCoUk, 0, 0, 0);
        assert.equal(0, resolvedDomainInfo);
    });
    it("find bank.co.uk using Root ERA B", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashBankCoUk, 0, 0, 0);
        assert.equal(domainInfoBankCoUk.address, resolvedDomainInfo);
    });


    it("dont find supply.com using Root ERA B - no domain info", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashSupplyCom, 0, 0, 0);
        assert.equal(0, resolvedDomainInfo);
    });
    it("dont find aa.supply.com using Root ERA B - no domain info", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashAaSupplyCom, domainHashSupplyCom, 0, 0);
        assert.equal(0, resolvedDomainInfo);
    });
    it("find a1.aa.supply.com using Root ERA B", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashA1AaSupplyCom, domainHashAaSupplyCom, domainHashSupplyCom, 0);
        assert.equal(domainInfoAaSupplyCom.address, resolvedDomainInfo);
    });


    it("find itee.uq.edu.au using Root ERA B", async function() {
        let eras = [];
        eras[0] = rootEraB.address;
        let resolvedDomainInfo = await finderInterface.resolveDomain.call(eras, domainHashIteeUqEduAu, domainHashUqEduAu, domainHashEduAu, 0);
        assert.equal(domainInfoIteeUqEduAu.address, resolvedDomainInfo);
    });


    it("find itee.uq.edu.au and bank.co.uk using Root ERA B", async function() {
        let eras = [];
        eras[0] = rootEraB.address;

        let domainHashes = [];
        domainHashes[0] = domainHashIteeUqEduAu;
        domainHashes[1] = domainHashBankCoUk;

        let parentHashes = [];
        parentHashes[0] = domainHashUqEduAu;
        parentHashes[1] = 0;

        let grandParentHashes = [];
        grandParentHashes[0] = domainHashEduAu;
        grandParentHashes[1] = 0;

        let greatGrandParentHashes = [];
        greatGrandParentHashes[0] = 0;
        greatGrandParentHashes[1] = 0;

        let resolvedDomainInfos = await finderInterface.resolveDomains.call(eras, domainHashes, parentHashes, grandParentHashes, greatGrandParentHashes);
        assert.equal(domainInfoIteeUqEduAu.address, resolvedDomainInfos[0]);
        assert.equal(domainInfoBankCoUk.address, resolvedDomainInfos[1]);
    });


});


