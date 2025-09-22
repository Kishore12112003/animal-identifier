
import React from 'react';
import { AnimalData } from '../types';

interface ResultDisplayProps {
  animalData: AnimalData;
  imagePreviewUrl: string;
  onReset: () => void;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">{label}</h3>
    <p className="text-lg text-gray-200">{value}</p>
  </div>
);

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
    const percentage = Math.round(value * 100);
    const barColor = percentage > 75 ? 'bg-green-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div>
            <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-2">Confidence</h3>
            <div className="flex items-center gap-3">
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="font-bold text-lg text-white">{percentage}%</span>
            </div>
        </div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ animalData, imagePreviewUrl, onReset }) => {
  return (
    <div className="w-full animate-fade-in bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-6 flex flex-col">
            <div className="relative aspect-square w-full">
                 <img src={imagePreviewUrl} alt="Uploaded animal" className="w-full h-full object-cover rounded-xl shadow-lg" />
            </div>
        </div>

        <div className="p-8 bg-gray-800/40">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xl font-medium text-indigo-400">{animalData.scientificName}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white">{animalData.commonName}</h2>
            </div>
            
            <ConfidenceBar value={animalData.confidenceLevel} />
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <DetailItem label="Habitat" value={animalData.habitat} />
              <DetailItem label="Diet" value={animalData.diet} />
              <DetailItem label="Lifespan" value={animalData.lifespan} />
              <DetailItem label="Conservation" value={animalData.conservationStatus} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-2">Fun Facts</h3>
              <ul className="list-disc list-inside space-y-2 pl-2 text-gray-300">
                {animalData.funFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={onReset}
              className="mt-4 w-full sm:w-auto self-start px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-transform hover:scale-105"
            >
              Analyze Another Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
