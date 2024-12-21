import authOrg from '@hexa/server/middleware/org';
import type { Context } from '@hexa/server/route/route-types';
import { PaginationSchema } from '@hexa/server/schema/common';
import {
  InsertDomainSchema,
  type QueryDomainType,
  UpdateDomainSchema,
} from '@hexa/server/schema/domain';
import { OrgIdSchema } from '@hexa/server/schema/org';
import {
  createCustomHostname,
  getCustomHostnameDetails,
} from '@hexa/server/service/domain';
import {
  createDomain,
  getDomains,
  updateDomain,
} from '@hexa/server/store/domain';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const domain = new Hono<Context>()

  // List domains for an org
  .get(
    '/org/:orgId/domains',
    zValidator('param', OrgIdSchema),
    zValidator('query', PaginationSchema),
    authOrg('param'),
    async (c) => {
      const { orgId } = c.req.valid('param');
      const { data, rowCount } = await getDomains(
        c.get('db'),
        orgId,
        c.req.valid('query')
      );

      const newData: QueryDomainType[] = await Promise.all(
        data.map((d) =>
          d.cloudflareId
            ? getCustomHostnameDetails(c.env, d.cloudflareId).then((detail) => {
                (d as unknown as QueryDomainType).detail = detail;
                return d;
              })
            : Promise.resolve(d)
        )
      );
      return c.json({
        data: newData,
        rowCount,
      });
    }
  )
  .post(
    '/org/create-domain',
    zValidator('json', InsertDomainSchema),
    authOrg('json', ['OWNER', 'ADMIN']),
    async (c) => {
      const data = c.req.valid('json');
      const org = c.get('org');
      const details = await createCustomHostname(c.env, data.hostname);
      const adminOrgId = await c.env.APP_KV.get('config:admin-org-id');
      await createDomain(c.get('db'), {
        details,
        org,
        isPublic: adminOrgId === org.id,
      });
      return c.json({});
    }
  )

  // Update domain
  .patch(
    '/org/update-domain',
    zValidator('json', UpdateDomainSchema),
    authOrg('json', ['OWNER', 'ADMIN']),
    async (c) => {
      const data = c.req.valid('json');
      const domain = await updateDomain(c.get('db'), {
        ...data,
        userId: c.get('user').id,
      });
      return c.json({ domain });
    }
  );

// // Delete domain
// .delete(
//   '/org/delete-domain',
//   zValidator('json', DeleteOrgDomainSchema),
//   authOrg('json', ['OWNER', 'ADMIN']),
//   async (c) => {
//     const { domainId } = c.req.valid('json');
//     await deleteDomain(c.get('db'), {
//       domainId,
//     });
//     return c.json({ success: true });
//   }
// );

export default domain;
