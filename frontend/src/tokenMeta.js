// src/tokenMeta.js
const COINGECKO = (id) => `https://assets.coingecko.com/coins/images/${id}/large.png`;
const TRUST = (sym) => `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${sym}/logo.png`;

// Minimal, expand as needed. Prefer stable logo URLs.
export const TOKENS = {
    BTC: { name: "Bitcoin", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    ETH: { name: "Ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    SOL: { name: "Solana", logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
    // Add your Lighter markets here, e.g. "PEPE", "ARB", etc.
};

export function tokenInfo(symbol) {
    const s = String(symbol || "").toUpperCase();
    return TOKENS[s] || { name: s, logo: "" };
}
