import { useParams, Link, useNavigate } from "react-router-dom";
import { useSurah } from "@/services/quranApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const SurahPage = () => {
  const { number } = useParams();
  const [translation, setTranslation] = useState("en.asad");
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const { data: surah, isLoading } = useSurah(isValidSurah ? surahNumber : 1);

  if (!isValidSurah) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-48 mb-8" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-32 mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Surahs
            </Button>
          </Link>
          <LanguageSelect value={translation} onChange={setTranslation} />
        </div>

        <div className="text-center mb-8">
          <h1 className="arabic-text text-4xl text-primary mb-2">
            {surah?.name}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {surah?.englishName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{surah?.englishNameTranslation}</p>
        </div>

        <div className="space-y-8">
          {surah?.ayahs.map((ayah) => (
            <div
              key={ayah.number}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full text-primary font-semibold">
                  {ayah.numberInSurah}
                </div>
              </div>
              <p className="arabic-text text-2xl leading-loose text-right mb-4">
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