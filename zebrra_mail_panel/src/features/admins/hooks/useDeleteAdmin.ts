import { useCallback, useState } from "react";
import { adminsService } from "../services/admins.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useDeleteAdmin() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<{title: string; message: string} | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const deleteAdmin = useCallback(async (uuid: string) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await adminsService.remove(uuid);
        } catch (error) {
            const ui = extractUiErrorFromUnknown(error);
            setError(
                ui ?? {
                    title: "Erreur",
                    message: "Impossible de supprimer cet admin.",
                }
            );
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        deleteAdmin,
        isSubmitting,
        error,
        clearError
    };
}