/**
 * OrgInfo.sol tests which involve a single key-value.
 *
 * The tests in this file check the behaviour of the OrgInfo contract when no key-values have
 * been added to it.
 */
const OrgInfo = artifacts.require("./OrgInfo.sol");

// All tests of the public API must be tested via the interface. This ensures all functions
// which are assumed to be part of the public API actually are in the interface.
const AbstractOrgInfo = artifacts.require("./AbstractOrgInfo.sol");

contract('OrgInfo: Single Entry', function(accounts) {
    const EMPTY = "";

    const keyScnode1Enode = "tech.pegasys.scnode.1.enode";
    const valueScnode1Enode = "enode://6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301";
    const valueScnode1EnodeUpdated = "Updated Value";

    it("addKeyValue and getValue", async function () {
        let orgInfoInstance = await OrgInfo.new();
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        await orgInfoInterface.addKeyValue(keyScnode1Enode, valueScnode1Enode);

        let value = await orgInfoInterface.getValue.call(keyScnode1Enode);
        assert(value, valueScnode1Enode);
    });

    it("removeKeyValue", async function () {
        let orgInfoInstance = await OrgInfo.new();
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        await orgInfoInterface.addKeyValue(keyScnode1Enode, valueScnode1Enode);
        await orgInfoInterface.removeKeyValue(keyScnode1Enode);

        let value = orgInfoInterface.getValue(keyScnode1Enode);

        assert(value, EMPTY);
    });

    it("updateKeyValue", async function () {
        let orgInfoInstance = await OrgInfo.new();
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        await orgInfoInterface.addKeyValue(keyScnode1Enode, valueScnode1Enode);
        await orgInfoInterface.updateKeyValue(keyScnode1Enode, valueScnode1EnodeUpdated);

        let value = orgInfoInterface.getValue(keyScnode1Enode);

        assert(value, valueScnode1EnodeUpdated);
    });


    it("add the same value twice", async function () {
        let orgInfoInstance = await OrgInfo.new();
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        await orgInfoInterface.addKeyValue(keyScnode1Enode, valueScnode1Enode);

        let didNotTriggerError = false;
        try {
            await orgInfoInterface.addKeyValue(keyScnode1Enode, valueScnode1EnodeUpdated);
            didNotTriggerError = true;
        } catch (err) {
            // Expect that a revert will be called as the transaction is being sent by an account other than the owner.
            //console.log("ERROR! " + err.message);
        }

        assert.equal(didNotTriggerError, false, "Unexpectedly, transaction addKeyValue on a key that already exists didn't cause a revert to be called");
    });

    it("get the same value twice", async function () {
        let orgInfoInstance = await OrgInfo.new();
        let orgInfoAddress = orgInfoInstance.address;
        let orgInfoInterface = await AbstractOrgInfo.at(orgInfoAddress);

        await orgInfoInterface.addKeyValue(keyScnode1Enode, valueScnode1Enode);

        assert.equal(await orgInfoInterface.getValue(keyScnode1Enode), valueScnode1Enode, "Unexpectedly, transaction addKeyValue on a key that already exists didn't cause a revert to be called");
        await orgInfoInterface.updateKeyValue(keyScnode1Enode, valueScnode1EnodeUpdated);
        //assert.notStrictEqual(await orgInfoInterface.getValue(keyScnode1Enode), valueScnode1EnodeUpdated, "Unexpectedly, transaction addKeyValue on a key that already exists didn't cause a revert to be called");
    });
});
