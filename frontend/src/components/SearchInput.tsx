import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  name: string;
  image?: string;
}

interface SearchInputProps {
  label: string;
  value: string;
  onChange: (value: string, id?: string) => void;
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
}

export default function SearchInput({
  label,
  value,
  onChange,
  onSearch,
  placeholder,
}: SearchInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange(newQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (newQuery.length >= 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        const searchResults = await onSearch(newQuery);
        setResults(searchResults);
        setIsOpen(true);
        setIsLoading(false);
      }, 250);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.name);
    onChange(result.name, result.id);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          display: "block",
          color: "#E50914",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "14px 16px",
            paddingRight: 44,
            background: "linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            outline: "none",
            transition: "all 0.3s ease",
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(229, 9, 20, 0.5)";
            e.currentTarget.style.boxShadow =
              "inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(229, 9, 20, 0.1)";
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.boxShadow =
                "inset 0 2px 4px rgba(0, 0, 0, 0.3)";
            }
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "#E50914";
            e.currentTarget.style.boxShadow =
              "inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 30px rgba(229, 9, 20, 0.2)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow =
              "inset 0 2px 4px rgba(0, 0, 0, 0.3)";
          }}
        />

        {/* Search icon / Loading spinner */}
        <div
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: isLoading ? "#E50914" : "#666",
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: 18, height: 18 }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            </motion.div>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          )}
        </div>
      </div>

      {/* Dropdown results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: 4,
              background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
              overflow: "hidden",
              zIndex: 100,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
            }}
          >
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(result)}
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  borderBottom:
                    index < results.length - 1
                      ? "1px solid rgba(255, 255, 255, 0.05)"
                      : "none",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(229, 9, 20, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: result.image
                      ? `url(${result.image}) center/cover`
                      : "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {!result.image && "🎭"}
                </div>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
                  {result.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
