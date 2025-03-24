import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "../../components/ui/Button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { PDFViewerProps } from "../../types/course";

// ✅ Dynamically Set Worker Path
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();


const PDFViewer: React.FC<PDFViewerProps> = ({ notesUrl, isDark }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("PDF URL:", notesUrl);
    }, [notesUrl]);

    return (
        <div
            className={`relative w-full max-w-4xl mx-auto border rounded-lg shadow-lg mb-12 ${
                isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"
            }`}
        >
            {notesUrl ? (
                <>
                    {/* ✅ Centered PDF Viewer */}
                    <div className="border p-2 rounded-md overflow-auto max-h-[80vh] flex justify-center items-start">
                        <Document
                            file={notesUrl}
                            onLoadSuccess={({ numPages }) => {
                                setNumPages(numPages);
                                setLoading(false);
                            }}
                            onLoadError={(error) => console.error("PDF Load Error:", error)}
                            className="flex justify-center w-full"
                        >
                            {loading ? (
                                <p className="text-gray-500">Loading PDF...</p>
                            ) : (
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderMode="canvas"
                                    
                                    className="mx-auto !h-auto"
                                />
                            )}
                        </Document>
                    </div>

                    {/* ✅ Sticky Controls */}
                    <div
                        className={`fixed bottom-0 left-0 w-full flex flex-col gap-2 p-3 ${
                            isDark ? "bg-gray-900 bg-opacity-90" : "bg-white bg-opacity-90"
                        } backdrop-blur-md border-t border-gray-300 shadow-lg`}
                    >
                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                            <Button variant="ghost" onClick={() => setScale(scale + 0.2)}>
                                <ZoomIn className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(pageNumber - 1)}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <p className="text-sm">
                                Page {pageNumber} of {numPages || "?"}
                            </p>

                            <Button
                                variant="ghost"
                                disabled={pageNumber >= (numPages || 1)}
                                onClick={() => setPageNumber(pageNumber + 1)}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" onClick={() => setScale(Math.max(scale - 0.2, 0.5))}>
                                <ZoomOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-center py-6 text-gray-500">No notes available for this topic.</p>
            )}
        </div>
    );
};

export default PDFViewer;
