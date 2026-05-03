import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileText,
  LoaderCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExportActions({ targetRef, fileName, summaryText }) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function downloadPng() {
    if (!targetRef.current) {
      return;
    }

    setBusy(true);

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0b1020"
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}.png`;
      link.click();
    } finally {
      setBusy(false);
    }
  }

  function exportPdf() {
    const previousTitle = document.title;
    document.title = fileName;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 100);
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <Button type="button" onClick={downloadPng} disabled={busy} variant="outline">
        {busy ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {busy ? "Rendering..." : "Download PNG"}
      </Button>
      <Button type="button" onClick={exportPdf} variant="outline">
        <FileText className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <Button type="button" onClick={copySummary} variant="secondary">
        {copied ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <Copy className="mr-2 h-4 w-4" />
        )}
        {copied ? "Summary Copied" : "Copy Summary"}
      </Button>
    </div>
  );
}
