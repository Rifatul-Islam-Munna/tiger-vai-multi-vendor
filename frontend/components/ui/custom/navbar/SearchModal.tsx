"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, Clock, X } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Sub-Component: Search List Content ---
interface SearchListProps {
  isDesktop: boolean;
  recentSearches: string[];
  searchQuery: string;
  handleSearch: (q: string) => void;
  removeRecentSearch: (q: string, e: React.MouseEvent) => void;
  clearRecentSearches: () => void;
}

const SearchContentList = ({
  isDesktop,
  recentSearches,
  searchQuery,
  handleSearch,
  removeRecentSearch,
  clearRecentSearches,
}: SearchListProps) => {
  return (
    <CommandList
      className={cn(!isDesktop && "max-h-[calc(100vh-120px)] pb-10")}
    >
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
              className="bg-[var(--palette-btn)] hover:opacity-90"
            >
              Search for {searchQuery}
            </Button>
          )}
        </div>
      </CommandEmpty>

      {recentSearches.length > 0 && (
        <CommandGroup heading="Recent Searches">
          {recentSearches.map((search, index) => (
            <CommandItem
              key={`recent-${index}`}
              onSelect={() => handleSearch(search)}
              className="cursor-pointer group flex items-center justify-between py-3"
            >
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <span>{search}</span>
              </div>
              <button
                onClick={(e) => removeRecentSearch(search, e)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
              </button>
            </CommandItem>
          ))}
          <CommandItem
            onSelect={clearRecentSearches}
            className="cursor-pointer justify-center text-xs text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
          >
            Clear all recent searches
          </CommandItem>
        </CommandGroup>
      )}

      {recentSearches.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="rounded-full bg-gray-100 p-4 mb-3">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            No recent searches
          </p>
          <p className="text-xs text-gray-500">
            Your search history will appear here
          </p>
        </div>
      )}
    </CommandList>
  );
};

export function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"results" | "recent">("results");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isDesktop, setIsDesktop] = useState(true);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDesktop = () =>
      setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Load recent searches
  useEffect(() => {
    if (open || mobilePanelOpen) {
      queueMicrotask(() => {
        const recent = localStorage.getItem("recentSearches");
        if (recent) {
          try {
            setRecentSearches(JSON.parse(recent));
          } catch {
            setRecentSearches([]);
          }
        }
      });
    }
  }, [open, mobilePanelOpen]);

  useEffect(() => {
    if (isDesktop || !mobilePanelOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setMobilePanelOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isDesktop, mobilePanelOpen]);

  // Keyboard shortcut
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

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    router.push(`/search-product?q=${encodeURIComponent(query)}`);
    setOpen(false);
    setMobilePanelOpen(false);
    setSearchQuery("");
  };

  const removeRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const listProps = {
    isDesktop,
    recentSearches,
    searchQuery,
    handleSearch,
    removeRecentSearch,
    clearRecentSearches,
  };

  return (
    <>
      {/* Trigger Button */}
      {isDesktop ? (
        // Desktop: Search Icon Button
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="relative h-9 w-9  bg-palette-btn/5 rounded-full hover:bg-gray-100"
        >
          <Search className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Search</span>
        </Button>
      ) : (
        <div
          ref={mobileSearchRef}
          className="relative w-full min-w-0 max-w-full lg:hidden"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch(searchQuery);
            }}
            className="flex w-full min-w-0 items-center gap-2 rounded-full border border-gray-200 bg-white pl-3 text-left transition-colors group focus-within:border-[var(--palette-btn)] focus-within:shadow-sm sm:gap-3 sm:pl-4"
          >
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setMobileTab("results");
                setMobilePanelOpen(true);
              }}
              onFocus={() => setMobilePanelOpen(true)}
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-500 sm:text-sm"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gray-950 p-3 transition active:scale-95"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-white transition-colors" />
            </button>
          </form>

          {mobilePanelOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 w-full max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="grid grid-cols-2 border-b border-gray-100 bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setMobileTab("results")}
                  className={cn(
                    "min-w-0 rounded-xl px-2 py-2 text-xs font-semibold transition sm:px-3",
                    mobileTab === "results"
                      ? "bg-white text-[var(--palette-btn)] shadow-sm"
                      : "text-gray-500",
                  )}
                >
                  Search Result
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab("recent")}
                  className={cn(
                    "min-w-0 rounded-xl px-2 py-2 text-xs font-semibold transition sm:px-3",
                    mobileTab === "recent"
                      ? "bg-white text-[var(--palette-btn)] shadow-sm"
                      : "text-gray-500",
                  )}
                >
                  Recent Search
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {mobileTab === "results" && (
                  <div>
                    {searchQuery.trim() ? (
                      <button
                        type="button"
                        onClick={() => handleSearch(searchQuery)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-gray-50"
                      >
                        <div className="rounded-full bg-[var(--palette-btn)]/10 p-2">
                          <Search className="h-4 w-4 text-[var(--palette-btn)]" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            Search for {searchQuery}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            Products, brands, categories
                          </p>
                        </div>
                      </button>
                    ) : (
                      <div className="px-4 py-2 text-center">
                        <Search className="mx-auto mb-3 h-5 w-5 text-gray-300" />
                        <p className="text-xs font-semibold text-gray-900">
                          Type to search
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {mobileTab === "recent" && (
                  <div>
                    {recentSearches.length > 0 ? (
                      <>
                        {recentSearches.map((search, index) => (
                          <div
                            key={`mobile-recent-${index}`}
                            className="flex items-center gap-2 rounded-xl hover:bg-gray-50"
                          >
                            <button
                              type="button"
                              onClick={() => handleSearch(search)}
                              className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left text-sm"
                            >
                              <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                              <span className="truncate">{search}</span>
                            </button>
                            <button
                              type="button"
                              onClick={(event) =>
                                removeRecentSearch(search, event)
                              }
                              className="mr-2 rounded-full p-1 hover:bg-gray-100"
                              aria-label={`Remove ${search}`}
                            >
                              <X className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          className="mt-1 w-full rounded-xl px-3 py-2 text-center text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                          Clear all recent searches
                        </button>
                      </>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Clock className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                        <p className="text-sm font-semibold text-gray-900">
                          No recent searches
                        </p>
                        <p className="text-xs text-gray-500">
                          Your search history will appear here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {isDesktop ? (
        /* --- DESKTOP: Command Dialog --- */
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
          />
          <SearchContentList {...listProps} />
          <div className="border-t bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Search for anything...</span>
              <div className="flex items-center gap-2">
                <Kbd>ESC</Kbd> to close
              </div>
            </div>
          </div>
        </CommandDialog>
      ) : null}
    </>
  );
}
