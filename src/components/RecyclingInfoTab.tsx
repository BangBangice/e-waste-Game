"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Smartphone, Recycle, Battery, Cpu, HardDrive, Info } from "lucide-react";

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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Recycling Info</h2>
        <p className="text-emerald-600 dark:text-emerald-300">Product recyclability and safe disposal guidance</p>
      </div>

      {props.scannedText && (
        <div className="bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
          <div className="text-sm text-emerald-800 dark:text-emerald-200">Scanned: <span className="font-mono">{props.scannedText}</span></div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
              <Smartphone />
            </div>
            <div>
              <h3 className="text-lg font-semibold dark:text-gray-100">{data.manufacturer} {data.productName} {data.model}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">Smartphone</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${scoreColor}`}>{data.recyclabilityScore}%</div>
            <div className="text-xs text-gray-500">Recyclability score</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center space-x-2"><Recycle size={16} /><span>Material Breakdown</span></h4>
            <ul className="space-y-2">
              {data.materials.map((m, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{m.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${m.recyclable ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{m.percentage}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center space-x-2"><Info size={16} /><span>Key Components</span></h4>
            <ul className="space-y-2">
              {data.components.map((c, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium mr-2">{c.name}</span>
                  <span className={`mr-2 ${c.recyclable ? "text-green-600" : "text-gray-500"}`}>{c.recyclable ? "recyclable" : "not recyclable"}</span>
                  {c.notes && <span className="text-gray-500">— {c.notes}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Recycling Guidance</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
            {data.guidance.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Estimated Material Recovery</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {data.estimatedRecovery.map((r, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{r.material}</span>
                <span className="text-gray-600">{r.grams} g</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Disposal Warnings</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
          {data.disposalWarnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}


