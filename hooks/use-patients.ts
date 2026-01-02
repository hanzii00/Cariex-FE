import { useState, useEffect } from 'react';
import { MOCK_PATIENTS, delay, type Patient } from '@/lib/mockData';

// This is a mock hook
export function usePatients() {
  const [data, setData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      await delay(800); // Simulate network latency
      setData(MOCK_PATIENTS);
      setIsLoading(false);
    };
    fetchPatients();
  }, []);

  return { data, isLoading };
}

export function usePatient(id: number) {
  const [data, setData] = useState<Patient | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      setIsLoading(true);
      await delay(600);
      const patient = MOCK_PATIENTS.find(p => p.id === id);
      setData(patient);
      setIsLoading(false);
    };
    fetchPatient();
  }, [id]);

  return { data, isLoading };
}
