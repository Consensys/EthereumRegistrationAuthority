/**
 * ERA_v1.sol tests which involve a single domain in a single ERA.
 *
 *
 *
 * Note: transactions by default use account 0 in test rpc.
 */
const ERA = artifacts.require("./ERA_v1.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const AbstractERA = artifacts.require("./EthereumRegistrationAuthorityInterface.sol");

contract('ERA: Testing a single domain in an ERA', function(accounts) {
    let eraInstance;

    const zeroAddress = "0x0";

    const testAuthAddress1 = "0x0000000000000000000000000000000000000001";
    const testAuthAddress2 = "0x2";
    const testOrgInfoAddress1 = "0x0000000000000000000000000000000000000011";
    const testOrgInfoAddress2 = "0x12";


    const testDomainHash1 = "0x101";
    const testDomainHash2 = "0x102";


    // Pass in a contract instance and expected value to retrieve the number of emitted events and run an assertion.
    function assertDomainAddedEventNum(inContract, expected) {
        inContract.DomainAdded({}, {fromBlock: 0, toBlock: "latest"}).get((error,result) => (assert.equal(expected, result.length)));
    }


    it("add one domain", async function() {
        const domainOwner = accounts[4];

        //Note: transactions by default use account 0 in test rpc.
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);
        const resultAddDomain = await eraInterface.addDomain(testDomainHash1, testAuthAddress1, testOrgInfoAddress1, domainOwner);
        //console.log("Transaction Hash");
        //console.log(resultAddDomain.tx);
        //console.log("Events");
        //console.log(resultAddDomain.logs);
        //console.log("Transaction Receipt");
        //console.log(resultAddDomain.receipt.gasUsed);

        const hasD1 = await eraInterface.hasDomain.call(testDomainHash1);
        assert.equal(hasD1, true, "Has domain one");
        const hasD2 = await eraInterface.hasDomain.call(testDomainHash2);
        assert.equal(hasD2, false, "Has domain two");

        const domainOwnerD1 = await eraInterface.getDomainOwner.call(testDomainHash1);
        assert.equal(domainOwnerD1, domainOwner, "Domain owner");

        const authAddr1 = await eraInterface.getAuthority.call(testDomainHash1);
        assert.equal(authAddr1, testAuthAddress1, "Authority address");

        const orgInfoAddr1 = await eraInterface.getOrgInfo.call(testDomainHash1);
        assert.equal(testOrgInfoAddress1, orgInfoAddr1, "Org Info address");
        //console.log("OrgInfo Address: ", orgInfoAddr1);


        //TODO The test below is not passing. It is not detecting the event.
//        assertDomainAddedEventNum(this.eraInstance, 1);
    });



});
