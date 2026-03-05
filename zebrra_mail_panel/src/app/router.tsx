import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout";

import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { RoleGuard } from "@/components/guards/RoleGuard";

import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ForbiddenPage } from "@/pages/ForbiddenPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <LoginPage /> },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: "/", element: <DashboardPage /> },

                    {
                        element: <RoleGuard anyOf={["ROLE_SUPER_ADMIN"]} />,
                        children: [
                            { path: "/super-admin", element: <div className="p-6">Zone super-admin</div> },
                        ],
                    },

                    { path: "/forbidden", element: <ForbiddenPage /> },
                    { path: "*", element: <NotFoundPage /> },
                ],
            },
        ],
    },
]);