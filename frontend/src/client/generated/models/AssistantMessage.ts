/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Chunk } from "./Chunk";
import type { Role } from "./Role";
export type AssistantMessage = {
  role?: Role;
  content: string;
  sources?: Array<Chunk> | null;
};
