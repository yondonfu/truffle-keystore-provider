const path = require("path")
const ProviderEngine = require("web3-provider-engine")
const FiltersSubprovider = require("web3-provider-engine/subproviders/filters.js")
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet.js")
const ProviderSubprovider = require("web3-provider-engine/subproviders/provider.js")
const NonceSubprovider = require("web3-provider-engine/subproviders/nonce-tracker.js")
const Web3 = require("web3")
const ethereumjsWallet = require("ethereumjs-wallet")
const keythereum = require("keythereum")
const prompt = require("prompt-sync")()

function TruffleKeystoreProvider(address, dataDir, providerUrl) {
    const dataDirPath = path.resolve(__dirname, dataDir)
    console.log(`Using data directory: ${dataDirPath}`)
    console.log(`Please unlock your account ${address}`)
    const password = prompt("Password: ", { echo: "" })
    const keyObj = keythereum.importFromFile(address.toLowerCase(), dataDirPath)

    this.wallet = ethereumjsWallet.fromPrivateKey(keythereum.recover(password, keyObj))
    this.address = address

    this.engine = new ProviderEngine()
    this.engine.addProvider(new FiltersSubprovider())
    this.engine.addProvider(new NonceSubprovider())
    this.engine.addProvider(new WalletSubprovider(this.wallet, {}))
    this.engine.addProvider(new ProviderSubprovider(new Web3.providers.HttpProvider(providerUrl)))
    this.engine.start()
}

TruffleKeystoreProvider.prototype.sendAsync = function() {
    this.engine.sendAsync.apply(this.engine, arguments)
}

TruffleKeystoreProvider.prototype.send = function() {
    return this.engine.send.apply(this.engine, arguments)
}

module.exports = TruffleKeystoreProvider
