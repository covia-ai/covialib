# @covia/covialib

[![npm version](https://badge.fury.io/js/@covia%2Fcovialib.svg)](https://www.npmjs.com/package/@covia/covialib)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK for [Covia.ai](https://covia.ai) - The Universal Grid for AI Orchestration & Multi-Agent Workflows.

Covia.ai provides federated execution, cryptographic verification, and shared state management for AI agents across organizations, clouds, and platforms.

[![npm version](https://badge.fury.io/js/@covia%2Fcovialib.svg)](https://www.npmjs.com/package/@covia/covialib)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
npm install @covia/covialib
```

Or with yarn:

```bash
yarn add @covia/covialib
```

Or with pnpm:

```bash
pnpm add @covia/covialib
```

## Quick Start

```typescript
import { Grid } from '@/lib/covia';

// Create venue
const venue = await Grid.connect("venue-did");

// Get assets (returns Operation or DataAsset based on metadata)
const operation = await venue.getAsset('op-id');
const dataAsset = await venue.getAsset('data-id');

// Use inherited functionality
await operation.invoke({ param: 'value' }); // Simplified: just pass input parameters
await dataAsset.uploadContent(content);
```

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0.0 (for TypeScript users)

## Testing

```bash
# Run tests
npm test

## TypeScript Support

`covialib` is written in TypeScript and ships with full type declarations. No `@types/` package is needed.

```typescript
import { Venue, Operation, DataAsset, CoviaError, AssetMetadata } from 'covialib';

## Resources

- [Covia.ai Platform](https://covia.ai)
- [Official Documentation](https://docs.covia.ai/)
- [GitHub Repository](https://github.com/covia-ai/covialib)
- [Issue Tracker](https://github.com/covia-ai/covialib/issues)
- [npm Package](https://www.npmjs.com/package/@covia/covialib)

## License

MIT © Covia AI

## Support

For questions, issues, or feature requests:
- 📧 Email: info@covia.ai
- 💬 GitHub Issues: [github.com/covia-ai/covialib/issues](https://github.com/covia-ai/covialib/issues)
- 📚 Documentation: [docs.covia.ai](https://docs.covia.ai/)

---


Built with ❤️ by [Covia Labs](https://covia.ai) - Foundational infrastructure for the agent economy
