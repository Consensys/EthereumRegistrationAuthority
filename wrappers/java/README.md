# Ethereum Registration Authority Java Wrapper


## Summary

This project provides java interface for interacting with ERA contracts.

### Instruction for using EraNetworkConfig:

When using this program with tag --deploy-config,
make sure to put a config file with name 'configuration' under the launching directory
The correct format for './configuration' is as follows

web3j=${web3j http address to connect to}
key=${private key of the account that is going to do the deployment}
root=${The contract address of the root era, start with 0x}
finder=${The contract address of the finder, start with 0x}
domain1 key:value key:value ....
domain2 key:value key:value ....
....
(A list of domains with its key-value pair separated by space. For example a.pegasys.com.au ip=1.1.1.1 port=1111)

If there isn't any era or finder available, configuration file can have only the first 2 lines (web3j and key).
Then, by using this tool with tag --create-era to create a new era or --create-finder to create a new finder.


## Development

To re-generate code in src/main/java/tech/pegasys/era/internal see instructions
at [https://docs.web3j.io/smart_contracts.html#smart-contract-wrappers](https://docs.web3j.io/smart_contracts.html#smart-contract-wrappers).