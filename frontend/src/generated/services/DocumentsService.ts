/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_document_api_v1_documents_upload_post } from "../models/Body_upload_document_api_v1_documents_upload_post";
import type { Document } from "../models/Document";
import type { Response } from "../models/Response";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class DocumentsService {
  /**
   * Upload Document
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static uploadDocumentApiV1DocumentsUploadPost({
    formData,
  }: {
    formData: Body_upload_document_api_v1_documents_upload_post;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/documents/upload",
      formData: formData,
      mediaType: "multipart/form-data",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Document
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deleteDocumentApiV1DocumentsDocumentIdDelete({
    documentId,
  }: {
    documentId: string;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/documents/{document_id}",
      path: {
        document_id: documentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Document
   * @returns Document Successful Response
   * @throws ApiError
   */
  public static getDocumentApiV1DocumentsDocumentIdGet({
    documentId,
  }: {
    documentId: string;
  }): CancelablePromise<Document> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/documents/{document_id}",
      path: {
        document_id: documentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Document
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static updateDocumentApiV1DocumentsDocumentIdPut({
    documentId,
    requestBody,
  }: {
    documentId: string;
    requestBody: Record<string, any>;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/documents/{document_id}",
      path: {
        document_id: documentId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List Documents
   * @returns Document Successful Response
   * @throws ApiError
   */
  public static listDocumentsApiV1DocumentsGet(): CancelablePromise<
    Array<Document>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/documents",
    });
  }
}
