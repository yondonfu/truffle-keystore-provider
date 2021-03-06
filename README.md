# truffle-keystore-provider

Local keystore compatible Web3 provider to be used with Truffle. Used to unlock an account stored in a local keystore to be used for signing transactions. You will be prompted for a password
to unlock the account.

## Install

```
$ npm install --save truffle-keystore-provider
```

## Usage

In your `truffle.js` file:

```
const KeystoreProvider = require("truffle-keystore-provider")

const memoizeKeystoreProviderCreator = () => {
    let providers = {}

    return (account, dataDir, providerUrl) => {
        if (providerUrl in providers) {
            return providers[providerUrl]
        } else {
            const provider = new KeystoreProvider(account, dataDir, providerUrl)
            providers[providerUrl] = provider
            return provider
        }
    }
}

const createKeystoreProvider = memoizeKeystoreProviderCreator()

module.exports = {
    rinkeby: {
        provider: createKeystoreProvider(process.env.ACCOUNT, process.env.DATA_DIR, "https://rinkeby.infura.io"),
        network_id: 4
    }
}
```
