// Simple Node.js example for using covialib
// This demonstrates basic usage of the Covia TypeScript API

// Import the covialib classes
// Note: You'll need to install the package first
// npm install @covia-ai/covialib (or the appropriate package name)
const {  Grid } = require('@covia-ai/covialib');

async function main() {
  try {
    // 1. Create a Venue instance to connect to the Covia grid
    const venue = await Grid.connect('https://venue-test.covia.ai');
    console.log('Connected to '+venue.metadata.name);

    // 2. Get an Operation asset
    // Operations represent executable tasks/functions in the Covia grid
    const operationId = '1821e02f84f24623cd8c05456230b457f475d7836147b9a88511577b3371bdac';
    const operation = await venue.getAsset(operationId);
    
    console.log(`Retrieved operation: ${operationId}`);

    // 3. Invoke the operation with parameters
    const result = await operation.invoke({
      'length': '10'
    });

    console.log('Operation result:', result);

    // 4. Lookup job created by operation invoke
    console.log('Looking up the job created by this operation invoke '+result.id)
    venue.getJob(result.id).then((job => {
      console.log(job)
    }))

    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Handle Covia-specific errors
    if (error.name === 'CoviaError') {
      console.error('Covia error code:', error.code);
    }
  }
}

// Run the example
main();
