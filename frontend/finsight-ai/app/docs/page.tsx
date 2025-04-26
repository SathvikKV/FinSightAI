"use client";

export default function Documentation() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          This platform provides AI-assisted financial insights by analyzing
          company SEC filings and related financial data. We leverage
          Retrieval-Augmented Generation (RAG) technology to generate summaries,
          comparisons, and thematic reports from primary sources like 10-K and
          10-Q filings. The platform is designed to assist analysts, investors,
          and researchers in rapidly understanding company strategies, risks,
          and financial performance.
        </p>
      </section>

      {/* How RAG Works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          How RAG (Retrieval-Augmented Generation) Works
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          1. Relevant excerpts from SEC filings are retrieved using vector
          similarity search.
          <br />
          2. Retrieved data is passed into a language model to generate
          structured answers or reports.
          <br />
          3. Outputs are grounded in factual documents, minimizing
          hallucinations.
        </p>
      </section>

      {/* Data Sources */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Data Sources</h2>
        <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
          <li>SEC EDGAR database (10-K, 10-Q, 8-K filings)</li>
          <li>Public company financial statements</li>
          <li>Supplementary regulatory filings</li>
        </ul>
      </section>

      {/* Supported SEC Forms */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Supported SEC Form Types</h2>
        <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
          <li>
            <strong>10-K</strong>: Annual comprehensive financial report
          </li>
          <li>
            <strong>10-Q</strong>: Quarterly financial report
          </li>
          <li>
            <strong>8-K</strong>: Report of major events
          </li>
          <li>
            <strong>DEF 14A</strong>: Proxy statements for shareholders
          </li>
        </ul>
      </section>

      {/* Financial Metrics Glossary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Financial Metrics Glossary</h2>
        <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
          <li>
            <strong>Revenue</strong>: Total income generated from operations
            before expenses.
          </li>
          <li>
            <strong>Net Income</strong>: Company's profit after all expenses,
            taxes, and costs are deducted.
          </li>
          <li>
            <strong>Operating Income</strong>: Earnings from regular business
            operations excluding taxes and interest.
          </li>
          <li>
            <strong>R&D Expense</strong>: Costs associated with research and
            development of products or services.
          </li>
          <li>
            <strong>Capital Expenditure (CapEx)</strong>: Funds used by a
            company to acquire or upgrade assets.
          </li>
          <li>
            <strong>EPS (Earnings Per Share)</strong>: Net income divided by the
            number of outstanding shares.
          </li>
        </ul>
      </section>

      {/* How to Use */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to Use the Platform</h2>
        <ol className="list-decimal list-inside text-muted-foreground leading-relaxed">
          <li>Search for a company or theme using the query interface.</li>
          <li>Compare financial metrics between companies over time.</li>
          <li>
            Explore AI-generated insights extracted directly from filings.
          </li>
          <li>
            Draft structured financial reports using the Report Assistant.
          </li>
          <li>Download reports in PDF or Markdown formats for external use.</li>
        </ol>
      </section>

      {/* Additional Tips */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tips for Best Results</h2>
        <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
          <li>
            Use specific queries when drafting insights (e.g., "supply chain
            risk in 10-K 2024").
          </li>
          <li>
            Always cross-reference AI outputs with official filings for
            compliance-grade usage.
          </li>
          <li>
            Choose appropriate SEC form types depending on your research goal.
          </li>
        </ul>
      </section>
    </div>
  );
}
