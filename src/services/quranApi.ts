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

const fetchWithCache = async (url: string) => {
  const cacheKey = `quran_api_${url}`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }

  const response = await fetch(url);
  const data = await response.json();
  
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

export const useSurahs = () => {
  return useQuery({
    queryKey: ["surahs"],
    queryFn: async () => {
      const data = await fetchWithCache(`${BASE_URL}/surah`);
      return data.data as Surah[];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useReciters = () => {
  return useQuery({
    queryKey: ["reciters"],
    queryFn: async () => {
      const data = await fetchWithCache(`${BASE_URL}/edition/format/audio`);
      return data.data as Reciter[];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useSurah = (surahNumber: number, reciter: string = "ar.alafasy") => {
  return useQuery({
    queryKey: ["surah", surahNumber, reciter],
    queryFn: async () => {
      const [arabicData, translationData, audioData] = await Promise.all([
        fetchWithCache(`${BASE_URL}/surah/${surahNumber}`),
        fetchWithCache(`${BASE_URL}/surah/${surahNumber}/en.asad`),
        fetchWithCache(`${BASE_URL}/surah/${surahNumber}/${reciter}`),
      ]);
      
      const ayahs = arabicData.data.ayahs.map((ayah: any, index: number) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: translationData.data.ayahs[index].text,
        audio: audioData.data.ayahs[index].audio,
        reciter,
      }));
      
      return {
        ...arabicData.data,
        ayahs,
      };
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};