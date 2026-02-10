// Simple Node.js example for using covialib
// This demonstrates basic usage of the Covia TypeScript API

// Import the covialib classes
// Note: You'll need to install the package first
// npm install @covia-ai/covialib (or the appropriate package name)
const {  Grid } = require('@covia-ai/covialib');


const getSHA256Hash = async (input) => {
      const textAsBuffer = new TextEncoder().encode(input.toString());
      const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
      return hash;
};

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

     //Text content asset creation
     const contentData = 'Hello World', contentType = 'text/plain';
     getSHA256Hash(Buffer.from(contentData)).then((hash) => {
         const metadata = 
            {
            "name":"Test Metadata",
            "creator":"Test",
            "description":"Test data to upload and check content.",
            "dateCreated":"2025-08-12",
            "keywords":["test"],
            "content": {
                     "sha256" : hash,
                     "contentType" : contentType, 
                  }
         }
         venue.createAsset(metadata).then((asset) => {
            const content = new Blob([contentData], { type: contentType });
            asset.uploadContent(content).then((response)=> {        
                 console.log(response)      
            }).catch((error) => {
              console.log(error)
            })
         }) 
    })

     const jsonContent = {"menu": {
        "id": "file",
        "value": "File",
        "popup": {
        "menuitem": [
          {"value": "New", "onclick": "CreateNewDoc()"},
          {"value": "Open", "onclick": "OpenDoc()"},
          {"value": "Close", "onclick": "CloseDoc()"}
        ]
      }
      }}

       getSHA256Hash(Buffer.from(jsonContent)).then((hash) => {
         const metadata = 
            {
            "name":"Test Metadata With json input",
            "creator":"Test",
            "description":"Test data to upload and check content.",
            "dateCreated":"2025-08-12",
            "keywords":["jsoncontent"],
            "content": {
                     "sha256" : hash,
                     "contentType" : "application/json", 
                  }
         }
         venue.createAsset(metadata).then((asset) => {
            const content = new Blob([jsonContent], { type: "application/json" });
            asset.uploadContent(content).then((response)=> {        
                 console.log(response)      
            }).catch((error) => {
              console.log(error)
            })
         }) 
    })

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
