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
  audio: string;
}

interface Reciter {
  identifier: string;
  name: string;
  englishName: string;
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

export const useReciters = () => {
  return useQuery({
    queryKey: ["reciters"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/edition/format/audio`);
      const data = await response.json();
      return data.data as Reciter[];
    },
  });
};

export const useSurah = (surahNumber: number, reciter: string = "ar.alafasy") => {
  return useQuery({
    queryKey: ["surah", surahNumber, reciter],
    queryFn: async () => {
      const [arabicResponse, translationResponse, audioResponse] = await Promise.all([
        fetch(`${BASE_URL}/surah/${surahNumber}`),
        fetch(`${BASE_URL}/surah/${surahNumber}/en.asad`),
        fetch(`${BASE_URL}/surah/${surahNumber}/${reciter}`),
      ]);
      
      const arabicData = await arabicResponse.json();
      const translationData = await translationResponse.json();
      const audioData = await audioResponse.json();
      
      const ayahs = arabicData.data.ayahs.map((ayah: any, index: number) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: translationData.data.ayahs[index].text,
        audio: audioData.data.ayahs[index].audio,
      }));
      
      return {
        ...arabicData.data,
        ayahs,
      };
    },
  });
};