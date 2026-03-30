import type { AdminListItem } from "@/features/admins/types/admin.types";

export const mockAdmins: AdminListItem[] = [
    {
        uuid: "019bf161-c76b-732c-aa6d-811025645aea",
        email: "pascal@zebrra.eu",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
        active: true,
        isDeleted: false,
        hasMailbox: true,
        createdAt: "2026-01-24T19:01:15+00:00",
    },
    {
        uuid: "019bf161-c76b-732c-aa6d-811025645aeb",
        email: "admin@zebrra.eu",
        roles: ["ROLE_ADMIN"],
        active: true,
        isDeleted: false,
        hasMailbox: false,
        createdAt: "2026-02-01T10:20:00+00:00",
    },
    {
        uuid: "019bf161-c76b-732c-aa6d-811025645aec",
        email: "inactive@zebrra.eu",
        roles: ["ROLE_ADMIN"],
        active: false,
        isDeleted: false,
        hasMailbox: false,
        createdAt: "2026-02-15T08:10:00+00:00",
    },
    {
        uuid: "019bf161-c76b-732c-aa6d-811025645aed",
        email: "deleted@zebrra.eu",
        roles: ["ROLE_ADMIN"],
        active: false,
        isDeleted: true,
        hasMailbox: true,
        createdAt: "2026-01-10T12:00:00+00:00",
    },
]