"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, MapPin, Calendar, Users, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface LearningContent {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  content: string;
  tips: string[];
}

const learningContent: LearningContent[] = [
  {
    id: "melbourne-ewaste",
    title: "E-Waste in Melbourne",
    description: "Understanding e-waste management in Melbourne",
    image: "🏙️",
    category: "Overview",
    content: "Melbourne has a comprehensive e-waste recycling program that helps residents properly dispose of electronic items. The city provides multiple collection points and regular collection services to ensure electronic waste is handled responsibly.",
    tips: [
      "Check your local council's e-waste collection schedule",
      "Use designated e-waste drop-off points",
      "Remove personal data before disposal",
      "Keep e-waste separate from regular recycling"
    ]
  },
  {
    id: "collection-points",
    title: "Collection Points",
    description: "Where to drop off your e-waste in Melbourne",
    image: "📍",
    category: "Locations",
    content: "Melbourne has numerous e-waste collection points across the city. These include permanent facilities, mobile collection services, and special collection events. Most collection points accept a wide range of electronic items.",
    tips: [
      "Find your nearest collection point online",
      "Check operating hours before visiting",
      "Some items may have size restrictions",
      "Bring ID for verification if required"
    ]
  },
  {
    id: "accepted-items",
    title: "Accepted Items",
    description: "What electronic items can be recycled",
    image: "📱",
    category: "Items",
    content: "Most electronic items are accepted at Melbourne's e-waste collection points. This includes computers, phones, TVs, small appliances, and other electronic devices. Some items may have specific requirements or restrictions.",
    tips: [
      "Remove batteries from devices when possible",
      "Keep items in original packaging if available",
      "Check for size limits on large items",
      "Some items may require special handling"
    ]
  },
  {
    id: "preparation",
    title: "Preparation Guide",
    description: "How to prepare your e-waste for recycling",
    image: "🔧",
    category: "Preparation",
    content: "Proper preparation of e-waste is crucial for safe and effective recycling. This includes removing personal data, cleaning devices, and following specific guidelines for different types of electronics.",
    tips: [
      "Back up important data before disposal",
      "Factory reset all devices",
      "Remove SIM cards and memory cards",
      "Clean devices of dust and debris"
    ]
  },
  {
    id: "environmental-impact",
    title: "Environmental Impact",
    description: "Why e-waste recycling matters for the environment",
    image: "🌱",
    category: "Impact",
    content: "E-waste recycling has significant environmental benefits. It prevents hazardous materials from entering landfills, recovers valuable resources, and reduces the need for mining new materials. Melbourne's program helps protect local ecosystems.",
    tips: [
      "Recycling prevents toxic materials from leaching",
      "Recovered materials reduce mining needs",
      "Proper disposal protects local waterways",
      "Energy is saved through material recovery"
    ]
  },
  {
    id: "future-trends",
    title: "Future Trends",
    description: "The future of e-waste management in Melbourne",
    image: "🚀",
    category: "Future",
    content: "Melbourne is continuously improving its e-waste management program. New technologies, expanded collection services, and increased public awareness are helping create a more sustainable approach to electronic waste.",
    tips: [
      "Stay updated on new collection methods",
      "Participate in community recycling programs",
      "Support sustainable electronics purchasing",
      "Educate others about e-waste importance"
    ]
  }
];

export default function LearningTab() {
  const [selectedContent, setSelectedContent] = useState<LearningContent | null>(null);
  const [expandedTips, setExpandedTips] = useState<boolean[]>(new Array(learningContent.length).fill(false));

  const toggleTips = (index: number) => {
    const newExpanded = [...expandedTips];
    newExpanded[index] = !newExpanded[index];
    setExpandedTips(newExpanded);
  };

  const categories = [...new Set(learningContent.map(item => item.category))];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Learning Center</h2>
        <p className="text-gray-600">
          Learn about e-waste recycling in Melbourne
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-3">Browse by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Learning Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningContent.map((content, index) => (
          <motion.div
            key={content.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-green-300 transition-all"
          >
            <div className="p-6">
              <div className="text-4xl mb-4 text-center">{content.image}</div>
              <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{content.description}</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedContent(content)}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <BookOpen size={16} />
                  <span>Learn More</span>
                </button>
                
                <button
                  onClick={() => toggleTips(index)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  {expandedTips[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span>Quick Tips</span>
                </button>
              </div>

              <AnimatePresence>
                {expandedTips[index] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Quick Tips:</h4>
                    <ul className="space-y-1">
                      {content.tips.slice(0, 2).map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-xs text-gray-600 flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Content Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedContent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{selectedContent.image}</div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedContent.title}</h2>
                      <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {selectedContent.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Overview</h3>
                    <p className="text-gray-600">{selectedContent.content}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Key Tips</h3>
                    <ul className="space-y-2">
                      {selectedContent.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
