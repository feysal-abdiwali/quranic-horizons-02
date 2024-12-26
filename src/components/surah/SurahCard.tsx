import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";
import { motion } from "framer-motion";

interface SurahCardProps {
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
}

export const SurahCard = ({ surah }: SurahCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group touch-manipulation"
    >
      <Link
        to={`/surah/${surah.number}`}
        className="block p-4 sm:p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label={`Surah ${surah.englishName} - ${surah.englishNameTranslation}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary font-semibold text-sm sm:text-base">
            {surah.number}
          </div>
          <div className="text-right flex-grow">
            <h2 className="arabic-text text-xl sm:text-2xl text-primary mb-1 group-hover:scale-105 transition-transform leading-normal">
              {surah.name}
            </h2>
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
            {surah.englishName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {surah.englishNameTranslation}
          </p>
          <div className="flex items-center text-xs text-gray-500 mt-2 sm:mt-3 space-x-2">
            <ScrollText className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span>{surah.numberOfAyahs} verses</span>
            <span className="px-2" aria-hidden="true">•</span>
            <span className="capitalize">{surah.revelationType}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};