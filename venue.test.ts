import { Venue,  CoviaError,  StatusData, Job, Grid, RunStatus, isJobComplete, isJobFinished, getParsedAssetId, getAssetIdFromPath, getAssetIdFromVenueId } from './src/index';

let venue:Venue;

beforeAll(async () => {
     const venueDid = process.env.VENUE_HOST?.toString();
      if(venueDid)
          venue = await Grid.connect(venueDid);
      else
          throw new Error("Unable to connect to Venue "+venueDid)
});
test('GridConnectWithDid', () => { 
  Grid.connect(process.env.VENUE_HOST!).then((venue:Venue) => {
    expect(venue.venueId).toBe(process.env.VENUE_HOST!);

  })
});
test('GridConnectWithUrl', () => { 
  Grid.connect(process.env.VENUE_URL!).then((venue:Venue) => {
    expect(venue.venueId).toBe(process.env.VENUE_HOST!);

  })
});
test('GridConnectCheckName', () => { 
  Grid.connect(process.env.VENUE_HOST!).then((venue:Venue) => {
    expect(venue.metadata.name).toBe(process.env.VENUE_NAME!);

  })
});
test('venueHasAssets', () => { 
    venue.getAssets().then((assets) => {
      expect(assets).toBeInstanceOf(Array);
      expect(assets.length).toBeGreaterThan(Number(process.env.MIN_ASSETS_VENUE));
    })
});
test('venueHasAssetId', () => {
   expect(venue.getAsset(process.env.VALID_ASSET!)).resolves.not.toBeNull();
   venue.getAsset(process.env.VALID_ASSET!).then((asset) => {
       
      asset.getMetadata().then(metadata => {
        expect(metadata?.name).toBe('Iris Dataset');
      })
   })
});
test('venueInvokeOp', () => {
   expect(venue.getAsset(process.env.VALID_OP!)).resolves.not.toBeNull();
    venue.getAsset(process.env.VALID_OP!).then((operation) => {
      expect(operation.id).not.toBeNull();
       operation.invoke({ length: "10" }).then((result:Job) => {
        expect(result.metadata.status).toBe(RunStatus.COMPLETE)
        const jobId = result.id;
        venue.getJob(jobId).then((job:Job) => {
           expect(job?.metadata.input).toEqual({ length: '10' })
        })
    })
    })
});
test('venueDataAsset', () => {
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
           expect(asset.getContentURL()).toBe(process.env.VENUE_URL+"/api/v1/assets/"+asset.id+"/content");
         }) 
   })
})


test('venueDoesNotHaveAssetId', () => {
   expect(venue.getAsset('42322')).rejects.toEqual(new CoviaError('Request failed! status: 400'));
});
test('venueHasNoData', () => {
   expect(venue.getJob('xyz')).rejects.toEqual(new CoviaError('Request failed! status: 404'));
});

test('venueRunOpAndCancel', () => {
   expect(venue.getAsset(process.env.VALID_OP2!)).resolves.not.toBeNull();
    venue.getAsset(process.env.VALID_OP2!).then((operation) => {
      expect(operation.id).not.toBeNull();
       operation.invoke(process.env.VALID_OP2_INPUT!).then((result) => {
       if(result.metadata.status == 'STARTED' || result.metadata.status == 'PENDING') {
        const jobId = result.id;
        venue.cancelJob(jobId).then((status) => {
             expect(status).toBe(200)
        })
       
       }
      });
    })
});

test('venueInvokeOpAndCancel', () => {
   expect(venue.getAsset(process.env.VALID_OP2!)).resolves.not.toBeNull();
    venue.getAsset(process.env.VALID_OP2!).then((operation) => {
      expect(operation.id).not.toBeNull();
       operation.invoke(process.env.VALID_OP2_INPUT!).then((result) => {
       if(result.metadata.status == 'STARTED' || result.metadata.status == 'PENDING') {
        const jobId = result.id;
        venue.cancelJob(jobId).then((status) => {
             expect(status).toBe(200)
        })
       
       }
      });
    })
});
test('venueStatus', () => {
   venue.getStats().then((stats:StatusData) => {
      expect(stats?.status).toBe("OK");
      expect(stats?.url).toBe(process.env.VENUE_URL);
      expect(stats?.did).toBe(process.env.VENUE_HOST);
   })
})
test('isJobCompleteMethod', () => {
   expect(isJobComplete(RunStatus.COMPLETE)).toBe(true)
   expect(isJobComplete(RunStatus.PENDING)).toBe(false)
})
test('isJobFinsihedMethod', () => {
   expect(isJobFinished(RunStatus.COMPLETE)).toBe(true)
   expect(isJobFinished(RunStatus.FAILED)).toBe(true)
   expect(isJobFinished(RunStatus.REJECTED)).toBe(true)
   expect(isJobFinished(RunStatus.CANCELLED)).toBe(true)
   expect(isJobFinished(RunStatus.STARTED)).toBe(false)
   expect(isJobFinished(RunStatus.AUTH_REQUIRED)).toBe(false)
})
test('getJobs', () => {
venue.getJobs().then((jobs => {
      expect(jobs.length).toBeGreaterThan(0);
      venue.getJob(jobs[0]).then((job:Job) => {
         expect(job.id).not.toBeNull();
         expect(job.metadata.status).not.toBeNull();
      })

  }))
})

const getSHA256Hash = async (input:Buffer<ArrayBuffer>) => {
      const textAsBuffer = new TextEncoder().encode(input.toString());
      const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
      return hash;
};


