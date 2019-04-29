# Ethereum Registration Authority Java Wrapper


## Summary

This project provides java interface for interacting with ERA contracts.

### Instruction for using EraNetworkConfig:

* Usage for deploying network

```
EraNetworkConfig --deploy-config
```
The tool expects a configuration file under the launching directory.
```
'./configuration'
```
The correct format for `./configuration` is as follows
```
web3j=${web3j-http-address-to-connect-to}
key=${private-key}
root=${contract-address-of-root-era}
finder=${contract-address-of-finder}
${domain-name-1} ${key}=${value} ${key}=${value} ...
${domain-name-2} ${key}=${value} ${key}=${value} ...
...
```
Line 1 is the web3j http address that this tool is used to interact with ethereum. For example, if a infura rinkeby test node is used, the field should be `web3j=https://rinkeby.infura.io/v3/$token`.
Line 2 is the private key of the ethereum account that is used to interact with account and it does **not** start with `0x`.
Line 3 is the contract address of the root era and it starts with `0x`.
Line 4 is the contract address of the finder and it starts with `0x`.
Line 5 and above are a list of domains with its key-value pair separated by space. For example `a.pegasys.com.au ip=1.1.1.1 port=1111`.

* Usage for creating finder and root era

To create a new root era.
```
EraNetworkConfig --create-era
```

To create a new finder.
```
EraNetworkCOnfig -create-finder
```
The first two lines of the configuration file in this case are compulsory. Remaining lines won't be read.
Upon completion, the contract address will be printed to the console.


## Development

To re-generate code in src/main/java/tech/pegasys/era/internal see instructions
at [https://docs.web3j.io/smart_contracts.html#smart-contract-wrappers](https://docs.web3j.io/smart_contracts.html#smart-contract-wrappers).