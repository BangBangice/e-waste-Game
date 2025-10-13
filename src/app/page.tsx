"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Heart, Gamepad2, BookOpen, Info } from "lucide-react";
import ScanTab from "@/components/ScanTab";
import PetTab from "@/components/PetTab";
import GamesTab from "@/components/GamesTab";
import LearningTab from "@/components/LearningTab";
import ThemeToggle from "@/components/ThemeToggle";
import RecyclingInfoTab from "@/components/RecyclingInfoTab";

const tabs = [
  { id: "scan", label: "Scan", icon: Camera },
  { id: "info", label: "Info", icon: Info },
  { id: "pet", label: "My Pet", icon: Heart },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "learning", label: "Learning", icon: BookOpen },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("scan");
  const [lastScanText, setLastScanText] = useState<string | null>(null);

  const handleScanComplete = (text: string) => {
    setLastScanText(text);
    setActiveTab("info");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "scan":
        return <ScanTab onScanComplete={handleScanComplete} />;
      case "pet":
        return <PetTab />;
      case "games":
        return <GamesTab />;
      case "learning":
        return <LearningTab />;
      case "info":
        return <RecyclingInfoTab scannedText={lastScanText ?? undefined} />;
      default:
        return <ScanTab />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 shadow-lg border-b border-purple-300 dark:border-purple-600">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white">
                🌱 E-Waste Recycling Game
              </h1>
              <p className="text-sm text-purple-100 mt-1">
                Learn about e-waste recycling in Melbourne
              </p>
            </div>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700 border-b border-blue-300 dark:border-blue-600 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-t-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-600 border-b-4 border-yellow-400 shadow-lg transform -translate-y-1"
                      : "text-white hover:text-yellow-200 hover:bg-blue-400 dark:hover:bg-blue-600"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </main>
    </div>
  );
}