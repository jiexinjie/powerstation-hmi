import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Monitoring } from "./pages/Monitoring";
import { Alarms } from "./pages/Alarms";
import { Maintenance } from "./pages/Maintenance";
import { History } from "./pages/History";
import { Service } from "./pages/Service";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/monitoring" replace /> },
      { path: "monitoring",  Component: Monitoring },
      { path: "alarms",      Component: Alarms },
      { path: "maintenance", Component: Maintenance },
      { path: "history",     Component: History },
      { path: "service",     Component: Service },
    ],
  },
]);