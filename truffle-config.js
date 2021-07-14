module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  contracts_build_directory: './eth-todo-list-react/src/abi',
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}