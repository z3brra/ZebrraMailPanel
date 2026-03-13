export type AdminCreatePayload = {
    email: string;
    plainPassword: string;
    roles?: string[];
    active?: boolean;
    createMailUser?: boolean;
};

export type AdminRead = {
    uuid: string;
    email: string;
    roles: string[];
    active: boolean;
    isDeleted: boolean;
    hasMailbox: boolean;
    createdAt: string;
    updatedAt: string | null;
};

export type AdminStatusAction = "enable" | "disable";

export type AdminStatusPatchPayload = {
    action: AdminStatusAction;
};

export type AdminPasswordResetResponse = {
    adminUuid: string;
    email: string;
    newPassword: string;
};

export type AdminListItem = {
    uuid: string;
    email: string;
    roles: string[];
    active: boolean;
    isDeleted: boolean;
    hasMailbox: boolean;
    createdAt: string;
};

export type PaginationMeta = {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    sort?: string | null;
    order?: string | null;
};

export type ListResponse<T> = {
    data: T[];
    meta: PaginationMeta;
};

export type AdminSort = "email" | "createdAt" | "active";
export type SortOrder = "asc" | "desc";

export type AdminSearchQuery = {
    q?: string;
    active?: boolean;
    deleted?: boolean;
    sort?: AdminSort;
    order?: SortOrder;
};