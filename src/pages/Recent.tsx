import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSurahs } from "@/services/quranApi";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Recent = () => {
  const { data: surahs } = useSurahs();
  const [recentSurahs, setRecentSurahs] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("recentSurahs");
    if (stored) {
      setRecentSurahs(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("recentSurahs");
    setRecentSurahs([]);
    toast({
      title: "History Cleared",
      description: "Your recently viewed Surahs have been cleared.",
    });
  };

  return (
    <div className="min-h-screen pattern-bg pt-24">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Recently Viewed Surahs</h1>
          {recentSurahs.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={clearHistory}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          )}
        </div>

        {recentSurahs.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No recently viewed Surahs
          </div>
        ) : (
          <div className="grid gap-4">
            {recentSurahs.map((surahNumber) => {
              const surah = surahs?.find((s) => s.number === surahNumber);
              if (!surah) return null;

              return (
                <Link
                  key={surah.number}
                  to={`/surah/${surah.number}`}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary font-semibold">
                        {surah.number}
                      </div>
                      <div>
                        <h2 className="font-semibold">{surah.englishName}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {surah.englishNameTranslation}
                        </p>
                      </div>
                    </div>
                    <p className="arabic-text text-xl">{surah.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recent;