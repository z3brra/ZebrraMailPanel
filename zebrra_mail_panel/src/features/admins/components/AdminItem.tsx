import type { AdminListItem } from "@/features/admins/types/admin.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Eye } from "lucide-react";
import { RoleBadge, ActiveBadge, DeletedBadge, MailboxBadge } from "./AdminBadges";
import { AdminRowActions } from "./AdminRowActions";

function formatDateFR(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit"});
}

type AdminItemProps = {
    admin: AdminListItem;
    onView?: (uuid: string) => void;
    onEnable?: (uuid: string) => void;
    onDisable?: (uuid: string) => void;
    onSoftDelete?: (uuid: string) => void;
    onResetPassword?: (uuid: string) => Promise<{ adminUuid: string; email: string; newPassword: string }>;
    viewDisabled?: boolean;
    isDeleting: boolean;
}

export function AdminItem({
    admin,
    onView,
    onEnable,
    onDisable,
    onSoftDelete,
    onResetPassword,
    viewDisabled = false,
    isDeleting,
}: AdminItemProps) {

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <Mail className="h-4 w-4 opacity-70 shrink-0" />
                            <div className="font-medium truncate">{admin.email}</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <RoleBadge roles={admin.roles} />
                            <ActiveBadge active={admin.active} />
                            <DeletedBadge isDeleted={admin.isDeleted} />
                            <MailboxBadge hasMailbox={admin.hasMailbox} />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 opacity-70" />
                            <span>Crée le {formatDateFR(admin.createdAt)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onView?.(admin.uuid)}
                            disabled={viewDisabled}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Détail
                        </Button>

                        <AdminRowActions
                            admin={admin}
                            onEnable={onEnable}
                            onDisable={onDisable}
                            onSoftDelete={onSoftDelete}
                            onResetPassword={onResetPassword}
                            isBusy={isDeleting}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}