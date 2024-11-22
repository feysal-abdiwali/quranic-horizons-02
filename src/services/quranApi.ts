import { useQuery } from "@tanstack/react-query";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  translation: string;
}

const BASE_URL = "https://api.alquran.cloud/v1";

export const useSurahs = () => {
  return useQuery({
    queryKey: ["surahs"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/surah`);
      const data = await response.json();
      return data.data as Surah[];
    },
  });
};

export const useSurah = (surahNumber: number) => {
  return useQuery({
    queryKey: ["surah", surahNumber],
    queryFn: async () => {
      const [arabicResponse, translationResponse] = await Promise.all([
        fetch(`${BASE_URL}/surah/${surahNumber}`),
        fetch(`${BASE_URL}/surah/${surahNumber}/en.asad`),
      ]);
      
      const arabicData = await arabicResponse.json();
      const translationData = await translationResponse.json();
      
      const ayahs = arabicData.data.ayahs.map((ayah: any, index: number) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: translationData.data.ayahs[index].text,
      }));
      
      return {
        ...arabicData.data,
        ayahs,
      };
    },
  });
};