import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, X } from "lucide-react";
import { useDownloadManager } from "@/hooks/useDownloadManager";

interface DownloadManagerProps {
  surahNumber: number;
  ayahNumber?: number;
  audioUrl: string | string[];
  reciter: string;
}

export const DownloadManager = ({ surahNumber, ayahNumber, audioUrl, reciter }: DownloadManagerProps) => {
  const {
    downloading,
    progress,
    handleDownload,
    handleCancelDownload,
  } = useDownloadManager(surahNumber, ayahNumber, reciter);

  return (
    <div className="space-y-2">
      {downloading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelDownload}
            className="gap-2 text-destructive"
          >
            <X className="h-4 w-4" />
            Cancel Download
          </Button>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDownload(audioUrl)}
        disabled={downloading}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {downloading ? "Downloading..." : "Download"}
      </Button>
    </div>
  );
};