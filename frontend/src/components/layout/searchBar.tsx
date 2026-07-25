import { useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchSuggestions from "@/components/layout/searchSuggestion"

function SearchBar() {
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading] = useState(false);

  const [suggestions] = useState([
    "React Tutorial",
    "Redux Toolkit",
    "Next.js Authentication",
    "MERN Stack Project",
    "Node.js Crash Course",
    "MongoDB Aggregation",
    "Tailwind CSS",
  ]);

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  function handleSearch() {
    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);

    setIsOpen(false);
  }

  function handleSuggestionClick(suggestion: string) {
    setQuery(suggestion);
    setIsOpen(false);

    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  }

  function clearSearch() {
    setQuery("");
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape
      );
  }, []);

  return (
    <div
      ref={searchRef}
      className="relative w-full max-w-2xl"
    >
      {/* Search Input */}
      <div className="flex">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search videos..."
          className="rounded-r-none border-r-0 pr-10 focus-visible:ring-1"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-16 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <Button
          onClick={handleSearch}
          variant="outline"
          className="rounded-l-none"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Suggestions */}
      <SearchSuggestions
        isOpen={isOpen}
        isLoading={isLoading}
        suggestions={filteredSuggestions}
        onSelect={handleSuggestionClick}
      />
    </div>
  );
}

export default SearchBar;