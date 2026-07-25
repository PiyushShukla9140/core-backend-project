import { Search } from "lucide-react";

interface SearchSuggestionItemProps {
  suggestion: string;
  onSelect: (suggestion: string) => void;
}

function SearchSuggestionItem({
  suggestion,
  onSelect,
}: SearchSuggestionItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(suggestion)}
      className="
        flex
        w-full
        items-center
        gap-3
        px-4
        py-3
        text-left
        transition-colors
        hover:bg-muted
      "
    >
      <Search className="h-4 w-4 text-muted-foreground" />

      <span className="truncate">
        {suggestion}
      </span>
    </button>
  );
}

export default SearchSuggestionItem;