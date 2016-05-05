var bip39 = require('bip39')
var crypto = require('crypto')

function create () {
  var bitcoinSeed = Object.create(null)

  bitcoinSeed.isDestroyed = false
  bitcoinSeed.mnemonic = new Buffer(0)
  bitcoinSeed.seed = new Buffer(0)

  bitcoinSeed.destroy = function destroy () {
    this.seed.fill(0)
    this.mnemonic.fill(0)
    this.isDestroyed = true
  }

  bitcoinSeed.toJSON = function toJSON () {
    throw new Error('<bitcoin-seed> Error: Convert each Buffer to JSON individually.')
  }

  return bitcoinSeed
}

// options = { entropyFn, passphrase }
function fromRandom (options) {
  options = options || { entropyFn: function () {} }

  // entropyFn MUST return a 16 byte Buffer
  var rndBytesHex = (options.entropyFn() || crypto.randomBytes(16)).toString('hex')
  var mnemonic = bip39.entropyToMnemonic(rndBytesHex)

  return fromMnemonic(mnemonic, options.passphrase)
}

function fromMnemonic (mnemonic, passphrase) {
  var bs = create()
  bs.mnemonic = new Buffer(mnemonic, 'utf8')
  bs.seed = bip39.mnemonicToSeed(mnemonic, passphrase)
  return bs
}

function isBitcoinSeed (bs) {
  return bs.mnemonic && bs.seed && ('isDestroyed' in bs)
}

module.exports = {
  create: create,
  isBitcoinSeed: isBitcoinSeed,
  fromMnemonic: fromMnemonic,
  fromRandom: fromRandom
}
