'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileImage, X, Loader2, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOCK_PATIENTS } from '@/lib/mockData';

export default function UploadScan() {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    setPreviewUrl(URL.createObjectURL(droppedFile));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = () => {
    if (!file || !selectedPatient) return;

    setUploading(true);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setAnalyzing(true);

          setTimeout(() => {
            router.push('/analysis/501');
          }, 2000);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <DashboardLayout title="Upload & Analyze">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>Upload Dental Image</CardTitle>
            <CardDescription>
              Upload dental images for AI-powered analysis.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Patient Selection
              </label>

              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-full bg-white border-slate-200">
                  <SelectValue placeholder="Choose a patient" />
                </SelectTrigger>

                <SelectContent>
                  {MOCK_PATIENTS.map(patient => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name} (ID: #{patient.id.toString().padStart(4, '0')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Upload Zone */}
            {!file && (
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all',
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="h-8 w-8" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Click to upload or drag and drop
                </h3>
                <p className="text-sm text-slate-500">
                  PNG, JPG, SVG, or DICOM (max 10MB)
                </p>
              </div>
            )}

            {/* File Preview */}
            {file && !analyzing && (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-white border rounded-lg flex items-center justify-center mr-3">
                        <FileImage className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {!uploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  {uploading && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </div>

                {previewUrl && (
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Image Preview
                    </label>
                    <div className="aspect-video bg-black/5 border rounded-xl flex items-center justify-center overflow-hidden relative">
                      <Image
                        src={previewUrl as string}
                        alt="Preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                {!uploading && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleUpload}
                      disabled={!selectedPatient}
                      className="bg-blue-600 hover:bg-blue-700 px-8 h-12 text-lg"
                    >
                      Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Analyzing */}
            {analyzing && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center animate-pulse">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="font-bold text-lg">AI Analysis in Progress</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Processing the image to detect caries and anomalies.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
