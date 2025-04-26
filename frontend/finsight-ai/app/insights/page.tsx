"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  compareCompanies,
  getCompanyFinancialChart,
  getInsightSpotlight,
  themeAnalysis,
} from "@/lib/api";
import { Loader2 } from "lucide-react";
import { TICKER_CIKS } from "@/lib/tickerCiks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FINANCIAL_METRICS = [
  "revenue",
  "net_income",
  "operating_income",
  "rd_expense",
  "capex",
  "eps",
];

const METRIC_LABELS: Record<string, string> = {
  revenue: "Revenue ($)",
  net_income: "Net Income ($)",
  operating_income: "Operating Income ($)",
  rd_expense: "R&D Expense ($)",
  capex: "Capital Expenditure ($)",
  eps: "Earnings Per Share ($)",
};

export default function AIInsights() {
  const [companyA, setCompanyA] = useState("");
  const [companyB, setCompanyB] = useState("");
  const [comparisonResult, setComparisonResult] = useState<{
    company_a_details: string;
    company_b_details: string;
    comparison_summary: string;
  } | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const [companyFinancial, setCompanyFinancial] = useState("");
  const [metric, setMetric] = useState("");
  const [financialResult, setFinancialResult] = useState<
    { date: string; value: number }[]
  >([]);
  const [financialLoading, setFinancialLoading] = useState(false);

  const [insights, setInsights] = useState<string[]>([]);
  const [insightLoading, setInsightLoading] = useState(false);

  const [theme, setTheme] = useState("");
  const [themeResult, setThemeResult] = useState<string | null>(null);
  const [themeLoading, setThemeLoading] = useState(false);
  const [insightCompany, setInsightCompany] = useState("");

  const handleCompare = async () => {
    setCompareLoading(true);
    try {
      const data = await compareCompanies(companyA, companyB);
      setComparisonResult(data);
    } catch (error) {
      setComparisonResult({
        company_a_details: "N/A",
        company_b_details: "N/A",
        comparison_summary: "Failed to fetch comparison.",
      });
    } finally {
      setCompareLoading(false);
    }
  };

  const handleFinancialChart = async () => {
    setFinancialLoading(true);
    setFinancialResult([]);
    try {
      const data = await getCompanyFinancialChart(companyFinancial, metric);
      setFinancialResult(data.data);
    } catch (error) {
      setFinancialResult([]);
    } finally {
      setFinancialLoading(false);
    }
  };

  const handleInsightSpotlight = async () => {
    setInsightLoading(true);
    setInsights([]);
    try {
      if (!insightCompany) {
        setInsights(["Please select a company to generate insights."]);
        return;
      }
      const data = await getInsightSpotlight(insightCompany);
      setInsights(data.insights);
    } catch (error) {
      setInsights(["Failed to fetch insights."]);
    } finally {
      setInsightLoading(false);
    }
  };

  const handleThemeAnalysis = async () => {
    setThemeLoading(true);
    try {
      const data = await themeAnalysis(theme);
      setThemeResult(data.analysis);
    } catch (error) {
      setThemeResult("Failed to fetch theme analysis.");
    } finally {
      setThemeLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-3xl font-bold mb-6">AI Insights</h1>

      {/* Compare Companies */}
      <div className="premium-border p-6 rounded-xl backdrop-blur-sm space-y-4">
        <h2 className="text-2xl font-semibold mb-4">
          🔍 Company vs Company Analysis
        </h2>
        <div className="flex gap-4 flex-wrap">
          <div>
            <Label>Company A</Label>
            <select
              value={companyA}
              onChange={(e) => setCompanyA(e.target.value)}
              className="w-full p-2 border border-muted rounded-md bg-background"
            >
              <option value="">Select Company A</option>
              {Object.entries(TICKER_CIKS).map(([ticker]) => (
                <option key={ticker} value={ticker}>
                  {ticker}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Company B</Label>
            <select
              value={companyB}
              onChange={(e) => setCompanyB(e.target.value)}
              className="w-full p-2 border border-muted rounded-md bg-background"
            >
              <option value="">Select Company B</option>
              {Object.entries(TICKER_CIKS).map(([ticker]) => (
                <option key={ticker} value={ticker}>
                  {ticker}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleCompare} disabled={compareLoading}>
            {compareLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Compare"
            )}
          </Button>
        </div>

        {comparisonResult && (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/10 p-4 rounded-lg text-base leading-relaxed break-words">
              <h3 className="font-semibold mb-2">📄 Company A ({companyA})</h3>
              <p className="whitespace-pre-wrap">
                {comparisonResult.company_a_details}
              </p>
            </div>
            <div className="bg-muted/10 p-4 rounded-lg text-base leading-relaxed break-words">
              <h3 className="font-semibold mb-2">📄 Company B ({companyB})</h3>
              <p className="whitespace-pre-wrap">
                {comparisonResult.company_b_details}
              </p>
            </div>
            <div className="bg-muted/10 p-4 rounded-lg text-base leading-relaxed break-words">
              <h3 className="font-semibold mb-2">
                ⚖️ Key Comparative Insights
              </h3>
              <p className="whitespace-pre-wrap">
                {comparisonResult.comparison_summary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Company Financial Chart */}
      <div className="premium-border p-6 rounded-xl backdrop-blur-sm space-y-4">
        <h2 className="text-2xl font-semibold mb-4">
          📊 Company Financial Highlights
        </h2>
        <div className="flex gap-4 flex-wrap">
          <div>
            <Label>Company</Label>
            <select
              value={companyFinancial}
              onChange={(e) => setCompanyFinancial(e.target.value)}
              className="w-full p-2 border border-muted rounded-md bg-background"
            >
              <option value="">Select Company</option>
              {Object.entries(TICKER_CIKS).map(([ticker]) => (
                <option key={ticker} value={ticker}>
                  {ticker}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Metric</Label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="w-full p-2 border border-muted rounded-md bg-background"
            >
              <option value="">Select Metric</option>
              {FINANCIAL_METRICS.map((m) => (
                <option key={m} value={m}>
                  {m.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleFinancialChart} disabled={financialLoading}>
            {financialLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Fetch Chart Data"
            )}
          </Button>
        </div>

        {financialResult.length > 0 && (
          <div className="bg-muted/10 p-4 rounded-lg mt-4">
            <h3 className="font-semibold mb-2">
              📈 {METRIC_LABELS[metric] || metric.toUpperCase()} Trend
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={financialResult}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  label={{
                    value: "Year",
                    position: "insideBottom",
                    offset: -10,
                    style: { fill: "#888", fontSize: 12 },
                  }}
                />
                <YAxis
                  label={{
                    value: METRIC_LABELS[metric] || "Value",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fill: "#888", fontSize: 12 },
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Insight Spotlight */}
      <div className="premium-border p-6 rounded-xl backdrop-blur-sm space-y-4">
        <h2 className="text-2xl font-semibold mb-4">💡 Insight Spotlight</h2>

        <div className="flex gap-4 flex-wrap">
          <div>
            <Label>Company</Label>
            <select
              value={insightCompany}
              onChange={(e) => setInsightCompany(e.target.value)}
              className="w-full p-2 border border-muted rounded-md bg-background"
            >
              <option value="">Select Company</option>
              {Object.entries(TICKER_CIKS).map(([ticker]) => (
                <option key={ticker} value={ticker}>
                  {ticker}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleInsightSpotlight} disabled={insightLoading}>
            {insightLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Generate Insights"
            )}
          </Button>
        </div>

        {insights.length > 0 && (
          <div className="grid gap-3 bg-muted/10 p-4 rounded-lg mt-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 border border-border rounded-lg bg-background shadow-sm"
              >
                <span className="text-yellow-500 text-xl mt-1">💡</span>
                <p className="text-sm leading-relaxed text-foreground">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theme Analysis */}
      <div className="premium-border p-6 rounded-xl backdrop-blur-sm space-y-4">
        <h2 className="text-2xl font-semibold mb-4">
          🧠 Thematic Risk / Strategy Report
        </h2>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-grow">
            <Label>Theme (e.g. AI risk, Climate Risk)</Label>
            <Input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. AI risk"
            />
          </div>
          <Button onClick={handleThemeAnalysis} disabled={themeLoading}>
            {themeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Analyze Theme"
            )}
          </Button>
        </div>
        {themeResult &&
          (() => {
            const [summary, ...rest] = themeResult.split("**Key Points:**");
            const cleanedSummary = summary
              .replace("**Executive Summary:**", "")
              .trim();
            const bulletPoints = rest
              .join("")
              .split(/\n[0-9]+\.\s+/)
              .filter((p) => p.trim());

            return (
              <div className="bg-muted/10 p-6 rounded-xl mt-4 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    📌 Executive Summary
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                    {cleanedSummary}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">📍 Key Points</h4>
                  <ol className="list-decimal list-inside space-y-4 text-sm text-foreground">
                    {bulletPoints.map((point, idx) => (
                      <li key={idx}>{point.trim()}</li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
