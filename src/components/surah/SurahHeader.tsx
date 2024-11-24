import { Book } from "lucide-react";

interface SurahHeaderProps {
  surah: any;
}

export const SurahHeader = ({ surah }: SurahHeaderProps) => (
  <div className="text-center mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-md animate-fade-in">
    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
      <Book className="w-8 h-8 text-primary" />
    </div>
    <h1 className="arabic-text text-4xl text-primary mb-4">{surah?.name}</h1>
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
      {surah?.englishName}
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mb-6">{surah?.englishNameTranslation}</p>
    <div className="flex items-center justify-center gap-6 text-sm">
      <span className="px-4 py-1 rounded-full bg-primary/10 text-primary">
        {surah?.numberOfAyahs} verses
      </span>
      <span className="px-4 py-1 rounded-full bg-primary/10 text-primary capitalize">
        {surah?.revelationType}
      </span>
    </div>
  </div>
);