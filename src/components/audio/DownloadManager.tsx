import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DownloadManagerProps {
  surahNumber: number;
  ayahNumber?: number;
  audioUrl: string;
  reciter: string;
}

// IndexedDB setup
const DB_NAME = 'QuranAudioDB';
const STORE_NAME = 'audioFiles';
const DB_VERSION = 1;

export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

export const DownloadManager = ({ surahNumber, ayahNumber, audioUrl, reciter }: DownloadManagerProps) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { toast } = useToast();

  const key = `${reciter}_${surahNumber}_${ayahNumber || 'full'}`;
  const fileName = `surah_${surahNumber}${ayahNumber ? `_ayah_${ayahNumber}` : ''}_${reciter}.mp3`;

  useEffect(() => {
    checkIfDownloaded();
  }, [key]);

  const checkIfDownloaded = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const result = await store.get(key);
      setIsDownloaded(!!result);
    } catch (error) {
      console.error('Error checking download status:', error);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Download failed');

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body!.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;
        setProgress(total ? (loaded / total) * 100 : 0);
      }

      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      // Create and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Store metadata in IndexedDB
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      await store.put({
        key,
        reciter,
        surahNumber,
        ayahNumber,
        fileName,
        timestamp: new Date().toISOString(),
        blob: await blob.arrayBuffer(), // Store the actual audio data
      });

      setIsDownloaded(true);
      toast({
        title: "Download Complete",
        description: `File saved as ${fileName}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error downloading the audio file.",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      await store.delete(key);
      
      setIsDownloaded(false);
      toast({
        title: "File Removed",
        description: "The file has been removed from your downloads list.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove the file from downloads.",
      });
    }
  };

  return (
    <div className="space-y-2">
      {downloading && (
        <Progress value={progress} className="w-full h-2" />
      )}
      {!isDownloaded ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Downloading..." : "Download"}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="gap-2 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Remove from Downloads
        </Button>
      )}
    </div>
  );
};