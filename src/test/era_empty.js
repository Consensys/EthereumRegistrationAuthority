/**
 * ERA_v1.sol unitinialised tests.
 *
 * The tests in this file check the behaviour of the ERA contract when no domains have
 * been added to it.
 */
const ERA = artifacts.require("./ERA_v1.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const AbstractERA = artifacts.require("./EthereumRegistrationAuthorityInterface.sol");

contract('ERA: Empty Tests', function(accounts) {
    // Used when assigning a domain to a dummy address.
    const testAuthAddress1 = "0x0000000000000000000000000000000000000001";


    const testDomainHash1 = "0x101";


    // Pass in a contract instance and expected value to retrieve the number of emitted events and run an assertion.
    function assertDomainAddedEventNum(inContract, expected) {
        inContract.DomainAdded({}, {fromBlock: 0, toBlock: "latest"}).get((error,result) => (assert.equal(expected, result.length)));
    }

    it("removeDomain", async function() {
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);

        let didNotTriggerError = false;
        try {
            await eraInterface.removeDomain(testDomainHash1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction removeDomain on a domain that doesn't exist didn't cause a revert to be called");
    });

    it("changeAuthority", async function() {
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);

        let didNotTriggerError = false;
        try {
            await eeraInterface.changeAuthority(testDomainHash1, testAuthAddress1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction changeAuthority on a domain that doesn't exist didn't cause a revert to be called");
    });

    it("changeOrgInfo", async function() {
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);

        let didNotTriggerError = false;
        try {
            await eeraInterface.changeOrgInfo(testDomainHash1, testAuthAddress1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction changeOrgInfo on a domain that doesn't exist didn't cause a revert to be called");
    });


    it("changeOwner", async function() {
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);

        let didNotTriggerError = false;
        try {
            await eeraInterface.changeOwner(testDomainHash1, testAuthAddress1);
            didNotTriggerError = true;
        } catch(err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction changeOwner on a domain that doesn't exist didn't cause a revert to be called");
    });

    it("hasDomain", async function() {
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);
        const hasD = await eraInterface.hasDomain.call(testDomainHash1);
        assert.equal(hasD, false);
    });

    it("getDomainOwner", async function() {
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);
        const hasD = await eraInterface.getDomainOwner.call(testDomainHash1);
        assert.equal(hasD, 0, "Unexpectedly, transaction changeOwner on a domain that doesn't exist didn't cause a revert to be called");
    });

    it("getAuthority", async function() {
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);
        const hasD = await eraInterface.getAuthority.call(testDomainHash1);
        assert.equal(hasD, 0, "Unexpectedly, transaction changeOwner on a domain that doesn't exist didn't cause a revert to be called");
    });

    it("getOrgInfo", async function() {
        let eraInstance = await ERA.new();
        let eraAddress = eraInstance.address;
        let eraInterface = await AbstractERA.at(eraAddress);
        const hasD = await eraInterface.getOrgInfo.call(testDomainHash1);
        assert.equal(hasD, 0, "Unexpectedly, transaction changeOwner on a domain that doesn't exist didn't cause a revert to be called");
    });
});
