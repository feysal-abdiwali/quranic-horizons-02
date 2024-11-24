import { Link, useLocation } from "react-router-dom";
import { Home, Search, Clock, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Quranic Horizons</SheetTitle>
                <SheetDescription>
                  Navigate through the Holy Quran
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                <Link to="/" className="block p-2 hover:bg-primary/10 rounded-md">
                  Home
                </Link>
                <Link to="/search" className="block p-2 hover:bg-primary/10 rounded-md">
                  Search
                </Link>
                <Link to="/recent" className="block p-2 hover:bg-primary/10 rounded-md">
                  Recently Viewed
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="text-xl font-bold text-primary">
            Quranic Horizons
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center gap-6">
          <Link
            to="/"
            className={`flex items-center gap-2 hover:text-primary transition-colors ${
              isHome ? "text-primary" : ""
            }`}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Link
            to="/recent"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Clock className="h-4 w-4" />
            Recently Viewed
          </Link>
        </div>
        
        <ThemeToggle />
      </div>
    </nav>
  );
};