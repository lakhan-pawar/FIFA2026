/**
 * Privacy and Consent Management Types
 */

export interface ConsentSettings {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  personalization: boolean;
  thirdPartyData: boolean;
  marketing: boolean;
}

export interface ConsentBanner {
  isVisible: boolean;
  hasConsented: boolean;
  consentSettings?: ConsentSettings;
}

export interface PrivacySettings {
  dataExportRequested: boolean;
  dataDeletionRequested: boolean;
  lastExportDate?: string;
  consentWithdrawn: boolean;
}

// Re-export database types for convenience
export type {
  UserConsent,
  UserConsentInsert,
  UserConsentUpdate,
  DataExportRequest,
  DataExportRequestInsert,
  DataExportRequestUpdate,
  DataDeletionRequest,
  DataDeletionRequestInsert,
  DataDeletionRequestUpdate,
} from './database';
