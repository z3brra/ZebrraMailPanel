import { useCallback, useState } from "react";
import type { AdminCreatePayload } from "../types/admin.types";
import { adminsService } from "../services/admins.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useCreateAdmin() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    const createAdmin = useCallback(async (payload: AdminCreatePayload) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await adminsService.create(payload);
        } catch (error) {
            const ui = extractUiErrorFromUnknown(error);
            setError(
                ui ?? {
                    title: "Erreur",
                    message: "Impossible de créer l'admin."
                }
            );
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        createAdmin,
        isSubmitting,
        error,
        clearError: () => setError(null)
    };
}