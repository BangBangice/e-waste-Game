"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Smile, Sword, Shield, Trophy, Recycle } from "lucide-react";

interface PetStats {
  life: number;
  happiness: number;
  energy: number;
  level: number;
  attack: number;
  defense: number;
  ecoPoints: number;
  itemsRecycled: number;
}

export default function PetTab() {
  const [petStats, setPetStats] = useState<PetStats>({
    life: 75,
    happiness: 60,
    energy: 60,
    level: 2,
    attack: 35,
    defense: 30,
    ecoPoints: 120,
    itemsRecycled: 8,
  });

  const [petAnimation, setPetAnimation] = useState<'idle' | 'happy' | 'sad' | 'excited' | 'sleeping'>('idle');

  // Load pet data from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("petStats");
    if (savedStats) {
      setPetStats(JSON.parse(savedStats));
    }
  }, []);

  // Save pet data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("petStats", JSON.stringify(petStats));
  }, [petStats]);

  // Update pet animation based on stats
  useEffect(() => {
    const avgHappiness = (petStats.happiness + petStats.life) / 2;
    if (avgHappiness < 30) {
      setPetAnimation('sad');
    } else if (avgHappiness > 80) {
      setPetAnimation('happy');
    } else if (petStats.energy < 20) {
      setPetAnimation('sleeping');
    } else {
      setPetAnimation('idle');
    }
  }, [petStats]);

  const feedPet = () => {
    setPetStats(prev => ({
      ...prev,
      life: Math.min(100, prev.life + 10),
      happiness: Math.min(100, prev.happiness + 5),
      ecoPoints: prev.ecoPoints + 5,
    }));
    setPetAnimation('happy');
    setTimeout(() => setPetAnimation('idle'), 3000);
  };

  const battlePet = () => {
    setPetStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      energy: Math.max(0, prev.energy - 15),
      attack: prev.attack + 2,
      defense: prev.defense + 1,
    }));
    setPetAnimation('excited');
    setTimeout(() => setPetAnimation('idle'), 3000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 text-white -m-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white text-sm">9:41</span>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
            <div className="w-4 h-4 bg-white rounded-sm"></div>
            <div className="flex items-center space-x-1">
              <span className="text-white text-sm">100%</span>
              <div className="w-6 h-3 border border-white rounded-sm">
                <div className="w-full h-full bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-white mb-2">EcoPokemon</h1>
        <p className="text-center text-white text-sm">Train your Pokemon through recycling & battles</p>
      </div>

      <div className="px-6 pb-6 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400">
        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Left Sidebar - Stats */}
          <div className="w-1/4 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-gray-800 font-medium">Health</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gray-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${petStats.life}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">{petStats.life}/100</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Recycle className="w-5 h-5 text-green-500" />
                <span className="text-gray-800 font-medium">Environmental Impact</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Eco Points</span>
                  <span className="text-gray-800 font-medium">{petStats.ecoPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items Recycled</span>
                  <span className="text-gray-800 font-medium">{petStats.itemsRecycled}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Pokemon Profile */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
              <div className="flex flex-col items-center">
                {/* Pokemon Image - Much Larger */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-8xl shadow-lg border-4 border-white">
                    <motion.div
                      animate={petAnimation === 'happy' ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5, repeat: petAnimation === 'happy' ? 2 : 0 }}
                    >
                      🦎
                    </motion.div>
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
                    ⚡
                  </div>
                </div>
                
                {/* Level Badge */}
                <div className="bg-gray-600 text-white px-6 py-2 rounded-full text-lg font-medium mb-3">
                  Level {petStats.level} EcoPokemon
                </div>
                
                {/* Pokemon Name */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6">EcoFriend</h2>
                
                {/* Stats - Better Aligned */}
                <div className="flex justify-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2 bg-red-100 px-4 py-3 rounded-full">
                    <Sword className="w-5 h-5 text-red-500" />
                    <span className="text-gray-800 font-medium text-lg">ATK: {petStats.attack}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-100 px-4 py-3 rounded-full">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-800 font-medium text-lg">DEF: {petStats.defense}</span>
                  </div>
                </div>

                {/* Happiness Stat */}
                <div className="w-full mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Smile className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-800 font-medium text-lg">Happiness {petStats.happiness}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gray-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${petStats.happiness}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons - Centered */}
                <div className="w-full space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={feedPet}
                    className="w-full bg-slate-800 text-white p-4 rounded-2xl flex items-center justify-center space-x-3 shadow-lg"
                  >
                    <Recycle className="w-5 h-5" />
                    <span className="font-medium text-lg">Scan E-Waste to Feed</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={battlePet}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl flex items-center justify-center space-x-3 shadow-lg"
                  >
                    <Sword className="w-5 h-5" />
                    <span className="font-medium text-lg">PvP Battle Arena</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Empty for balance */}
          <div className="w-1/4"></div>
        </div>

        {/* Achievements Section - Bottom */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-gray-800 font-medium text-lg">Achievements</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-yellow-100 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm text-gray-600 font-medium">First Battle</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">♻️</div>
                <div className="text-sm text-gray-600 font-medium">Recycler</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-sm text-gray-600 font-medium">Eco Hero</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
