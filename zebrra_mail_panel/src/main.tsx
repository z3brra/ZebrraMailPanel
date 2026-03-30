import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "@/context/theme-provider";

import { router } from "@/app/router";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);