import { useEffect, useState } from "react";
import type { TokenRead } from "../types/token.types";
import { tokenService } from "../services/tokens.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useTokenDetails(uuid: string) {
    const [token, setToken] = useState<TokenRead | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<{title: string; message: string} | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await tokenService.get(uuid);
                if (!cancelled) {
                    setToken(response);
                }
            } catch (error) {
                if (!cancelled) {
                    const ui = extractUiErrorFromUnknown(error);
                    setError(ui ?? {
                        title: "Erreur",
                        message: "Impossible de charger le token."
                    });
                    setToken(null);
                }
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
        token,
        isLoading,
        error
    };
}