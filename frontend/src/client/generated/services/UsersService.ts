/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Response } from "../models/Response";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class UsersService {
  /**
   * Get Current User Info
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static getCurrentUserInfoApiV1UsersMeGet(): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/me",
    });
  }
  /**
   * Update User
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static updateUserApiV1UsersUserIdPut({
    userId,
    requestBody,
  }: {
    userId: string;
    requestBody: Record<string, any>;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete User
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deleteUserApiV1UsersUserIdDelete({
    userId,
  }: {
    userId: string;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
