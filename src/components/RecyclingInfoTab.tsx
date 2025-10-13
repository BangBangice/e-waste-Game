"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Smartphone, Recycle, Info, AlertTriangle, Leaf, Box } from "lucide-react";

export interface RecyclingInfoData {
  productName: string;
  model: string;
  manufacturer: string;
  recyclabilityScore: number; // 0-100
  materials: Array<{ name: string; percentage: number; recyclable: boolean }>;
  components: Array<{ name: string; recyclable: boolean; notes?: string }>;
  guidance: string[];
  estimatedRecovery: Array<{ material: string; grams: number }>;
  disposalWarnings: string[];
}

const iphone17Static: RecyclingInfoData = {
  productName: "iPhone",
  model: "17",
  manufacturer: "Apple",
  recyclabilityScore: 92,
  materials: [
    { name: "Aluminum enclosure (recycled)", percentage: 48, recyclable: true },
    { name: "Glass and ceramics", percentage: 25, recyclable: true },
    { name: "Stainless steel / titanium elements", percentage: 6, recyclable: true },
    { name: "Lithium-ion battery", percentage: 8, recyclable: true },
    { name: "Plastics and adhesives", percentage: 7, recyclable: false },
    { name: "Rare earths and trace metals", percentage: 6, recyclable: true },
  ],
  components: [
    { name: "Battery (Li-ion)", recyclable: true, notes: "Recycle via e-waste facility; never bin" },
    { name: "Display assembly", recyclable: true, notes: "Glass recovery possible" },
    { name: "Logic board (CPU, memory)", recyclable: true, notes: "Precious metal recovery" },
    { name: "Cameras and sensors", recyclable: true },
    { name: "Adhesives and sealants", recyclable: false, notes: "Residue handled during processing" },
  ],
  guidance: [
    "Back up and wipe your data (Settings > General > Transfer or Reset)",
    "Remove SIM and any memory cards before recycling",
    "If the battery is swollen or damaged, do not charge; bring to staffed facility",
    "Use designated e-waste points in Melbourne; avoid kerbside bins",
  ],
  estimatedRecovery: [
    { material: "Aluminum", grams: 28 },
    { material: "Copper", grams: 15 },
    { material: "Gold, silver, palladium (combined)", grams: 0.2 },
    { material: "Rare earth elements", grams: 0.5 },
  ],
  disposalWarnings: [
    "Do not dispose in household bins",
    "Avoid puncturing or crushing the battery",
    "Transport in original box or non-conductive pouch if possible",
  ],
};

export default function RecyclingInfoTab(props: { data?: RecyclingInfoData; scannedText?: string | null }) {
  const data = useMemo(() => props.data ?? iphone17Static, [props.data]);

  const scoreColor = data.recyclabilityScore >= 85 ? "text-green-600" : data.recyclabilityScore >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Hero / Header */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{data.manufacturer} {data.productName} {data.model}</h2>
              <p className="text-emerald-50">Recyclability and safe disposal guidance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/10 grid place-items-center">
                <div className="w-16 h-16 rounded-full bg-white grid place-items-center">
                  <div className={`text-2xl font-extrabold ${scoreColor}`}>{data.recyclabilityScore}%</div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-white/30" />
            </div>
            <div className="text-sm opacity-90">
              <div className="font-semibold">Recyclability Score</div>
              <div>Higher is better</div>
            </div>
          </div>
        </div>
      </div>

      {props.scannedText && (
        <div className="bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
          <div className="text-sm text-emerald-800 dark:text-emerald-200">Scanned: <span className="font-mono">{props.scannedText}</span></div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Materials Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-emerald-100 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2"><Recycle size={18} className="text-emerald-600" /><span>Material Breakdown</span></h4>
          <div className="space-y-4">
            {data.materials.map((m, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{m.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${m.recyclable ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{m.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full ${m.recyclable ? "bg-emerald-500" : "bg-gray-400"}`} style={{ width: `${m.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Components Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-emerald-100 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2"><Info size={18} className="text-emerald-600" /><span>Key Components</span></h4>
          <ul className="space-y-3">
            {data.components.map((c, idx) => (
              <li key={idx} className="flex items-start justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{c.name}</span>
                  {c.notes && <span className="text-gray-500"> — {c.notes}</span>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ml-3 whitespace-nowrap ${c.recyclable ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{c.recyclable ? "Recyclable" : "Not recyclable"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Guidance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-emerald-100 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2"><Leaf size={18} className="text-emerald-600" /><span>Recycling Guidance</span></h4>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            {data.guidance.map((g, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recovery Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-emerald-100 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2"><Box size={18} className="text-emerald-600" /><span>Estimated Material Recovery</span></h4>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            {data.estimatedRecovery.map((r, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{r.material}</span>
                <span className="text-gray-600">{r.grams} g</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-red-200 dark:border-red-800">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2"><AlertTriangle size={18} className="text-red-500" /><span>Disposal Warnings</span></h4>
        <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
          {data.disposalWarnings.map((w, i) => (
            <li key={i} className="flex items-start space-x-2">
              <span className="text-red-500 mt-1">•</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


