import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const StorageInfo = () => {
  const [storageUsed, setStorageUsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    calculateStorageUsed();
  }, []);

  const calculateStorageUsed = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('quran_audio_')) {
        total += localStorage.getItem(key)?.length || 0;
      }
    }
    setStorageUsed(total);
  };

  const clearAllDownloads = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('quran_audio_')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => localStorage.removeItem(key));
    calculateStorageUsed();
    
    toast({
      title: "Storage Cleared",
      description: "All downloaded audio files have been removed.",
    });
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Storage used: {(storageUsed / 1024 / 1024).toFixed(2)} MB
        </AlertDescription>
      </Alert>
      {storageUsed > 0 && (
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