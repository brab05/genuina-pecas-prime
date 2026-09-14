import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./pages/Home";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      children: [
        { index: true, Component: Home },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
