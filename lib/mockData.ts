import { RiskLevel } from "@/app/patients/components/RiskBadge";

export type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  lastVisit?: Date;
  riskProfile?: RiskLevel;
  notes?: string;
};

export type Scan = {
  id: number;
  patientId: number;
  date: Date;
  imageUrl: string;
  type: string;
  status: string;
};

export type Analysis = {
  id: number;
  scanId: number;
  severity: string;
  confidence: number;
  findings: string[];
  heatmapOverlayUrl?: string;
  aiNotes?: string;
  createdAt: Date;
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    age: 34,
    gender: "Female",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    lastVisit: new Date("2023-10-15"),
    riskProfile: "Moderate",
    notes: "History of gingivitis. Sensitive teeth."
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 42,
    gender: "Male",
    email: "m.chen@example.com",
    phone: "+1 (555) 987-6543",
    lastVisit: new Date("2023-11-02"),
    riskProfile: "Low",
    notes: "Routine cleaning needed every 6 months."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    age: 28,
    gender: "Female",
    email: "emily.r@example.com",
    phone: "+1 (555) 456-7890",
    lastVisit: new Date("2023-09-20"),
    riskProfile: "High",
    notes: "Multiple active caries lesions monitored."
  },
  {
    id: 4,
    name: "James Wilson",
    age: 55,
    gender: "Male",
    email: "j.wilson@example.com",
    phone: "+1 (555) 234-5678",
    lastVisit: new Date("2023-10-05"),
    riskProfile: "Moderate",
    notes: "Previous root canal on #14."
  },
  {
    id: 5,
    name: "Anita Patel",
    age: 41,
    gender: "Female",
    email: "anita.p@example.com",
    phone: "+1 (555) 876-5432",
    lastVisit: new Date("2023-11-10"),
    riskProfile: "Low",
    notes: "Excellent oral hygiene."
  }
];

export const MOCK_SCANS: Scan[] = [
  {
    id: 101,
    patientId: 3,
    date: new Date("2023-09-20T10:30:00"),
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600&h=400", // Dental X-ray placeholder
    type: "Bitewing",
    status: "analyzed"
  },
  {
    id: 102,
    patientId: 1,
    date: new Date("2023-10-15T14:15:00"),
    imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600&h=400", // Dental tech placeholder
    type: "Panoramic",
    status: "analyzed"
  },
  {
    id: 103,
    patientId: 3,
    date: new Date("2023-11-12T09:00:00"),
    imageUrl: "https://images.unsplash.com/photo-1606811841689-230391b4291b?auto=format&fit=crop&q=80&w=600&h=400", // Dental model placeholder
    type: "Periapical",
    status: "pending"
  }
];

export const MOCK_ANALYSES: Analysis[] = [
  {
    id: 501,
    scanId: 101,
    severity: "Advanced",
    confidence: 94,
    findings: ["Deep caries on #19 distal", "Bone loss indicated"],
    heatmapOverlayUrl: "/overlays/heatmap1.png",
    aiNotes: "Urgent intervention recommended. Lesion depth > 2mm into dentin.",
    createdAt: new Date("2023-09-20T10:35:00")
  },
  {
    id: 502,
    scanId: 102,
    severity: "Incipient",
    confidence: 88,
    findings: ["Early demineralization #3 mesial"],
    heatmapOverlayUrl: "/overlays/heatmap2.png",
    aiNotes: "Monitor closely. Recommend fluoride treatment.",
    createdAt: new Date("2023-10-15T14:20:00")
  }
];

// Helper to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback logic for frontend-only mode
export const getAnalysisOrDefault = (id: number): any => {
  return MOCK_ANALYSES.find(a => a.id === id) || MOCK_ANALYSES[0];
};

export const getScanOrDefault = (id: number): any => {
  return MOCK_SCANS.find(s => s.id === id) || MOCK_SCANS[0];
};