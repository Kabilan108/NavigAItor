/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssistantMessage } from "../models/AssistantMessage";
import type { Message } from "../models/Message";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ChatService {
  /**
   * Create Chat
   * @returns AssistantMessage Successful Response
   * @throws ApiError
   */
  public static createChatApiV1ChatPost({
    requestBody,
    topK = 3,
  }: {
    requestBody: Array<Message | AssistantMessage>;
    topK?: number;
  }): CancelablePromise<AssistantMessage> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/chat",
      query: {
        top_k: topK,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
