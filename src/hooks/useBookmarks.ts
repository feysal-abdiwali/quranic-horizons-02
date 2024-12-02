import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface Bookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  timestamp: number;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('quran_bookmarks');
    if (stored) {
      setBookmarks(JSON.parse(stored));
    }
  }, []);

  const addBookmark = (bookmark: Omit<Bookmark, 'timestamp'>) => {
    const newBookmark = { ...bookmark, timestamp: Date.now() };
    setBookmarks(prev => {
      const exists = prev.some(b => 
        b.surahNumber === bookmark.surahNumber && 
        b.ayahNumber === bookmark.ayahNumber
      );
      
      if (exists) {
        toast({
          description: "This verse is already bookmarked",
        });
        return prev;
      }

      const updated = [...prev, newBookmark];
      localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
      toast({
        description: "Bookmark added successfully",
      });
      return updated;
    });
  };

  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    setBookmarks(prev => {
      const updated = prev.filter(b => 
        !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
      );
      localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
      toast({
        description: "Bookmark removed successfully",
      });
      return updated;
    });
  };

  const isBookmarked = (surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(b => 
      b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
};