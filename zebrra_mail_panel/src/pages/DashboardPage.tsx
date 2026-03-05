import { useAuth } from "@/features/auth";

export function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="p-6 space-y-2">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="text-sm opacity-80">
                Connecté en tant que <span className="font-medium">{user?.email}</span>
            </div>
        </div>
    );
}