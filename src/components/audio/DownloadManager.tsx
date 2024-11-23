import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DownloadManagerProps {
  surahNumber: number;
  ayahNumber?: number;
  audioUrl: string;
  reciter: string;
}

export const DownloadManager = ({ surahNumber, ayahNumber, audioUrl, reciter }: DownloadManagerProps) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfDownloaded();
  }, [surahNumber, ayahNumber, reciter]);

  const checkIfDownloaded = async () => {
    try {
      const key = `quran_audio_${reciter}_${surahNumber}_${ayahNumber || 'full'}`;
      const stored = localStorage.getItem(key);
      setIsDownloaded(!!stored);
    } catch (error) {
      console.error('Error checking download status:', error);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const key = `quran_audio_${reciter}_${surahNumber}_${ayahNumber || 'full'}`;
      
      // Store the audio blob in localStorage (in a real app, use IndexedDB for larger files)
      localStorage.setItem(key, URL.createObjectURL(blob));
      
      setIsDownloaded(true);
      toast({
        title: "Download Complete",
        description: `Successfully downloaded ${ayahNumber ? `Ayah ${ayahNumber}` : `Surah ${surahNumber}`}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error downloading the audio file.",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = () => {
    try {
      const key = `quran_audio_${reciter}_${surahNumber}_${ayahNumber || 'full'}`;
      localStorage.removeItem(key);
      setIsDownloaded(false);
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
          Delete
        </Button>
      )}
    </div>
  );
};