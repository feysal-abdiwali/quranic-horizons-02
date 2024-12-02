import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Trash2, X } from "lucide-react";
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
    isDownloaded,
    handleDownload,
    handleDelete,
    handleCancelDownload,
    checkDownloadStatus
  } = useDownloadManager(surahNumber, ayahNumber, reciter);

  useEffect(() => {
    checkDownloadStatus();
  }, []);

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
      {!isDownloaded ? (
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