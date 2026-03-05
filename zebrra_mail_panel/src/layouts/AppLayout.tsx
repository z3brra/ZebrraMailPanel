import { Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useState } from "react";
import { AppSidebar } from "@/layouts/components/app-sidebar";
import { Topbar } from "@/layouts/components/topbar"

function BootSplash() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm opacity-80">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Chargement…</span>
            </div>
        </div>
    );
}

export function AppLayout() {
    const { isLoading } = useAuth();
    const [collapsed, setCollapsed] = useState<boolean>(false);

    if (isLoading) {
        return <BootSplash />;
    }

    return (
        <div className="min-h-screen flex">
            <AppSidebar
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed((v) => !v)}
            />

            <div className="flex-1 min-w-0">
                <Topbar onToggleSidebar={() => setCollapsed((v) => !v)} />

                <main className="min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}