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

  // => seed || mnemonic
  bitcoinSeed.serialize = function serialize () {
    var b = new Buffer(this.seed.length + this.mnemonic.length)
    this.seed.copy(b)
    this.mnemonic.copy(b, this.seed.length)
    return b
  }

  return bitcoinSeed
}

// NOTE: after calling this, don't forget to zero out the input buffer
// could use slice() here, but in Browserify Buffer, that may be deceiving in
// older browsers: https://github.com/feross/buffer#in-old-browsers-bufslice-does-not-modify-parent-buffers-memory
// may be an acceptable tradeoff at some point
function fromBuffer (buffer) {
  var bs = create()
  bs.seed = new Buffer(64)
  bs.mnemonic = new Buffer(buffer.length - 64)

  buffer.copy(bs.seed, 0, 0, 64)
  buffer.copy(bs.mnemonic, 0, 64, buffer.length)

  return bs
}

function fromMnemonic (mnemonic, passphrase) {
  var bs = create()
  bs.mnemonic = new Buffer(mnemonic, 'utf8')
  bs.seed = bip39.mnemonicToSeed(mnemonic, passphrase)
  return bs
}

// options = { entropyFn, passphrase }
function fromRandom (options) {
  options = options || { entropyFn: function () {} }

  // entropyFn MUST return a 16 byte Buffer
  var rndBytesHex = (options.entropyFn() || crypto.randomBytes(16)).toString('hex')
  var mnemonic = bip39.entropyToMnemonic(rndBytesHex)

  return fromMnemonic(mnemonic, options.passphrase)
}

function isBitcoinSeed (bs) {
  return bs.mnemonic && bs.seed && ('isDestroyed' in bs)
}

module.exports = {
  create: create,
  isBitcoinSeed: isBitcoinSeed,
  fromBuffer: fromBuffer,
  fromMnemonic: fromMnemonic,
  fromRandom: fromRandom
}
