import { Router } from "express";
import axios from "axios";
import { isAddress, getAddress } from "ethers";

const router = Router();

// You can override this in .env: ZKLIGHTER_RESOLVER_URL=https://.../api/v1/accountsByL1Address
const DEFAULT_URL = "https://mainnet.zklighter.elliot.ai/api/v1/accountsByL1Address";

router.get("/resolve/:address", async (req, res) => {
    const raw = String(req.params.address || "").trim();

    // Validate & normalize to EIP-55 checksum
    if (!isAddress(raw)) {
        return res.status(400).json({ error: "Invalid Ethereum address" });
    }
    const address = getAddress(raw);

    const url = process.env.ZKLIGHTER_RESOLVER_URL || DEFAULT_URL;
    console.log("[account.resolve] using URL:", url, "address:", address);

    try {
        // First try GET with the expected query key
        const { data, status } = await axios.get(url, { params: { l1_address: address } });

        console.log("[account.resolve] upstream GET status:", status, "payload keys:", Object.keys(data || {}));
        return handleSuccessPayload(address, url, data, res);
    } catch (err) {
        // If GET failed with 405/404 for the path or 400 for shape, try POST as a fallback
        const sc = err?.response?.status;
        const body = err?.response?.data;

        // Lighter-specific "not found" (often 400 with code 21100) -> 404 for your API
        if (sc === 400 && body?.code === 21100) {
            console.warn("[account.resolve] not found (21100) for", address);
            return res.status(404).json({ error: "Account not found on Lighter for this L1 address", address, upstream: url });
        }

        // Try POST fallback only if it seems like a method/shape issue
        if (sc === 404 || sc === 405 || sc === 415 || (sc === 400 && !body?.code)) {
            try {
                const { data, status } = await axios.post(url, { l1Address: address });
                console.log("[account.resolve] upstream POST status:", status, "payload keys:", Object.keys(data || {}));
                return handleSuccessPayload(address, url, data, res);
            } catch (err2) {
                return handleFailure(address, url, err2, res);
            }
        }

        return handleFailure(address, url, err, res);
    }
});

function handleSuccessPayload(address, url, data, res) {
    // Expect possible shapes:
    // { sub_accounts: [{ index: 123, ... }, ...] } OR
    // { account_index: 123, ... } OR
    // direct array, etc.
    const subs = Array.isArray(data?.sub_accounts) ? data.sub_accounts : [];

    if (subs.length > 0) {
        const main = subs[0];
        const idx = Number(main?.index ?? main?.account_index ?? main);
        if (Number.isFinite(idx)) {
            return res.json({ address, account_index: idx, sub_accounts: subs });
        }
    }

    // If the upstream includes a top-level index instead
    const idxTop = Number(data?.account_index ?? data?.index);
    if (Number.isFinite(idxTop)) {
        return res.json({ address, account_index: idxTop, sub_accounts: subs });
    }

    console.warn("[account.resolve] no accounts parsed for", address, "payload:", Object.keys(data || {}));
    return res.status(404).json({ error: "No accounts found for address", address, upstream: url });
}

function handleFailure(address, url, err, res) {
    const sc = err?.response?.status;
    const body = err?.response?.data;

    // Normalize Lighter "not found"
    if (sc === 400 && body?.code === 21100) {
        return res.status(404).json({ error: "Account not found on Lighter for this L1 address", address, upstream: url });
    }
    if (sc) {
        return res.status(sc).json({ error: body?.message || "Upstream error", code: body?.code, upstream: url });
    }
    return res.status(502).json({ error: "Upstream unreachable", detail: err?.message, upstream: url });
}

export default router;
