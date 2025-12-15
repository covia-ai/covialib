import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';

// src/types.ts
var RunStatus = /* @__PURE__ */ ((RunStatus2) => {
  RunStatus2["COMPLETE"] = "COMPLETE";
  RunStatus2["FAILED"] = "FAILED";
  RunStatus2["PENDING"] = "PENDING";
  RunStatus2["STARTED"] = "STARTED";
  RunStatus2["CANCELLED"] = "CANCELLED";
  RunStatus2["TIMEOUT"] = "TIMEOUT";
  RunStatus2["REJECTED"] = "REJECTED";
  RunStatus2["INPUT_REQUIRED"] = "INPUT_REQUIRED";
  RunStatus2["AUTH_REQUIRED"] = "AUTH_REQUIRED";
  RunStatus2["PAUSED"] = "PAUSED";
  return RunStatus2;
})(RunStatus || {});
var CoviaError = class extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = "CoviaError";
    this.code = code;
    this.message = message;
  }
};

// src/Credentials.ts
var CredentialsHTTP = class {
  constructor(venueId, apiKey, userId) {
    this.venueId = venueId;
    this.apiKey = apiKey;
    this.userId = userId;
  }
};

// src/Utils.ts
function fetchWithError(url, options) {
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new CoviaError(`Request failed! status: ${response.status}`);
    }
    return response.json();
  }).catch((error) => {
    throw error instanceof CoviaError ? error : new CoviaError(`Request failed: ${error.message}`);
  });
}
function fetchStreamWithError(url, options) {
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new CoviaError(`Request failed! status: ${response.status}`);
    }
    return response;
  }).catch((error) => {
    throw error instanceof CoviaError ? error : new CoviaError(`Request failed: ${error.message}`);
  });
}
function isJobComplete(jobStatus) {
  if (jobStatus == null)
    return false;
  return jobStatus == "COMPLETE" /* COMPLETE */ ? true : false;
}
function isJobPaused(jobStatus) {
  if (jobStatus == null)
    return false;
  return jobStatus == "PAUSED" /* PAUSED */ ? true : false;
}
function isJobFinished(jobStatus) {
  if (jobStatus == null)
    return false;
  if (jobStatus == "COMPLETE" /* COMPLETE */) return true;
  if (jobStatus == "FAILED" /* FAILED */) return true;
  if (jobStatus == "REJECTED" /* REJECTED */) return true;
  if (jobStatus == "CANCELLED" /* CANCELLED */) return true;
  return false;
}
function getParsedAssetId(assetId) {
  if (assetId.startsWith("did:web")) {
    const parts = assetId.split("/");
    return parts[parts.length - 1];
  }
  return assetId;
}
function getAssetIdFromPath(assetHex, assetPath) {
  const venueDid = decodeURIComponent(assetPath.split("/")[4]);
  return venueDid + "/a/" + assetHex;
}
function getAssetIdFromVenueId(assetHex, venueId) {
  return venueId + "/a/" + assetHex;
}

// src/Asset.ts
var cache = /* @__PURE__ */ new Map();
var Asset = class {
  constructor(id, venue, metadata = {}) {
    this.id = id;
    this.venue = venue;
    this.metadata = metadata;
  }
  /**
   * Get asset metadata
   * @returns {Promise<AssetMetadata>}
   */
  async getMetadata() {
    if (cache.has(this.id)) {
      return Promise.resolve(cache.get(this.id));
    } else {
      const data = this.venue.getMetadata(this.id);
      if (data) {
        cache.set(this.id, data);
      }
      return data;
    }
  }
  /**
   * Read stream from asset
   * @param reader - ReadableStreamDefaultReader
   */
  async readStream(reader) {
    return this.readStream(reader);
  }
  /**
   * Upload content to asset
   * @param content - Content to upload
   * @returns {Promise<ReadableStream<Uint8Array> | null>}
   */
  uploadContent(content) {
    return this.venue.uploadContent(this.id, content);
  }
  /**
   * Get asset content
   * @returns {Promise<ReadableStream<Uint8Array> | null>}
   */
  getContent() {
    return this.venue.getContent(this.id);
  }
  /**
   * Get the URL for downloading asset content
   * @returns {string} The URL for downloading the asset content
   */
  getContentURL() {
    return `${this.venue.baseUrl}/api/v1/assets/${this.id}/content`;
  }
  /**
   * Execute the operation
   * @param input - Operation input parameters
   * @returns {Promise<any>}
   */
  run(input) {
    return this.venue.run(this.id, input);
  }
};

// src/Operation.ts
var Operation = class extends Asset {
  constructor(id, venue, metadata = {}) {
    super(id, venue, metadata);
  }
  // Operation-specific methods can be added here
  // For now, it inherits all functionality from Asset
};

// src/DataAsset.ts
var DataAsset = class extends Asset {
  constructor(id, venue, metadata = {}) {
    super(id, venue, metadata);
  }
  // DataAsset-specific methods can be added here
  // For now, it inherits all functionality from Asset
};

// src/Job.ts
var Job = class {
  constructor(id, venue, metadata) {
    this.id = id;
    this.venue = venue;
    this.metadata = metadata;
  }
  /**
  * Cancels the execution of the job
  * @returns {Promise<number>}
  */
  async cancelJob() {
    return this.venue.cancelJob(this.id);
  }
  /**
   * Delete the job
   * @returns {Promise<number>}
   */
  async deleteJob() {
    return this.venue.deleteJob(this.id);
  }
};

// src/Venue.ts
var webResolver = getResolver();
var resolver = new Resolver(webResolver);
var cache2 = /* @__PURE__ */ new Map();
var Venue = class _Venue {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || "https://venue-test.covia.ai";
    this.venueId = options.venueId || "default";
    this.name = options.name || "default";
    this.credentials = options.credentials || new CredentialsHTTP(this.venueId, "", "");
    this.metadata = {};
  }
  /**
   * Static method to connect to a venue
   * @param venueId - Can be a HTTP base URL, DNS name, or existing Venue instance
   * @param credentials - Optional credentials for venue authentication
   * @returns {Promise<Venue>} A new Venue instance configured appropriately
   */
  static async connect(venueId, credentials) {
    if (venueId instanceof _Venue) {
      return new _Venue({
        baseUrl: venueId.baseUrl,
        venueId: venueId.venueId,
        name: venueId.name,
        credentials
      });
    }
    if (typeof venueId === "string") {
      let baseUrl;
      if (venueId.startsWith("http:") || venueId.startsWith("https:")) {
        baseUrl = venueId;
        if (baseUrl.endsWith("/"))
          baseUrl = baseUrl.substring(0, baseUrl.length - 1);
      } else if (venueId.startsWith("did:web:")) {
        const didDoc = await resolver.resolve(venueId);
        if (!didDoc.didDocument) {
          throw new CoviaError("Invalid DID document");
        }
        const endpoint = didDoc.didDocument.service?.find((service) => service.type === "Covia.API.v1")?.serviceEndpoint;
        if (!endpoint) {
          throw new CoviaError("No endpoint found for DID");
        }
        baseUrl = endpoint.toString().replace(/\/api\/v1/, "");
      } else {
        baseUrl = `https://${venueId}`;
      }
      const data = await fetchWithError(baseUrl + "/api/v1/status");
      return new _Venue({
        baseUrl,
        venueId: data.did,
        name: data.name,
        credentials
      });
    }
    throw new CoviaError("Invalid venue ID parameter. Must be a string (URL/DNS) or Venue instance.");
  }
  /**
   * Create a new asset
   * @param assetData - Asset configuration
   * @returns {Promise<Asset>}
   */
  async createAsset(assetData) {
    return fetchWithError(`${this.baseUrl}/api/v1/assets/`, {
      method: "POST",
      headers: this.setCredentialsInHeader(),
      body: JSON.stringify(assetData)
    }).then((response) => {
      return this.getAsset(response);
    });
  }
  /**
   * Read stream from asset
   * @param reader - ReadableStreamDefaultReader
   */
  async readStream(reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
    }
  }
  /**
   * Get asset by ID
   * @param assetId - Asset identifier
   * @returns {Promise<Asset>} Returns either an Operation or DataAsset based on the asset's metadata
   */
  async getAsset(assetId) {
    if (cache2.has(assetId)) {
      const cachedData = cache2.get(assetId);
      if (cachedData.metadata?.operation) {
        return new Operation(assetId, this, cachedData);
      } else {
        return new DataAsset(assetId, this, cachedData);
      }
    } else {
      return fetchWithError(`${this.baseUrl}/api/v1/assets/${assetId}`).then((data) => {
        cache2.set(assetId, data);
        if (data.metadata?.operation) {
          return new Operation(assetId, this, data);
        } else {
          return new DataAsset(assetId, this, data);
        }
      });
    }
  }
  /**
   * Get all assets
   * @returns {Promise<Asset[]>}
   */
  getAssets() {
    return fetchWithError(`${this.baseUrl}/api/v1/assets/`).then((assetIds) => {
      const assetPromises = assetIds.items.map((assetId) => this.getAsset(assetId));
      return Promise.all(assetPromises);
    });
  }
  /**
   * Get all jobs
   * @returns {Promise<string[]>}
   */
  async getJobs() {
    return fetchWithError(`${this.baseUrl}/api/v1/jobs`);
  }
  /**
   * Get job by ID
   * @param jobId - Job identifier
   * @returns {Promise<Job>}
   */
  async getJob(jobId) {
    return fetchWithError(`${this.baseUrl}/api/v1/jobs/${jobId}`).then((data) => {
      return new Job(jobId, this, data);
    });
  }
  /**
  * Cancel job by ID
  * @param jobId - Job identifier
  * @returns {Promise<number>}
  */
  async cancelJob(jobId) {
    return fetchStreamWithError(`${this.baseUrl}/api/v1/jobs/${jobId}/cancel`, { method: "PUT" }).then((response) => {
      return response.status;
    });
  }
  /**
  * Delete job by ID
  * @param jobId - Job identifier
  * @returns {Promise<number>}
  */
  async deleteJob(jobId) {
    return fetchStreamWithError(`${this.baseUrl}/api/v1/jobs/${jobId}/delete`, { method: "PUT" }).then((response) => {
      return response.status;
    });
  }
  /**
  * Get the DID (Decentralized Identifier) for this venue
  * @returns {string} DID in the format did:web:domain
  */
  getStats() {
    return fetchWithError(`${this.baseUrl}/api/v1/status`);
  }
  /**
   * Get asset metadata
   * @returns {Promise<AssetMetadata>}
   */
  async getMetadata(assetId) {
    return await fetchWithError(`${this.baseUrl}/api/v1/assets/${assetId}`);
  }
  /**
  * Upload content to asset
  * @param content - Content to upload
  * @returns {Promise<ReadableStream<Uint8Array> | null>}
  */
  async uploadContent(content, assetId) {
    const response = await fetchStreamWithError(`${this.baseUrl}/api/v1/assets/${assetId}/content`, {
      method: "PUT",
      headers: this.setCredentialsInHeader(),
      body: content
    });
    return response.body;
  }
  /**
   * Get asset content
   * @returns {Promise<ReadableStream<Uint8Array> | null>}
   */
  async getContent(assetId) {
    const response = await fetchStreamWithError(`${this.baseUrl}/api/v1/assets/${assetId}/content`);
    return response.body;
  }
  /**
     * Execute the operation
     * @param input - Operation input parameters
     * @returns {Promise<any>}
     */
  async run(assetId, input) {
    const payload = {
      operation: assetId,
      input
    };
    let customHeader = {};
    if (this.credentials.userId && this.credentials.userId != "") {
      customHeader = {
        "Content-Type": "application/json",
        "X-Covia-User": this.credentials.userId
      };
    } else {
      customHeader = {
        "Content-Type": "application/json"
      };
    }
    try {
      return await fetchWithError(`${this.baseUrl}/api/v1/invoke/`, {
        method: "POST",
        headers: customHeader,
        body: JSON.stringify(payload)
      });
    } catch (error) {
      throw error;
    }
  }
  /**
  * Execute the operation
  * @param input - Operation input parameters
  * @returns {Promise<Job>}
  */
  async invoke(assetId, input) {
    const payload = {
      operation: assetId,
      input
    };
    return fetchWithError(`${this.baseUrl}/api/v1/invoke/`, {
      method: "POST",
      headers: this.setCredentialsInHeader(),
      body: JSON.stringify(payload)
    }).catch((error) => {
      throw error;
    });
  }
  setCredentialsInHeader() {
    if (this.credentials.userId && this.credentials.userId != "") {
      return {
        "Content-Type": "application/json",
        "X-Covia-User": this.credentials.userId
      };
    } else {
      return { "Content-Type": "application/json" };
    }
  }
};

// src/Grid.ts
var cache3 = /* @__PURE__ */ new Map();
var Grid = class {
  /**
  * Static method to connect to a venue
  * @param venueId - Can be a HTTP base URL, DNS name, or existing Venue instance
  * @returns {Promise<Venue>} A new Venue instance configured appropriately
  */
  static async connect(venueId, credentials) {
    if (cache3.has(venueId))
      return Promise.resolve(cache3.get(venueId));
    const connectedVenue = await Venue.connect(venueId, credentials);
    cache3.set(venueId, connectedVenue);
    return Promise.resolve(connectedVenue);
  }
};

export { Asset, CoviaError, CredentialsHTTP, DataAsset, Grid, Job, Operation, RunStatus, Venue, fetchStreamWithError, fetchWithError, getAssetIdFromPath, getAssetIdFromVenueId, getParsedAssetId, isJobComplete, isJobFinished, isJobPaused };
