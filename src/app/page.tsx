"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Heart, Gamepad2, BookOpen } from "lucide-react";
import ScanTab from "@/components/ScanTab";
import PetTab from "@/components/PetTab";
import GamesTab from "@/components/GamesTab";
import LearningTab from "@/components/LearningTab";

const tabs = [
  { id: "scan", label: "Scan", icon: Camera },
  { id: "pet", label: "My Pet", icon: Heart },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "learning", label: "Learning", icon: BookOpen },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("scan");

  const renderTabContent = () => {
    switch (activeTab) {
      case "scan":
        return <ScanTab />;
      case "pet":
        return <PetTab />;
      case "games":
        return <GamesTab />;
      case "learning":
        return <LearningTab />;
      default:
        return <ScanTab />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            🌱 E-Waste Recycling Game
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            Learn about e-waste recycling in Melbourne
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-0 z-10">
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
                      ? "bg-green-100 text-green-700 border-b-2 border-green-500"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
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