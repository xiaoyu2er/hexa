import { Hono } from "hono";
import { cors } from "hono/cors";

import { handle } from "hono/vercel";
import test from "./test";
import user from "./user";

const app = new Hono().basePath("/api");

app.use("/*", cors());
app.route("/test", test);
app.route("/", user);

export const GET = handle(app);
export const POST = handle(app);
