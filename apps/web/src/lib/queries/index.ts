import type { AppType } from "@/app/api/[[...route]]/route";
import { InferRequestType, InferResponseType, hc } from "hono/client";
export const client = hc<AppType>("/api");
