import { CoviaError, CoviaConnectionError, GridError, NotFoundError, RunStatus } from './types';
import { logger } from './Logger';

/**
 * Parse error message from an API response body.
 */
async function parseErrorBody(response: Response): Promise<{ message: string; body: any }> {
  let body: any = null;
  let message = `Request failed with status ${response.status}`;
  try {
    body = await response.json();
    if (body?.error) {
      message = body.error;
    }
  } catch {
    try {
      const text = await response.text();
      if (text) message = text;
    } catch {
      // use default message
    }
  }
  return { message, body };
}

/**
 * Throw the appropriate error subclass for an HTTP error response.
 */
async function throwHttpError(response: Response): Promise<never> {
  const { message, body } = await parseErrorBody(response);
  if (response.status === 404) {
    throw new NotFoundError(message);
  }
  throw new GridError(response.status, message, body);
}

/**
 * Wrap a non-CoviaError into the appropriate subclass.
 */
function wrapError(error: unknown): CoviaError {
  if (error instanceof CoviaError) return error;
  const msg = (error as Error).message ?? String(error);
  // Detect network/connection errors from fetch
  if (error instanceof TypeError) {
    return new CoviaConnectionError(msg);
  }
  return new CoviaError(`Request failed: ${msg}`);
}

/**
 * Utility function to handle API calls with consistent error handling
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns {Promise<T>} The response data
 */
export async function fetchWithError<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method ?? 'GET';
  logger.debug(`${method} ${url}`);
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    const msg = (error as Error).message ?? String(error);
    logger.debug(`Connection failed: ${method} ${url} — ${msg}`);
    throw wrapError(error);
  }
  logger.debug(`${method} ${url} → ${response.status}`);
  if (!response.ok) {
    await throwHttpError(response);
  }
  return response.json();
}

/**
 * Utility function to handle fetch requests that return streams
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns {Promise<Response>} The fetch response
 */
export async function fetchStreamWithError(url: string, options?: RequestInit): Promise<Response> {
  const method = options?.method ?? 'GET';
  logger.debug(`${method} ${url}`);
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    const msg = (error as Error).message ?? String(error);
    logger.debug(`Connection failed: ${method} ${url} — ${msg}`);
    throw wrapError(error);
  }
  logger.debug(`${method} ${url} → ${response.status}`);
  if (!response.ok) {
    await throwHttpError(response);
  }
  return response;
}
/**
 * Utility function to check if job is considered completed
 * @param jobStatus - The status of the job
 * @returns {boolean} - Returns false if job is not completed , else returns true
 */
export function isJobComplete(jobStatus:RunStatus): boolean {
  if(jobStatus == null)
      return false;
  return jobStatus == RunStatus.COMPLETE ? true:false
}
/**
 * Utility function to check if job is considered paused
 * @param jobStatus - The status of the job
 * @returns {boolean} - Returns false if job is not paused , else returns true
 */
export function isJobPaused(jobStatus:RunStatus): boolean {
  if(jobStatus == null)
      return false;
  return jobStatus == RunStatus.PAUSED
      || jobStatus == RunStatus.INPUT_REQUIRED
      || jobStatus == RunStatus.AUTH_REQUIRED;
}
/**
 * Utility function to check if job is considered finished
 * @param jobStatus - The status of the job
 * @returns {boolean} - Returns false if job is not finished , else returns true
 */
export function isJobFinished(jobStatus:RunStatus): boolean {
  if(jobStatus == null)
      return false;

  if (jobStatus == RunStatus.COMPLETE) return true;
  if (jobStatus == RunStatus.FAILED) return true;
  if (jobStatus == RunStatus.REJECTED) return true;
  if (jobStatus == RunStatus.CANCELLED) return true;
  if (jobStatus == RunStatus.TIMEOUT) return true;

  return false;
}
/**
 * Utility function to parse the asset hex from the compelte assetId
 * @param assetId - The complete assetId
 * @returns {string} - Returns the parsed hexIdof the asset
 */
export function getParsedAssetId(assetId: string): string {
  if(assetId.startsWith("did:web")) {
    const parts = assetId.split("/");
    return  parts[parts.length - 1];
  }
  return assetId;
}
/**
 * Utility function to return complete assetId from hex and path
 * @param assetHex - The asset hex
 * @param assetPath - The asset path
 * @returns {string} - Returns the complete assetId
 */
export function getAssetIdFromPath(assetHex: string, assetPath:string): string {
  //Get did from path and append to asset for full id
  const venueDid = decodeURIComponent(assetPath.split("/")[4]);   
  return venueDid+"/a/"+assetHex;
}
export function getAssetIdFromVenueId(assetHex: string, venueId:string): string {
  //Get did from path and append to asset for full id
  return venueId+"/a/"+assetHex;
}

