import { Button } from "@/components/ui/button";
import { Play, Pause, Bookmark } from "lucide-react";
import { DownloadManager } from "../audio/DownloadManager";
import { useBookmarks } from "@/hooks/useBookmarks";

interface AyahCardProps {
  ayah: any;
  isPlaying: boolean;
  onPlayAyah: () => void;
  surahNumber: number;
  surahName: string;
}

export const AyahCard = ({ ayah, isPlaying, onPlayAyah, surahNumber, surahName }: AyahCardProps) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(surahNumber, ayah.numberInSurah);

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(surahNumber, ayah.numberInSurah);
    } else {
      addBookmark({
        surahNumber,
        ayahNumber: ayah.numberInSurah,
        surahName,
        ayahText: ayah.text,
      });
    }
  };

  // Enhanced text formatting with improved spacing and Unicode normalization
  const formattedAyahText = ayah.text
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFKC');

  return (
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
          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-primary/10 transition-colors ${bookmarked ? 'text-primary' : ''}`}
            onClick={handleBookmark}
          >
            <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
          </Button>
          <DownloadManager
            surahNumber={surahNumber}
            ayahNumber={ayah.numberInSurah}
            audioUrl={ayah.audio}
            reciter={ayah.reciter}
          />
        </div>
      </div>
      <div 
        className="arabic-text text-2xl sm:text-3xl leading-[2.8] sm:leading-[3.2] text-right mb-8 font-['Amiri'] tracking-wide"
        dir="rtl"
        lang="ar"
        style={{
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        {formattedAyahText}
      </div>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
        {ayah.translation}
      </p>
    </div>
  );
};