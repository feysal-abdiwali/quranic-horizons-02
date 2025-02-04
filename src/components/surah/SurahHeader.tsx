import { Book } from "lucide-react";

interface SurahHeaderProps {
  surah: any;
}

export const SurahHeader = ({ surah }: SurahHeaderProps) => (
  <div className="glass-card text-center mb-12 p-4 sm:p-8 rounded-xl animate-fade-in">
    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-premium-gradient flex items-center justify-center shadow-lg">
      <Book className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
    </div>
    <h1 className="arabic-text text-3xl sm:text-4xl text-primary mb-3 sm:mb-4">{surah?.name}</h1>
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
      {surah?.englishName}
    </h2>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">{surah?.englishNameTranslation}</p>
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
      <span className="px-3 sm:px-4 py-1 rounded-full bg-premium-gradient text-white shadow-md">
        {surah?.numberOfAyahs} verses
      </span>
      <span className="px-3 sm:px-4 py-1 rounded-full bg-premium-gradient text-white shadow-md capitalize">
        {surah?.revelationType}
      </span>
    </div>
  </div>
);