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

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider());

let result = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";

let i = 170;
let val = "0x" + i.toString(16);
let hash = web3.utils.keccak256(val);
console.log("Val: " + val + ", hash: " + hash);


//result = "0x2caf51b00de996420960792fdcee502c6a46be0e5c7d641d2e019847e897d583";
//for (let i = 0; i < 10; i++) {
//
  //  let val = i.toString(16);;

//var hash = web3.utils.sha3(val);
//console.log("Val: " + val + ", hash: " + hash);

//if (hash == result) {
//    console.log("done****");
//}
//}

//let found = false;

//let j=0;
//while (j < 256 && found === false) {

  //  let val = "0x" + j.toString(16);
    //let hash = web3.utils.keccak256(val);
//    console.log("Val: " + val + ", hash: " + hash);

  //  if (hash.localeCompare(result) === 0) {
    //   console.log("FOUND Val: " + val + ", hash: " + hash);
      // found = true;
   // } else {
     //   j++;
   // }

//}

var web3a = new Web3(new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/9vqrmSJ5Gr5Q9rV98gPU'
));

let contractAddress = '0x1Ea1A4af2c4dB09EEf28A7c59969dFF530A94E7a'



web3a.eth.getStorageAt(contractAddress, 0).then(function(value) {
      console.log(`[${0}]` + value)
});
web3a.eth.getStorageAt(contractAddress, 1).then(function(value) {
    console.log(`[${1}]` + value)
});
web3a.eth.getStorageAt(contractAddress, 2).then(function(value) {
    console.log(`[${2}]` + value)
});
web3a.eth.getStorageAt(contractAddress, 3).then(function(value) {
    console.log(`[${3}]` + value)
});
web3a.eth.getStorageAt(contractAddress, 4).then(function(value) {
    console.log(`[${4}]` + value)
});
web3a.eth.getStorageAt(contractAddress, 5).then(function(value) {
    console.log(`[${5}]` + value)
});
web3a.eth.getStorageAt(contractAddress, 6).then(function(value) {
    console.log(`[${6}]` + value)
});


for (index = 0; index < 10; index++){
    web3a.eth.getStorageAt(contractAddress, index).then(function(value) {
        console.log(`[${index}]` + value)
    });
}for (index = 0; index < 10; index++){
    web3a.eth.getStorageAt(contractAddress, index).then(function(value) {
        console.log(`[${index}]` + value)
    });
}


for (index = 0; index < 10; index++){
    web3a.eth.getStorageAt(contractAddress, index).then(function(value) {
        console.log(`[${index}]` + value)
    });
}

let contractAddress1 = '0xf1f5896ace3a78c347eb7eab503450bc93bd0c3b'
for (index = 0; index < 10; index++){
    web3a.eth.getStorageAt(contractAddress1, index).then(function(value) {
        console.log(`[${index}]` + value)
    });
}