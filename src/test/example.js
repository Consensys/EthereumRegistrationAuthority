/**
 * Example of the whole Ethereum Registration Authority system.
 *
 * Note: this is just a happy case test of the entire system.
 *
 *
 * There are four companies:
 *  example.com.au: Has a separate sub-domain name used for sidechains. Manages its own ERA. Uses: ERA1, ERA2. Uses account 3
 *  somewhere.tw: Uses domain name for sidechains. Uses: ERA1. Uses account 4
 *  bank.com: Uses separate domain for each sidechain. Manages its own ERA. Uses: ERA1, ERA2, and ERA3. Uses account 5
 *  bank2.com: Only lists the sidechain sub-domain in ERA3. Uses account 6
 *
 * There is a sidechain service provider:
 *  schosting.com: operates sidechain nodes which somewhere.tw and banks2.com use. Uses account 7
 *
 * There are three ERAs operated by three companies:
 *  ERA1: Uses account 0.
 *  ERA2: Uses account 1.
 *  ERA3: Uses account 2.
 *
 *
 *
 *
 *
 */
const Resolver = artifacts.require("./Resolver.sol");
const ERA = artifacts.require("./ERA.sol");
const OrgInfo = artifacts.require("./OrgInfo.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const AbstractResolver = artifacts.require("./AbstractResolver.sol");
const AbstractERA = artifacts.require("./AbstractERA.sol");
const AbstractOrgInfo = artifacts.require("./AbstractOrgInfo.sol");


const SHA3 = require('sha3');
const hexy = require("hexy");


contract('Example', function(accounts) {
    const zeroAddress = "0x0";

    // Keys used for sidechains.
    const keyScnodeSize = "tech.pegasys.scnode.size";       // The number of sidechain nodes.
    const keyScnode1Enode = "tech.pegasys.scnode.1.enode";  // Sidechain node 1: enode.
    const keyScnode1Enc = "tech.pegasys.scnode.1.enc";      // Sidechain node 1: encryption public key.
    const keyScnodeBase = "tech.pegasys.scnode";
    const keyScnodeEnc = "enc";
    const keyScnodeEnode = "enode";

    const exampleEnode = "enode://6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301";
    const exampleEnc = "6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f7716";


    const domainExample1 = "sidechains.example.com.au";
    const domainExample1P1 = "example.com.au";


    const domainExample2 = "somewhere.tw";
    const domainExample2P1 = "tw";

    const domainExample3a = "sc1.sidechains.bank.com";
    const domainExample3b = "sc2.sidechains.bank.com";
    const domainExample3P1 = "sidechains.bank.com";
    const domainExample3P2 = "bank.com";

    const domainExample4 = "chains.bank2.com";

    const domainExample5 = "schosting.com";
    const domainExample5P1 = "com";

    let domainExample1Hash;
    let domainExample1P1Hash;

    let domainExample2Hash;
    let domainExample2P1Hash;

    let domainExample3aHash;
    let domainExample3bHash;
    let domainExample3P1Hash;
    let domainExample3P2Hash;

    let domainExample4Hash;

    let domainExample5Hash;
    let domainExample5P1Hash;


    let era1Address;
    let era2Address;
    let era3Address;
    let eraExample1Address;
    let eraExample3Address;

    let era1Interface;
    let era2Interface;
    let era3Interface;
    let eraExample1Interface;
    let eraExample3Interface;



    let example1OrgInfoAddress;
    let example1P1OrgInfoAddress;
    let example3aOrgInfoAddress;
    let example3bOrgInfoAddress;
    let example3P1OrgInfoAddress;
    let example3P2OrgInfoAddress;
    let example4OrgInfoAddress;
    let example5OrgInfoAddress;


    let resolverInterface;


    function calculateDomainHash(domain) {
        let md = new SHA3.SHA3Hash(256); //TODO is this really SHA3 or is it KECCAK?
        md.update(domain, 'utf-8');
        return '0x' + md.digest('hex');
//        console.log("testDomainHash: " + testDomain);
//        console.log(testDomainHash);
//        console.log(hexy.hexy(new Buffer(testDomainHashBin, 'binary')));
    }


    async function calculateDomainHashes() {
        domainExample1Hash = calculateDomainHash(domainExample1);
        domainExample1P1Hash = calculateDomainHash(domainExample1P1);
        domainExample2Hash = calculateDomainHash(domainExample2);
        domainExample2P1Hash = calculateDomainHash(domainExample2P1);
        domainExample3aHash = calculateDomainHash(domainExample3a);
        domainExample3bHash = calculateDomainHash(domainExample3b);
        domainExample3P1Hash = calculateDomainHash(domainExample3P1);
        domainExample3P2Hash = calculateDomainHash(domainExample3P2);
        domainExample4Hash = calculateDomainHash(domainExample4);
        domainExample5Hash = calculateDomainHash(domainExample5);
        domainExample5P1Hash = calculateDomainHash(domainExample5P1);
    }


    // To make the example simpler, all ERAs are set-up using account 0.
    async function createEra(owner) {
        //Note: transactions by default use account 0 in test rpc.
        let eraInstance = await ERA.new({from: owner});
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);
        //console.log("Gen eraAddress: " + eraAddress);
        //console.log("Gen eraInterface: " + eraInterface);
        return [eraAddress, eraInterface];
    }


    async function setupEras() {
        const domainOwner = accounts[4];

        //Note: transactions by default use account 0 in test rpc.
        let eraInstance = await ERA.new();
        eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);

        const resultAddDomain = await eraInterface.addDomain(testDomainHash, 0, testOrgInfoAddress1, domainOwner);
    }


    // For the purpose of the example, everyone uses the same resolver contract.
    async function setupResolver() {
        let resolverInstance = await Resolver.new();
        let resolverAddress = resolverInstance.address;
        resolverInterface = await AbstractResolver.at(resolverAddress);
    }

    function createKeyEnode(i) {
        return keyScnodeBase + i + keyScnodeEnode;
    }
    function createKeyEnc(i) {
        return keyScnodeBase + i + keyScnodeEnc;
    }

    function createValueEnode(domainName, i) {
        return exampleEnode.slice(0, 7) + "_NotReal_" + domainName + '_' + i + '_' + exampleEnode.slice(7);
    }
    function createValueEnc(domainName, i) {
        return exampleEnc.slice(0, 7) + "_NotReal_" + domainName + '_' + i + '_' + exampleEnc.slice(7);
    }


    async function createTestOrgInfo(domainName, account, numNodes) {
        let orgInfoInstance = await OrgInfo.new({from: account});
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        // To make it to debug the output, put the domain name into the enode and encryption key.
        for (let i = 0; i < numNodes; i++) {
            let enode = createValueEnode(domainName, i);
            let enc = "0x" + createValueEnc(domainName, i);

            let keyEnode = createKeyEnode(i);
            let keyEnc = createKeyEnc(i);

            await orgInfoInterface.addKeyValue(keyEnode, enode, {from: account});
            await orgInfoInterface.addKeyValue(keyEnc, enc, {from: account});
        }
        let numNodesString = "" + numNodes;
        await orgInfoInterface.addKeyValue(keyScnodeSize, numNodesString, {from: account});
        return orgInfoAddress;
    }


    async function dumpTestOrgInfo(orgInfoAddress) {
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        let value = await orgInfoInterface.getValue.call(keyScnodeSize);
        //console.log("value: " + value);
        let numNodesIncludingBlanks = parseInt(value, 10);

        //console.log("Nodes, including deleted nodes: ");
        for (let i = 0; i < numNodesIncludingBlanks; i++) {
            let keyEnode = createKeyEnode(i);
            let keyEnc = createKeyEnc(i);
            let enode = await orgInfoInterface.getValue.call(keyEnode);
            let enc = await orgInfoInterface.getValue.call(keyEnc);
            //console.log("Node(" + i + ") enode: " + enode);
            //console.log("Node(" + i + ") enc: " + enc);
        }
    }





    it("example", async function() {
        //console.log("start");
        await calculateDomainHashes();
        await setupResolver();

        //console.log("HERE1");
        // Create the three public ERAs, operated by different organisations.
        let eraInfo = await createEra(accounts[0]);
        era1Address = eraInfo[0];
        era1Interface = eraInfo[1];
        eraInfo = await createEra(accounts[1]);
        era2Address = eraInfo[0];
        era2Interface = eraInfo[1];
        eraInfo = await createEra(accounts[2]);
        era3Address = eraInfo[0];
        era3Interface = eraInfo[1];


        //console.log("HERE2");
        // Create example.com.au's ERA
        eraInfo = await createEra(accounts[3]);
        eraExample1Address = eraInfo[0];
        eraExample1Interface = eraInfo[1];

        // Create bank.com's ERA
        eraInfo = await createEra(accounts[5]);
        eraExample3Address = eraInfo[0];
        eraExample3Interface = eraInfo[1];

        //console.log("HERE3");
        // Set-up org info for sidechains.example.com.au and example.com.au
        example1OrgInfoAddress = await createTestOrgInfo(domainExample1, accounts[3], 2);
        example1P1OrgInfoAddress = await createTestOrgInfo(domainExample1P1, accounts[3], 1);  // In a real system, this might be some other data.

        //console.log("HERE4");
        // Set-up org info for sc1.sidechains.bank.com, sc2.sidechains.bank.com, sidechains.bank.com, and bank.com
        example3aOrgInfoAddress = await createTestOrgInfo(domainExample3a, accounts[5], 2);
        example3bOrgInfoAddress = await createTestOrgInfo(domainExample3b, accounts[5], 2);
        example3P1OrgInfoAddress = await createTestOrgInfo(domainExample3P1, accounts[5], 1);
        example3P2OrgInfoAddress = await createTestOrgInfo(domainExample3P2, accounts[5], 1);

        //console.log("HERE5");
        // Set-up org info for schosting.com: nodes 0 to 5.
        example5OrgInfoAddress = await createTestOrgInfo(domainExample5, accounts[7], 6);
        let orgInfoInterface = await AbstractOrgInfo.at(example5OrgInfoAddress);
        // Add an additional sidechain node: node 6.
        let keyEnode = createKeyEnode(6);
        let keyEnc = createKeyEnc(6);
        let enode = createValueEnode(domainExample5, 6);
        let enc = createValueEnc(domainExample5, 6);
        await orgInfoInterface.addKeyValue(keyEnode, enode, {from: accounts[7]});
        await orgInfoInterface.addKeyValue(keyEnc, enc, {from: accounts[7]});
        // Remove sidechain node 1 and 3.
        keyEnode = createKeyEnode(1);
        keyEnc = createKeyEnc(1);
        await orgInfoInterface.removeKeyValue(keyEnode, {from: accounts[7]});
        await orgInfoInterface.removeKeyValue(keyEnc, {from: accounts[7]});
        keyEnode = createKeyEnode(3);
        keyEnc = createKeyEnc(3);
        await orgInfoInterface.removeKeyValue(keyEnode, {from: accounts[7]});
        await orgInfoInterface.removeKeyValue(keyEnc, {from: accounts[7]});
        // Update the size.
        let numNodesString = "7";
        await orgInfoInterface.updateKeyValue(keyScnodeSize, numNodesString, {from: accounts[7]});


        //console.log("HERE6");
        // Register example.com.au's private ERA and orginfo in the public ERA1 and ERA2
        await era1Interface.addDomain(domainExample1P1Hash, eraExample1Address, example1P1OrgInfoAddress, accounts[3], {from: accounts[0]});
        await era2Interface.addDomain(domainExample1P1Hash, eraExample1Address, example1P1OrgInfoAddress, accounts[3], {from: accounts[1]});
        // Register sidechain.example.com.au info with the private ERA.
        await eraExample1Interface.addDomain(domainExample1Hash, 0, example1OrgInfoAddress, accounts[3], {from: accounts[3]});

        //console.log("HERE7");
        // Register somewhere.tw's orgInfo in the public ERA1. somewhere.tw uses schosting.com.
        await era1Interface.addDomain(domainExample2Hash, 0, example5OrgInfoAddress, accounts[4], {from: accounts[0]});

        //console.log("HERE7");
        // Register bank.com's private ERA in the public ERA1, ERA2, and ERA3.
        await era1Interface.addDomain(domainExample3P2Hash, eraExample3Address, example3P2OrgInfoAddress, accounts[5], {from: accounts[0]});
        await era2Interface.addDomain(domainExample3P2Hash, eraExample3Address, example3P2OrgInfoAddress, accounts[5], {from: accounts[1]});
        await era3Interface.addDomain(domainExample3P2Hash, eraExample3Address, example3P2OrgInfoAddress, accounts[5], {from: accounts[2]});
        // Register the orgInfo for sc1.sidechains.bank.com, sc2.sidechains.bank.com, sidechains.bank.com with the private ERA.
        await eraExample3Interface.addDomain(domainExample3aHash, 0, example3aOrgInfoAddress, accounts[5], {from: accounts[5]});
        await eraExample3Interface.addDomain(domainExample3bHash, 0, example3bOrgInfoAddress, accounts[5], {from: accounts[5]});
        await eraExample3Interface.addDomain(domainExample3P1Hash, 0, example3P1OrgInfoAddress, accounts[5], {from: accounts[5]});

        //console.log("HERE8");
        // Register chains.bank2.com's orgInfo in the public ERA3.
        await era3Interface.addDomain(domainExample4Hash, 0, example5OrgInfoAddress, accounts[6], {from: accounts[2]});


        // const hasD1 = await era1Interface.hasDomain.call(domainExample1P1Hash);
        // console.log("era1 has domain: " + hasD1);
        //
        //
        // console.log("era1address: " + era1Address);
        // console.log("era2address: " + era2Address);
        // console.log("era3address: " + era3Address);
        // console.log("domainExample1Hash: " + domainExample1Hash);
        // console.log("domainExample1P1Hash: " + domainExample1P1Hash);

        let eras = [era1Address, era2Address, era3Address];
        let domainHashes = [domainExample1Hash, domainExample2Hash, domainExample3aHash, domainExample4Hash];
        let domainHashesP1 = [domainExample1P1Hash, domainExample2P1Hash, domainExample3P1Hash, 0];
        let domainHashesP2 = [0, 0, domainExample3P2Hash, 0];
        let domainHashesP3 = [0, 0, 0, 0];

        // TODO there is a bug in truffle / webpack for processing an array or hex big numbers.
//        let resolvedOrgInfo = await resolverInterface.resolve.call(eras, domainHashes[0], domainHashesP1[0], domainHashesP2[0], domainHashesP3[0]);
//        console.log("resolvedOrgInfo: " + resolvedOrgInfo);


        //   let resolvedOrgInfos = await resolverInterface.resolve.call(eras, domainHashes, domainHashesP1, domainHashesP2, domainHashesP3);
   //     resolvedOrgInfos.forEach(function(entry) {
  //          console.log("resolved Org Info: " + entry);
   //     });



        // Simulate calling the array based API which can't be called due to the bug in truffle / webpack.
        let resolvedOrgInfo = await resolverInterface.resolve.call(eras[0], domainHashes[0], domainHashesP1[0], domainHashesP2[0], domainHashesP3[0]);
        //console.log("resolvedOrgInfo (0,0): " + resolvedOrgInfo);
        resolvedOrgInfo = await resolverInterface.resolve.call(eras[1], domainHashes[0], domainHashesP1[0], domainHashesP2[0], domainHashesP3[0]);
        //console.log("resolvedOrgInfo (1,0): " + resolvedOrgInfo);
        resolvedOrgInfo = await resolverInterface.resolve.call(eras[2], domainHashes[0], domainHashesP1[0], domainHashesP2[0], domainHashesP3[0]);
        //console.log("resolvedOrgInfo (2,0): " + resolvedOrgInfo);

        resolvedOrgInfo = await resolverInterface.resolve.call(eras[0], domainHashes[1], domainHashesP1[1], domainHashesP2[1], domainHashesP3[1]);
        //console.log("resolvedOrgInfo (0,1): " + resolvedOrgInfo);
        resolvedOrgInfo = await resolverInterface.resolve.call(eras[1], domainHashes[1], domainHashesP1[1], domainHashesP2[1], domainHashesP3[1]);
        //console.log("resolvedOrgInfo (1,1): " + resolvedOrgInfo);
        resolvedOrgInfo = await resolverInterface.resolve.call(eras[2], domainHashes[1], domainHashesP1[1], domainHashesP2[1], domainHashesP3[1]);
        //console.log("resolvedOrgInfo (2,1): " + resolvedOrgInfo);

        resolvedOrgInfo = await resolverInterface.resolve.call(eras[0], domainHashes[2], domainHashesP1[2], domainHashesP2[2], domainHashesP3[2]);
        //console.log("resolvedOrgInfo (0,2): " + resolvedOrgInfo);
        resolvedOrgInfo = await resolverInterface.resolve.call(eras[1], domainHashes[2], domainHashesP1[2], domainHashesP2[2], domainHashesP3[2]);
        //console.log("resolvedOrgInfo (1,2): " + resolvedOrgInfo);
        resolvedOrgInfo = await resolverInterface.resolve.call(eras[2], domainHashes[2], domainHashesP1[2], domainHashesP2[2], domainHashesP3[2]);
        //console.log("resolvedOrgInfo (2,2): " + resolvedOrgInfo);

        resolvedOrgInfo = await resolverInterface.resolve.call(eras[0], domainHashes[3], domainHashesP1[3], domainHashesP2[3], domainHashesP3[3]);
        //console.log("resolvedOrgInfo (0,3): " + resolvedOrgInfo);
        resolvedOrgInfo = await resolverInterface.resolve.call(eras[1], domainHashes[3], domainHashesP1[3], domainHashesP2[3], domainHashesP3[3]);
        //console.log("resolvedOrgInfo (1,3): " + resolvedOrgInfo);
        resolvedOrgInfo = await resolverInterface.resolve.call(eras[2], domainHashes[3], domainHashesP1[3], domainHashesP2[3], domainHashesP3[3]);
        //console.log("resolvedOrgInfo (2,3): " + resolvedOrgInfo);


        // Based on the resolved org info address, get the list of enode addresses and keys.
        await dumpTestOrgInfo(resolvedOrgInfo);


    });



});
