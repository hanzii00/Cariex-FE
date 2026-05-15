'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UploadCloud, Loader2, ArrowRight, CheckCircle2, 
  Clock, X, FileImage, AlertCircle, Search, 
  ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { Patient, DiagnosisResult, fetchPatients, fetchRecentScans, uploadScan } from '@/services/scan.service';

const ITEMS_PER_PAGE = 5;

type PatientRecord = Patient & {
  first_name?: string;
  last_name?: string;
  full_name?: string;
};

const getPatientDisplayName = (patient: PatientRecord) => {
  const fullName = patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`;
  return fullName.trim() || `Patient ${patient.id}`;
};

const normalizeScanForDisplay = (
  scan: DiagnosisResult,
  patientNameById: Map<string, string>,
  selectedPatientId?: string
): DiagnosisResult => {
  const resolvedPatientId = scan.patientId ?? (selectedPatientId ? Number(selectedPatientId) : null) ?? null;
  const resolvedPatientName =
    scan.patientName ||
    (resolvedPatientId != null ? patientNameById.get(String(resolvedPatientId)) : null) ||
    (selectedPatientId ? patientNameById.get(selectedPatientId) : null) ||
    null;

  return {
    ...scan,
    patientId: resolvedPatientId,
    patientName: resolvedPatientName,
  };
};

export default function UploadScan() {
  const router = useRouter();

  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [recentScans, setRecentScans] = useState<DiagnosisResult[]>([]);

  // Upload states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [completedScanId, setCompletedScanId] = useState<number | null>(null);

  // Filter & Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchPatients().then(setPatients).catch(console.error);
    fetchRecentScans().then(setRecentScans).catch(console.error);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  const clearSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNewScan = () => {
    clearSelection();
    setCompletedScanId(null);
    // Note: We keep `selectedPatient` so the user can easily upload multiple scans for the same patient, 
    // but you can add `setSelectedPatient('');` here if you want it to completely reset.
  };

  const patientNameById = useMemo(() => {
    return new Map(patients.map(patient => [String(patient.id), getPatientDisplayName(patient)]));
  }, [patients]);

  const displayedScans = useMemo(() => {
    return recentScans.map(scan => normalizeScanForDisplay(scan, patientNameById, selectedPatient));
  }, [recentScans, patientNameById, selectedPatient]);

  const handleUpload = async () => {
    if (!file || !selectedPatient) return;

    try {
      setCompletedScanId(null);
      setUploading(true);
      const scan = await uploadScan(file, parseInt(selectedPatient));
      
      setPreviewUrl(scan.imageUrl || previewUrl);
      setUploading(false);

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      let targetScanId = scan.id;

      if (!targetScanId) {
        const scansResp = await fetchRecentScans();
        setRecentScans(scansResp.map(scan => normalizeScanForDisplay(scan, patientNameById, selectedPatient)));

        const patientId = Number(selectedPatient);
        const fallbackScan = scansResp
          .filter(s => s.patientId === patientId)
          .sort((a, b) => Number(b.id) - Number(a.id))[0];

        targetScanId = fallbackScan?.id;
      }

      if (!targetScanId) {
        throw new Error('Upload completed, but the new scan id could not be resolved.');
      }

      if (scan.status === 'completed') {
        const selectedPatientId = Number(selectedPatient);
        setRecentScans(prev => [
          normalizeScanForDisplay({ ...scan, patientId: selectedPatientId }, patientNameById, selectedPatient),
          ...prev.filter(item => item.id !== targetScanId),
        ]);
        setCompletedScanId(targetScanId);
        return;
      }

      setAnalyzing(true);

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const scansResp = await fetchRecentScans();
          setRecentScans(scansResp.map(scan => normalizeScanForDisplay(scan, patientNameById, selectedPatient)));
          
          const updated = scansResp.find(s => s.id === targetScanId);
          
          if (updated?.status === 'completed') {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            setAnalyzing(false);
            setCompletedScanId(targetScanId);
          } else if (updated?.status === 'failed') {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            setAnalyzing(false);
            setCompletedScanId(null);
            alert('Analysis failed. Please try uploading again.');
          }
        } catch (pollError) {
          console.error('Polling error:', pollError);
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      alert('Upload failed. Please check your connection and try again.');
      setUploading(false);
      setAnalyzing(false);
    }
  };

  // Filter, Sort, and Paginate Scans
  const filteredScans = useMemo(() => {
    const processed = displayedScans.filter(scan => {
      const matchName = (scan.patientName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = scan.patientId?.toString().includes(searchTerm);
      const passesSearch = matchName || matchId;

      let passesStatus = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'processing') {
          passesStatus = scan.status !== 'completed' && scan.status !== 'failed';
        } else {
          passesStatus = scan.status === statusFilter;
        }
      }

      return passesSearch && passesStatus;
    });

    processed.sort((a, b) => {
      if (sortBy === 'newest') {
        return Number(b.id) - Number(a.id);
      } else {
        return Number(a.id) - Number(b.id);
      }
    });

    return processed;
  }, [displayedScans, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredScans.length / ITEMS_PER_PAGE) || 1;
  const paginatedScans = filteredScans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardLayout title="Upload & Analyze">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* ================= Upload Card ================= */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
            <CardTitle className="text-2xl text-slate-800">Upload Dental Image</CardTitle>
            <CardDescription className="text-base text-slate-500">
              Select a patient and upload their dental scan for AI-powered analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">

            {/* Patient Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                1. Select Patient <span className="text-red-500">*</span>
              </label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient} disabled={uploading || analyzing || !!completedScanId}>
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Search or choose a patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {getPatientDisplayName(p)} <span className="text-slate-400 text-sm ml-2">(ID: {p.id})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Upload Zone */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                2. Upload Scan <span className="text-red-500">*</span>
              </label>

              {!file ? (
                <div
                  className={cn(
                    'flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer',
                    'border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 group'
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setFile(f);
                      setPreviewUrl(URL.createObjectURL(f));
                    }}
                  />
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="font-semibold text-slate-700 text-lg mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500">Supported formats: PNG, JPG, DICOM (Max 10MB)</p>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={80}
                      height={80}
                      unoptimized
                      className="w-20 h-20 rounded-lg object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center">
                      <FileImage className="text-slate-400 h-8 w-8" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  
                  {!uploading && !analyzing && !completedScanId && (
                    <Button variant="ghost" size="icon" onClick={clearSelection} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Actions & Status */}
            <div className="pt-4">
              {uploading && (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="font-medium text-slate-600">Uploading secure image...</p>
                </div>
              )}

              {analyzing && (
                <div className="flex flex-col items-center justify-center py-4 space-y-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="relative">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 relative z-10" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-blue-900 text-lg">AI Analysis in Progress</p>
                    <p className="text-sm text-blue-600/80">Detecting anomalies and generating report...</p>
                  </div>
                </div>
              )}

              {!analyzing && completedScanId && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-900">Analysis complete</p>
                        <p className="text-sm text-emerald-700">The scan is ready to review.</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/analysis/${completedScanId}`)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      View Report
                    </Button>
                  </div>

                  <Button 
                    onClick={handleNewScan} 
                    variant="outline"
                    className="w-full h-14 text-lg border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <UploadCloud className="mr-2 h-5 w-5" /> Scan Another Image
                  </Button>
                </div>
              )}

              {/* Added !completedScanId check to hide this when finished */}
              {file && !uploading && !analyzing && !completedScanId && (
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedPatient} 
                  className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                >
                  Start AI Analysis <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              
              {!selectedPatient && file && !uploading && !analyzing && !completedScanId && (
                <p className="text-sm text-amber-600 flex items-center justify-center mt-3">
                  <AlertCircle className="h-4 w-4 mr-1" /> Please select a patient to continue
                </p>
              )}
            </div>

          </CardContent>
        </Card>

        {/* ================= Recent Scans (Paginated & Filtered) ================= */}
        <Card className="border-slate-200 shadow-sm flex flex-col h-full">
          <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>Status of the most recently uploaded imagery.</CardDescription>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              
              <div className="relative w-full sm:w-56">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Filter by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-10"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[130px] h-10 text-sm">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] h-10 text-sm">
                    <Filter className="w-4 h-4 mr-2 text-slate-500" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </CardHeader>
          
          <CardContent className="space-y-3 pt-6 flex-1 min-h-[400px]">
            {filteredScans.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 h-full flex flex-col items-center justify-center">
                <Search className="h-8 w-8 mb-3 text-slate-300" />
                <p className="font-medium text-slate-600">No scans found</p>
                <p className="text-sm mt-1">
                  {(searchTerm || statusFilter !== 'all') ? "Adjust your filters or search term to see results." : "You haven't uploaded any scans yet."}
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    variant="link" 
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} 
                    className="mt-2 text-blue-600"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3 h-full">
                {paginatedScans.map(scan => (
                  <div key={scan.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl p-4 gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{scan.patientName ?? 'Unknown Patient'}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span>ID #{scan.patientId != null ? scan.patientId.toString().padStart(4, '0') : '----'}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{scan.uploadedAt ?? 'Just now'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {scan.status === 'completed' ? (
                        <span className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium border border-emerald-100 min-w-[110px] justify-center">
                          <CheckCircle2 className="h-4 w-4 mr-1.5" /> Completed
                        </span>
                      ) : scan.status === 'failed' ? (
                        <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium border border-red-100 min-w-[110px] justify-center">
                          <AlertCircle className="h-4 w-4 mr-1.5" /> Failed
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium border border-amber-100 min-w-[110px] justify-center">
                          <Clock className="h-4 w-4 mr-1.5 animate-pulse" /> Processing
                        </span>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/analysis/${scan.id}`)}
                        disabled={scan.status !== 'completed'}
                        className="whitespace-nowrap"
                      >
                        View Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {/* Pagination Controls */}
          {filteredScans.length > ITEMS_PER_PAGE && (
            <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between rounded-b-xl mt-auto">
              <p className="text-sm text-slate-500 font-medium">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredScans.length)} of {filteredScans.length}
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <div className="text-sm font-medium text-slate-700 px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>

      </div>
    </DashboardLayout>
  );
}