import { useState } from "react";
import { Link } from "react-router-dom";
import { useSurahs } from "@/services/quranApi";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Book, ScrollText } from "lucide-react";

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
      <div className="container py-12 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Book className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold text-primary mb-4">
            The Noble Quran
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Begin your spiritual journey with an enhanced digital Quran reading experience. 
            Browse through all 114 surahs with beautiful typography and easy navigation.
          </p>
        </div>
        
        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search Surah by name or meaning..."
            className="pl-10 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading &&
            Array.from({ length: 9 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-40 rounded-xl"
              />
            ))}

          {filteredSurahs?.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className="group block p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary font-semibold">
                  {surah.number}
                </div>
                <div className="text-right">
                  <h2 className="arabic-text text-2xl text-primary mb-1 group-hover:scale-105 transition-transform">
                    {surah.name}
                  </h2>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {surah.englishName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {surah.englishNameTranslation}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-3 space-x-2">
                  <ScrollText className="w-4 h-4" />
                  <span>{surah.numberOfAyahs} verses</span>
                  <span className="px-2">•</span>
                  <span className="capitalize">{surah.revelationType}</span>
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