"use client";

import { useRoute, Link } from "wouter";
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share2, Download, Maximize2, Check, Info } from 'lucide-react';
import { useScanAnalysis } from '@/hooks/use-scans';
import { MOCK_SCANS, MOCK_ANALYSES } from '@/lib/mockData'; 
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function AnalysisResult() {
  const [, params] = useRoute('/analysis/:id');
  const id = parseInt(params?.id || '0');
  
  const { data: analysis, isLoading } = useScanAnalysis(id);
  // Find the scan
  const scan = MOCK_SCANS.find(s => s.id === (analysis?.scanId || 101)) || MOCK_SCANS[0];
  const [showOverlay, setShowOverlay] = useState(true);

  if (isLoading) {
    return (
      <DashboardLayout title="Analysis Result">
         <Skeleton className="h-150 w-full rounded-xl" />
      </DashboardLayout>
    );
  }

  // Fallback for showcase purposes
  const displayAnalysis = analysis || MOCK_ANALYSES[0];

  return (
    <DashboardLayout title={`Analysis Report #${id}`}>
      <div className="mb-6 flex justify-between items-center">
        <Link href={`/patients/${scan.patientId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Patient
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button variant="outline" size="sm" className="bg-white">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        
        {/* Main Image Viewer */}
        <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden relative group shadow-2xl">
          <div className="absolute top-4 left-4 z-20 flex space-x-2">
            <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-md">
              {scan.type} View
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/80 text-white border-0 backdrop-blur-md">
              AI Confidence: {displayAnalysis.confidence}%
            </Badge>
          </div>

          <div className="absolute top-4 right-4 z-20 flex space-x-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className={`backdrop-blur-md border-0 text-xs ${showOverlay ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-black/50 text-white hover:bg-black/70'}`}
              onClick={() => setShowOverlay(!showOverlay)}
            >
              {showOverlay ? 'Hide AI Overlay' : 'Show AI Overlay'}
            </Button>
            <Button size="icon" variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-md hover:bg-black/70">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Simulated Image */}
            <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
            <Image
              src={scan.imageUrl}
              alt="Scan"
              fill
              className="object-contain"
              unoptimized
            />
            
            {/* Mock AI Overlay Boxes - Positioned absolute */}
            {showOverlay && (
              <>
                <div className="absolute top-[40%] left-[35%] w-[10%] h-[15%] border-2 border-red-500 bg-red-500/20 rounded-sm animate-pulse">
                  <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                    Caries (94%)
                  </div>
                </div>
                 <div className="absolute top-[30%] right-[40%] w-[8%] h-[12%] border-2 border-amber-500 bg-amber-500/20 rounded-sm">
                  <div className="absolute -top-6 left-0 bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                    Watch (65%)
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar: Findings */}
        <div className="flex flex-col space-y-4 h-full overflow-hidden">
          <Card className="flex-1 border-slate-200 shadow-lg flex flex-col overflow-hidden">
            <div className={`p-4 border-b ${
              displayAnalysis.severity === 'Advanced' ? 'bg-red-50 border-red-100' : 
              displayAnalysis.severity === 'Moderate' ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'
            }`}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Detected Severity</div>
              <div className={`text-2xl font-bold ${
                 displayAnalysis.severity === 'Advanced' ? 'text-red-700' : 
                 displayAnalysis.severity === 'Moderate' ? 'text-amber-700' : 'text-green-700'
              }`}>
                {displayAnalysis.severity}
              </div>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-600" /> Key Findings
              </h4>
              
              <div className="space-y-3 mb-6">
                {(displayAnalysis.findings as string[]).map((finding, idx) => (
                  <div key={idx} className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-sm text-slate-700">{finding}</span>
                  </div>
                ))}
              </div>

              <h4 className="font-semibold text-slate-800 mb-3">AI Assessment</h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                {displayAnalysis.aiNotes}
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                <Check className="h-4 w-4 mr-2" /> Verify & Save to Record
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
