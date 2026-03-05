import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth";
import { env } from "@/lib/env";
import {
    clearLoginAttempts,
    getLoginAttemptsInfo,
    registerFailedLoginAttempt,
} from "@/features/auth/utils/login-attemps";

import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    Field,
    FieldGroup,
    FieldLabel,
    FieldContent,
    FieldError,
} from "@/components/ui/field";

function formatRetryAt(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function LoginPage() {
    const { isAuthenticated, isBootstrapping, isSubmittingLogin, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from ?? "/";

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [attemptsInfo, setAttemptsInfo] = useState(() => getLoginAttemptsInfo());

    const blockedText = useMemo(() => {
        if (!attemptsInfo.isBlocked || !attemptsInfo.retryAt) {
            return null;
        }
        return `Trop de tentatives. Réessaie à ${formatRetryAt(attemptsInfo.retryAt)}.`;
    }, [attemptsInfo]);

    useEffect(() => {
        if (isAuthenticated && !isBootstrapping) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isBootstrapping, navigate, from]);

    useEffect(() => {
        setAttemptsInfo(getLoginAttemptsInfo());
    }, []);

    async function onSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorTitle(null);
        setErrorMessage(null);
        setEmailError(null);
        setPasswordError(null);

        const info = getLoginAttemptsInfo();
        setAttemptsInfo(info);

        if (info.isBlocked) {
            setErrorTitle("Connexion temporairement bloquée");
            setErrorMessage(blockedText ?? "Trop de tentatives, réessaie plus tard.");
            return;
        }

        const trimmedEmail = email.trim();
        let hasLocalError = false;

        if (!trimmedEmail) {
            setEmailError("Email requis.");
            hasLocalError = true;
        }
        if (!password) {
            setPasswordError("Mot de passe requis.");
            hasLocalError = true;
        }
        if (hasLocalError) {
            return;
        }

        try {
            await login({ email: email.trim(), password });

            clearLoginAttempts();

            navigate(from, { replace: true });
        } catch (error: any) {
            const updated = registerFailedLoginAttempt();
            setAttemptsInfo(updated);

            const ui = extractUiErrorFromUnknown(error);

            if (ui) {
                setErrorTitle(ui.title);
                setErrorMessage(ui.message);
            } else {
                setErrorTitle("Erreur");
                setErrorMessage("Impossible de se connecter. Vérifie tes identifiants et réessaie.");
            }

            if (updated.isBlocked && updated.retryAt) {
                setErrorTitle("Connexion temporairement bloquée");
                setErrorMessage(
                    `Tu as atteint la limite (${env.auth.loginAttemptsMax}) sur ${env.auth.loginAttemptsWindowMin} min. Réessaie à ${formatRetryAt(updated.retryAt)}`
                );
            }
        }
    }

    const disabled = isSubmittingLogin || attemptsInfo.isBlocked;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                    Accès réservé aux <span className="font-bold">admin</span> et <span className="font-bold">super-admin</span>.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    { errorTitle || errorMessage ? (
                        <Alert variant="destructive">
                            <AlertTitle>{errorTitle ?? "Erreur"}</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    ) : null}

                    <form onSubmit={onSubmit} className="space-y-3">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <FieldContent>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemple@email.com"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                                        disabled={disabled}
                                    />
                                </FieldContent>
                                { emailError ? <FieldError>{emailError}</FieldError> : null}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                                <FieldContent>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Votre mot de passe"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                                        disabled={disabled}
                                    />
                                </FieldContent>
                                { passwordError ? <FieldError>{passwordError}</FieldError> : null }
                            </Field>
                        </FieldGroup>

                        <Button>
                            { isSubmittingLogin ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Connexion…
                                </span>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>

                        {attemptsInfo.isBlocked && blockedText ? (
                            <p className="text-sm text-destructive">{blockedText}</p>
                        ) : null }
                    </form>
                </div>
            </CardContent>
        </Card>
    );

}