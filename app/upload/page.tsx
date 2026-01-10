'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Loader2, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { Patient, DiagnosisResult, fetchPatients, fetchRecentScans, uploadScan } from '@/services/scan.service';

export default function UploadScan() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentScans, setRecentScans] = useState<DiagnosisResult[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch patients + recent scans on mount
  useEffect(() => {
    fetchPatients().then(setPatients).catch(console.error);
    fetchRecentScans()
      .then(data => {
        setRecentScans(data);
      })
      .catch(console.error);
  }, []);

  const handleUpload = async () => {
    if (!file || !selectedPatient) return;

    try {
      setUploading(true);
      const scan = await uploadScan(file, parseInt(selectedPatient));
      setPreviewUrl(scan.imageUrl || null);
      setAnalyzing(true);

      // Optionally poll for status
      const interval = setInterval(async () => {
        const scansResp = await fetchRecentScans();
        setRecentScans(scansResp);
        const updated = scansResp.find(s => s.id === scan.id);
        if (updated?.status === 'completed') {
          clearInterval(interval);
          setAnalyzing(false);
          router.push(`/analysis/${scan.id}`);
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout title="Upload & Analyze">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ================= Upload Card ================= */}
        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>Upload Dental Image</CardTitle>
            <CardDescription>Upload dental images for AI-powered analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Patient Selection</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Upload Zone */}
            {!file && (
              <div
                className={cn('border-2 border-dashed rounded-xl p-12 text-center cursor-pointer', 'border-slate-200')}
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
                <UploadCloud className="mx-auto h-10 w-10 text-blue-600 mb-4" />
                <p className="font-semibold">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500">PNG, JPG, DICOM (max 10MB)</p>
              </div>
            )}

            {file && !uploading && !analyzing && (
              <Button onClick={handleUpload} disabled={!selectedPatient} className="w-full h-12 text-lg">
                Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {analyzing && (
              <div className="text-center py-6">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-2" />
                <p className="font-semibold">AI Analysis in Progress</p>
              </div>
            )}

          </CardContent>
        </Card>

        {/* ================= Recent Scans ================= */}
        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Latest uploaded dental scans and their analysis status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentScans.map(scan => (
              <div key={scan.id} className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <p className="font-semibold">{scan.patientName ?? 'Unknown Patient'}</p>
                  <p className="text-sm text-slate-500">
                    Patient ID #{scan.patientId != null ? scan.patientId.toString().padStart(4, '0') : '----'}
                  </p>
                  <p className="text-xs text-slate-400">Uploaded: {scan.uploadedAt ?? '—'}</p>
                </div>

                <div className="flex items-center gap-4">
                  {scan.status === 'completed' ? (
                    <span className="flex items-center text-green-600 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600 text-sm font-medium">
                      <Clock className="h-4 w-4 mr-1" /> Processing
                    </span>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/analysis/${scan.id}`)}
                    disabled={scan.status !== 'completed'}
                  >
                    View Analysis
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
