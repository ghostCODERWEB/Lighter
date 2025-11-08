import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme.jsx";
import Header from "./components/Header.jsx";
import AccountCheck from "./pages/AccountCheck.jsx";
import PointsCalculator from "./pages/PointsCalculator.jsx";
import LighterStats from "./pages/LighterStats.jsx";
import Announcements from "./pages/Announcements.jsx";
import "./index.css";
import FundingDifferences from "./pages/FundingDifferences.jsx";


export default function App() {
  return (
    <ThemeProvider>
      <div className="font-inter min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6 sm:px-8 sm:py-10">
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
    </ThemeProvider>
  );
}