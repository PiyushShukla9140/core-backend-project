import { Loader2 } from "lucide-react";

import SearchSuggestionItem from "./searchSuggestionItem";

interface SearchSuggestionsProps {
  isOpen: boolean;
  isLoading: boolean;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

function SearchSuggestions({
  isOpen,
  isLoading,
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  if (!isOpen) return null;

  return (
    <div
      className="
        absolute
        left-0
        top-full
        z-50
        mt-2
        w-full
        overflow-hidden
        rounded-xl
        border
        bg-background
        shadow-lg
      "
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((suggestion) => (
            <SearchSuggestionItem
              key={suggestion}
              suggestion={suggestion}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No suggestions found
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;