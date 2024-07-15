import { loginByTokenAction } from "@/lib/actions/login";
import {
  createOpenApiServerActionRouter,
  createRouteHandlers,
} from "zsa-openapi";

const router = createOpenApiServerActionRouter({}).get(
  "/login/passtoken",
  loginByTokenAction,
  {},
);

export const { GET } = createRouteHandlers(router);
