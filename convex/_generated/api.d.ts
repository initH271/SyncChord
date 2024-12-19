/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as auth_auth0 from "../auth_auth0.js";
import type * as channels from "../channels.js";
import type * as channels_auth0 from "../channels_auth0.js";
import type * as common from "../common.js";
import type * as conversations from "../conversations.js";
import type * as conversations_auth0 from "../conversations_auth0.js";
import type * as http from "../http.js";
import type * as members from "../members.js";
import type * as members_auth0 from "../members_auth0.js";
import type * as messages from "../messages.js";
import type * as messages_auth0 from "../messages_auth0.js";
import type * as reactions from "../reactions.js";
import type * as reactions_auth0 from "../reactions_auth0.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";
import type * as workspaces from "../workspaces.js";
import type * as workspaces_auth0 from "../workspaces_auth0.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  auth_auth0: typeof auth_auth0;
  channels: typeof channels;
  channels_auth0: typeof channels_auth0;
  common: typeof common;
  conversations: typeof conversations;
  conversations_auth0: typeof conversations_auth0;
  http: typeof http;
  members: typeof members;
  members_auth0: typeof members_auth0;
  messages: typeof messages;
  messages_auth0: typeof messages_auth0;
  reactions: typeof reactions;
  reactions_auth0: typeof reactions_auth0;
  upload: typeof upload;
  users: typeof users;
  workspaces: typeof workspaces;
  workspaces_auth0: typeof workspaces_auth0;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
