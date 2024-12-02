import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { checkIfExists, storeInDB } from '@/utils/indexedDB';

export const useDownloadManager = (
  surahNumber: number,
  ayahNumber: number | undefined,
  reciter: string
) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const key = `${reciter}_${surahNumber}_${ayahNumber || 'full'}`;
  const fileName = `surah_${surahNumber}${ayahNumber ? `_ayah_${ayahNumber}` : ''}_${reciter}.mp3`;

  const checkDownloadStatus = useCallback(async () => {
    try {
      const exists = await checkIfExists(key);
      setIsDownloaded(exists);
    } catch (error) {
      console.error('Error checking download status:', error);
      setIsDownloaded(false);
    }
  }, [key]);

  const downloadSingleAudio = async (url: string): Promise<ArrayBuffer> => {
    abortControllerRef.current = new AbortController();
    const response = await fetch(url, {
      signal: abortControllerRef.current.signal
    });
    if (!response.ok) throw new Error('Download failed');
    return await response.arrayBuffer();
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setDownloading(false);
      setProgress(0);
      toast({
        title: "Download Cancelled",
        description: "The download has been cancelled.",
      });
    }
  };

  const handleDownload = async (audioUrl: string | string[]) => {
    setDownloading(true);
    setProgress(0);

    try {
      let audioData: ArrayBuffer;
      
      if (Array.isArray(audioUrl)) {
        // Handle full surah download
        const totalAyahs = audioUrl.length;
        const audioBuffers: ArrayBuffer[] = [];

        for (let i = 0; i < totalAyahs; i++) {
          const buffer = await downloadSingleAudio(audioUrl[i]);
          audioBuffers.push(buffer);
          setProgress((i + 1) / totalAyahs * 100);
        }

        const totalLength = audioBuffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
        audioData = new ArrayBuffer(totalLength);
        const uint8Array = new Uint8Array(audioData);
        let offset = 0;

        audioBuffers.forEach(buffer => {
          uint8Array.set(new Uint8Array(buffer), offset);
          offset += buffer.byteLength;
        });
      } else {
        // Handle single ayah download
        audioData = await downloadSingleAudio(audioUrl);
        setProgress(100);
      }

      // Create and trigger download
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Store in IndexedDB
      await storeInDB({
        key,
        reciter,
        surahNumber,
        ayahNumber,
        fileName,
        timestamp: new Date().toISOString(),
        blob: audioData,
      });

      setIsDownloaded(true);
      toast({
        title: "Download Complete",
        description: `File saved as ${fileName}`,
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error downloading the audio file.",
      });
    } finally {
      setDownloading(false);
      abortControllerRef.current = null;
    }
  };

  return {
    downloading,
    progress,
    isDownloaded,
    handleDownload,
    handleCancelDownload,
    checkDownloadStatus
  };
};
