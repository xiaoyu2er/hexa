import { RESET_PASSWORD_EXPIRE_TIME_SPAN } from "@/lib/const";
import { generateCode, generateId } from "@/lib/utils";
import type { DBType } from "@/server/types";
import { and, eq } from "drizzle-orm";
import { createDate, isWithinExpirationDate } from "oslo";
import { ZSAError } from "zsa";
import { type TokenType, tokenTable } from "../schema";

export async function deleteDBToken(
  db: DBType,
  userId: string,
  type: TokenType,
) {
  return db
    .delete(tokenTable)
    .where(and(eq(tokenTable.userId, userId), eq(tokenTable.type, type)));
}

export async function findDBTokenByUserId(
  db: DBType,
  userId: string,
  type: TokenType,
) {
  return db.query.tokenTable.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.userId, userId), eq(table.type, type)),
  });
}

export async function addDBToken(
  db: DBType,
  userId: string,
  email: string,
  type: TokenType,
) {
  await db
    .delete(tokenTable)
    .where(and(eq(tokenTable.userId, userId), eq(tokenTable.type, type)));
  const code = generateCode();
  const token = generateId();
  const row = (
    await db
      .insert(tokenTable)
      .values({
        code,
        token,
        userId,
        email,
        expiresAt: createDate(RESET_PASSWORD_EXPIRE_TIME_SPAN),
        type,
      })
      .returning()
  )[0];

  if (!row) {
    throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create token");
  }
  return row;
}

export async function getTokenByToken(
  db: DBType,
  token: string,
  type: TokenType,
) {
  return db.query.tokenTable.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.token, token), eq(table.type, type)),
  });
}

export async function verifyDBTokenByCode(
  db: DBType,
  userId: string,
  codeOrToken: {
    code?: string;
    token?: string;
  },
  type: TokenType,
  deleteRow: boolean,
) {
  if (!codeOrToken.code && !codeOrToken.token) {
    throw new ZSAError("CONFLICT", "Code or token is required");
  }

  console.log("findDBTokenByUserId", userId, type);
  const tokenRow = await findDBTokenByUserId(db, userId, type);

  // No record
  if (!tokenRow) {
    throw new ZSAError(
      "CONFLICT",
      process.env.NODE_ENV === "development"
        ? "[dev]Code was not sent"
        : "Code is invalid or expired",
    );
  }

  // Expired
  if (!isWithinExpirationDate(tokenRow.expiresAt)) {
    // Delete the verification row
    if (deleteRow) {
      await deleteDBToken(db, userId, type);
    }

    throw new ZSAError(
      "CONFLICT",
      process.env.NODE_ENV === "development"
        ? "[dev]Code is expired"
        : "Code is invalid or expired",
    );
  }

  if (codeOrToken.code) {
    // Not matching code
    if (tokenRow.code !== codeOrToken.code) {
      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === "development"
          ? "[dev]Code does not match"
          : "Code is invalid or expired",
      );
    }
  }

  if (codeOrToken.token) {
    // Not matching token
    if (tokenRow.token !== codeOrToken.token) {
      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === "development"
          ? "[dev]Token does not match"
          : "Token is invalid or expired",
      );
    }
  }

  if (deleteRow) {
    await deleteDBToken(db, userId, type);
  }

  return tokenRow;
}
