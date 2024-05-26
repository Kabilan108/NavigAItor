/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AuthService {
  /**
   * Login
   * @returns any Successful Response
   * @throws ApiError
   */
  public static loginApiV1AuthLoginGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/auth/login",
    });
  }
  /**
   * Token
   * @returns any Successful Response
   * @throws ApiError
   */
  public static tokenApiV1AuthTokenGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/auth/token",
    });
  }
  /**
   * Refresh
   * @returns any Successful Response
   * @throws ApiError
   */
  public static refreshApiV1AuthRefreshPost({
    requestBody,
  }: {
    requestBody: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/auth/refresh",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
