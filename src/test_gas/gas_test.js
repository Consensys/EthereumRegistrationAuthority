/**
 * ERA_v1.sol tests which analyse gas usage.
 *
 *
 *
 * Note: transactions by default use account 0 in test rpc.
 */

const ERAImplementation = artifacts.require("./ERA_v1.sol");
const ERAImplementation2 = artifacts.require("./ERA_v2.sol");

contract('gas test', function(accounts) {
    let common = require('../test/common');

    const DONT_SET = "1";

    const testAuthAddress1 = "0x0000000000000000000000000000000000000021";
    const testOrgInfoAddress1 = "0x0000000000000000000000000000000000000123";

    const testDomainHash1 = "0x101";
    const domainOwner = accounts[1];



    async function tests(eraInterface) {
        let result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner);
        console.log("gas: add domain: " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner, {from:domainOwner});
        console.log("gas: add domain (same domain): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner, {from:domainOwner});
        console.log("gas: add domain (same domain): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, DONT_SET, {from:domainOwner});
        console.log("gas: add domain (none): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, DONT_SET, {from:domainOwner});
        console.log("gas: add domain (none): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, DONT_SET, {from:domainOwner});
        console.log("gas: add domain (none): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, DONT_SET, DONT_SET, {from:domainOwner});
        console.log("gas: add domain (auth): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, DONT_SET, DONT_SET, {from:domainOwner});
        console.log("gas: add domain (auth): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, testAuthAddress1, DONT_SET, DONT_SET, {from:domainOwner});
        console.log("gas: add domain (auth): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, testOrgInfoAddress1, DONT_SET, {from:domainOwner});
        console.log("gas: add domain (org): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, testOrgInfoAddress1, DONT_SET, {from:domainOwner});
        console.log("gas: add domain (org): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, domainOwner, {from:domainOwner});
        console.log("gas: add domain (domain): " + result.receipt.gasUsed);
        result = await eraInterface.addUpdateDomain(testDomainHash1, DONT_SET, DONT_SET, domainOwner, {from:domainOwner});
        console.log("gas: add domain (domain): " + result.receipt.gasUsed);
        result = await eraInterface.removeDomain(testDomainHash1);
        console.log("gas: removeDomain (existing): " + result.receipt.gasUsed);
        result = await eraInterface.removeDomain(testDomainHash1);
        console.log("gas: removeDomain (not existing): " + result.receipt.gasUsed);
        result = await eraInterface.removeDomain(testDomainHash1);
        console.log("gas: removeDomain (not existing): " + result.receipt.gasUsed);

        await common.dumpAllDomainAddUpdateEvents(eraInterface);

//
//         console.log("ContractAddress                                 Event           BlkNum DomainHash                 AuthorityAddress             OrgAddress                OwnerAddress");
//         var domainsAddedEvents = await eraInterface.DomainAddUpdate({}, {fromBlock: 0, toBlock: "latest"}).get(function(error, result){
// //        await domainsAddedEvents.get(function(error, result){
//             if (error) {
//                 console.log(error);
//                 throw error;
//
//             }
//             if (result.length == 0) {
//                 console.log("No events recorded");
//             } else {
//                 var i;
//                 for (i = 0; i < result.length; i++) {
//                     console.log(
//                         result[i].address + " \t" +
//                         result[i].event + " \t" +
//                         result[i].blockNumber + " \t" +
//                         result[i].args._domainHash + " \t" +
//                         result[i].args._domainAuthority + " \t" +
//                         result[i].args._orgInfo + " \t" +
//                         result[i].args._owner + " \t"
// //                result.blockHash + "    " +
// //                result.logIndex + " " +
// //                result.transactionHash + "  " +
// //                result.transactionIndex
//                     );
//
//                 }
//             }
//
//
//
//         });
//
//         // Do something here. It seems to force the test system to wait around long enough for the previous
//         // event dump to happen.
//         result = await eraInterface.removeDomain(testDomainHash1);


    }





    it("gas test v1", async function() {
        let eraInstance = await ERAImplementation.new();
        let receipt = await web3.eth.getTransactionReceipt(eraInstance.transactionHash);
        console.log("gas: contract deploy: " + receipt.gasUsed);

        let eraInterface = await common.getNewERA();
        await tests(eraInterface);
    });

    it("gas test v2", async function() {
        let eraInstance = await ERAImplementation2.new();
        let receipt = await web3.eth.getTransactionReceipt(eraInstance.transactionHash);
        console.log("gas: contract deploy: " + receipt.gasUsed);

        let eraInterface = await common.getNewERAv2();
        await tests(eraInterface);
    });
});