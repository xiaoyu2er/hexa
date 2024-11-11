import {
  NEXT_PUBLIC_STORAGE_BASE_URL,
  NEXT_PUBLIC_STORAGE_ENDPOINT,
} from "@/lib/env";
import { fetchWithTimeout } from "@hexa/utils";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { AwsClient } from "aws4fetch";

interface imageOptions {
  contentType?: string;
  width?: number;
  height?: number;
}

class StorageClient {
  private $client: Promise<AwsClient>;

  constructor() {
    this.$client = new Promise((resolve) => {
      getCloudflareContext().then(
        ({ env: { STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY } }) => {
          resolve(
            new AwsClient({
              accessKeyId: STORAGE_ACCESS_KEY_ID ?? "",
              secretAccessKey: STORAGE_SECRET_ACCESS_KEY ?? "",
              service: "s3",
              region: "auto",
            }),
          );
        },
      );
    });
  }

  async upload(key: string, body: Blob | string, opts?: imageOptions) {
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let uploadBody;
    if (typeof body === "string") {
      if (this.isBase64(body)) {
        uploadBody = this.base64ToArrayBuffer(body, opts);
      } else if (this.isUrl(body)) {
        uploadBody = await this.urlToBlob(body, opts);
      } else {
        throw new Error("Invalid input: Not a base64 string or a valid URL");
      }
    } else {
      uploadBody = body;
    }

    console.log("uploadBody", uploadBody, uploadBody.size, uploadBody.type);

    const headers: { [key: string]: string } = {
      "Content-Length": uploadBody.size.toString(),
    };
    if (opts?.contentType) headers["Content-Type"] = opts.contentType;
    const client = await this.$client;
    const res = await client.fetch(
      `${NEXT_PUBLIC_STORAGE_ENDPOINT ?? ""}/${key}`,
      {
        method: "PUT",
        headers,
        body: uploadBody,
      },
    );

    const json = await res.text();
    console.log("upload:", json);

    return {
      url: `${NEXT_PUBLIC_STORAGE_BASE_URL ?? ""}/${key}`,
    };
  }

  async delete(url: string) {
    if (!url.startsWith(NEXT_PUBLIC_STORAGE_BASE_URL ?? "")) {
      return {
        success: false,
        message: `Url not stored on ${NEXT_PUBLIC_STORAGE_BASE_URL ?? ""}`,
      };
    }
    const key = url.replace(`${NEXT_PUBLIC_STORAGE_BASE_URL ?? ""}/`, "");
    const client = await this.$client;
    await client.fetch(`${NEXT_PUBLIC_STORAGE_ENDPOINT ?? ""}/${key}`, {
      method: "DELETE",
    });

    return { success: true };
  }

  private base64ToArrayBuffer(base64: string, opts?: imageOptions) {
    const base64Data = base64.replace(/^data:.+;base64,/, "");
    const paddedBase64Data = base64Data.padEnd(
      base64Data.length + ((4 - (base64Data.length % 4)) % 4),
      "=",
    );

    const binaryString = atob(paddedBase64Data);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    const blobProps: { type?: string } = {};

    if (opts?.contentType) blobProps.type = opts.contentType;
    return new Blob([byteArray], blobProps);
  }

  private isBase64(str: string): boolean {
    const regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,([^\s]*)$/;
    return regex.test(str);
  }

  private isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  }

  private async urlToBlob(url: string, opts?: imageOptions): Promise<Blob> {
    let response: Response;
    if (opts?.height || opts?.width) {
      try {
        const proxyUrl = new URL("https://wsrv.nl");
        proxyUrl.searchParams.set("url", url);
        if (opts.width) proxyUrl.searchParams.set("w", opts.width.toString());
        if (opts.height) proxyUrl.searchParams.set("h", opts.height.toString());
        proxyUrl.searchParams.set("fit", "cover");
        response = await fetchWithTimeout(proxyUrl.toString());
      } catch (error) {
        response = await fetch(url);
      }
    } else {
      response = await fetch(url);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const blob = await response.blob();
    if (opts?.contentType) {
      return new Blob([blob], { type: opts.contentType });
    }
    return blob;
  }
}

export const storage = new StorageClient();

export const isStored = (url: string) => {
  return url.startsWith(NEXT_PUBLIC_STORAGE_BASE_URL ?? "");
};
