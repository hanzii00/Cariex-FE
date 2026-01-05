'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Clock } from 'lucide-react';
import { getDiagnosis } from '@/services/scan.service';

export default function AnalysisPage() {
  const { id } = useParams();
  const router = useRouter();

  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Poll every 2 seconds if analysis not completed
  useEffect(() => {
    let interval: any;
    const fetchData = async () => {
      try {
        const data = await getDiagnosis(parseInt(id));
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

  if (loading || !diagnosis) {
    return (
      <DashboardLayout title="Analysis">
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="font-semibold">Loading analysis...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analysis Results">
      <div className="max-w-3xl mx-auto space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Uploaded X-ray</CardTitle>
            <CardDescription>Original dental X-ray image.</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={diagnosis.image_url} alt="Uploaded X-ray" className="w-full rounded-lg border border-slate-200" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              Status: {diagnosis.status === 'completed' ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle2 className="mr-1 h-5 w-5" /> Completed
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center">
                  <Clock className="mr-1 h-5 w-5" /> {diagnosis.status}
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        {diagnosis.has_caries !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Detection Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Lesions Detected: {diagnosis.num_lesions ?? diagnosis.lesion_boxes?.length ?? 0}</p>
              <p>Affected Area: {(diagnosis.affected_percentage ?? 0).toFixed(2)}%</p>
            </CardContent>
          </Card>
        )}

        {diagnosis.severity && (
          <Card>
            <CardHeader>
              <CardTitle>Severity Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Severity: {diagnosis.severity}</p>
              <p>Confidence: {(diagnosis.confidence_score ?? 0).toFixed(2)}%</p>
            </CardContent>
          </Card>
        )}

        {diagnosis.xai_url && (
          <Card>
            <CardHeader>
              <CardTitle>XAI Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={diagnosis.xai_url} alt="XAI Explanation" className="w-full rounded-lg border border-slate-200" />
            </CardContent>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
