# Ethereum Registration Authority Code

These directories contain the Ethereum Registration Authority 
solidity code, test code, and eventually sample code.




The contracts are written in Solidity. The code is tested utilising the Truffle 
framework.  For more information on installing and using Truffle, please 
refer to: http://truffleframework.com/docs/getting_started/installation

Current contract gas cost:
addDomain 86475
addDomainAuthorityOnly 71612
addDomainOrgInfoOnly 71656
removeDomain 19672
changeAuthority 30431
changeOrgInfo 30387
changeOwner 30563

TODO also install web3  hexy  sha3
TODO work out what should be replaced.


# Truffle Installation:
```
npm install -g truffle
```

# Running the tests:
Truffle permits writing tests in Javascript or Solidity.  The tests that 
are currently included are writted in Javascript, which uses the 
Mocha framework (https://mochajs.org/) and 
Chai (http://www.chaijs.com/) for assertions.

## To run the tests:
1. Start the Truffle dev blockchain + console:
```
truffle develop
```

2. Compile the Solidity source:
```
compile
```

3. Ensure the latest contracts are deployed:
```
migrate --reset
```

4. Run the tests:
```
test
```

5. To exit:
```
.exit
```


# Running the Truffle console logger
Execute the following command in a separate window to your Truffle developer console:
```
truffle develop --log
```

# Creating Tests:
From the root directory of the Solidity project, run the following:
```
truffle create test *contractName*
```
