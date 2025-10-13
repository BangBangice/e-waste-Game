"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, MapPin, Swords, Award, ArrowLeft, Compass, Lightbulb, Recycle } from "lucide-react";

type BossPhase = "intro" | "map" | "encounter" | "result";

interface Location {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bosses: string[];
  position: { top: string; left: string };
}

const EWASTE_TYPES = [
  "Batteries",
  "Small Appliances",
  "Mobile Phones",
  "Computers & Laptops",
  "TVs & Monitors",
  "Cables & Chargers",
  "Power Tools",
  "Printers & Scanners",
  "Tablets & Phones",
];

const LOCATIONS: Location[] = [
  {
    id: "north",
    name: "Supermarket",
    emoji: "🛒",
    color: "bg-green-500",
    bosses: ["Batteries", "Cables & Chargers"],
    position: { top: "18%", left: "30%" },
  },
  {
    id: "east",
    name: "Kitchen",
    emoji: "🍽️",
    color: "bg-orange-500",
    bosses: ["Small Appliances", "Cables & Chargers"],
    position: { top: "28%", left: "72%" },
  },
  {
    id: "central",
    name: "Office",
    emoji: "🏢",
    color: "bg-blue-500",
    bosses: ["Computers & Laptops", "Printers & Scanners"],
    position: { top: "52%", left: "48%" },
  },
  {
    id: "river",
    name: "Living Room",
    emoji: "🛋️",
    color: "bg-pink-500",
    bosses: ["TVs & Monitors", "Cables & Chargers"],
    position: { top: "62%", left: "18%" },
  },
  {
    id: "south",
    name: "Garage",
    emoji: "🛠️",
    color: "bg-slate-600",
    bosses: ["Power Tools", "Batteries"],
    position: { top: "78%", left: "62%" },
  },
  {
    id: "west",
    name: "School",
    emoji: "🏫",
    color: "bg-purple-600",
    bosses: ["Tablets & Phones", "Cables & Chargers"],
    position: { top: "38%", left: "12%" },
  },
];

const bossVisuals: Record<string, { emoji: string; title: string; description: string; tip: string }> = {
  Batteries: {
    emoji: "🔋",
    title: "Voltaic Hydra",
    description: "Overcharged cells spark in every direction, waiting to unleash a shockwave.",
    tip: "Look for high-density energy storage near checkout counters and device kiosks.",
  },
  "Small Appliances": {
    emoji: "🔌",
    title: "Countertop Golem",
    description: "A heap of blenders and toasters fuses into a clattering construct.",
    tip: "Compact gadgets with short cords often gather around kitchen waste areas.",
  },
  "Mobile Phones": {
    emoji: "📱",
    title: "Signal Wraith",
    description: "Screens flicker as abandoned phones merge into a whispering spirit.",
    tip: "Retail floors and lockers are prime zones for lost handheld devices.",
  },
  "Computers & Laptops": {
    emoji: "💻",
    title: "Server Titan",
    description: "Towering stacks of processors glow with recycled power cores.",
    tip: "Watch for cooling vents, power bricks, and cables clustering under desks.",
  },
  "TVs & Monitors": {
    emoji: "📺",
    title: "Pixel Leviathan",
    description: "Cracked displays stitch together into a beast of static and light.",
    tip: "Large glass screens usually lurk near lounges and entertainment hubs.",
  },
  "Cables & Chargers": {
    emoji: "🔗",
    title: "Current Coil Basilisk",
    description: "Loops of insulated lines braid together, ready to ensnare careless trainers.",
    tip: "Check communal storage tubs where accessories pile up between uses.",
  },
  "Power Tools": {
    emoji: "🛠️",
    title: "Workshop Colossus",
    description: "Rusty drills and saws pound together in a relentless rhythm.",
    tip: "Heavy gear with removable batteries lives in garages and sheds.",
  },
  "Printers & Scanners": {
    emoji: "🖨️",
    title: "Paperstorm Chimera",
    description: "Toner clouds swirl around a multi-headed printer beast.",
    tip: "Shared offices stash bulky printers near copy stations and spare paper.",
  },
  "Tablets & Phones": {
    emoji: "📲",
    title: "Glasslight Mirage",
    description: "Shimmering frames refract the skyline, masking the creature's true form.",
    tip: "Charging carts and classrooms keep spare tablets close at hand.",
  },
};

export default function GamesTab() {
  const [phase, setPhase] = useState<BossPhase>("intro");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentBoss, setCurrentBoss] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const selectedLocationData = useMemo(
    () => LOCATIONS.find((loc) => loc.id === selectedLocation) ?? null,
    [selectedLocation]
  );

  const startBattle = () => {
    resetState();
    setPhase("map");
  };

  const resetState = () => {
    setSelectedLocation(null);
    setCurrentBoss(null);
    setOptions([]);
    setIsCorrect(null);
  };

  const pickBossForLocation = (locId: string) => {
    const location = LOCATIONS.find((loc) => loc.id === locId);
    if (!location) {
      return;
    }

    const boss = location.bosses[Math.floor(Math.random() * location.bosses.length)];
    const otherChoices = EWASTE_TYPES.filter((type) => type !== boss);
    const randomOthers = [...otherChoices].sort(() => Math.random() - 0.5).slice(0, 3);
    const shuffled = [boss, ...randomOthers].sort(() => Math.random() - 0.5);

    setSelectedLocation(locId);
    setCurrentBoss(boss);
    setOptions(shuffled);
    setIsCorrect(null);
    setPhase("encounter");
  };

  const handleBossAnswer = (choice: string) => {
    if (!currentBoss) {
      return;
    }

    const correct = choice === currentBoss;
    setIsCorrect(correct);
    if (correct) {
      awardPetRewards();
    }
    setPhase("result");
  };

  const awardPetRewards = () => {
    try {
      const raw = localStorage.getItem("petStats");
      const base = raw ? JSON.parse(raw) : {};
      const updated = {
        life: Math.min(100, base.life ?? 70),
        happiness: Math.min(100, (base.happiness ?? 50) + 5),
        energy: Math.max(0, (base.energy ?? 60) - 3),
        level: base.level ?? 1,
        attack: (base.attack ?? 20) + 1,
        defense: (base.defense ?? 20) + 1,
        ecoPoints: (base.ecoPoints ?? 0) + 15,
        itemsRecycled: (base.itemsRecycled ?? 0) + 1,
      };
      localStorage.setItem("petStats", JSON.stringify(updated));
    } catch {
      // ignore storage errors to avoid UI crashes
    }
  };

  const gradientAccent = "bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500";

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium"
        >
          <Swords size={18} />
          Melbourne Defence Initiative
        </motion.div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          E-waste Boss Battle
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Scout the city, uncover e-waste creatures, and call out their true recycling type to keep Melbourne clean.
          Successful identifications power up your pet.
        </p>
      </div>

      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-10 space-y-8 border border-slate-100 dark:border-slate-800"
        >
          <div className="grid md:grid-cols-3 gap-6 justify-items-center text-center">
            {[
              {
                title: "Scout Districts",
                description: "Pinpoint hotspots across the CBD and suburbs collecting the most rogue electronics.",
                icon: <Compass className="text-purple-500" size={20} />,
              },
              {
                title: "Read the Signals",
                description: "Each location whispers clues about the creature. Study the hints before acting.",
                icon: <Lightbulb className="text-sky-500" size={20} />,
              },
              {
                title: "Recycle to Win",
                description: "Identify the correct e-waste stream to neutralise the boss and earn EcoPoints.",
                icon: <Recycle className="text-emerald-500" size={20} />,
              },
            ].map((step, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950/40 w-full max-w-xs">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${gradientAccent} text-white shadow-lg`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {step.icon}
                    {step.title}
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={startBattle}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white text-lg font-semibold shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 mx-auto"
            style={{ backgroundImage: "linear-gradient(135deg, #805AD5 0%, #4F46E5 50%, #0EA5E9 100%)" }}
          >
            <Play size={20} /> Enter Melbourne Map
          </motion.button>
        </motion.div>
      )}

      {phase === "map" && (
        <motion.div
          key="map"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 space-y-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MapPin size={22} className="text-rose-500" /> Melbourne City Map
            </h3>
            <button
              onClick={() => {
                resetState();
                setPhase("intro");
              }}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <ArrowLeft size={16} /> Back to briefing
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tap a district label to investigate the local boss. Each hotspot highlights e-waste commonly found in that setting.
          </p>

          <div className="relative h-80 rounded-[34px] bg-gradient-to-br from-sky-200 via-emerald-100 to-slate-200 overflow-hidden shadow-inner">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff88,transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#94a3b844,transparent_55%)]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/60" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/60" />
              <div className="absolute inset-8 rounded-[30px] border border-white/40" />
            </div>

            {LOCATIONS.map((loc) => (
              <motion.button
                key={loc.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => pickBossForLocation(loc.id)}
                style={{ top: loc.position.top, left: loc.position.left }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-2xl border backdrop-blur text-left shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/60 ${
                  selectedLocation === loc.id
                    ? "border-purple-500 bg-white/95 shadow-2xl"
                    : "border-white/50 bg-white/70 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${loc.color} rounded-full flex items-center justify-center text-xl shadow-inner`}>{loc.emoji}</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Hotspot</p>
                    <p className="font-semibold text-slate-800">{loc.name}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 md:grid-cols-3">
            {LOCATIONS.map((loc) => (
              <motion.button
                key={`${loc.id}-card`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => pickBossForLocation(loc.id)}
                className={`w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
                  selectedLocation === loc.id
                    ? "border-purple-500 bg-white dark:bg-slate-900 shadow-lg"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className={`w-12 h-12 ${loc.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>{loc.emoji}</div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{loc.name}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "encounter" && currentBoss && (
        <motion.div
          key="encounter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 space-y-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>
              Location: <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedLocationData?.name}</span>
            </span>
            <button onClick={() => setPhase("map")} className="hover:text-purple-500 dark:hover:text-purple-400">
              Back to map
            </button>
          </div>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div className="text-center md:text-left space-y-4">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full ${gradientAccent} flex items-center justify-center text-5xl shadow-xl text-white`}>
                  {bossVisuals[currentBoss]?.emoji ?? "♻️"}
                </div>
                <div className="px-3 py-1 rounded-full bg-white text-purple-600 text-xs font-semibold shadow">
                  Boss Appeared
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center md:text-left">
                {bossVisuals[currentBoss]?.title ?? currentBoss}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center md:text-left">
                {bossVisuals[currentBoss]?.description ?? "An e-waste creature materialises before you."}
              </p>
              <div className="rounded-2xl border border-purple-200/60 dark:border-purple-500/40 bg-purple-50/70 dark:bg-purple-900/20 px-4 py-3 text-sm text-purple-700 dark:text-purple-200">
                Hint: {bossVisuals[currentBoss]?.tip}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 text-center md:text-left">Select the correct type</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Classify correctly to break the creature&rsquo;s defence.</p>
              <div className="grid grid-cols-1 gap-3">
                {options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBossAnswer(option)}
                    className="w-full px-4 py-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-400 transition-all bg-slate-50 dark:bg-slate-950/40 flex items-center justify-center"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-lg md:text-xl">{option}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {phase === "result" && currentBoss && (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 text-center space-y-6"
        >
          {isCorrect ? (
            <>
              <div className="text-5xl">🎉</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Boss Neutralised!</h3>
              <p className="text-slate-600 dark:text-slate-300">
                The {bossVisuals[currentBoss]?.title ?? currentBoss} dissolves into reusable parts. Correct type: <span className="font-semibold text-slate-900 dark:text-slate-100">{currentBoss}</span>.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                <Award size={18} /> Rewards: +15 EcoPoints · +1 Recycled · +1 ATK · +1 DEF · +5 Happiness
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (selectedLocation) {
                      pickBossForLocation(selectedLocation);
                    } else {
                      setPhase("map");
                    }
                  }}
                  className="px-5 py-2 rounded-full text-white font-medium shadow-lg"
                  style={{ backgroundImage: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 60%, #0EA5E9 100%)" }}
                >
                  Patrol Same District
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    resetState();
                    setPhase("map");
                  }}
                  className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900"
                >
                  Choose New Location
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl">😿</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Attack Deflected</h3>
              <p className="text-slate-600 dark:text-slate-300">
                The boss shrugged off the wrong classification. Study the environment hints and try again.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPhase("encounter")}
                  className="px-5 py-2 rounded-full text-white font-medium shadow-lg"
                  style={{ backgroundImage: "linear-gradient(135deg, #F97316 0%, #FB7185 60%, #F472B6 100%)" }}
                >
                  Reassess Boss
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    resetState();
                    setPhase("map");
                  }}
                  className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900"
                >
                  Return to Map
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
