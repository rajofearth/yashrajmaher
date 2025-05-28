import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({ placeholder = "Search posts", onChange }) {
  return (
    <div className="px-4 py-3">
      <div className="relative h-12">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={24} />
        </div>
        <Input
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-full pl-12 w-full rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground text-base font-normal"
        />
      </div>
    </div>
  );
} 