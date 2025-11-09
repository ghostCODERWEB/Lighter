import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme.jsx";
import Header from "./components/Header.jsx";
import AccountCheck from "./pages/AccountCheck.jsx";
import PointsCalculator from "./pages/PointsCalculator.jsx";
import LighterStats from "./pages/LighterStats.jsx";
import Announcements from "./pages/Announcements.jsx";
import FundingDifferences from "./pages/FundingDifferences.jsx";
import "./index.css";

export default function App() {
  return (
    <ThemeProvider>
      <div className="font-sans min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <Routes>
              <Route path="/" element={<FundingDifferences />} />
              <Route path="/account-checkB" element={<AccountCheck />} />
              <Route path="/points" element={<PointsCalculator />} />
              <Route path="/statsB" element={<LighterStats />} />
              <Route path="/announcementsB" element={<Announcements />} />
              <Route path="/funding" element={<FundingDifferences />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Bottom-right disclaimer / X link */}
      <a
        href="https://x.com/falcononchain"
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed bottom-3 right-3 sm:bottom-4 sm:right-4
          z-50 inline-flex items-center gap-1.5
          rounded-full border border-white/15
          bg-gray-900/85 dark:bg-gray-900/90
          text-gray-100 px-3 py-1.5
          text-[9px] sm:text-[10px]
          shadow-lg backdrop-blur
          hover:bg-gray-800 hover:scale-[1.02]
          transition
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium">@falcononchain</span>
        <span className="hidden xs:inline text-gray-400">
          not affiliated • context & updates
        </span>
      </a>
    </ThemeProvider>
  );
}
