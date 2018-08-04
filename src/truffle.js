module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4600000
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x418fb41de37f8891c3a441fa04e008eb9b60c5e1", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 74612388 // Gas limit used for deploys
    },
      ropsten: {
          host: "localhost",
          port: 8545,
          network_id: "3"
      }

  }
};
