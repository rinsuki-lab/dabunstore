import { hc } from "hono/client";
import type { ApiType } from "../../routes/api/index.js";

export const client = hc<ApiType>("/api/")