# @covia/covia-sdk

[![npm version](https://badge.fury.io/js/@covia%2Fcovia-sdk.svg)](https://www.npmjs.com/package/@covia/covia-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK for [Covia.ai](https://covia.ai) - The Universal Grid for AI Orchestration & Multi-Agent Workflows.

Covia.ai provides federated execution, cryptographic verification, and shared state management for AI agents across organizations, clouds, and platforms.

## Features

- 🔒 **Type-Safe API** - Full TypeScript support with complete type definitions
- 🎯 **Asset Management** - Work with Operations and Data Assets through a unified interface
- 🔄 **Streaming Support** - Built-in support for streaming content and responses
- 💾 **Intelligent Caching** - Automatic caching for improved performance
- 🛡️ **Error Handling** - Comprehensive error handling with typed exceptions
- 🌐 **Federated Execution** - Connect to Covia venues for cross-organizational workflows
- 📦 **Dual Module Support** - Works with both CommonJS and ES Modules

## Installation

```bash
npm install @covia/covia-sdk
```

Or with yarn:

```bash
yarn add @covia/covia-sdk
```

Or with pnpm:

```bash
pnpm add @covia/covia-sdk
```

## Quick Start

```typescript
import { Grid } from '@covia/covia-sdk';

// Connect to a venue
const venue = await Grid.connect("venue-did");

// Get assets (returns Operation or DataAsset based on metadata)
const operation = await venue.getAsset('op-id');
const dataAsset = await venue.getAsset('data-id');

// Invoke an operation
await operation.invoke({ param: 'value' });

// Upload data to a data asset
await dataAsset.uploadContent(content);
```

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0.0 (for TypeScript users)

## TypeScript Support

`@covia/covia-sdk` is written in TypeScript and ships with full type declarations. No `@types/` package is needed.

```typescript
import { Venue, Operation, DataAsset, CoviaError, AssetMetadata } from '@covia/covia-sdk';
```

## Testing

```bash
npm test
```

## Resources

- [Covia.ai Platform](https://covia.ai)
- [Official Documentation](https://docs.covia.ai/)
- [GitHub Repository](https://github.com/covia-ai/covia-sdk)
- [Issue Tracker](https://github.com/covia-ai/covia-sdk/issues)
- [npm Package](https://www.npmjs.com/package/@covia/covia-sdk)

## License

MIT © Covia AI

## Support

For questions, issues, or feature requests:

- 📧 Email: info@covia.ai
- 💬 GitHub Issues: [github.com/covia-ai/covia-sdk/issues](https://github.com/covia-ai/covia-sdk/issues)
- 📚 Documentation: [docs.covia.ai](https://docs.covia.ai/)

---

Built with ❤️ by [Covia Labs](https://covia.ai) - Foundational infrastructure for the agent economy
