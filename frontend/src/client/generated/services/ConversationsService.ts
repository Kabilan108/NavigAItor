/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConversationInDB } from "../models/ConversationInDB";
import type { UpdateConversation } from "../models/UpdateConversation";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ConversationsService {
  /**
   * Get Conversation
   * @returns ConversationInDB Successful Response
   * @throws ApiError
   */
  public static getConversationApiV1ConversationsConversationIdGet({
    conversationId,
  }: {
    conversationId: string;
  }): CancelablePromise<ConversationInDB> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/conversations/{conversation_id}",
      path: {
        conversation_id: conversationId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Conversation
   * @returns ConversationInDB Successful Response
   * @throws ApiError
   */
  public static updateConversationApiV1ConversationsConversationIdPut({
    conversationId,
    requestBody,
  }: {
    conversationId: string;
    requestBody: UpdateConversation;
  }): CancelablePromise<ConversationInDB> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/conversations/{conversation_id}",
      path: {
        conversation_id: conversationId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Conversation
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteConversationApiV1ConversationsConversationIdDelete({
    conversationId,
  }: {
    conversationId: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/conversations/{conversation_id}",
      path: {
        conversation_id: conversationId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
