/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_file_api_v1_files_upload_post } from "../models/Body_upload_file_api_v1_files_upload_post";
import type { FileInDB } from "../models/FileInDB";
import type { Response } from "../models/Response";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class FilesService {
  /**
   * Upload File
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static uploadFileApiV1FilesUploadPost({
    formData,
  }: {
    formData: Body_upload_file_api_v1_files_upload_post;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/files/upload",
      formData: formData,
      mediaType: "multipart/form-data",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete File
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deleteFileApiV1FilesFileIdDelete({
    fileId,
  }: {
    fileId: string;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/files/{file_id}",
      path: {
        file_id: fileId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get File
   * @returns FileInDB Successful Response
   * @throws ApiError
   */
  public static getFileApiV1FilesFileIdGet({
    fileId,
  }: {
    fileId: string;
  }): CancelablePromise<FileInDB> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/files/{file_id}",
      path: {
        file_id: fileId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update File
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static updateFileApiV1FilesFileIdPut({
    fileId,
    requestBody,
  }: {
    fileId: string;
    requestBody: Record<string, any>;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/files/{file_id}",
      path: {
        file_id: fileId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List Files
   * @returns FileInDB Successful Response
   * @throws ApiError
   */
  public static listFilesApiV1FilesGet(): CancelablePromise<Array<FileInDB>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/files",
    });
  }
}
