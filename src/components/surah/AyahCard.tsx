import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { DownloadManager } from "../audio/DownloadManager";

interface AyahCardProps {
  ayah: any;
  isPlaying: boolean;
  onPlayAyah: () => void;
  surahNumber: number;
}

export const AyahCard = ({ ayah, isPlaying, onPlayAyah, surahNumber }: AyahCardProps) => (
  <div className="glass-card rounded-xl p-4 sm:p-8 animate-scale-up">
    <div className="flex items-start justify-between mb-6 sm:mb-8">
      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-premium-gradient rounded-full text-white text-sm sm:text-base font-semibold shadow-lg">
        {ayah.numberInSurah}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-colors"
          onClick={onPlayAyah}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-primary" />
          ) : (
            <Play className="h-4 w-4 text-primary" />
          )}
        </Button>
        <DownloadManager
          surahNumber={surahNumber}
          ayahNumber={ayah.numberInSurah}
          audioUrl={ayah.audio}
          reciter={ayah.reciter}
        />
      </div>
    </div>
    <p className="arabic-text text-xl sm:text-2xl leading-loose text-right mb-6 sm:mb-8">
      {ayah.text}
    </p>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
      {ayah.translation}
    </p>
  </div>
);