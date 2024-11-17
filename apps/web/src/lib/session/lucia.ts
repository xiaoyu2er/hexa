import { IS_PRODUCTION } from '@/lib/env';
import { getD1 } from '@/server/db/index';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import { Lucia, TimeSpan } from 'lucia';

export const getLucia = async () => {
  // here we use D1 directly so the user session/attributes are not camelCase but snake_case
  const d1 = await getD1();
  const adapter = new D1Adapter(d1, { user: 'user', session: 'session' });
  const lucia = new Lucia(adapter, {
    getSessionAttributes: (attributes) => {
      return attributes;
    },
    getUserAttributes: (attributes) => {
      // @ts-ignore - We return the user attributes with the password removed
      const hasPassword = !!attributes.password;
      return {
        id: attributes.id,
        name: attributes.name,
        avatarUrl: attributes.avatar_url,
        defaultWsId: attributes.default_ws_id,
        displayName: attributes.display_name,
        hasPassword,
      };
    },

    /**
     * Session lifetime: wow long a session lasts for inactive users
     * Sessions do not have an absolute expiration. The expiration gets extended whenever they're used. This ensures that active users remain signed in, while inactive users are signed out.
     * More specifically, if the session expiration is set to 30 days (default), Lucia will extend the expiration by another 30 days when there are less than 15 days (half of the expiration) until expiration. You can configure the expiration with the sessionExpiresIn configuration.
     */
    sessionExpiresIn: new TimeSpan(30, 'd'),
    sessionCookie: {
      // Cookie name (default: auth_session)
      name: 'hexa-session',
      // Set to false for cookies to persist indefinitely (default: true)
      expires: false,
      attributes: {
        secure: IS_PRODUCTION,
      },
    },
  });
  return lucia;
};

export const $lucia = getLucia();

declare module 'lucia' {
  // @ts-ignore - We declare the Register interface to extend the default Register interface from Lucia
  interface Register {
    Lucia: Awaited<ReturnType<typeof getLucia>>;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }

  interface DatabaseSessionAttributes {}
  interface DatabaseUserAttributes {
    id: string;
    name: string;
    avatar_url: string;
    default_ws_id: string;
    display_name: string;
    password: string;
  }
}
