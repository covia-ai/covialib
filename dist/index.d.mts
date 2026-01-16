declare class Job {
    id: string;
    venue: VenueInterface;
    metadata: JobMetadata;
    constructor(id: string, venue: VenueInterface, metadata: JobMetadata);
    /**
    * Cancels the execution of the job
    * @returns {Promise<number>}
    */
    cancelJob(): Promise<number>;
    /**
     * Delete the job
     * @returns {Promise<number>}
     */
    deleteJob(): Promise<number>;
}

declare abstract class Asset {
    id: AssetID;
    venue: VenueInterface;
    metadata: AssetMetadata;
    status?: RunStatus;
    error?: string;
    constructor(id: AssetID, venue: VenueInterface, metadata?: AssetMetadata);
    /**
     * Get asset metadata
     * @returns {Promise<AssetMetadata>}
     */
    getMetadata(): Promise<AssetMetadata>;
    /**
     * Read stream from asset
     * @param reader - ReadableStreamDefaultReader
     */
    readStream(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<void>;
    /**
     * Upload content to asset
     * @param content - Content to upload
     * @returns {Promise<ReadableStream<Uint8Array> | null>}
     */
    uploadContent(content: BodyInit): Promise<ReadableStream<Uint8Array> | null>;
    /**
     * Get asset content
     * @returns {Promise<ReadableStream<Uint8Array> | null>}
     */
    getContent(): Promise<ReadableStream<Uint8Array> | null>;
    /**
     * Get the URL for downloading asset content
     * @returns {string} The URL for downloading the asset content
     */
    getContentURL(): string;
    /**
     * Execute the operation
     * @param input - Operation input parameters
     * @returns {Promise<any>}
     */
    run(input: any): Promise<any>;
    /**
    * Execute the operation
    * @param input - Operation input parameters
    * @returns {Promise<any>}
    */
    invoke(input: any): Promise<Job>;
}

interface Credentials {
    venueId: string;
    apiKey: string;
    userId: string;
}
declare class CredentialsHTTP implements Credentials {
    venueId: string;
    apiKey: string;
    userId: string;
    constructor(venueId: string, apiKey: string, userId: string);
}

declare class Venue implements VenueInterface {
    baseUrl: string;
    venueId: string;
    credentials: Credentials;
    metadata: VenueData;
    constructor(options?: VenueOptions);
    /**
     * Static method to connect to a venue
     * @param venueId - Can be a HTTP base URL, DNS name, or existing Venue instance
     * @param credentials - Optional credentials for venue authentication
     * @returns {Promise<Venue>} A new Venue instance configured appropriately
     */
    static connect(venueId: string | Venue, credentials?: CredentialsHTTP): Promise<Venue>;
    /**
     * Create a new asset
     * @param assetData - Asset configuration
     * @returns {Promise<Asset>}
     */
    createAsset(assetData: any): Promise<Asset>;
    /**
     * Read stream from asset
     * @param reader - ReadableStreamDefaultReader
     */
    readStream(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<void>;
    /**
     * Get asset by ID
     * @param assetId - Asset identifier
     * @returns {Promise<Asset>} Returns either an Operation or DataAsset based on the asset's metadata
     */
    getAsset(assetId: AssetID): Promise<Asset>;
    /**
     * Get all assets
     * @returns {Promise<Asset[]>}
     */
    getAssets(): Promise<Asset[]>;
    /**
     * Get all jobs
     * @returns {Promise<string[]>}
     */
    getJobs(): Promise<string[]>;
    /**
     * Get job by ID
     * @param jobId - Job identifier
     * @returns {Promise<Job>}
     */
    getJob(jobId: string): Promise<Job>;
    /**
    * Cancel job by ID
    * @param jobId - Job identifier
    * @returns {Promise<number>}
    */
    cancelJob(jobId: string): Promise<number>;
    /**
    * Delete job by ID
    * @param jobId - Job identifier
    * @returns {Promise<number>}
    */
    deleteJob(jobId: string): Promise<number>;
    /**
   * Get the DID (Decentralized Identifier) for this venue
   * @returns {string} DID in the format did:web:domain
   */
    getStats(): Promise<StatusData>;
    /**
     * Get asset metadata
     * @returns {Promise<AssetMetadata>}
     */
    getMetadata(assetId: string): Promise<AssetMetadata>;
    /**
 * Upload content to asset
 * @param content - Content to upload
 * @returns {Promise<ReadableStream<Uint8Array> | null>}
 */
    uploadContent(content: BodyInit, assetId: string): Promise<ReadableStream<Uint8Array> | null>;
    /**
     * Get asset content
     * @returns {Promise<ReadableStream<Uint8Array> | null>}
     */
    getContent(assetId: string): Promise<ReadableStream<Uint8Array> | null>;
    /**
       * Execute the operation
       * @param input - Operation input parameters
       * @returns {Promise<any>}
       */
    run(assetId: string, input: any): Promise<any>;
    /**
    * Execute the operation
    * @param input - Operation input parameters
    * @returns {Promise<Job>}
    */
    invoke(assetId: string, input: any): Promise<Job>;
    private setCredentialsInHeader;
}

interface VenueOptions {
    baseUrl?: string;
    venueId?: string;
    name?: string;
    description?: string;
    credentials?: Credentials;
}
interface VenueConstructor {
    new (): VenueInterface;
    connect(venueId: string | Venue, credentials?: CredentialsHTTP): Promise<Venue>;
}
interface VenueInterface {
    baseUrl: string;
    venueId: string;
    metadata: VenueData;
    cancelJob(jobId: string): Promise<number>;
    deleteJob(jobId: string): Promise<number>;
    getStats(): Promise<StatusData>;
    getJob(jobId: string): Promise<Job>;
    getJobs(): Promise<string[]>;
    getAsset(assetId: AssetID): Promise<Asset>;
    createAsset(assetData: any, userEmail: string): Promise<Asset>;
    getAssets(): Promise<Asset[]>;
    getMetadata(assetId: string): Promise<AssetMetadata>;
    readStream(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<void>;
    uploadContent(assetId: string, content: BodyInit): Promise<ReadableStream<Uint8Array> | null>;
    getContent(assetId: string): Promise<ReadableStream<Uint8Array> | null>;
    run(assetId: string, input: any): Promise<any>;
    invoke(assetId: string, input: any): Promise<Job>;
}
type AssetID = string;
interface AssetMetadata {
    [key: string]: any;
    name?: string;
    description?: string;
    type?: string;
    created?: string;
    updated?: string;
    operation?: OperationDetails;
    content?: ContentDetails;
    input?: any;
    output?: any;
}
interface VenueData {
    description?: string;
    name?: string;
}
/** Type for metadata.operation */
interface OperationDetails {
    [key: string]: any;
    adapter?: string;
    input?: any;
    output?: any;
    steps?: any[];
    result?: any;
}
/** Type for metadata.content */
interface ContentDetails {
    [key: string]: any;
}
interface OperationPayload {
    [key: string]: any;
}
interface JobMetadata {
    id: string;
    status?: RunStatus;
    created?: string;
    updated?: string;
    input?: any;
    output?: any;
    [key: string]: any;
}
interface InvokePayload {
    assetId: AssetID;
    payload: OperationPayload;
}
declare enum RunStatus {
    COMPLETE = "COMPLETE",
    FAILED = "FAILED",
    PENDING = "PENDING",
    STARTED = "STARTED",
    CANCELLED = "CANCELLED",
    TIMEOUT = "TIMEOUT",
    REJECTED = "REJECTED",
    INPUT_REQUIRED = "INPUT_REQUIRED",
    AUTH_REQUIRED = "AUTH_REQUIRED",
    PAUSED = "PAUSED"
}
interface StatusData {
    url?: string;
    ts?: string;
    status?: string;
    did?: string;
    name?: string;
    stats?: StatsData;
}
interface StatsData {
    assets?: number;
    users?: number;
    ops?: number;
    jobs?: number;
}
declare class CoviaError extends Error {
    code: number | null;
    constructor(message: string, code?: number | null);
}

/**
 * Utility function to handle API calls with consistent error handling
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns {Promise<T>} The response data
 */
declare function fetchWithError<T>(url: string, options?: RequestInit): Promise<T>;
/**
 * Utility function to handle fetch requests that return streams
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns {Promise<Response>} The fetch response
 */
declare function fetchStreamWithError(url: string, options?: RequestInit): Promise<Response>;
/**
 * Utility function to check if job is considered completed
 * @param jobStatus - The status of the job
 * @returns {boolean} - Returns false if job is not completed , else returns true
 */
declare function isJobComplete(jobStatus: RunStatus): boolean;
/**
 * Utility function to check if job is considered paused
 * @param jobStatus - The status of the job
 * @returns {boolean} - Returns false if job is not paused , else returns true
 */
declare function isJobPaused(jobStatus: RunStatus): boolean;
/**
 * Utility function to check if job is considered finished
 * @param jobStatus - The status of the job
 * @returns {boolean} - Returns false if job is not finished , else returns true
 */
declare function isJobFinished(jobStatus: RunStatus): boolean;
/**
 * Utility function to parse the asset hex from the compelte assetId
 * @param assetId - The complete assetId
 * @returns {string} - Returns the parsed hexIdof the asset
 */
declare function getParsedAssetId(assetId: string): string;
/**
 * Utility function to return complete assetId from hex and path
 * @param assetHex - The asset hex
 * @param assetPath - The asset path
 * @returns {string} - Returns the complete assetId
 */
declare function getAssetIdFromPath(assetHex: string, assetPath: string): string;
declare function getAssetIdFromVenueId(assetHex: string, venueId: string): string;

declare class Grid {
    /**
    * Static method to connect to a venue
    * @param venueId - Can be a HTTP base URL, DNS name, or existing Venue instance
    * @returns {Promise<Venue>} A new Venue instance configured appropriately
    */
    static connect(venueId: string, credentials?: CredentialsHTTP): Promise<Venue>;
}

declare class Operation extends Asset {
    constructor(id: AssetID, venue: VenueInterface, metadata?: AssetMetadata);
}

declare class DataAsset extends Asset {
    constructor(id: AssetID, venue: VenueInterface, metadata?: AssetMetadata);
}

export { Asset, type AssetID, type AssetMetadata, type ContentDetails, CoviaError, type Credentials, CredentialsHTTP, DataAsset, Grid, type InvokePayload, Job, type JobMetadata, Operation, type OperationDetails, type OperationPayload, RunStatus, type StatsData, type StatusData, Venue, type VenueConstructor, type VenueData, type VenueInterface, type VenueOptions, fetchStreamWithError, fetchWithError, getAssetIdFromPath, getAssetIdFromVenueId, getParsedAssetId, isJobComplete, isJobFinished, isJobPaused };
