import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <form
      className="hidden flex-1 items-center justify-center px-8 md:flex"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex w-full max-w-2xl">
        <Input
          type="text"
          placeholder="Search videos..."
          className="h-10 rounded-r-none"
        />

        <Button
          type="submit"
          variant="outline"
          className="h-10 rounded-l-none border-l-0 px-5"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}

export default SearchBar;