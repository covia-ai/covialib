import { Venue, Asset, Operation, DataAsset, CoviaError, RunStatus } from './src/index';

 const venue = new Venue({
          baseUrl: 'http://localhost:8080',
          venueId: 'my-venue'
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
   return venue.getAsset('1821e02f84f24623cd8c05456230b457f475d7836147b9a88511577b3371bdac').then(operation => {
    expect(operation).not.toBeNull();
    operation.invoke({ length: "100" }).then((result) => {
        expect(result.status).toBe('COMPLETE')
        const jobId = result.id;
        venue.getJob(jobId).then((job) => {
           expect(job.input).toEqual({ length: "100" })
        })
    })
  });
   
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

const getSHA256Hash = async (input) => {
      const textAsBuffer = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
      return hash;
};

