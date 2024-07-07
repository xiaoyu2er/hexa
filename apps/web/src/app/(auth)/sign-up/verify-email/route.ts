import { verifyEmailByTokenAction } from "@/lib/actions/sign-up";
import {
  createOpenApiServerActionRouter,
  createRouteHandlers,
} from "zsa-openapi";

const router = createOpenApiServerActionRouter({}).get(
  "/sign-up/verify-email",
  verifyEmailByTokenAction,
  {},
);

export const { GET } = createRouteHandlers(router);
