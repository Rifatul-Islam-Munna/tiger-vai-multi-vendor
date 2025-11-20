"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";

// Sample data - replace with your API
const TRENDING_SEARCHES = [
  "iPhone 15 Pro Max",
  "Samsung Galaxy S24 Ultra",
  "Sony WH-1000XM5",
  "MacBook Pro M3",
  "Apple Watch Series 9",
  "PlayStation 5",
];

const RECOMMENDED_SEARCHES = [
  "Best Smartphone Deals",
  "Trending Fashion",
  "Home Appliances Sale",
  "Beauty & Skincare",
  "Gaming Accessories",
  "Wireless Earbuds",
];

export function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (open) {
      const recent = localStorage.getItem("recentSearches");
      if (recent) {
        try {
          setRecentSearches(JSON.parse(recent));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, [open]);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle search submission
  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate to search page
    router.push(`/search-product?q=${encodeURIComponent(query)}`);
    setOpen(false);
    setSearchQuery("");
  };

  // Handle selection from suggestions
  const handleSelectSuggestion = (suggestion: string) => {
    handleSearch(suggestion);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Remove single recent search
  const removeRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 max-w-[200px] sm:max-w-[300px] md:max-w-2xl  px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors text-left group"
      >
        <Search className="h-4 w-4 text-gray-400 group-hover:text-palette-btn transition-colors" />
        <span className="text-sm text-gray-500 flex-1 truncate">
          Search for products, brands, and more...
        </span>
        <KbdGroup className="hidden sm:flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </button>

      {/* Search Modal */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for products, brands, categories..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              handleSearch(searchQuery);
            }
          }}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-3">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No results found
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Try searching with different keywords
              </p>
              {searchQuery && (
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  size="sm"
                  className="bg-palette-btn hover:bg-palette-btn/90"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search for &quot;{searchQuery}&quot;
                </Button>
              )}
            </div>
          </CommandEmpty>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search, index) => (
                <CommandItem
                  key={`recent-${index}`}
                  onSelect={() => handleSelectSuggestion(search)}
                  className="cursor-pointer group"
                >
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="flex-1">{search}</span>
                  <button
                    onClick={(e) => removeRecentSearch(search, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                  </button>
                </CommandItem>
              ))}
              <CommandItem
                onSelect={clearRecentSearches}
                className="cursor-pointer justify-center text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Clear all recent searches
              </CommandItem>
            </CommandGroup>
          )}

          {/* Recommended Searches */}
          {!searchQuery && (
            <CommandGroup heading="Recommended">
              {RECOMMENDED_SEARCHES.map((suggestion, index) => (
                <CommandItem
                  key={`recommended-${index}`}
                  onSelect={() => handleSelectSuggestion(suggestion)}
                  className="cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{suggestion}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Trending Now */}
          {!searchQuery && (
            <CommandGroup heading="🔥 Trending Now">
              {TRENDING_SEARCHES.map((trending, index) => (
                <CommandItem
                  key={`trending-${index}`}
                  onSelect={() => handleSelectSuggestion(trending)}
                  className="cursor-pointer"
                >
                  <TrendingUp className="mr-2 h-4 w-4 text-palette-btn" />
                  <span>{trending}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>

        {/* Footer with keyboard shortcuts */}
        <div className="border-t bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <KbdGroup>
                  <Kbd>↵</Kbd>
                </KbdGroup>
                <span>to search</span>
              </div>
              <div className="flex items-center gap-1.5">
                <KbdGroup>
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                </KbdGroup>
                <span>to navigate</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Kbd>ESC</Kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
