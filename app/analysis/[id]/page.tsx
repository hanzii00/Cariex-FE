'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  CheckCircle2,
  Clock,
  BarChart3,
  Brain,
  Info,
  Target,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Download,
  Printer,
  Upload,
  Layers,
  Activity
} from 'lucide-react';
import { getDiagnosis } from '@/services/scan.service';

export default function AnalysisPage() {
  const { id } = useParams();
  const router = useRouter();

  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'results' | 'xai' | 'details'>('results');

  // XAI state
  const [xaiLoading, setXaiLoading] = useState(false);
  const [xaiData, setXaiData] = useState<any | null>(null);
  const [xaiError, setXaiError] = useState<string | null>(null);
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickOverlay, setQuickOverlay] = useState<any | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [highlighted, setHighlighted] = useState<number | null>(null);

  // Poll every 2 seconds if analysis not completed
  useEffect(() => {
    let interval: any;
    const fetchData = async () => {
      try {
        const data = await getDiagnosis(parseInt(id as string));
        setDiagnosis(data);
        setLoading(false);

        if (data.status !== 'completed') {
          interval = setInterval(fetchData, 2000);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
    return () => clearInterval(interval);
  }, [id]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const loadXAIExplanation = async () => {
    if (!API_URL) {
      setXaiError('API URL is not configured');
      return;
    }
    try {
      setXaiError(null);
      setQuickOverlay(null);
      setXaiLoading(true);
      const res = await fetch(`${API_URL}/ai/explain/${id}/`, {
        headers: {
          Authorization: typeof window !== 'undefined' && localStorage.getItem('access')
            ? `Bearer ${localStorage.getItem('access')}`
            : '',
        },
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate explanation');
      }
      setXaiData(data);
    } catch (e: any) {
      setXaiError(e?.message || 'Failed to generate explanation');
    } finally {
      setXaiLoading(false);
    }
  };

  const loadQuickOverlay = async () => {
    if (!API_URL) {
      setXaiError('API URL is not configured');
      return;
    }
    try {
      setXaiError(null);
      setQuickLoading(true);
      const res = await fetch(`${API_URL}/ai/explain/quick/${id}/`, {
        headers: {
          Authorization: typeof window !== 'undefined' && localStorage.getItem('access')
            ? `Bearer ${localStorage.getItem('access')}`
            : '',
        },
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate quick overlay');
      }
      setQuickOverlay(data);
    } catch (e: any) {
      setXaiError(e?.message || 'Failed to generate quick overlay');
    } finally {
      setQuickLoading(false);
    }
  };

  if (loading || !diagnosis) {
    return (
      <DashboardLayout title="Analysis">
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-900 font-semibold text-lg">Retrieving analysis data...</p>
          <p className="text-gray-500 text-sm">Please wait while we fetch the results.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analysis Results">
      <div className="max-w-5xl mx-auto space-y-8 pb-12 font-sans">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Diagnosis Report</h1>
            <p className="text-gray-500 text-sm mt-1">ID: #{diagnosis.id} &bull; Uploaded on {diagnosis.uploaded_at}</p>
          </div>

          <div className={`inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium ${diagnosis.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {diagnosis.status === 'completed' ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Analysis Complete
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" /> Processing: {diagnosis.status}
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 bg-gray-50/50 p-1 rounded-lg border border-gray-100 w-fit">
          <button
            type="button"
            className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'results' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('results')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Results
          </button>
          <button
            type="button"
            className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'xai' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('xai')}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Explanation
          </button>
          <button
            type="button"
            className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'details' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('details')}
          >
            <Info className="w-4 h-4 mr-2" />
            Details
          </button>
        </div>

        {/* RESULTS TAB */}
        {activeTab === 'results' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Image Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100 pb-4">
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Scan Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div ref={imageWrapperRef} className="relative w-full bg-gray-50 min-h-[400px] flex items-center justify-center">
                    <Image
                      src={diagnosis.image_url}
                      alt="Uploaded X-ray"
                      fill
                      style={{ objectFit: 'contain' }}
                      onLoadingComplete={(info: any) => {
                        const naturalW = info?.naturalWidth ?? info?.width ?? 1;
                        const naturalH = info?.naturalHeight ?? info?.height ?? 1;
                        const dispW = imageWrapperRef.current?.clientWidth ?? naturalW;
                        const dispH = imageWrapperRef.current?.clientHeight ?? Math.round((dispW / naturalW) * naturalH);
                        setScale({ x: dispW / naturalW, y: dispH / naturalH });
                      }}
                    />

                    {(diagnosis.lesion_boxes ?? diagnosis.bounding_boxes ?? []).map((b: any) => {
                      const left = (b.x ?? 0) * scale.x;
                      const top = (b.y ?? 0) * scale.y;
                      const width = (b.width ?? 0) * scale.x;
                      const height = (b.height ?? 0) * scale.y;
                      const isActive = highlighted === b.id;
                      return (
                        <div
                          key={b.id ?? `${b.x}-${b.y}-${b.width}-${b.height}`}
                          onMouseEnter={() => setHighlighted(b.id ?? null)}
                          onMouseLeave={() => setHighlighted(null)}
                          style={{ left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` }}
                          className={`pointer-events-auto absolute border-2 rounded-sm transition-all duration-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500/30 z-10' : 'border-amber-400/80 hover:border-amber-400'}`}
                        >
                          <div className={`w-full h-full transition-opacity ${isActive ? 'bg-blue-500/10' : 'bg-transparent'}`} />
                          <div className="absolute -top-7 left-0 flex items-center gap-1 text-[10px] font-bold bg-gray-900 text-white px-2 py-1 rounded shadow-sm">
                            <Target className="w-3 h-3" />
                            {((b.confidence ?? 0) * 100).toFixed(0)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Column */}
            <div className="space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-900">Detection Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                        <span className="block text-2xl font-bold text-gray-900">{diagnosis.num_lesions ?? (diagnosis.lesion_boxes ?? []).length ?? 0}</span>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lesions</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                        <span className="block text-2xl font-bold text-gray-900">{(diagnosis.affected_percentage ?? 0).toFixed(1)}%</span>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Affected Area</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                       Detected Areas
                    </h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {(diagnosis.lesion_boxes ?? []).map((l: any, idx: number) => (
                        <div
                          key={l.id ?? idx}
                          onMouseEnter={() => setHighlighted(l.id ?? null)}
                          onMouseLeave={() => setHighlighted(null)}
                          className={`group p-3 rounded-lg border transition-all cursor-pointer ${highlighted === (l.id ?? null) ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Lesion #{idx + 1}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                Coord: ({l.x ?? 0}, {l.y ?? 0})
                              </div>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {((l.confidence ?? 0)).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                      {((diagnosis.lesion_boxes ?? []).length ?? 0) === 0 && (
                        <div className="text-sm text-gray-400 italic text-center py-4">No lesions detected in this scan.</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {diagnosis.severity && (
                <Card className="border-gray-200 shadow-sm bg-gray-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Severity Classification</span>
                      <span className="text-sm font-medium text-gray-900">{(diagnosis.confidence_score ?? 0).toFixed(1)}% conf.</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{diagnosis.severity}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* XAI TAB */}
        {activeTab === 'xai' && (
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      Explainable AI Visualization
                    </CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                      Visual heatmaps and Grad-CAM analysis to understand the model's focus.
                    </CardDescription>
                  </div>
                  {!xaiData && !quickOverlay && !xaiLoading && (
                     <Button onClick={loadXAIExplanation} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                       <Brain className="w-4 h-4 mr-2" />
                       Run Deep Analysis
                     </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">

                {/* Empty State / Initial Load */}
                {!xaiData && !quickOverlay && !xaiLoading && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                     <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                     <h3 className="text-gray-900 font-medium">No Analysis Generated Yet</h3>
                     <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
                       Click the button above to generate a visual explanation of the AI's decision-making process.
                     </p>
                  </div>
                )}

                {/* Loading State */}
                {xaiLoading && (
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                    <p className="font-medium text-gray-900">Generating Explanation...</p>
                    <p className="text-sm text-gray-500 mt-1">Processing Grad-CAM heatmaps and overlays</p>
                  </div>
                )}

                {/* Error State */}
                {xaiError && (
                  <div className="rounded-md border border-red-100 bg-red-50 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 text-sm">Analysis Failed</h4>
                      <p className="text-red-700 text-sm mt-1">{xaiError}</p>
                    </div>
                  </div>
                )}

                {/* Quick Overlay View */}
                {quickOverlay && !quickLoading && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                       <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                         <Layers className="w-4 h-4 text-blue-600" /> Quick Overlay
                       </h3>
                       <Button variant="outline" size="sm" onClick={loadXAIExplanation} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-100">
                         <ArrowLeft className="w-4 h-4 mr-2" /> Back to Full Analysis
                       </Button>
                    </div>

                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100">
                      {quickOverlay.description}
                    </p>

                    <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-900 min-h-[400px]">
                      <Image
                        src={quickOverlay.overlay_url}
                        alt="Quick XAI Overlay"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                )}

                {/* Full XAI Explanation */}
                {xaiData && !quickOverlay && !xaiLoading && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden bg-gray-100 aspect-[3/2] min-h-[450px] shadow-inner">
                      <Image
                        src={xaiData.explanation_url}
                        alt="XAI Explanation"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Severity</p>
                        <p className="text-2xl font-bold text-gray-900">{xaiData.severity ?? 'N/A'}</p>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Confidence</p>
                        <p className="text-2xl font-bold text-blue-600">{(xaiData.confidence ?? 0).toFixed(1)}%</p>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Affected Area</p>
                        <p className="text-2xl font-bold text-gray-900">{(xaiData.affected_percentage ?? 0).toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        Clinical Interpretation
                      </h3>

                      <div className="grid gap-6 md:grid-cols-2 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Status</p>
                          <p className="text-gray-600 leading-relaxed">{xaiData.interpretation?.status}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Recommendation</p>
                          <p className="text-gray-600 leading-relaxed">{xaiData.interpretation?.recommendation}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Localization (Red Areas)</p>
                          <p className="text-gray-600 leading-relaxed">{xaiData.interpretation?.red_areas}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Model Focus (Grad-CAM)</p>
                          <p className="text-gray-600 leading-relaxed">{xaiData.interpretation?.gradcam}</p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-200 flex flex-wrap gap-6 text-xs text-gray-600">
                        {/* <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500" />
                          <span>Suspected Caries</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-green-500" />
                          <span>Healthy Tissue</span>
                        </div> */}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button variant="outline" onClick={loadQuickOverlay} disabled={quickLoading} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        {quickLoading ? 'Loading...' : 'View Quick Overlay'}
                      </Button>

                      {xaiData.explanation_url && (
                        <>
                          <a
                            href={xaiData.explanation_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Full Image
                          </a>
                          <a
                            href={xaiData.explanation_url}
                            download
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-gray-900 text-base">Diagnosis Metadata</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Diagnosis ID</span>
                    <span className="font-mono text-gray-900 font-medium">{diagnosis.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Upload Timestamp</span>
                    <span className="text-gray-900">{diagnosis.uploaded_at}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Processing Status</span>
                    <span className="text-gray-900 capitalize">{diagnosis.status}</span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="text-gray-500">Caries Detected</span>
                    <span className={`font-medium ${diagnosis.has_caries ? 'text-red-600' : 'text-green-600'}`}>
                        {diagnosis.has_caries ? 'Yes' : 'No'}
                    </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-gray-900 text-base">System Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-sm">
                    <div className="grid gap-1">
                        <span className="font-semibold text-gray-900">Model Architecture</span>
                        <span className="text-gray-600">Adult Teeth Segmentation (U-Net based Custom Architecture)</span>
                    </div>
                    <div className="grid gap-1">
                        <span className="font-semibold text-gray-900">Preprocessing</span>
                        <span className="text-gray-600">CLAHE Enhancement, Resize (512x512), Normalization</span>
                    </div>
                    <div className="grid gap-1">
                        <span className="font-semibold text-gray-900">Classes</span>
                        <span className="text-gray-600">Normal, Mild Caries, Moderate Caries, Severe Caries</span>
                    </div>
                </CardContent>
                </Card>

                <div className="flex flex-wrap gap-4">
                <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => router.push('/upload')}
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Scan
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => window.print()}
                >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Report
                </Button>
                </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
