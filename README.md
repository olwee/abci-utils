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
    version: '0.0.1',
    block_version: 12,
    p2p_version: 7,
  }) => ({
    data: 'NodeJS Todo', // Name of the application
    version: '0.0.1',
    app_version: 1,
    last_block_height: '100', // Last Height Commited on the Application
    last_block_app_hash: '0xabc', // Last App Hash Committed on the Application, if height = 0, must  be ''
  }),
});

```
