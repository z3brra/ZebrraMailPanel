export type AuthMe = {
    uuid: string;
    email: string;
    roles: string[];
    active: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export type AuthMeResponse = {
    data: AuthMe;
}