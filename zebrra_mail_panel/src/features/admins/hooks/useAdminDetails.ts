import { useEffect, useState } from "react";
import type { AdminRead } from "../types/admin.types";
import { adminsService } from "../services/admins.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useAdminDetails(uuid: string) {
    const [admin, setAdmin] = useState<AdminRead | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ title: string; message: string } | null>(null)

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await adminsService.get(uuid);
                if (cancelled) {
                    return;
                }
                setAdmin(data);
            } catch (error) {
                if (cancelled) {
                    return;
                }
                const ui = extractUiErrorFromUnknown(error);
                setError(
                    ui ?? {
                        title: "Erreur", 
                        message: "Impossible de charger les détails."
                    }
                );
                setAdmin(null);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        if (uuid) {
            void run();
        }

        return () => {
            cancelled = true;
        };
    }, [uuid]);

    return {
        admin,
        isLoading,
        error
    };

}