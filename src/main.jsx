import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import SignIn from "./pages/signin";
import HomePage from "./pages/homepage";
import ErrorPage from "./pages/errorpage";
import Notice from "./pages/notice";
import Dashboard from "./pages/dashboard";
import SignUp from "./pages/signup";
import AdminSignIn from "./pages/admin";
import AdminDashboard from "./pages/adminDashboard";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/notice",
    element: <Notice />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/admin",
    element: <AdminSignIn />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/:id",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
