import { http } from "@/lib/http";

export type DomainOption = { uuid: string; name: string };

export async function fetchDomainOptions(): Promise<DomainOption[]> {
    const response = await http.get("/admin/domains/options");
    return response.data.data as DomainOption[];
}