"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, QrCode, AlertCircle, X, RotateCcw } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScanTab({ onScanComplete }: { onScanComplete?: (text: string) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize QR code reader
  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      stopCamera();
    };
  }, []);

  // Get available cameras
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Check if mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.warn('MediaDevices API not supported');
          setError('Camera access not supported in this browser. Please use a modern browser with HTTPS.');
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        } else {
          setError('No cameras found. Please connect a camera and refresh the page.');
        }
      } catch (err) {
        console.error('Error getting devices:', err);
        setError('Failed to access camera devices. Please check your browser permissions.');
      }
    };
    getDevices();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleCameraScan = async () => {
    if (!readerRef.current || !selectedDeviceId) {
      setError('No camera selected or QR reader not initialized.');
      return;
    }

    // Check if mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera access not supported in this browser. Please use a modern browser with HTTPS.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScannedData(null);

    try {
      // Check camera permission (if supported)
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });

          if (permission.state === 'denied') {
            setError('Camera permission denied. Please enable camera access in your browser settings.');
            setIsLoading(false);
            return;
          }
        } catch (permErr) {
          // Permission API might not be supported, continue anyway
          console.warn('Permission API not supported:', permErr);
        }
      }

      setIsScanning(true);
      setIsLoading(false);

      // Start camera stream
      const constraints = {
        video: {
          deviceId: { exact: selectedDeviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Start QR code scanning
      if (videoRef.current) {
        await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
          if (result) {
            const text = result.getText();
            setScannedData(text);
            if (onScanComplete) {
              onScanComplete(text);
            }
            stopCamera();
          }
          if (error && !error.message.includes('No MultiFormat Readers')) {
            console.log('QR Code scan error:', error);
          }
        }
        );
      }

    } catch (err: unknown) {
      console.error('Camera error:', err);
      let errorMessage = 'Failed to access camera. ';
      
      if (err instanceof Error && err.name === 'NotAllowedError') {
        errorMessage += 'Camera permission denied. Please allow camera access and try again.';
      } else if (err instanceof Error && err.name === 'NotFoundError') {
        errorMessage += 'No camera found. Please connect a camera and try again.';
      } else if (err instanceof Error && err.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else if (err instanceof Error && err.name === 'OverconstrainedError') {
        errorMessage += 'Camera constraints cannot be satisfied.';
      } else {
        errorMessage += err instanceof Error ? err.message : 'Please check your browser permissions and try again.';
      }
      
      setError(errorMessage);
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !readerRef.current) return;

    setError(null);
    setScannedData(null);
    setIsLoading(true);

    try {
      const result = await readerRef.current.decodeFromImageUrl(URL.createObjectURL(file));
      setScannedData(result.getText());
    } catch (err: unknown) {
      console.error('File scan error:', err);
      setError('No QR code found in the image. Please try a different image.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetScan = () => {
    stopCamera();
    setScannedData(null);
    setError(null);
    setIsLoading(false);
  };

  const switchCamera = () => {
    if (availableDevices.length > 1) {
      const currentIndex = availableDevices.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % availableDevices.length;
      setSelectedDeviceId(availableDevices[nextIndex].deviceId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">QR Code Scanner</h2>
        <p className="text-purple-600 dark:text-purple-300">
          Scan QR codes on e-waste items to learn about proper disposal
        </p>
      </div>

      {!scannedData && !isScanning && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Scan */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 rounded-lg shadow-lg p-6 border-2 border-dashed transition-all duration-300 ${
              availableDevices.length > 0 
                ? 'border-green-300 dark:border-green-600 hover:border-green-500 hover:shadow-xl' 
                : 'border-red-300 dark:border-red-600'
            }`}
          >
            <div className="text-center">
              <Camera className={`mx-auto mb-4 ${availableDevices.length > 0 ? 'text-green-500' : 'text-red-500'}`} size={48} />
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Use Camera</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {availableDevices.length > 0 
                  ? 'Point your camera at a QR code to scan'
                  : 'No cameras detected. Please connect a camera or use file upload instead.'
                }
              </p>
              
              {/* Camera Selection */}
              {availableDevices.length > 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Camera:
                  </label>
                  <select
                    value={selectedDeviceId || ''}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {availableDevices.map((device, index) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleCameraScan}
                disabled={isLoading || !selectedDeviceId || availableDevices.length === 0}
                className={`px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto ${
                  availableDevices.length > 0
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Starting...</span>
                  </>
                ) : (
                  <>
                    <Camera size={20} />
                    <span>{availableDevices.length > 0 ? 'Start Camera' : 'No Camera'}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* File Upload */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors"
          >
            <div className="text-center">
              <Upload className="mx-auto mb-4 text-blue-500" size={48} />
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Upload Photo</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Select an image with a QR code
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Choose File</span>
                  </>
                )}
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

      {/* Camera View */}
      {isScanning && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">Camera View</h3>
            <div className="flex space-x-2">
              {availableDevices.length > 1 && (
                <button
                  onClick={switchCamera}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Switch Camera"
                >
                  <RotateCcw size={20} />
                </button>
              )}
              <button
                onClick={stopCamera}
                className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                title="Stop Camera"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover"
              playsInline
              muted
            />
            <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none">
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <QrCode className="inline mr-2" size={20} />
              <span>Point camera at QR code</span>
            </div>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scannedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <QrCode className="text-green-500 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                QR Code Scanned Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4 font-mono bg-white dark:bg-gray-800 p-3 rounded border">
                {scannedData}
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Disposal Information:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• This item can be recycled at designated e-waste collection points</li>
                  <li>• Remove all personal data before disposal</li>
                  <li>• Check with your local council for collection schedules</li>
                  <li>• Some items may require special handling procedures</li>
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
          className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-500 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Scan Failed</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
              
              {/* HTTPS Warning */}
              {error.includes('HTTPS') && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Camera access requires HTTPS. If you&apos;re testing locally, try accessing the app via 
                    <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">https://localhost:3000</code> or deploy to a hosting service.
                  </p>
                </div>
              )}
              
              <div className="mt-4 space-x-2">
                <button
                  onClick={resetScan}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
                {error.includes('permission') && (
                  <button
                    onClick={() => window.open('https://support.google.com/chrome/answer/2693767', '_blank')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Help with Permissions
                  </button>
                )}
                {error.includes('HTTPS') && (
                  <button
                    onClick={() => window.location.href = window.location.href.replace('http:', 'https:')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Try HTTPS
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}