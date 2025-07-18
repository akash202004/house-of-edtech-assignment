import React, { useState } from "react";
import { mutualFundsApi } from "../utils/api";
import SearchBar from "../components/SearchBar";
import FundCard from "../components/FundCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import type { MutualFund } from "../types";

const Landing: React.FC = () => {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await mutualFundsApi.searchFunds(query);
      setFunds(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setFunds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setFunds([]);
    setHasSearched(false);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setHasSearched(false);
    setFunds([]);
  };

  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="text-center space-y-8 py-12">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Mutual Fund Tracker
            </h1>
          </div>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
          Discover, track, and manage your mutual fund investments with
          real-time data, personalized insights, and premium analytics in our
          sleek dark interface.
        </p>
      </div>

      {/* Search bar */}
      <div className="space-y-8 z-10 pb-40">
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={loading}
        />

        {!hasSearched && (
          <div className="text-center space-y-6">
            <p className="text-gray-400 text-lg">
              Start by searching for mutual funds above
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["SBI", "HDFC", "ICICI", "Axis", "Kotak"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="px-6 py-3 bg-black border-2 border-white/20 hover:border-white/40 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5 backdrop-blur-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* my Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" text="Searching mutual funds..." />
        </div>
      )}

      {/* my Error */}
      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {/* No results */}
      {hasSearched && !loading && !error && funds.length === 0 && (
        <div className="text-center py-16 bg-black border-2 border-white/20 rounded-xl backdrop-blur-sm">
          <p className="text-gray-400 text-xl">
            No mutual funds found. Try a different search term.
          </p>
        </div>
      )}

      {/* my Results */}
      {funds.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white">Search Results</h2>
            <span className="bg-gradient-to-r from-white to-blue-400 hover:from-white/90 hover:to-blue-500 text-black font-semibold px-4 py-2 rounded-lg border border-white ">
              {funds.length} funds found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {funds.map((fund) => (
              <FundCard key={fund.schemeCode} fund={fund} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
