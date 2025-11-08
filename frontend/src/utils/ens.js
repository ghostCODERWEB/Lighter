// src/utils/ens.js
const isHexAddress = (s) => /^0x[a-fA-F0-9]{40}$/.test(s || "");
const looksLikeENS = (s) => /\.[a-z]{2,}$/i.test(s || "");

export async function resolveAddressOrEns(input) {
    const raw = (input || "").trim();
    if (!raw) throw new Error("Enter an address or ENS name");
    if (isHexAddress(raw)) return raw;
    if (!looksLikeENS(raw)) throw new Error("Invalid address / ENS");

    // Try ethers via window if available
    try {
        const g = globalThis;
        if (g?.ethers?.providers) {
            const provider = new g.ethers.providers.JsonRpcProvider("https://cloudflare-eth.com");
            const addr = await provider.resolveName(raw);
            if (addr && isHexAddress(addr)) return addr;
        }
    } catch { }

    // Public resolver fallback
    try {
        const r = await fetch(`https://api.ensideas.com/ens/resolve/${encodeURIComponent(raw)}`);
        if (r.ok) {
            const j = await r.json();
            if (j?.address && isHexAddress(j.address)) return j.address;
        }
    } catch { }

    throw new Error("Could not resolve ENS to address");
}
