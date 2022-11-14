var test = require('tape')
var bitcoinSeed = require('../src')

//  TODO: extract into fixtures file with more examples
var FIXTURE_ENTROPY = 'c58d98f79da6e6ca93306d8c2fcc2bf6'
var FIXTURE_SEED = '8ec7627de828cd686a14e8837919ed23a8bc52c6acaa719d3dfa37f1540dbd802038d8c1d12978ba69bb63d1297590db9015240deadbe48d96909e90e4dc0238'
var FIXTURE_MNEMONIC = 'sheriff holiday digital deputy hover grab error asset method lazy april uniform'

test('isBitcoinSeed() verify if object is a bitcoin seed (duck-type)', function (t) {
  t.plan(2)

  var bs = bitcoinSeed.create()
  t.true(bitcoinSeed.isBitcoinSeed(bs), 'is BitcoinSeed')
  t.false(bitcoinSeed.isBitcoinSeed({}), 'is not BitcoinSeed')

  t.end()
})

test('fromRandom() generates a random seed and mnemonic', function (t) {
  t.plan(3)

  var entropyFn = function () { return Buffer.from(FIXTURE_ENTROPY, 'hex') }
  var bs = bitcoinSeed.fromRandom({ entropyFn: entropyFn })

  t.is(bs.seed.toString('hex'), FIXTURE_SEED, 'seed')
  t.is(bs.mnemonic.toString('utf8'), FIXTURE_MNEMONIC, 'mnemonic')
  t.false(bs.isDestroyed, 'destroyed = false')

  t.end()
})

test('destroy() fills buffers with zero', function (t) {
  t.plan(4)

  var entropyFn = function () { return Buffer.from(FIXTURE_ENTROPY, 'hex') }
  var bs = bitcoinSeed.fromRandom({ entropyFn: entropyFn })

  bs.destroy()

  t.is(bs.seed.toString('hex'), '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'seed is zero')
  t.is(bs.mnemonic.toString('hex'), '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'mnemonic is zero')
  t.is(bs.entropy.toString('hex'), '00000000000000000000000000000000', 'hex')
  t.true(bs.isDestroyed, 'destroyed = true')

  t.end()
})

test('serialize() / fromBuffer() should serialize to buffer and deserialize from buffer', function (t) {
  t.plan(10)

  var entropyFn = function () { return Buffer.from(FIXTURE_ENTROPY, 'hex') }
  var bs = bitcoinSeed.fromRandom({ entropyFn: entropyFn })

  var buf = bs.serializeOld()
  t.is(buf.toString('hex'), FIXTURE_SEED + Buffer.from(FIXTURE_MNEMONIC).toString('hex'), 'SEED + MNEMONIC (OLD FORMAT)')

  var bs2 = bitcoinSeed.fromBuffer(buf)
  t.is(bs2.seed.toString('hex'), FIXTURE_SEED, 'seed')
  t.is(bs2.mnemonic.toString('utf8'), FIXTURE_MNEMONIC, 'mnemonic')
  t.is(bs2.entropy.toString('hex'), FIXTURE_ENTROPY, 'entropy')
  t.is(bs2.mnemonicString, FIXTURE_MNEMONIC, 'mnemonc string')

  buf = bs.serialize()
  t.is(buf.toString('hex'), FIXTURE_SEED + FIXTURE_ENTROPY, 'SEED + ENTROPY (NEW FORMAT)')

  var bs3 = bitcoinSeed.fromBuffer(buf)
  t.is(bs3.seed.toString('hex'), FIXTURE_SEED, 'seed')
  t.is(bs3.mnemonic.toString('utf8'), FIXTURE_MNEMONIC, 'mnemonic')
  t.is(bs3.entropy.toString('hex'), FIXTURE_ENTROPY, 'entropy')
  t.is(bs3.mnemonicString, FIXTURE_MNEMONIC, 'mnemonc string')

  t.end()
})

test('fromMnemonic() should generate proper mnemonic / seed pair', function (t) {
  t.plan(1)

  var bs = bitcoinSeed.fromMnemonic(FIXTURE_MNEMONIC)
  t.is(bs.seed.toString('hex'), FIXTURE_SEED, 'seed')

  t.end()
})

test('fromMnemonic() should only accept mnemonics of type string', function (t) {
  t.plan(1)

  t.throws(function () {
    bitcoinSeed.fromMnemonic(1000)
  }, /pass type "string"/, 'fromMnemonic w/ non-string')

  t.end()
})

test('fromEntropy()', function (t) {
  t.plan(4)

  var bs = bitcoinSeed.fromEntropy(Buffer.from(FIXTURE_ENTROPY, 'hex'))
  t.is(bs.seed.toString('hex'), FIXTURE_SEED, 'seed')
  t.is(bs.mnemonic.toString('utf8'), FIXTURE_MNEMONIC, 'mnemonic')
  t.is(bs.entropy.toString('hex'), FIXTURE_ENTROPY, 'entropy')
  t.is(bs.mnemonicString, FIXTURE_MNEMONIC, 'mnemonc string')

  t.end()
})
