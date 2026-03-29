import { useState, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchLocations } from "@/lib/api";

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    async (value) => {
      setQuery(value);
      if (value.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      setLoading(true);
      try {
        const locations = await searchLocations(value);
        setResults(locations);
        setIsOpen(locations.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSelect = (loc) => {
    onSelect(loc);
    setQuery(`${loc.city}, ${loc.country}`);
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="glass-card flex items-center gap-2 px-4 py-2.5">
        {loading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" style={{ color: "hsl(var(--muted-foreground))" }} />
        ) : (
          <Search className="h-4 w-4 shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search city..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
          style={{ color: "hsl(var(--foreground))" }}
        />
      </div>

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border"
          style={{
            background: "rgba(30, 30, 47, 0.95)",
            backdropFilter: "blur(16px)",
            borderColor: "var(--surface-border)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          }}
        >
          {results.map((loc, idx) => (
            <button
              key={`${loc.latitude}-${loc.longitude}-${idx}`}
              onClick={() => handleSelect(loc)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors"
              style={{ color: "hsl(var(--foreground))" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <MapPin className="h-4 w-4 shrink-0" style={{ color: "var(--neon-cyan)" }} />
              <span>
                <span className="font-medium">{loc.city}</span>
                <span className="ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {loc.country}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
