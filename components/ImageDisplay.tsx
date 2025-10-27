import React from 'react';
import { SparklesIcon, ExclamationTriangleIcon } from './Icons';

interface ImageDisplayProps {
  imageData: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 animate-pulse">
    <SparklesIcon className="w-16 h-16 text-pink-500 mb-4" />
    <p className="text-lg font-semibold text-foreground">Reviving your photo...</p>
    <p className="text-sm text-muted-foreground">This may take a moment.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
    <p className="text-lg font-semibold text-red-400">Generation Failed</p>
    <p className="text-sm text-muted-foreground mt-2 max-w-xs">{message}</p>
  </div>
);

const PlaceholderState: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
    <SparklesIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
    <p className="text-lg font-semibold text-muted-foreground">Your modern portrait will appear here</p>
    <p className="text-sm text-muted-foreground/80">Upload a photo and click "Revive" to begin.</p>
  </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageData, isLoading, error }) => {
  return (
    <div className="w-full aspect-square bg-background rounded-lg flex items-center justify-center">
      <div className="w-full h-full border-2 border-dashed border-border rounded-lg flex items-center justify-center">
        {isLoading ? <LoadingState /> :
         error ? <ErrorState message={error} /> :
         imageData ? <img src={imageData} alt="Generated portrait" className="w-full h-full object-contain rounded-md" /> :
         <PlaceholderState />}
      </div>
    </div>
  );
};
