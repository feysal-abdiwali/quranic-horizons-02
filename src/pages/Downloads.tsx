import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Play, Pause } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StorageInfo } from "@/components/audio/StorageInfo";
import { openDB } from "@/components/audio/DownloadManager";

interface DownloadedFile {
  key: string;
  reciter: string;
  surahNumber: number;
  ayahNumber?: number;
  url: string;
}

const Downloads = () => {
  const [downloads, setDownloads] = useState<DownloadedFile[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const { toast } = useToast();
  const audioRef = new Audio();

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction("audioFiles", "readonly");
      const store = tx.objectStore("audioFiles");
      const items = await store.getAll();
      setDownloads(items);
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
  };

  const handlePlay = async (file: DownloadedFile) => {
    if (playing === file.key) {
      audioRef.pause();
      setPlaying(null);
    } else {
      try {
        audioRef.src = file.url;
        await audioRef.play();
        setPlaying(file.key);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Playback Error",
          description: "Could not play the audio file.",
        });
      }
    }
  };

  const handleDelete = async (key: string) => {
    try {
      const db = await openDB();
      const tx = db.transaction("audioFiles", "readwrite");
      const store = tx.objectStore("audioFiles");
      await store.delete(key);
      
      if (playing === key) {
        audioRef.pause();
        setPlaying(null);
      }
      
      await loadDownloads();
      toast({
        title: "File Deleted",
        description: "The audio file has been removed from storage.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the audio file.",
      });
    }
  };

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container max-w-4xl mx-auto py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Downloaded Audio Files</h1>
        <StorageInfo />
        <div className="space-y-4 mt-6">
          {downloads.length === 0 ? (
            <p className="text-muted-foreground">No downloaded files found.</p>
          ) : (
            downloads.map((file) => (
              <div
                key={file.key}
                className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm"
              >
                <div>
                  <h3 className="font-medium">
                    Surah {file.surahNumber}
                    {file.ayahNumber ? ` - Ayah ${file.ayahNumber}` : " (Full)"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Reciter: {file.reciter}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePlay(file)}
                  >
                    {playing === file.key ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
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