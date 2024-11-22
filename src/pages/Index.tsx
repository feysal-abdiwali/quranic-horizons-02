import { useState } from "react";
import { Link } from "react-router-dom";
import { useSurahs } from "@/services/quranApi";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const Index = () => {
  const { data: surahs, isLoading } = useSurahs();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurahs = surahs?.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container py-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          The Noble Quran
        </h1>
        
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search Surah..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-32 rounded-lg"
              />
            ))}

          {filteredSurahs?.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className="block p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full text-primary font-semibold">
                  {surah.number}
                </div>
                <div className="text-right">
                  <h2 className="arabic-text text-2xl text-primary mb-1">
                    {surah.name}
                  </h2>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">
                  {surah.englishName}
                </h3>
                <p className="text-sm text-gray-600">
                  {surah.englishNameTranslation}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  {surah.numberOfAyahs} verses • {surah.revelationType}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;