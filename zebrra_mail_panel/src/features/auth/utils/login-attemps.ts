import { env } from "@/lib/env";

export type AttemptsState = {
    attempts: number[];
};

function nowMs() {
    return Date.now();
}

function getWindowMs() {
    return env.auth.loginAttemptsWindowMin *  60_000;
}

function loadState(): AttemptsState {
    try {
        const raw = localStorage.getItem(env.auth.loginAttemptsKey);
        if (!raw) {
            return { attempts: [] };
        }

        const parsed = JSON.parse(raw) as AttemptsState;
        if (!parsed || !Array.isArray(parsed.attempts)) {
            return { attempts: [] };
        }

        return { attempts: parsed.attempts.filter((n) => typeof n === "number") };
    } catch {
        return { attempts: [] };
    }
}

function saveState(state: AttemptsState) {
    localStorage.setItem(env.auth.loginAttemptsKey, JSON.stringify(state));
}

function pruneOld(attempts: number[]): number[] {
    const cutoff = nowMs() - getWindowMs();
    return attempts.filter((t) => t >= cutoff);
}

export function getLoginAttemptsInfo() {
    const state = loadState();
    const attempts = pruneOld(state.attempts);
    const remaining = Math.max(0, env.auth.loginAttemptsMax - attempts.length);

    let retryAt: number | null = null;
    if (remaining === 0 && attempts.length > 0) {
        const oldest = Math.min(...attempts);
        retryAt = oldest + getWindowMs();
    }

    saveState({ attempts });

    return {
        attemptsCount: attempts.length,
        remaining,
        isBlocked: remaining === 0,
        retryAt,
    };
}

export function registerFailedLoginAttempt() {
    const state = loadState();
    const attempts = pruneOld(state.attempts);
    attempts.push(nowMs());
    saveState({ attempts });
    return getLoginAttemptsInfo();
}

export function clearLoginAttempts() {
    localStorage.removeItem(env.auth.loginAttemptsKey);
}