import React, { useState, useCallback } from 'react';
import { modernizeVintagePhoto } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { PhotoIcon, SparklesIcon, DownloadIcon } from './components/Icons';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';

interface ImageFile {
  file: File;
  dataUrl: string;
}

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage({ file, dataUrl: reader.result as string });
      setGeneratedImage(null);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Data = originalImage.dataUrl.split(',')[1];
      const mimeType = originalImage.file.type;
      
      const generatedBase64 = await modernizeVintagePhoto(base64Data, mimeType);
      
      if (generatedBase64) {
        setGeneratedImage(`data:image/png;base64,${generatedBase64}`);
      } else {
        throw new Error('The API did not return an image. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'revived-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);


  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <header className="text-center p-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Vintage Photo Reviver
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Bring your old photos to life with a touch of AI magic ✨</p>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>
                <PhotoIcon className="w-6 h-6 mr-2 text-purple-400" />
                1. Upload Your Vintage Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader onImageUpload={handleImageUpload} currentImage={originalImage?.dataUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                 <SparklesIcon className="w-6 h-6 mr-2 text-pink-500" />
                2. Your Modern Portrait
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ImageDisplay 
                imageData={generatedImage} 
                isLoading={isLoading} 
                error={error} 
              />
              {generatedImage && !isLoading && !error && (
                <Button onClick={handleDownload} variant="secondary" className="mt-4">
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Download Photo
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full max-w-6xl mt-8">
           <Button
            onClick={handleGenerate}
            disabled={!originalImage || isLoading}
            size="lg"
            className="w-full text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6 mr-2" />
                Revive My Photo
              </>
            )}
          </Button>
        </div>
      </main>

       <footer className="text-center p-4 text-muted-foreground text-sm border-t border-border mt-8">
        <p>Powered by Gemini. An AI experiment.</p>
      </footer>
    </div>
  );
};

export default App;
