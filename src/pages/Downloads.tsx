import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Play, Pause, Download, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StorageInfo } from "@/components/audio/StorageInfo";
import { openDB } from "@/components/audio/DownloadManager";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DownloadedFile {
  key: string;
  reciter: string;
  surahNumber: number;
  ayahNumber?: number;
  fileName: string;
  timestamp: string;
  filePath?: string;
}

interface GroupedDownloads {
  [key: number]: DownloadedFile[];
}

const Downloads = () => {
  const [downloads, setDownloads] = useState<DownloadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { toast } = useToast();
  const audioRef = useState<HTMLAudioElement | null>(null)[0] || new Audio();

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

  const handleDelete = async (keys: string[]) => {
    try {
      const db = await openDB();
      const tx = db.transaction("audioFiles", "readwrite");
      const store = tx.objectStore("audioFiles");
      
      await Promise.all(keys.map(key => store.delete(key)));
      
      setSelectedFiles([]);
      await loadDownloads();
      toast({
        title: "Files Removed",
        description: `Successfully removed ${keys.length} file(s)`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove the files from downloads.",
      });
    }
  };

  const handlePlay = async (file: DownloadedFile) => {
    if (currentlyPlaying === file.key) {
      audioRef.pause();
      setCurrentlyPlaying(null);
    } else {
      try {
        if (file.filePath) {
          audioRef.src = file.filePath;
          await audioRef.play();
          setCurrentlyPlaying(file.key);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Playback Error",
          description: "Unable to play the audio file.",
        });
      }
    }
  };

  const toggleFileSelection = (key: string) => {
    setSelectedFiles(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const selectAll = () => {
    if (selectedFiles.length === downloads.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(downloads.map(file => file.key));
    }
  };

  const groupDownloadsBySurah = (downloads: DownloadedFile[]): GroupedDownloads => {
    return downloads.reduce((acc, download) => {
      const { surahNumber } = download;
      if (!acc[surahNumber]) {
        acc[surahNumber] = [];
      }
      acc[surahNumber].push(download);
      return acc;
    }, {} as GroupedDownloads);
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

  const groupedDownloads = groupDownloadsBySurah(downloads);

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container max-w-4xl mx-auto py-24 px-4 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Downloaded Audio Files</h1>
        <StorageInfo />
        
        {downloads.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="gap-2"
              >
                <Checkbox
                  checked={selectedFiles.length === downloads.length && downloads.length > 0}
                  className="mr-2"
                />
                {selectedFiles.length === downloads.length && downloads.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              
              {selectedFiles.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedFiles)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedFiles.length})
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-8 mt-6">
          {Object.entries(groupedDownloads).length === 0 ? (
            <div className="text-center py-8">
              <Download className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No downloaded files found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Download Surah audio files to access them offline.
              </p>
            </div>
          ) : (
            Object.entries(groupedDownloads).map(([surahNumber, files]) => (
              <div key={surahNumber} className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Surah {surahNumber}
                </h2>
                <div className="space-y-4">
                  {files.map((file) => (
                    <div
                      key={file.key}
                      className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={selectedFiles.includes(file.key)}
                          onCheckedChange={() => toggleFileSelection(file.key)}
                        />
                        <div className="space-y-1">
                          <h3 className="font-medium">
                            {file.ayahNumber 
                              ? `Ayah ${file.ayahNumber}`
                              : "Full Surah"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Reciter: {file.reciter}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(file.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePlay(file)}
                        >
                          {currentlyPlaying === file.key ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete([file.key])}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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