"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useAuthGuard } from "@/lib/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  listReports,
  getReport,
  saveReport,
  updateReport,
  deleteReport,
  draftReportSection,
} from "@/lib/api";
import { Loader2, Trash2, FileText, Plus, FilePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ReportSection {
  section: string;
  content: string;
}

interface Report {
  id: string;
  title: string;
  company: string;
  form_type: string;
  sections: ReportSection[];
}

export default function SavedReports() {
  useAuthGuard();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newSection, setNewSection] = useState("");
  const [drafting, setDrafting] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newFormType, setNewFormType] = useState("10-K");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const data = await listReports();
      setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateReport() {
    try {
      const result = await saveReport({
        title: newTitle,
        company: newCompany,
        form_type: newFormType,
        sections: [],
      });
      setNewTitle("");
      setNewCompany("");
      fetchReports();
      handleSelect(result.id);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this report?")) {
      await deleteReport(id);
      fetchReports();
      setSelectedReport(null);
    }
  }

  async function handleSelect(id: string) {
    const data = await getReport(id);
    setSelectedReport(data);
  }

  async function handleDraftSection() {
    if (!selectedReport || !newSection) return;
    setDrafting(true);
    try {
      const draft = await draftReportSection(
        selectedReport.company,
        newSection,
        selectedReport.form_type
      );
      const updatedSections = [
        ...selectedReport.sections,
        { section: draft.section, content: draft.content },
      ];
      await updateReport(selectedReport.id, { sections: updatedSections });
      const updatedReport = await getReport(selectedReport.id);
      setSelectedReport(updatedReport);
      setNewSection("");
    } catch (error) {
      console.error(error);
    } finally {
      setDrafting(false);
    }
  }

  function generateReportContent(report: Report, format: "pdf" | "markdown") {
    const lines = [
      `# ${report.title}`,
      `**Company:** ${report.company}`,
      `**Form Type:** ${report.form_type}`,
      "",
    ];
    report.sections.forEach((section) => {
      lines.push(`## ${section.section.replace(/_/g, " ").toUpperCase()}`);
      lines.push(section.content);
      lines.push("");
    });
    return lines.join("\n");
  }

  function handleDownload(type: "markdown" | "pdf") {
    if (!selectedReport) return;

    if (type === "pdf") {
      handleDownloadPDF(selectedReport);
    } else if (type === "markdown") {
      handleDownloadMarkdown(selectedReport);
    }
  }

  function handleDownloadPDF(report: Report) {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text(report.title, 10, 20);
    pdf.setFontSize(12);
    pdf.text(`Company: ${report.company}`, 10, 30);
    pdf.text(`Form Type: ${report.form_type}`, 10, 40);

    let y = 50;
    report.sections.forEach((section, idx) => {
      pdf.setFontSize(14);
      pdf.text(
        `${idx + 1}. ${section.section.replace(/_/g, " ").toUpperCase()}`,
        10,
        y
      );
      y += 8;
      pdf.setFontSize(10);

      // Split content into multiple lines if needed
      const lines = pdf.splitTextToSize(section.content, 180);
      lines.forEach((line: string) => {
        if (y > 270) {
          // Add new page if beyond page height
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 10, y);
        y += 6;
      });

      y += 10; // Space between sections
    });

    pdf.save(`${report.title.replace(/\s+/g, "_")}.pdf`);
  }
  function handleDownloadMarkdown(report: Report) {
    const markdown = `# ${report.title}
  
  **Company:** ${report.company}
  **Form Type:** ${report.form_type}
  
  ---
  
  ${report.sections
    .map(
      (s) => `## ${s.section.replace(/_/g, " ").toUpperCase()}\n\n${s.content}`
    )
    .join("\n\n")}
  `;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">📚 Saved Reports</h1>

      <div className="bg-muted/10 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FilePlus className="h-5 w-5 text-primary" /> New Report
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Title</Label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Company (Ticker)</Label>
            <Input
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
            />
          </div>
          <div>
            <Label>Form Type</Label>
            <Input
              value={newFormType}
              onChange={(e) => setNewFormType(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleCreateReport}
          disabled={!newTitle || !newCompany}
        >
          Create Report
        </Button>
      </div>

      <div className="premium-border p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold mb-4">📄 Your Reports</h2>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground">
            No reports yet. Start by creating one above!
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-lg bg-muted/10 border cursor-pointer hover:shadow-md transition"
                onClick={() => handleSelect(report.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{report.title}</h3>
                  <Trash2
                    className="h-5 w-5 text-destructive cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(report.id);
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {report.company} ({report.form_type})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="premium-border p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{selectedReport.title}</h2>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
          </div>

          <div className="space-y-6">
            {selectedReport.sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-background p-4 border rounded-lg shadow-sm"
              >
                <h4 className="font-semibold mb-2 text-primary">
                  {section.section.replace(/_/g, " ").toUpperCase()}
                </h4>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 mt-6">
            <Label>➕ Draft New Section</Label>
            <Input
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="e.g. executive_summary, risks"
            />
            <Button
              onClick={handleDraftSection}
              disabled={drafting || !newSection}
            >
              {drafting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate Section"
              )}
            </Button>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => handleDownload("markdown")}
            >
              Download Markdown
            </Button>
            <Button variant="outline" onClick={() => handleDownload("pdf")}>
              Download PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
