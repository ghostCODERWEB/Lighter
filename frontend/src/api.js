// src/api.js
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

// centralized axios instance for all API routes
export const api = axios.create({
    baseURL: `${API_BASE}/api`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// generic response handler
function handleError(e) {
    const res = e?.response;
    if (!res) throw new Error("Network or CORS error – backend unreachable.");
    const message = res.data?.error || res.data?.message || res.statusText || "Unknown error";
    const detail = res.data?.detail ? `: ${res.data.detail}` : "";
    throw new Error(`${message}${detail}`);
}

// ─────────────────────────────────────────────
// ACCOUNT RESOLVER
// ─────────────────────────────────────────────
export async function resolveAccount(address) {
    try {
        const { data } = await api.get(`/account/resolve/${address}`);
        return data; // { address, account_index, sub_accounts? }
    } catch (e) {
        handleError(e);
    }
}

// ─────────────────────────────────────────────
// POSITIONS / ORDERS / FILLS
// ─────────────────────────────────────────────
export async function fetchOpenPositions(address) {
    try {
        const { data } = await api.get(`/account/${address}/positions/open`);
        return data;
    } catch (e) {
        handleError(e);
    }
}

export async function fetchActiveOrders(address) {
    try {
        const { data } = await api.get(`/account/${address}/orders/active`);
        return data;
    } catch (e) {
        handleError(e);
    }
}

export async function fetchRecentFills(address, limit = 50) {
    try {
        const { data } = await api.get(`/account/${address}/fills`, {
            params: { limit },
        });
        return data;
    } catch (e) {
        handleError(e);
    }
}
