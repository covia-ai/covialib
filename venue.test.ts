import { Venue, Asset, Operation, DataAsset, CoviaError, RunStatus, StatusData, Job, Grid } from './src/index';

let venue:Venue;

beforeAll(async () => {
      venue = await Grid.connect('did:web:venue-test.covia.ai'); // Replace with your async function
    });

test('GridConnectWithUrl', () => { 
  Grid.connect('https://venue-test.covia.ai/').then((venue:Venue) => {
    expect(venue.venueId).toBe('did:web:venue-test.covia.ai');

  })
});
test('GridConnectWithInvalidDid', () => { 
  Grid.connect('did:web:venue-zzyaaa.covia.ai').then((response) => {
    expect(response).toBe('Invalid venue ID parameter. Must be a string (URL/DNS) or Venue instance.');
    
  })
});

test('venueHasAssets', () => { 
    venue.getAssets().then((assets) => {
      expect(assets).toBeInstanceOf(Array);
      expect(assets.length).toBeGreaterThan(5);
    })
});

test('venueHasAssetId', () => {
   expect(venue.getAsset('0e39af73ed1710a1f555a10f0f066ad1155be26c0ec0a8160d88ac529ebf6056')).resolves.not.toBeNull();
});

test('venueInvokeOp', () => {
   expect(venue.getAsset('1821e02f84f24623cd8c05456230b457f475d7836147b9a88511577b3371bdac')).resolves.not.toBeNull();
    venue.getAsset('1821e02f84f24623cd8c05456230b457f475d7836147b9a88511577b3371bdac').then((operation) => {
      expect(operation.id).not.toBeNull();
       operation.run({ length: "10" }).then((result) => {
        expect(result.status).toBe("COMPLETE")
        const jobId = result.id;
        venue.getJob(jobId).then((job:Job) => {
           expect(job?.metadata.input).toEqual({ length: "10" })
        })
    })
    })
});

test('venuDataAsset', () => {
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
            expect(asset.id).not.toBeNull();
            const content = new Blob([contentData], { type: contentType });
            asset.uploadContent(content).then((response)=> {        
                 expect(response).toBeInstanceOf(ReadableStream)
                 asset.getContent().then((response) => {
                   response?.getReader().read().then(({done,value}) => {
                     const decoder = new TextDecoder('utf-8'); 
                     const str = decoder.decode(value);
                     expect(str).toBe(contentData);
                   })
                 })
                        
            })
         }) 
   })
})

test('venueDoesNotHaveAssetId', () => {
   expect(venue.getAsset('42322')).rejects.toEqual(new CoviaError('Request failed! status: 400'));
});

test('venueHasNoData', () => {
   expect(venue.getJob('xyz')).rejects.toEqual(new CoviaError('Request failed! status: 404'));
});

test('venueInvokeOpAndCancel', () => {
   expect(venue.getAsset('57def38c9005783f3431191c6d8e7a2b8a3fcf1791ff783d8e4033acc91d0630')).resolves.not.toBeNull();
    venue.getAsset('57def38c9005783f3431191c6d8e7a2b8a3fcf1791ff783d8e4033acc91d0630').then((operation) => {
      expect(operation.id).not.toBeNull();
       operation.run({ length: "10" }).then((result) => {
       if(result.status == 'STARTED' || result.status == 'PENDING') {
        const jobId = result.id;
        venue.cancelJob(jobId).then((status) => {
             expect(status).toBe(200)
        })
       
       }
      });
    })
});

test('venueInvokeOpAndDelete', () => {
   expect(venue.getAsset('57def38c9005783f3431191c6d8e7a2b8a3fcf1791ff783d8e4033acc91d0630')).resolves.not.toBeNull();
    venue.getAsset('57def38c9005783f3431191c6d8e7a2b8a3fcf1791ff783d8e4033acc91d0630').then((operation) => {
      expect(operation.id).not.toBeNull();
       operation.run({ length: "10" }).then((result) => {
       if(result.status == 'STARTED' || result.status == 'PENDING') {
        const jobId = result.id;
        venue.deleteJob(jobId).then((status) => {
             expect(status).toBe(200)
        })
       
       }
      });
    })
});

test('venueStatus', () => {
   venue.getStats().then((stats:StatusData) => {
      expect(stats?.status).toBe("OK");
      expect(stats?.url).toBe("https://venue-test.covia.ai");
      expect(stats?.did).toBe("did:web:venue-test.covia.ai");
   })
})

const getSHA256Hash = async (input) => {
      const textAsBuffer = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
      return hash;
};

