import { useParams, useNavigate } from "react-router-dom";
import { useSurah, useReciters } from "@/services/quranApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SurahHeader } from "@/components/surah/SurahHeader";
import { SurahControls } from "@/components/surah/SurahControls";
import { AyahCard } from "@/components/surah/AyahCard";
import { StorageInfo } from "@/components/audio/StorageInfo";
import { motion, AnimatePresence } from "framer-motion";

const SurahPage = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy");
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingSurah, setIsPlayingSurah] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const surahNumber = Number(number);
  const isValidSurah = !isNaN(surahNumber) && surahNumber >= 1 && surahNumber <= 114;

  const { data: surah, isLoading } = useSurah(isValidSurah ? surahNumber : 1, selectedReciter);
  const { data: reciters } = useReciters();

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

  const handlePlayAyah = useCallback((ayahNumber: number, audioUrl: string) => {
    setIsPlayingSurah(false);
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
  }, [playingAyah]);

  const handlePlaySurah = useCallback(() => {
    if (isPlayingSurah) {
      audioRef.current?.pause();
      setIsPlayingSurah(false);
      setPlayingAyah(null);
    } else {
      setIsPlayingSurah(true);
      setCurrentAyahIndex(0);
      if (surah?.ayahs[0]) {
        audioRef.current!.src = surah.ayahs[0].audio;
        audioRef.current?.play();
        setPlayingAyah(surah.ayahs[0].number);
      }
    }
  }, [isPlayingSurah, surah?.ayahs]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        if (isPlayingSurah && surah?.ayahs) {
          const nextIndex = currentAyahIndex + 1;
          if (nextIndex < surah.ayahs.length) {
            setCurrentAyahIndex(nextIndex);
            audioRef.current!.src = surah.ayahs[nextIndex].audio;
            audioRef.current?.play();
            setPlayingAyah(surah.ayahs[nextIndex].number);
          } else {
            setIsPlayingSurah(false);
            setPlayingAyah(null);
            setCurrentAyahIndex(0);
          }
        } else {
          setPlayingAyah(null);
        }
      };
    }
  }, [currentAyahIndex, isPlayingSurah, surah?.ayahs]);

  useEffect(() => {
    setIsPlayingSurah(false);
    setPlayingAyah(null);
    setCurrentAyahIndex(0);
  }, [selectedReciter]);

  useEffect(() => {
    if (isValidSurah) {
      const stored = localStorage.getItem("recentSurahs");
      const recentSurahs = stored ? JSON.parse(stored) : [];
      const updatedSurahs = [
        surahNumber,
        ...recentSurahs.filter((num: number) => num !== surahNumber),
      ].slice(0, 10);
      localStorage.setItem("recentSurahs", JSON.stringify(updatedSurahs));
    }
  }, [isValidSurah, surahNumber]);

  if (!isValidSurah) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pattern-bg">
        <div className="container max-w-4xl mx-auto py-8 space-y-8">
          <div className="glass-card rounded-xl p-8 animate-pulse">
            <div className="flex justify-center mb-6">
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          {[1, 2, 3].map((index) => (
            <div key={index} className="glass-card rounded-xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-bg">
      <audio 
        ref={audioRef} 
        className="hidden" 
        onPlay={() => console.log("Audio started playing")}
        onError={(e) => console.error("Audio error:", e)}
      />
      <div className="container max-w-4xl mx-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SurahControls
              selectedReciter={selectedReciter}
              setSelectedReciter={setSelectedReciter}
              reciters={reciters || []}
              isPlaying={isPlayingSurah}
              onPlaySurah={handlePlaySurah}
              surahNumber={surahNumber}
              audioUrl={surah?.ayahs[0]?.audio}
              surah={surah}
            />
            <StorageInfo />
            <SurahHeader surah={surah} />
            <div className="space-y-6">
              {surah?.ayahs.map((ayah: any) => (
                <motion.div
                  key={ayah.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AyahCard
                    ayah={ayah}
                    isPlaying={playingAyah === ayah.number}
                    onPlayAyah={() => handlePlayAyah(ayah.number, ayah.audio)}
                    surahNumber={surahNumber}
                    surahName={surah.englishName}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SurahPage;