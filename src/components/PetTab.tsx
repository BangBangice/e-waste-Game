"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Smile, Zap, Star } from "lucide-react";

interface PetStats {
  life: number;
  happiness: number;
  energy: number;
  level: number;
}

export default function PetTab() {
  const [petStats, setPetStats] = useState<PetStats>({
    life: 80,
    happiness: 70,
    energy: 60,
    level: 1,
  });

  const [petPosition, setPetPosition] = useState({ x: 200, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  // Load pet data from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("petStats");
    const savedPosition = localStorage.getItem("petPosition");
    
    if (savedStats) {
      setPetStats(JSON.parse(savedStats));
    }
    if (savedPosition) {
      setPetPosition(JSON.parse(savedPosition));
    }
  }, []);

  // Save pet data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("petStats", JSON.stringify(petStats));
  }, [petStats]);

  useEffect(() => {
    localStorage.setItem("petPosition", JSON.stringify(petPosition));
  }, [petPosition]);

  const feedPet = () => {
    setPetStats(prev => ({
      ...prev,
      life: Math.min(100, prev.life + 10),
      happiness: Math.min(100, prev.happiness + 5),
    }));
    showTemporaryMessage("Yum! Thanks for the food! 🍎");
  };

  const playWithPet = () => {
    setPetStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.max(0, prev.energy - 10),
    }));
    showTemporaryMessage("That was fun! Let's play again! 🎾");
  };

  const restPet = () => {
    setPetStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 20),
      life: Math.min(100, prev.life + 5),
    }));
    showTemporaryMessage("Zzz... Feeling refreshed! 😴");
  };

  const showTemporaryMessage = (message: string) => {
    setShowMessage(message);
    setTimeout(() => setShowMessage(null), 3000);
  };

  const handleDrag = (event: any, info: any) => {
    setPetPosition({
      x: Math.max(50, Math.min(350, petPosition.x + info.delta.x)),
      y: Math.max(50, Math.min(300, petPosition.y + info.delta.y)),
    });
  };

  const getPetMood = () => {
    const avgHappiness = (petStats.happiness + petStats.life) / 2;
    if (avgHappiness >= 80) return "😊";
    if (avgHappiness >= 60) return "😐";
    if (avgHappiness >= 40) return "😕";
    return "😢";
  };

  const getPetColor = () => {
    const avgHappiness = (petStats.happiness + petStats.life) / 2;
    if (avgHappiness >= 80) return "bg-green-400";
    if (avgHappiness >= 60) return "bg-yellow-400";
    if (avgHappiness >= 40) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">My Virtual Pet</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Take care of your digital companion by keeping it happy and healthy
        </p>
      </div>

      {/* Pet Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Pet Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Heart className="mx-auto mb-2 text-red-500" size={24} />
            <div className="text-sm font-medium text-gray-600 mb-1">Life</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${petStats.life}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{petStats.life}/100</div>
          </div>

          <div className="text-center">
            <Smile className="mx-auto mb-2 text-yellow-500" size={24} />
            <div className="text-sm font-medium text-gray-600 mb-1">Happiness</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${petStats.happiness}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{petStats.happiness}/100</div>
          </div>

          <div className="text-center">
            <Zap className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-sm font-medium text-gray-600 mb-1">Energy</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${petStats.energy}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{petStats.energy}/100</div>
          </div>

          <div className="text-center">
            <Star className="mx-auto mb-2 text-purple-500" size={24} />
            <div className="text-sm font-medium text-gray-600 mb-1">Level</div>
            <div className="text-2xl font-bold text-purple-500">{petStats.level}</div>
          </div>
        </div>
      </div>

      {/* Pet Area */}
      <div className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg shadow-md p-6 relative overflow-hidden">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Pet Playground</h3>
        
        {/* Pet Character */}
        <motion.div
          drag
          dragMomentum={false}
          onDrag={handleDrag}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          className={`absolute w-16 h-16 rounded-full ${getPetColor()} cursor-move flex items-center justify-center text-2xl shadow-lg`}
          style={{
            left: petPosition.x,
            top: petPosition.y,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isDragging ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getPetMood()}
        </motion.div>

        {/* Pet Message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs"
            >
              <div className="text-sm font-medium text-gray-800">{showMessage}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background decorations */}
        <div className="absolute bottom-4 left-4 text-2xl">🌳</div>
        <div className="absolute bottom-4 right-4 text-2xl">🌻</div>
        <div className="absolute top-4 right-4 text-2xl">☁️</div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={feedPet}
          className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <span>🍎</span>
          <span>Feed Pet</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={playWithPet}
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <span>🎾</span>
          <span>Play</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={restPet}
          className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
        >
          <span>😴</span>
          <span>Rest</span>
        </motion.button>
      </div>
    </div>
  );
}
