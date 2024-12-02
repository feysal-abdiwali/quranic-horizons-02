import { useBookmarks } from "@/hooks/useBookmarks";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Trash2 } from "lucide-react";

const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Surahs
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">Your Bookmarks</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {bookmarks.length === 0 
              ? "You haven't bookmarked any verses yet." 
              : `You have ${bookmarks.length} bookmarked verse${bookmarks.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`} className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <Link 
                  to={`/surah/${bookmark.surahNumber}`}
                  className="text-primary hover:underline"
                >
                  {bookmark.surahName} - Verse {bookmark.ayahNumber}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="arabic-text text-xl leading-loose text-right mb-4">
                {bookmark.ayahText}
              </p>
              <p className="text-xs text-gray-500">
                Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;