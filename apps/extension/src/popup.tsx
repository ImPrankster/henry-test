import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

import "~/style.css";

import ClientShowcase from "./components/clientShowcase";
import { TRPCProvider } from "./utils/api";

const rootRoute = createRootRoute({
  notFoundComponent: () => {
    return <div>404</div>;
  },
  component: () => (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <Link to="/popup.html" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/popup.html",
  component: function Index() {
    return (
      <div className="flex flex-col gap-2 p-2">
        <h3>Welcome Home!</h3>
        <ClientShowcase />
      </div>
    );
  },
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    return <div className="p-2">Hello from About!</div>;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function IndexPopup() {
  return (
    <TRPCProvider>
      <div className="h-[348px] w-[256px]">
        <RouterProvider router={router} />
      </div>
    </TRPCProvider>
  );
}

export default IndexPopup;
