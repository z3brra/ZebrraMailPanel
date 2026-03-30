import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Shield } from "lucide-react";

export type NavItem = {
    key: string;
    to: string;
    label: string;
    description: string;
    icon: LucideIcon;
    superAdminOnly?: boolean;
};

export const navItems: NavItem[] = [
    {
        key: "dashboard",
        to: "/",
        label: "Dashboard",
        description: "Vue d'ensemble et accès rapide.",
        icon: LayoutDashboard,
    },
    {
        key: "admins",
        to: "/admins",
        label: "Admins",
        description: "Créer et gérer les comptes admin.",
        icon: Shield,
        superAdminOnly: true,
    }
];

export function getSectionByPath(pathname: string): NavItem | null {
    const exact = navItems.find((n) => n.to === pathname);
    return exact ?? null;
}