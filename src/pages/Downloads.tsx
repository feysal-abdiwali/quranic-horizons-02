import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Play, Pause, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StorageInfo } from "@/components/audio/StorageInfo";
import { openDB } from "@/components/audio/DownloadManager";

interface DownloadedFile {
  key: string;
  reciter: string;
  surahNumber: number;
  ayahNumber?: number;
  fileName: string;
  timestamp: string;
  filePath?: string;
}

const Downloads = () => {
  const [downloads, setDownloads] = useState<DownloadedFile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction("audioFiles", "readonly");
      const store = tx.objectStore("audioFiles");
      const request = store.getAll();
      
      request.onsuccess = () => {
        const sortedDownloads = (request.result as DownloadedFile[])
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setDownloads(sortedDownloads);
      };
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      const db = await openDB();
      const tx = db.transaction("audioFiles", "readwrite");
      const store = tx.objectStore("audioFiles");
      await store.delete(key);
      
      await loadDownloads();
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container max-w-4xl mx-auto py-24 px-4 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Downloaded Audio Files</h1>
        <StorageInfo />
        <div className="space-y-4 mt-6">
          {downloads.length === 0 ? (
            <div className="text-center py-8">
              <Download className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No downloaded files found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Download Surah audio files to access them offline.
              </p>
            </div>
          ) : (
            downloads.map((file) => (
              <div
                key={file.key}
                className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">
                    Surah {file.surahNumber}
                    {file.ayahNumber ? ` - Ayah ${file.ayahNumber}` : " (Full)"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Reciter: {file.reciter}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Downloaded: {formatDate(file.timestamp)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(file.key)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Downloads;