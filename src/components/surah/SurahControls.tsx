import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Volume2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DownloadManager } from "../audio/DownloadManager";

interface SurahControlsProps {
  selectedReciter: string;
  setSelectedReciter: (value: string) => void;
  reciters: any[];
  isPlaying: boolean;
  onPlaySurah: () => void;
  surahNumber: number;
  audioUrl?: string;
}

export const SurahControls = ({
  selectedReciter,
  setSelectedReciter,
  reciters,
  isPlaying,
  onPlaySurah,
  surahNumber,
  audioUrl,
}: SurahControlsProps) => (
  <div className="sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b py-4 mb-8 animate-fade-in">
    <div className="container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <Link to="/">
        <Button variant="ghost" className="hover:bg-primary/10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Surahs
        </Button>
      </Link>
      <div className="flex flex-wrap items-center gap-4">
        <Button 
          variant="outline" 
          className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={onPlaySurah}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "Pause Surah" : "Play Surah"}
        </Button>
        {audioUrl && (
          <DownloadManager
            surahNumber={surahNumber}
            audioUrl={audioUrl}
            reciter={selectedReciter}
          />
        )}
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-primary" />
          <Select value={selectedReciter} onValueChange={setSelectedReciter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Reciter" />
            </SelectTrigger>
            <SelectContent>
              {reciters?.map((reciter) => (
                <SelectItem key={reciter.identifier} value={reciter.identifier}>
                  {reciter.englishName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
);