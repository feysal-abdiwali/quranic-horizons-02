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
  <div className="flex justify-between items-center mb-8">
    <Link to="/">
      <Button variant="ghost" className="hover:bg-white/20">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Surahs
      </Button>
    </Link>
    <div className="flex items-center gap-4">
      <Button variant="outline" className="gap-2" onClick={onPlaySurah}>
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
);