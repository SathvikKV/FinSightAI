"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFilingLinks } from "@/lib/api";

interface FilingLink {
  url: string;
  date: string;
  title: string;
}

const TICKER_CIKS: Record<string, string> = {
  AAPL: "Apple",
  MSFT: "Microsoft",
  GOOGL: "Alphabet",
  META: "Meta",
  AMZN: "Amazon",
  TSLA: "Tesla",
  F: "Ford",
  NVDA: "Nvidia",
  AMD: "AMD",
  INTC: "Intel",
  QCOM: "Qualcomm",
  CRM: "Salesforce",
  ORCL: "Oracle",
  ADBE: "Adobe",
  SHOP: "Shopify",
  PYPL: "PayPal",
  SQ: "Block",
  MA: "Mastercard",
  V: "Visa",
  UBER: "Uber",
  LYFT: "Lyft",
  NFLX: "Netflix",
  DIS: "Disney",
  WMT: "Walmart",
  COST: "Costco",
  T: "AT&T",
  VZ: "Verizon",
  PLTR: "Palantir",
  SNOW: "Snowflake",
  COIN: "Coinbase",
  ROKU: "Roku",
  ZM: "Zoom",
  DOCU: "DocuSign",
  ASML: "ASML",
  TXN: "Texas Instruments",
  IBM: "IBM",
  INTU: "Intuit",
  NET: "Cloudflare",
  PANW: "Palo Alto Networks",
  ZS: "Zscaler",
};

const FORM_TYPES = ["All", "10-K", "10-Q"];

export default function FilingsExplorer() {
  const [ticker, setTicker] = useState("");
  const [formType, setFormType] = useState("10-K");
  const [results, setResults] = useState<FilingLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!ticker) {
      setError("Please select a company.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const filings = await getFilingLinks(
        ticker,
        formType === "All" ? undefined : formType,
        10
      );
      setResults(filings);
    } catch (err: any) {
      setError(err.message || "Failed to fetch filings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Filings Explorer</h1>

      <div className="premium-border p-6 rounded-xl backdrop-blur-sm mb-8 space-y-4">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="w-[240px]">
            <Label>Company</Label>
            <Select onValueChange={(value) => setTicker(value)} value={ticker}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TICKER_CIKS).map(([symbol, name]) => (
                  <SelectItem key={symbol} value={symbol}>
                    {name} ({symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[160px]">
            <Label>Form Type</Label>
            <Select
              onValueChange={(value) => setFormType(value)}
              value={formType}
            >
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORM_TYPES.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {loading ? "Searching..." : "Search Filings"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {results.map((filing, idx) => (
            <div
              key={idx}
              className="border border-border rounded-xl p-4 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <p className="text-muted-foreground text-sm mb-1">
                {filing.date}
              </p>
              <a
                href={filing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-medium text-lg"
              >
                {filing.title || `Filing (${filing.date})`}
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <p className="text-muted-foreground text-center mt-8">
          No filings found. Try different filters.
        </p>
      )}
    </div>
  );
}
