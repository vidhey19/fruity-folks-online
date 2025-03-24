
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { SearchResult, searchProducts } from "../data/products";

interface SearchWithSuggestionsProps {
  onClose?: () => void;
  placeholder?: string;
  maxSuggestions?: number;
}

const SearchWithSuggestions = ({ 
  onClose, 
  placeholder = "Search for products...",
  maxSuggestions = 5
}: SearchWithSuggestionsProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-focus the input when component mounts
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchProducts(query);
      setResults(searchResults.slice(0, maxSuggestions));
      setShowSuggestions(true);
    } else {
      setResults([]);
      setShowSuggestions(false);
    }
  }, [query, maxSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      if (onClose) onClose();
    }
  };

  const handleSuggestionClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    if (onClose) onClose();
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center">
        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none pl-12 pr-12 py-3 outline-none focus:ring-0 text-foreground"
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
        />
        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        ) : null}
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
        >
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && results.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md overflow-hidden z-50"
        >
          <div className="max-h-80 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center p-3 hover:bg-muted cursor-pointer border-b border-border/20 last:border-0"
                onClick={() => handleSuggestionClick(result.id)}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                  <img 
                    src={result.image} 
                    alt={result.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-sm">{result.name}</h4>
                  <p className="text-xs text-muted-foreground">${result.salePrice || result.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;
