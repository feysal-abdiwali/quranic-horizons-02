import { useParams, Link, useNavigate } from "react-router-dom";
import { useSurah, useReciters } from "@/services/quranApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Book, Play, Pause, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SurahPage = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy");
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Validate surah number
  const surahNumber = Number(number);
  const isValidSurah = !isNaN(surahNumber) && surahNumber >= 1 && surahNumber <= 114;

  useEffect(() => {
    if (!isValidSurah) {
      toast({
        variant: "destructive",
        title: "Invalid Surah",
        description: "Please select a valid Surah (1-114)",
      });
      navigate("/");
    }
  }, [isValidSurah, navigate, toast]);

  const { data: surah, isLoading } = useSurah(isValidSurah ? surahNumber : 1, selectedReciter);
  const { data: reciters } = useReciters();

  const handlePlayAyah = (ayahNumber: number, audioUrl: string) => {
    if (playingAyah === ayahNumber) {
      audioRef.current?.pause();
      setPlayingAyah(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingAyah(ayahNumber);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setPlayingAyah(null);
      };
    }
  }, []);

  if (!isValidSurah) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Skeleton className="h-12 w-48 mb-8" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-32 mb-4 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-bg">
      <audio ref={audioRef} className="hidden" />
      <div className="container max-w-4xl mx-auto py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost" className="hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Surahs
            </Button>
          </Link>
          <div className="flex items-center gap-4">
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

        <div className="text-center mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-md">
          <Book className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="arabic-text text-4xl text-primary mb-3">
            {surah?.name}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {surah?.englishName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{surah?.englishNameTranslation}</p>
          <div className="flex items-center justify-center text-sm text-gray-500 mt-4 space-x-4">
            <span>{surah?.numberOfAyahs} verses</span>
            <span>•</span>
            <span className="capitalize">{surah?.revelationType}</span>
          </div>
        </div>

        <div className="space-y-6">
          {surah?.ayahs.map((ayah) => (
            <div
              key={ayah.number}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full text-primary font-semibold">
                  {ayah.numberInSurah}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10"
                  onClick={() => handlePlayAyah(ayah.number, ayah.audio)}
                >
                  {playingAyah === ayah.number ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="arabic-text text-2xl leading-loose text-right mb-6">
                {ayah.text}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {ayah.translation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurahPage;