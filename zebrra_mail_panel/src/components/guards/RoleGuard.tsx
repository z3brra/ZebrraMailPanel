import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth";

type RoleGuardProps = {
    anyOf: string[];
};

export function RoleGuard({ anyOf }: RoleGuardProps) {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const ok = anyOf.some((role) => user.roles.includes(role));
    if (!ok) {
        return <Navigate to="/forbidden" replace />;
    }

    return <Outlet />;
}