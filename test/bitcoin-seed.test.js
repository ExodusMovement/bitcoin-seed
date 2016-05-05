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

  var entropyFn = function () { return new Buffer(FIXTURE_ENTROPY, 'hex') }
  var bs = bitcoinSeed.fromRandom({ entropyFn: entropyFn })

  t.is(bs.seed.toString('hex'), FIXTURE_SEED, 'seed')
  t.is(bs.mnemonic.toString('utf8'), FIXTURE_MNEMONIC, 'mnemonic')
  t.false(bs.isDestroyed, 'destroyed = false')

  t.end()
})

test('destroy() fills buffers with zero', function (t) {
  t.plan(3)

  var entropyFn = function () { return new Buffer(FIXTURE_ENTROPY, 'hex') }
  var bs = bitcoinSeed.fromRandom({ entropyFn: entropyFn })

  bs.destroy()

  t.is(bs.seed.toString('hex'), '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'seed is zero')
  t.is(bs.mnemonic.toString('hex'), '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'mnemonic is zero')
  t.true(bs.isDestroyed, 'destroyed = true')

  t.end()
})

test('serialize() / fromBuffer() should serialize to buffer and deserialize from buffer', function (t) {
  t.plan(3)

  var entropyFn = function () { return new Buffer(FIXTURE_ENTROPY, 'hex') }
  var bs = bitcoinSeed.fromRandom({ entropyFn: entropyFn })

  var buf = bs.serialize()
  t.is(buf.toString('hex'), FIXTURE_SEED + new Buffer(FIXTURE_MNEMONIC).toString('hex'), 'SEED + MNEMONIC')

  var bs2 = bitcoinSeed.fromBuffer(buf)
  t.is(bs2.seed.toString('hex'), FIXTURE_SEED, 'seed')
  t.is(bs2.mnemonic.toString('utf8'), FIXTURE_MNEMONIC, 'mnemonic')

  t.end()
})
