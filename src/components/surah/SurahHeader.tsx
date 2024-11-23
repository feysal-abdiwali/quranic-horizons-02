import { Book } from "lucide-react";

interface SurahHeaderProps {
  surah: any;
}

export const SurahHeader = ({ surah }: SurahHeaderProps) => (
  <div className="text-center mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-md">
    <Book className="w-12 h-12 mx-auto mb-4 text-primary" />
    <h1 className="arabic-text text-4xl text-primary mb-3">{surah?.name}</h1>
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
);