Utilties for building Javascript ABCI Apps. Ships with `Server` and `Client` (coming soon).

```javascript
const abciUtils = require('abci-utils');


const server = abciUtils.Server({
  info: async () => ({
    data: 'Node.Js Todo-App',
    version: '0.0.0',
    appVersion: 0,
  }),
});

server.listen(26658);

```

# Installation

This is a Node.js module available through [npm registry](https://npmjs.org)

Before installing, Nodejs v12.0.0 and higher is required.

Installation is done using `npm install` command.

```bash
$ npm install abci-utils
```

# Implemented Methods

| Msg | Server | Client
|---| ---| ---|
| Echo | x | |
| Flush | x | |
| Info | x | |
| SetOption |  | |
| InitChain | x | |
| Query | x | |
| BeginBlock | x | |
| CheckTx | x | |
| DeliverTx | x | |
| EndBlock | x | |
| Commit | x | |

# Features

- ABCI Server Handlers with promises (async/await)
- Request and Response validation with Joi (coming soon)
- ABCI Client (coming soon)
- Mock ABCI Queries for TDD (coming soon)

# Quick Start

```bash
$ mkdir abci-app
$ cd abci-app
$ npm init
$ npm i abci-utils
$ touch index.js <- Populate with example above
$ node index.js
```

## Making Queries with ABCI-CLI

**echo**

```bash
$ abci-cli echo hi
[2020-04-16|21:26:01.828] Starting socketClient                        module=abci-client impl=socketClient
-> code: OK
-> data: hi
-> data.hex: 0x6869
```

**info**

```bash
$ abci-cli info
[2020-04-16|21:27:35.884] Starting socketClient                        module=abci-client impl=socketClient
-> code: OK
-> data: Node.Js Todo-App
-> data.hex: 0x4E6F64652E4A7320546F646F2D417070
```

# API Documentation

## Server

```javascript
const server = abciServer({
  // ABCI Info Request
  info: async ({
    version: '0.32.9-e6a7757b',
    blockVersion: 10,
    p2pVersion: 7
  }) => ({
    data: 'NodeJS Todo', // Name of the application
    version: '0.0.1',
    app_version: 1,
    last_block_height: 100, // Last Height Commited on the Application
    last_block_app_hash: Buffer.from('abc'), // Last App Hash Committed on the Application, if height = 0, must  be ''
  }),
  // ABCI initChain Request
  // Only called when height = 0
  initChain: async ({
    time: {
      seconds: 1586626526,
      nanos: 973515384
    },
    chainId: 'test-chain-Di4e1N',
    consensusParams: {
      block: {
        maxBytes: 22020096,
        maxGas: -1
      },
      evidence: {
        maxAge: 100000
      },
      validator: {
        pubKeyTypesList: [
          'ed25519'
        ]
      }
    },
    validatorsList: [
      {
        pubKey: {
          type: 'ed25519',
          data: '7fCUyw3swEyrgnqVNQ29ENc/8V0m9q3vQeCtwLth7J0='
        },
        'power': 10
      }
    ],
    'appStateBytes': '' // Base64 Encoded
  }) => ({
    consensusParams: {
      block: {
        maxBytes: 22020096,
        maxGas: -1
      },
      evidence: {
        maxAge: 100000
      },
      validator: {
        pubKeyTypesList: [
          'ed25519'
        ]
      }
    },
    // We can update the voting power of validators to be different from genesis.json here
    validatorsList: [
      {
        pubKey: {
          type: 'ed25519',
          data: '7fCUyw3swEyrgnqVNQ29ENc/8V0m9q3vQeCtwLth7J0='
        },
        'power': 10
      }
    ],
  }),
  // ABCI query
  query: async ({
    data: '', // Base64 Encoded
    path, // Can be 'undefined'
    height: 0, // Height Query
    prove: false,
  }) => ({
    //
    code: 1,
    log: '',
    info: '',
    index: 0,
    key: Buffer.from(''),
    value: Buffer.from(''),
    // For Merkle Proof Operations
    proof: {
      op: [{
        type: 0,
        key: Buffer.from(''),
        data: Buffer.from(''),
      }],
    },
    height: 0,
    codespace: '',
  }),
  // ABCI beginBlockRequest
  beginBlock: async ({
    hash: '1eHGfl7O3L4YdT2A1a+LoImIV1LFrq3ESHlM9hlNhzI=',
    header: {
      version: {
        block: 10,
        app: 0
      },
      chainId: 'test-chain-Di4e1N',
      height: 3,
      time: {
        seconds: 1587205383,
        nanos: 454326863
      },
      numTxs: 0,
      totalTxs: 0,
      lastBlockId: {
        hash: 'vw0nKIP5Enl3kQxK5Gbi8HkaRnnhqHtSv2bJ4J8ZxiM=',
        partsHeader: {
          total: 1,
          hash: 'jTBaUA+pLtYnRY5wSiD3/TZEYO7rhLt6XVyWAHj92jM='
        }
      },
      lastCommitHash: 'PaNx0MYK1L5MYYYTPRzzqofU8CP6d68ABAzAx/WIZI0=',
      dataHash: '',
      validatorsHash: 'yUZht2h0UPnGdPV4LfejtB3krz8oMU8hH+lf/7TbVUE=',
      nextValidatorsHash: 'yUZht2h0UPnGdPV4LfejtB3krz8oMU8hH+lf/7TbVUE=',
      consensusHash: 'BICRvH3cKD93v7+R1zxE2ljD34qcvIZ0Bdi389qtoi8=',
      appHash: 'hBykN3pIXkou9SztGWN752sH8dgM1PJ+ixRYKMRnxHI=',
      lastResultsHash: '',
      evidenceHash: '',
      proposerAddress: 'fNcvTjK07W6kk1m35rlZWvIvu3o='
    },
    lastCommitInfo: {
      round: 0,
      votesList: [
        {
          validator: {
            address: 'fNcvTjK07W6kk1m35rlZWvIvu3o=',
            power: 10
          },
          signedLastBlock: true
        }
      ]
    },
  'byzantineValidatorsList': []
  }) => ({
    events: [{
      type: '',
      attributes: [{
        key: Buffer.from(''),
        value: Buffer.from(''),
      }],
    }],
  }),
  // ABCI checkTx
  checkTx: async ({
    "tx": "gqR0eXBlqnRvZG8vU3RkVHildmFsdWWBo21zZ4KkdHlwZaNhZGSldmFsdWWlaGVsbG8=",
    "type": 0
  }) => ({
    //
    code: 0,
    data: Buffer.from(''), 
    log: '',
    info: '',
    gasWanted: 0,
    gasUsed: 0,
    events: [{
      type: '',
      attributes: [{
        key: Buffer.from(''),
        value: Buffer.from(''),
      }],
    }],
    codespace: '',
  }),
  // ABCI deliverTx
  deliverTx: async ({
    "tx": "gqR0eXBlqnRvZG8vU3RkVHildmFsdWWBo21zZ4KkdHlwZaNhZGSldmFsdWWlaGVsbG8=",
  }) => ({
    code: 0,
    data: Buffer.from(''), 
    log: '',
    info: '',
    gasWanted: 0,
    gasUsed: 0,
    events: [{
      type: '',
      attributes: [{
        key: Buffer.from(''),
        value: Buffer.from(''),
      }],
    }],
    codespace: '',
  }),
  // ABCI commit
  commit: async () => ({
    // TODO
    // Data is the AppHash
    data: Buffer.from(''),
  }),
  // ABCI endBlockRequest
  endBlock: async ({
    height: 4,
  }) => ({
    // TODO
    events: [{
      type: '',
      attributes: [{
        key: Buffer.from(''),
        value: Buffer.from(''),
      }],
    }],
    consensusParams: {
      block: {
        maxBytes: 22020096,
        maxGas: -1
      },
      evidence: {
        maxAge: 100000
      },
      validator: {
        pubKeyTypesList: [
          'ed25519'
        ]
      }
    },
    // We can update the voting power of validators here
    // Can be used to handle slashing, introduction of new validators, etc
    validatorsList: [
      {
        pubKey: {
          type: 'ed25519',
          data: '7fCUyw3swEyrgnqVNQ29ENc/8V0m9q3vQeCtwLth7J0='
        },
        'power': 10
      }
    ],
  }),
});

```
