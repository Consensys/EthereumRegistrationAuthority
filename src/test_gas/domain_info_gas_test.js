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
 * Tests which analyse gas usage of the Domain Information contract.
 *
 * The base transaction cost is 21000. It costs 20000 to write one word for the initial write, and 5000 for subsequent writes.
 *
 * The output using Truffle is:
 *
 *   Contract: Domain Info gas test
 gas: contract deploy: 532678
 ✓ DomainInfo deployement (142ms)
 gas: setVale 1 word, initial write: 45240
 gas: setVale 1 word, subsequent write: 35297
 gas: setVale 1 word, subsequent write: 35297
 gas: setVale 2 words, initial write: 67455
 gas: setVale 2 words, subsequent write: 37455
 gas: setVale 2 words, subsequent write: 37455
 gas: setVale 3 words, initial write: 87653
 gas: setVale 3 words, subsequent write: 42653
 gas: setVale 3 words, subsequent write: 42653
 gas: setVale 4 words, initial write: 109899
 gas: setVale 4 words, subsequent write: 49899
 gas: setVale 4 words, subsequent write: 49899
 gas: setVale EC_PUBLIC_KEY, initial write: 109835
 gas: setVale EC_PUBLIC_KEY, subsequent write: 49835
 gas: setVale EC_PUBLIC_KEY, subsequent write: 49835
 gas: setVale ENODE, initial write: 176957
 gas: setVale ENODE, subsequent write: 71957
 gas: setVale ENODE, subsequent write: 71957
 ✓ DomainInfo tests (966ms)

 */
contract('Domain Info gas test', function(accounts) {
    let common = require('../test/common');

    async function tests(domainInfoInterface) {
        var Web3 = require('web3');
        var web3 = new Web3();


        const KEY = "domain:keytype";

        // Zero to 31 bytes are stored in one word: length byte + 31 data bytes.
        const ONE_WORD         = "0x01";
        // 32 bytes are stored in two words: length word + 32 data bytes in one word.
        const TWO_WORDS        = "0x01020304050606708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20";
        // 33 to 64 bytes are stored in three words: length word + 64 data bytes in two words.
        const THREE_WORDS      = "0x01020304050606708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F2021";
        // 65 to 96 bytes are stored in four words: length word + 96 data bytes in three words.
        const FOUR_WORDS       = "0x01020304050606708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F4041";

        // ECC public key. Note that this will be interpreted as a byte array.
        const EC_PUBLIC_KEY    = "0x04855c7b3f9089fb5c7c3055497f2585c80af2cd22861cec172582fb097853172346c0c3accc3d53aab7a7bc27d03adb72fe0190ee73e13124e8554e76d7364018";

        // An enode address. Note that this will be intepreted as a string.
        const ENODE = "enode://6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301";

        // Use a different key each time, to ensure memory locations aren't reused.
        let key = web3.utils.keccak256(KEY + "1");
        let receipt = await domainInfoInterface.setValue(key, ONE_WORD);
        console.log("gas: setVale 1 word, initial write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, ONE_WORD);
        console.log("gas: setVale 1 word, subsequent write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, ONE_WORD);
        console.log("gas: setVale 1 word, subsequent write: " + receipt.receipt.gasUsed);

        key = web3.utils.keccak256(KEY + "2");
        receipt = await domainInfoInterface.setValue(key, TWO_WORDS);
        console.log("gas: setVale 2 words, initial write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, TWO_WORDS);
        console.log("gas: setVale 2 words, subsequent write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, TWO_WORDS);
        console.log("gas: setVale 2 words, subsequent write: " + receipt.receipt.gasUsed);

        key = web3.utils.keccak256(KEY + "3");
        receipt = await domainInfoInterface.setValue(key, THREE_WORDS);
        console.log("gas: setVale 3 words, initial write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, THREE_WORDS);
        console.log("gas: setVale 3 words, subsequent write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, THREE_WORDS);
        console.log("gas: setVale 3 words, subsequent write: " + receipt.receipt.gasUsed);

        key = web3.utils.keccak256(KEY + "4");
        receipt = await domainInfoInterface.setValue(key, FOUR_WORDS);
        console.log("gas: setVale 4 words, initial write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, FOUR_WORDS);
        console.log("gas: setVale 4 words, subsequent write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, FOUR_WORDS);
        console.log("gas: setVale 4 words, subsequent write: " + receipt.receipt.gasUsed);

        key = web3.utils.keccak256(KEY + "5");
        receipt = await domainInfoInterface.setValue(key, EC_PUBLIC_KEY);
        console.log("gas: setVale EC_PUBLIC_KEY, initial write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, EC_PUBLIC_KEY);
        console.log("gas: setVale EC_PUBLIC_KEY, subsequent write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, EC_PUBLIC_KEY);
        console.log("gas: setVale EC_PUBLIC_KEY, subsequent write: " + receipt.receipt.gasUsed);

        key = web3.utils.keccak256(KEY + "6");
        receipt = await domainInfoInterface.setValue(key, ENODE);
        console.log("gas: setVale ENODE, initial write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, ENODE);
        console.log("gas: setVale ENODE, subsequent write: " + receipt.receipt.gasUsed);
        receipt = await domainInfoInterface.setValue(key, ENODE);
        console.log("gas: setVale ENODE, subsequent write: " + receipt.receipt.gasUsed);
    }



    it("DomainInfo deployement", async function() {
        const DomainInfoImplementation = artifacts.require("./DomainInfo_v1.sol");
        let domainInfoInstance = await DomainInfoImplementation.new();
        let receipt = await web3.eth.getTransactionReceipt(domainInfoInstance.transactionHash);
        console.log("gas: contract deploy: " + receipt.gasUsed);
        //console.log(receipt);
    });

    it("DomainInfo tests", async function() {
        let domainInfoInterface = await common.getNewDomainInfo();
        await tests(domainInfoInterface);
    });


});