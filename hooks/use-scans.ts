import { useState, useEffect } from 'react';
import { MOCK_SCANS, MOCK_ANALYSES, delay, type Scan, type Analysis } from '@/lib/mockData';


// note: these are mock hooks
export function usePatientScans(patientId: number) {
  const [data, setData] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      setIsLoading(true);
      await delay(700);
      const scans = MOCK_SCANS.filter(s => s.patientId === patientId);
      setData(scans);
      setIsLoading(false);
    };
    fetchScans();
  }, [patientId]);

  return { data, isLoading };
}

export function useScanAnalysis(scanId: number) {
  const [data, setData] = useState<Analysis | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      await delay(1000); // Analysis takes longer
      const analysis = MOCK_ANALYSES.find(a => a.scanId === scanId);
      setData(analysis);
      setIsLoading(false);
    };
    fetchAnalysis();
  }, [scanId]);

  return { data, isLoading };
}
