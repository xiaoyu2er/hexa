import { ApiError } from '@hexa/lib';
import type { CustomHostnameDetailsType } from '@hexa/server/schema/domain';

// Get an API Token
// https://dash.cloudflare.com/profile/api-tokens

// Get Custom Hostname Details
// https://developers.cloudflare.com/api/operations/custom-hostname-for-a-zone-custom-hostname-details

function constructRequest(path: string, request?: RequestInit) {
  return new Request(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/custom_hostnames${path}`,
    {
      method: request?.method || 'GET',
      ...request,
      headers: {
        Authorization: `Bearer ${process.env.CF_EDIT_CUSTOM_HOSTNAME_API_TOKEN}`,
        'Content-Type': 'application/json',
        ...request?.headers,
      },
    }
  );
}

async function handleRequest<T>(req: Request) {
  const res = await fetch(req);
  // check if response type is json
  if (!res.headers.get('content-type')?.includes('application/json')) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(res.status, res.statusText);
    const message = await res.text();
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(message);

    throw new ApiError('INTERNAL_SERVER_ERROR', message);
  }

  const data = (await res.json()) as {
    success: boolean;
    errors?: { code: number; message: string }[];
    result: T;
  };

  if (!data.success) {
    throw new ApiError(
      'INTERNAL_SERVER_ERROR',
      data.errors?.[0]
        ? `${data.errors[0].code}: ${data.errors[0].message}`
        : 'Unknown error'
    );
  }

  return data.result;
}

export const getCustomHostnameDetails = (
  domainId: string
): Promise<CustomHostnameDetailsType> =>
  handleRequest<CustomHostnameDetailsType>(constructRequest(`/${domainId}`));

// https://developers.cloudflare.com/api/operations/custom-hostname-for-a-zone-create-custom-hostnameame

export const createCustomHostname = (
  hostname: string
): Promise<CustomHostnameDetailsType> => {
  const body = {
    hostname,
    ssl: {
      method: 'txt',
      type: 'dv',
      settings: { min_tls_version: '1.0' },
    },
  };
  const request = constructRequest('', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return handleRequest<CustomHostnameDetailsType>(request);
};

// https://developers.cloudflare.com/api/operations/custom-hostname-for-a-zone-delete-custom-hostname-(-and-any-issued-ssl-certificates)
export const deleteCustomHostname = (domainId: string) =>
  handleRequest(
    constructRequest(`/${domainId}`, {
      method: 'DELETE',
    })
  );
