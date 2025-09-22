
import React, { useState, useCallback } from 'react';
import { AnimalData } from './types';
import { identifyAnimal } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { LogoIcon, GitHubIcon } from './components/Icons';

const App: React.FC = () => {
  const [image, setImage] = useState<{ file: File | null; previewUrl: string | null }>({
    file: null,
    previewUrl: null,
  });
  const [animalData, setAnimalData] = useState<AnimalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnimalData(null);
    setImage({ file, previewUrl: URL.createObjectURL(file) });

    try {
      const generativePart = await fileToGenerativePart(file);
      const result = await identifyAnimal(generativePart.inlineData.data, generativePart.inlineData.mimeType);

      if (result.error) {
        setError(result.error);
        setAnimalData(null);
      } else {
        setAnimalData(result);
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while analyzing the image. Please try again.');
      setAnimalData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setImage({ file: null, previewUrl: null });
    setAnimalData(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Animal Identifier AI
          </h1>
        </div>
        <a href="https://github.com/google/genai-js" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
          <GitHubIcon />
        </a>
      </header>

      <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center">
        {!image.previewUrl && !isLoading && (
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
        )}

        {isLoading && <LoadingSpinner />}
        
        {error && !isLoading && <ErrorDisplay message={error} onReset={handleReset} />}
        
        {animalData && image.previewUrl && !isLoading && (
          <ResultDisplay 
            animalData={animalData} 
            imagePreviewUrl={image.previewUrl} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
