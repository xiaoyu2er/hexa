import type { Route, RouteContext } from '@/libs/docs/page';

const getRouteContext = (
  routes: Route[],
  currentRoute?: Route,
  context: RouteContext = {}
): RouteContext => {
  const path = currentRoute?.path;
  const { parent } = context;

  for (let i = 0; i < routes?.length; i += 1) {
    const route = routes[i];

    if (!route) {
      continue;
    }

    if (route.routes) {
      const newContext = getRouteContext(route.routes, currentRoute, {
        ...context,
        parent: route,
      });
      if (newContext.nextRoute) {
        return newContext;
      }
    }
    if (!route.path) {
      continue;
    }
    if (context.route) {
      context.nextRoute =
        parent && i === 0
          ? { ...route, title: `${parent.title}: ${route.title}` }
          : route;

      return context;
    }
    if (route.path === path) {
      context.route = {
        ...currentRoute,
        title:
          parent && !parent.heading
            ? `${parent.title}: ${currentRoute?.title}` || ''
            : currentRoute?.title || '',
      };
      // Continue the loop until we know the next route
      continue;
    }
    context.prevRoute =
      parent && !parent.heading && !routes[i + 1]?.path
        ? { ...route, title: `${parent.title}: ${route.title}` }
        : route;
  }

  return context;
};

/**
 * Returns the siblings of a specific route (that is the previous and next routes).
 */
export const useDocsRoute = (
  routes: Route[],
  currentRoute?: Route,
  ctx: RouteContext = {}
): RouteContext => {
  getRouteContext(routes, currentRoute, ctx);

  // The loop ended and the previous route was found, or nothing
  return ctx;
};
