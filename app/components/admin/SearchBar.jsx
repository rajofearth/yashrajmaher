import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({ placeholder = "Search posts", onChange }) {
  return (
    <div className="px-3 sm:px-4 py-2 sm:py-3">
      <div className="relative h-10 sm:h-12">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <Input
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-full pl-11 sm:pl-14 w-full rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base font-normal"
        />
      </div>
    </div>
  );
} 