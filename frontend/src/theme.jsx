import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";


const STORAGE_KEY = "theme";
const ThemeCtx = createContext({ theme: "light", setTheme: () => { } });


function applyThemeClass(theme) {
    const root = document.documentElement;
    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}


function getInitialTheme() {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    // Fallback to OS preference if nothing saved
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}


export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);


    // Apply immediately on first paint to avoid a dark-only flash
    useLayoutEffect(() => {
        applyThemeClass(theme);
    }, [theme]);


    // Persist to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch { }
    }, [theme]);


    const value = useMemo(() => ({ theme, setTheme }), [theme]);
    return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}


export function ThemeToggle() {
    const { theme, setTheme } = useContext(ThemeCtx);
    return (
        <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-2xl px-3 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            aria-pressed={theme === "dark"}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
    );
}


export function useTheme() {
    return useContext(ThemeCtx);
}