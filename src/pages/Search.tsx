import { useState } from "react";
import { Link } from "react-router-dom";
import { useSurahs } from "@/services/quranApi";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const { data: surahs } = useSurahs();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurahs = surahs?.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.name.includes(searchQuery)
  );

  return (
    <div className="min-h-screen pattern-bg pt-24">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by Surah name in English or Arabic..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredSurahs?.map((surah) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;