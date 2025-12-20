import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LeadData {
  id?: string;
  name: string;
  email: string;
  ebookDownloaded: boolean;
  portalAccessed: boolean;
  reportsDownloaded: boolean;
  analysisCompleted: boolean;
  violationsFound: number;
  callBooked: boolean;
  source?: string;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
}

interface LeadContextType {
  lead: LeadData | null;
  setLead: (lead: LeadData | null) => void;
  updateLead: (updates: Partial<LeadData>) => void;
  clearLead: () => void;
  isLoading: boolean;
}

const defaultLead: LeadData = {
  name: '',
  email: '',
  ebookDownloaded: false,
  portalAccessed: false,
  reportsDownloaded: false,
  analysisCompleted: false,
  violationsFound: 0,
  callBooked: false,
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

const STORAGE_KEY = 'carc_lead_data';

export function LeadProvider({ children }: { children: ReactNode }) {
  const [lead, setLeadState] = useState<LeadData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLeadState(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading lead data:', error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage when lead changes
  useEffect(() => {
    if (lead) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
    }
  }, [lead]);

  const setLead = (newLead: LeadData | null) => {
    setLeadState(newLead);
  };

  const updateLead = (updates: Partial<LeadData>) => {
    setLeadState(prev => {
      if (!prev) return { ...defaultLead, ...updates };
      return { ...prev, ...updates };
    });
  };

  const clearLead = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLeadState(null);
  };

  return (
    <LeadContext.Provider value={{ lead, setLead, updateLead, clearLead, isLoading }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLead() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLead must be used within a LeadProvider');
  }
  return context;
}

// Helper to parse UTM params from URL
export function parseUTMParams(): Partial<LeadData> {
  const params = new URLSearchParams(window.location.search);
  return {
    utmCampaign: params.get('utm_campaign') || undefined,
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    source: params.get('source') || params.get('utm_source') || undefined,
  };
}
