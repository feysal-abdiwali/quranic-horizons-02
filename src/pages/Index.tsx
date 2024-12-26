import { useState } from "react";
import { Link } from "react-router-dom";
import { useSurahs } from "@/services/quranApi";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Book, ScrollText, Keyboard } from "lucide-react";
import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { useToast } from "@/components/ui/use-toast";
import { SurahCard } from "@/components/surah/SurahCard";

const Index = () => {
  const { data: surahs, isLoading } = useSurahs();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
    toast({
      title: "Keyboard Shortcut",
      description: "Use '/' to quickly search surahs",
    });
  });

  useHotkeys('/', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });

  const filteredSurahs = surahs?.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen pattern-bg">
      <div className="container py-6 sm:py-8 md:py-12 animate-fade-in px-4 sm:px-6">
        <motion.header 
          className="max-w-3xl mx-auto text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Book className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-primary" aria-hidden="true" />
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3 sm:mb-4">
            The Noble Quran
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Begin your spiritual journey with an enhanced digital Quran reading experience. 
            Browse through all 114 surahs with beautiful typography and easy navigation.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Keyboard className="h-4 w-4" />
            <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">/</kbd> to search</span>
          </div>
        </motion.header>
        
        <nav className="relative max-w-md mx-auto mb-8 sm:mb-12" role="search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search Surah by name or meaning..."
            className="pl-10 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 h-12 text-base sm:text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Surahs"
          />
        </nav>

        <section 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
          aria-label="Surah List"
        >
          {isLoading &&
            Array.from({ length: 9 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-40 rounded-xl"
              />
            ))}

          {filteredSurahs?.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Index;