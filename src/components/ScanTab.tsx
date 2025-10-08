"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, QrCode, AlertCircle } from "lucide-react";

export default function ScanTab() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate QR code scanning from uploaded image
      setScannedData("Sample QR Code Data: E-waste item detected - Smartphone");
      setError(null);
    }
  };

  const handleCameraScan = () => {
    setIsScanning(true);
    setError(null);
    
    // Simulate camera scanning
    setTimeout(() => {
      setIsScanning(false);
      setScannedData("Sample QR Code Data: E-waste item detected - Laptop");
    }, 2000);
  };

  const resetScan = () => {
    setScannedData(null);
    setError(null);
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">QR Code Scanner</h2>
        <p className="text-gray-600">
          Scan QR codes on e-waste items to learn about proper disposal
        </p>
      </div>

      {!scannedData && !isScanning && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Scan */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors"
          >
            <div className="text-center">
              <Camera className="mx-auto mb-4 text-green-500" size={48} />
              <h3 className="text-lg font-semibold mb-2">Use Camera</h3>
              <p className="text-gray-600 mb-4">
                Point your camera at a QR code to scan
              </p>
              <button
                onClick={handleCameraScan}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Camera
              </button>
            </div>
          </motion.div>

          {/* File Upload */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
          >
            <div className="text-center">
              <Upload className="mx-auto mb-4 text-blue-500" size={48} />
              <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>
              <p className="text-gray-600 mb-4">
                Select an image with a QR code
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Scanning State */}
      {isScanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-8 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <QrCode size={48} className="text-green-500" />
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">Scanning...</h3>
          <p className="text-gray-600">Point your camera at the QR code</p>
        </motion.div>
      )}

      {/* Scan Results */}
      {scannedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <QrCode className="text-green-500 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                QR Code Scanned Successfully!
              </h3>
              <p className="text-green-700 mb-4">{scannedData}</p>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2">Disposal Information:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• This item can be recycled at designated e-waste collection points</li>
                  <li>• Remove all personal data before disposal</li>
                  <li>• Check with your local council for collection schedules</li>
                </ul>
              </div>
            </div>
          </div>
          <button
            onClick={resetScan}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Scan Another Code
          </button>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-500 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Scan Failed</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={resetScan}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
