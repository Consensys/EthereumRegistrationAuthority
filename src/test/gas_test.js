/**
 * ERA.sol tests which involve a single domain in a single ERA.
 *
 *
 *
 * Note: transactions by default use account 0 in test rpc.
 */
const ERA = artifacts.require("./ERA.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const AbstractERA = artifacts.require("./AbstractERA.sol");

contract('gas test', function(accounts) {
    let eraInstance;

    const zeroAddress = "0x0";

    const testAuthAddress1 = "0x0000000000000000000000000000000000000001";
    const testAuthAddress2 = "0x2";
    const testOrgInfoAddress1 = "0x0000000000000000000000000000000000000011";
    const testOrgInfoAddress2 = "0x12";


    const testDomainHash1 = "0x101";
    const testDomainHash2 = "0x102";
    const testDomainHash3 = "0x103";
    const testDomainHash4 = "0x104";


    // Pass in a contract instance and expected value to retrieve the number of emitted events and run an assertion.
    function assertDomainAddedEventNum(inContract, expected) {
        inContract.DomainAdded({}, {fromBlock: 0, toBlock: "latest"}).get((error,result) => (assert.equal(expected, result.length)));
    }


    it("gas test", async function() {
        const domainOwner = accounts[4];
        const domainOwner2 =accounts[3];

        //Note: transactions by default use account 0 in test rpc.
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);
        let resultAddDomain = await eraInterface.addDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner);
        console.log("gas cost of addDomain " + resultAddDomain.receipt.gasUsed);
        let resultAddDomain2 = await eraInterface.addDomainAuthorityOnly(testDomainHash2, testAuthAddress2, domainOwner);
        console.log("gas cost of addDomainAuthorityOnly " + resultAddDomain2.receipt.gasUsed);
        let resultAddDomain3 = await eraInterface.addDomainOrgInfoOnly(testDomainHash3, testAuthAddress2, domainOwner);
        console.log("gas cost of addDomainOrgInfoOnly " +resultAddDomain3.receipt.gasUsed);
        let resultAddDomain4 = await eraInterface.removeDomain(testDomainHash2);
        console.log("gas cost of removeDomain " + resultAddDomain4.receipt.gasUsed);
        let resultAddDomain5 = await eraInterface.changeAuthority(testDomainHash1, domainOwner2, {from:domainOwner});
        console.log("gas cost of changeAuthority " + resultAddDomain5.receipt.gasUsed);
        let resultAddDomain6 = await eraInterface.changeOrgInfo(testDomainHash1, domainOwner2, {from:domainOwner});
        console.log("gas cost of changeOrgInfo " + resultAddDomain6.receipt.gasUsed);
        let resultAddDomain7 = await eraInterface.changeOwner(testDomainHash1, domainOwner2, {from:domainOwner});
        console.log("gas cost of changeOwner " + resultAddDomain7.receipt.gasUsed);
    });

});