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

// Primary and fallback API endpoints
const API_ENDPOINTS = {
  PRIMARY: "https://api.alquran.cloud/v1",
  FALLBACK: "https://quran-api.azurewebsites.net/api/v1"
};

const validateAyahData = (ayah: any): boolean => {
  return (
    typeof ayah.number === 'number' &&
    typeof ayah.text === 'string' &&
    ayah.text.trim().length > 0 &&
    typeof ayah.numberInSurah === 'number' &&
    typeof ayah.translation === 'string'
  );
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      // Exponential backoff
      await delay(baseDelay * Math.pow(2, i));
    }
  }
  
  throw lastError;
};

const fetchWithCache = async (url: string) => {
  const cacheKey = `quran_api_${url}`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }

  try {
    // Try primary endpoint
    const data = await fetchWithRetry(url);
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (primaryError) {
    console.error("Primary API failed:", primaryError);
    
    // Try fallback endpoint
    const fallbackUrl = url.replace(API_ENDPOINTS.PRIMARY, API_ENDPOINTS.FALLBACK);
    try {
      const fallbackData = await fetchWithRetry(fallbackUrl);
      sessionStorage.setItem(cacheKey, JSON.stringify(fallbackData));
      return fallbackData;
    } catch (fallbackError) {
      console.error("Fallback API failed:", fallbackError);
      throw new Error("All API endpoints failed");
    }
  }
};

export const useSurahs = () => {
  return useQuery({
    queryKey: ["surahs"],
    queryFn: async () => {
      const data = await fetchWithCache(`${API_ENDPOINTS.PRIMARY}/surah`);
      if (!Array.isArray(data.data)) {
        throw new Error('Invalid surahs data format');
      }
      return data.data as Surah[];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 3,
  });
};

export const useReciters = () => {
  return useQuery({
    queryKey: ["reciters"],
    queryFn: async () => {
      const data = await fetchWithCache(`${API_ENDPOINTS.PRIMARY}/edition/format/audio`);
      if (!Array.isArray(data.data)) {
        throw new Error('Invalid reciters data format');
      }
      return data.data as Reciter[];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 3,
  });
};

export const useSurah = (surahNumber: number, reciter: string = "ar.alafasy") => {
  return useQuery({
    queryKey: ["surah", surahNumber, reciter],
    queryFn: async () => {
      if (surahNumber < 1 || surahNumber > 114) {
        throw new Error('Invalid surah number');
      }

      const [arabicData, translationData, audioData] = await Promise.all([
        fetchWithCache(`${API_ENDPOINTS.PRIMARY}/surah/${surahNumber}`),
        fetchWithCache(`${API_ENDPOINTS.PRIMARY}/surah/${surahNumber}/en.asad`),
        fetchWithCache(`${API_ENDPOINTS.PRIMARY}/surah/${surahNumber}/${reciter}`),
      ]);
      
      if (!Array.isArray(arabicData.data.ayahs) || 
          !Array.isArray(translationData.data.ayahs) || 
          !Array.isArray(audioData.data.ayahs)) {
        throw new Error('Invalid ayahs data format');
      }

      if (arabicData.data.ayahs.length !== translationData.data.ayahs.length ||
          arabicData.data.ayahs.length !== audioData.data.ayahs.length) {
        throw new Error('Mismatched ayahs count between Arabic text and translation');
      }
      
      const ayahs = arabicData.data.ayahs.map((ayah: any, index: number) => {
        const mappedAyah = {
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          translation: translationData.data.ayahs[index].text,
          audio: audioData.data.ayahs[index].audio,
          reciter,
        };

        if (!validateAyahData(mappedAyah)) {
          console.error('Invalid ayah data:', mappedAyah);
          throw new Error(`Invalid ayah data at index ${index}`);
        }

        return mappedAyah;
      });
      
      return {
        ...arabicData.data,
        ayahs,
      };
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching surah:', error);
      },
    },
  });
};