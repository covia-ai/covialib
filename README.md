# Covia TypeScript API

This directory contains the TypeScript implementation of the Covia grid API, extracted from the original JavaScript implementation.

## File Structure

- **`types.ts`** - TypeScript interfaces, types, and the `CoviaError` class
- **`Asset.ts`** - Abstract base class for all assets
- **`Operation.ts`** - Extends `Asset` for operation-specific functionality
- **`DataAsset.ts`** - Extends `Asset` for data asset-specific functionality
- **`Venue.ts`** - Manages connections and provides factory methods
- **`index.ts`** - Exports all classes and types
- **`example.ts`** - Usage examples

## Inheritance Structure

```
Asset (abstract base class)
├── Operation (extends Asset)
└── DataAsset (extends Asset)
```

## Usage

```typescript
import { Venue, Asset, Operation, DataAsset } from '@/lib/covia';

// Create venue
const venue = new Venue({ 
  baseUrl: 'http://localhost:8080',
  venueId: 'my-venue' 
});

// Get assets (returns Operation or DataAsset based on metadata)
const operation = await venue.getAsset('op-id');
const dataAsset = await venue.getAsset('data-id');

// Use inherited functionality
await operation.invoke({ param: 'value' }); // Simplified: just pass input parameters
await dataAsset.uploadContent(content);
```

## Key Features

- **Type Safety**: Full TypeScript support with proper interfaces
- **Inheritance**: `Operation` and `DataAsset` inherit all functionality from `Asset`
- **Caching**: Built-in caching for improved performance
- **Error Handling**: Typed `CoviaError` class for proper error management
- **Stream Support**: Built-in support for content streaming
# @covia-ai/covialib

TypeScript client library for the Covia grid API.

## Features

- 🔒 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🏗️ **Object-Oriented**: Clean inheritance structure with Asset, Operation, and DataAsset classes
- ⚡ **Performance**: Built-in caching for improved performance
- 🌊 **Streaming**: Native support for content streaming
- 🛡️ **Error Handling**: Typed error handling with CoviaError class

## Installation

```bash
npm install @covia-ai/covialib
```

or

```bash
yarn add @covia-ai/covialib
```

## Quick Start

```typescript
import { Venue, Asset, Operation, DataAsset } from '@covia-ai/covialib';

// Create a venue connection
const venue = new Venue({
  baseUrl: 'http://localhost:8080',
  venueId: 'my-venue'
});

// Get assets (returns Operation or DataAsset based on metadata)
const operation = await venue.getAsset('op-id') as Operation;
const dataAsset = await venue.getAsset('data-id') as DataAsset;

// Use operation
const result = await operation.invoke({ 
  param: 'value' 
});

// Upload content to data asset
await dataAsset.uploadContent(content);
```

## Architecture

```
Asset (abstract base class)
├── Operation (extends Asset)
└── DataAsset (extends Asset)
```

### Core Classes

- **Venue**: Manages connections and provides factory methods for creating assets
- **Asset**: Abstract base class providing common functionality
- **Operation**: Extends Asset for operation-specific functionality
- **DataAsset**: Extends Asset for data asset-specific functionality

## API Reference

### Venue

```typescript
class Venue {
  constructor(config: VenueConfig);
  getAsset(assetId: string): Promise<Asset>;
  // ... other methods
}
```

### Operation

```typescript
class Operation extends Asset {
  invoke(params: Record<string, any>): Promise<any>;
  // ... inherited methods from Asset
}
```

### DataAsset

```typescript
class DataAsset extends Asset {
  uploadContent(content: any): Promise<void>;
  downloadContent(): Promise<any>;
  // ... inherited methods from Asset
}
```

## Error Handling

The library provides a typed `CoviaError` class for comprehensive error handling:

```typescript
import { CoviaError } from '@covia-ai/covialib';

try {
  await operation.invoke({ param: 'value' });
} catch (error) {
  if (error instanceof CoviaError) {
    console.error('Covia API Error:', error.message);
    console.error('Error code:', error.code);
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Type checking
npm run typecheck
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please use the [GitHub issue tracker](https://github.com/covia-ai/covialib/issues).