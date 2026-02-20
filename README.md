# @covia/covialib

[![npm version](https://badge.fury.io/js/@covia%2Fcovialib.svg)](https://www.npmjs.com/package/@covia/covialib)
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

### 1. Initialize a Venue

A Venue is your connection point to the Covia Grid:

```typescript
import { Venue } from '@covia/covialib';

const venue = new Venue({
  baseUrl: 'https://your-venue.covia.ai',
  venueId: 'your-venue-id'
});
```

### 2. Work with Assets

Assets are the core building blocks in Covia - they can be Operations (executable functions) or Data Assets (stored data):

```typescript
// Get an asset (automatically returns Operation or DataAsset based on type)
const asset = await venue.getAsset('asset-id');

// Create a new operation
const operation = await venue.createOperation({
  name: 'process-data',
  description: 'Process and transform data',
  // ... additional metadata
});

// Create a data asset
const dataAsset = await venue.createDataAsset({
  name: 'training-dataset',
  contentType: 'application/json',
  // ... additional metadata
});
```

### 3. Execute Operations

Operations represent executable functions or agents in your workflow:

```typescript
import { Operation } from '@covia/covialib';

// Invoke an operation with parameters
const result = await operation.invoke({
  input: 'your-input-data',
  parameters: {
    temperature: 0.7,
    maxTokens: 1000
  }
});

console.log('Operation result:', result);
```

### 4. Manage Data Assets

Data Assets store and retrieve content within the Covia Grid:

```typescript
import { DataAsset } from '@covia/covialib';

// Upload content to a data asset
await dataAsset.uploadContent('file content or buffer');

// Download content from a data asset
const content = await dataAsset.downloadContent();

// Stream large content
const stream = await dataAsset.streamContent();
```

## Core Concepts

### Venue

A `Venue` represents your connection to the Covia Grid. It provides factory methods for creating and retrieving assets:

```typescript
const venue = new Venue({
  baseUrl: string,    // Your Covia venue URL
  venueId: string,    // Your venue identifier
  apiKey?: string,    // Optional API key for authentication
  timeout?: number    // Optional request timeout in ms
});
```

**Key Methods:**
- `getAsset(id)` - Retrieve an asset by ID (auto-detects type)
- `createOperation(metadata)` - Create a new Operation
- `createDataAsset(metadata)` - Create a new Data Asset  
- `deleteAsset(id)` - Delete an asset
- `listAssets(filter?)` - List available assets

### Asset (Base Class)

`Asset` is the abstract base class for all Covia assets, providing common functionality:

```typescript
// Common properties
asset.id              // Unique asset identifier
asset.metadata        // Asset metadata
asset.venue           // Reference to parent Venue

// Common methods
await asset.update(metadata)    // Update asset metadata
await asset.delete()            // Delete this asset
await asset.refresh()           // Refresh metadata from server
```

### Operation

`Operation` extends `Asset` and represents executable operations or agents:

```typescript
// Invoke the operation
const result = await operation.invoke(inputParams);

// Invoke with streaming response
const stream = await operation.invokeStream(inputParams);

// Check operation status
const status = await operation.getStatus();
```

### DataAsset

`DataAsset` extends `Asset` and represents data storage:

```typescript
// Content management
await dataAsset.uploadContent(content);
const content = await dataAsset.downloadContent();
const stream = await dataAsset.streamContent();

// Metadata
const size = await dataAsset.getSize();
const contentType = dataAsset.metadata.contentType;
```

## Advanced Usage

### Error Handling

The library provides typed error handling through the `CoviaError` class:

```typescript
import { CoviaError } from '@covia/covialib';

try {
  const asset = await venue.getAsset('non-existent-id');
} catch (error) {
  if (error instanceof CoviaError) {
    console.error('Covia Error:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Error Details:', error.details);
  }
}
```

### Streaming Responses

Handle large content or long-running operations with streaming:

```typescript
// Stream operation results
const stream = await operation.invokeStream(params);

stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});

stream.on('end', () => {
  console.log('Stream complete');
});

stream.on('error', (error) => {
  console.error('Stream error:', error);
});
```

### Caching

The library includes intelligent caching to reduce API calls:

```typescript
// First call fetches from API
const asset1 = await venue.getAsset('asset-id');

// Second call uses cached version
const asset2 = await venue.getAsset('asset-id');

// Force refresh from server
await asset1.refresh();
```

### Working with Metadata

Assets support rich metadata for organization and discovery:

```typescript
const operation = await venue.createOperation({
  name: 'sentiment-analysis',
  description: 'Analyze text sentiment using AI',
  version: '1.0.0',
  tags: ['nlp', 'sentiment', 'ai'],
  customMetadata: {
    model: 'gpt-4',
    accuracy: 0.95
  }
});

// Update metadata
await operation.update({
  version: '1.1.0',
  tags: ['nlp', 'sentiment', 'ai', 'production']
});
```

## TypeScript Support

The library is written in TypeScript and provides complete type definitions:

```typescript
import type { 
  VenueConfig,
  AssetMetadata,
  OperationInput,
  OperationResult,
  DataAssetContent
} from '@covia/covialib';

// All types are exported and available for use
const config: VenueConfig = {
  baseUrl: 'https://venue.covia.ai',
  venueId: 'my-venue'
};
```

## Module Formats

The package supports both CommonJS and ES Modules:

**ES Modules (recommended):**
```typescript
import { Venue, Operation, DataAsset } from '@covia/covialib';
```

**CommonJS:**
```javascript
const { Venue, Operation, DataAsset } = require('@covia/covialib');
```

## API Reference

### Venue

#### Constructor
```typescript
new Venue(config: VenueConfig)
```

#### Methods
- `getAsset(id: string): Promise<Asset>` - Get asset by ID
- `createOperation(metadata: OperationMetadata): Promise<Operation>` - Create operation
- `createDataAsset(metadata: DataAssetMetadata): Promise<DataAsset>` - Create data asset
- `deleteAsset(id: string): Promise<void>` - Delete asset
- `listAssets(filter?: AssetFilter): Promise<Asset[]>` - List assets

### Operation

#### Methods
- `invoke(input: OperationInput): Promise<OperationResult>` - Execute operation
- `invokeStream(input: OperationInput): Promise<ReadableStream>` - Execute with streaming
- `getStatus(): Promise<OperationStatus>` - Get execution status

### DataAsset

#### Methods
- `uploadContent(content: Buffer | string): Promise<void>` - Upload content
- `downloadContent(): Promise<Buffer>` - Download content
- `streamContent(): Promise<ReadableStream>` - Stream content
- `getSize(): Promise<number>` - Get content size

### Asset (Base Class)

#### Methods
- `update(metadata: AssetMetadata): Promise<void>` - Update metadata
- `delete(): Promise<void>` - Delete asset
- `refresh(): Promise<void>` - Refresh from server

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0.0 (for TypeScript users)

## Testing

```bash
# Run tests
npm test


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