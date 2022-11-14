bitcoin-seed
============

[![NPM Package](https://img.shields.io/npm/v/bitcoin-seed.svg?style=flat-square)](https://www.npmjs.org/package/bitcoin-seed)
[![Build Status](https://img.shields.io/travis/ExodusMovement/bitcoin-seed.svg?branch=master&style=flat-square)](https://travis-ci.org/ExodusMovement/bitcoin-seed)

## API

### `fromRandom({ passphrase, entropyFn })`

Creates a random new `seed` instance with optional `passphrase`. If `entropyFn` is passed, it must return a 16-byte random `Buffer`; `crypto.randomBytes(16)` is used by default.

### `fromEntropy(entropy, passphrase)`

Returns a `seed` for the given raw `Buffer` `entropy` and optional `passphrase`.

### `fromMnemonic(mnemonic, passphrase)`

Returns a `seed` for the given `mnemonic` and optional `passphrase`.

### `fromBuffer(buf)`

Returns `seed` from a `buf` generated by `seed.serialize()`

### `isBitcoinSeed(obj)`

Returns whether `obj` looks like a `seed`; this is just basic duck typing.

### `seed.entropy`

Raw `Buffer` entropy of the `seed`.

### `seed.seed`

Raw `Buffer` of the seed.

### `seed.mnemonicString`

String mnemonic representation of the seed's entropy.

### `seed.destroy()`

Zero-fills all internal `Buffer`s.

### `seed.isDestroyed`

Boolean property indicating whether `seed.destroy()` has been called on this `seed`.

### `seed.serialize()`

Return seed encoded as a serialized `Buffer`, which can be passed to `fromBuffer()` to convert it back to a `seed`.
