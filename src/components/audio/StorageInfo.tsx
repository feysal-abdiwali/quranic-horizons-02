import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { openDB } from "./DownloadManager";

export const StorageInfo = () => {
  const [downloadCount, setDownloadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    calculateDownloads();
  }, []);

  const calculateDownloads = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction("audioFiles", "readonly");
      const store = tx.objectStore("audioFiles");
      const countRequest = store.count();
      
      // Properly handle the IDBRequest
      countRequest.onsuccess = () => {
        setDownloadCount(countRequest.result);
      };
    } catch (error) {
      console.error('Error calculating downloads:', error);
    }
  };

  const clearAllDownloads = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction("audioFiles", "readwrite");
      const store = tx.objectStore("audioFiles");
      await store.clear();
      
      setDownloadCount(0);
      toast({
        title: "Storage Cleared",
        description: "All downloaded audio files have been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear downloads.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Downloaded files: {downloadCount}
        </AlertDescription>
      </Alert>
      {downloadCount > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={clearAllDownloads}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Downloads
        </Button>
      )}
    </div>
  );
};