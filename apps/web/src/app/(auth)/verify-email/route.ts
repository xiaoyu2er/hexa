import { verifyEmailByTokenAction } from "@/lib/actions/user";
import {
  createOpenApiServerActionRouter,
  createRouteHandlers,
} from "zsa-openapi";

const router = createOpenApiServerActionRouter({}).get(
  "/verify-email",
  verifyEmailByTokenAction,
  {}
);

export const { GET } = createRouteHandlers(router);
