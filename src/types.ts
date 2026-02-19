export type WidgetTheme = 'light' | 'dark';
export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface WidgetConfig {
  theme?: WidgetTheme;
  position?: WidgetPosition;
  primaryColor?: string;
  title?: string;
  showEmail?: boolean;
}

export interface FeedbackWidgetProps {
  projectId: string;
  apiKey: string;
  apiBaseUrl?: string;

  config?: WidgetConfig;

  onOpen?: () => void;
  onClose?: () => void;
  onSubmit?: (data: { feedbackId: string; type: string }) => void;
  onError?: (error: string) => void;

  userId?: string;
  userEmail?: string;
  customMetadata?: Record<string, unknown>;
}

export interface EmbedInitConfig {
  projectId: string;
  apiKey: string;
  apiBaseUrl?: string;
  theme?: WidgetTheme;
  position?: WidgetPosition;
  primaryColor?: string;
  title?: string;
  showEmail?: boolean;
  userId?: string;
  email?: string;
  customMetadata?: Record<string, unknown>;
  onOpen?: () => void;
  onClose?: () => void;
  onSubmit?: (data: { feedbackId: string; type: string }) => void;
  onError?: (error: string) => void;
}

export interface FeedbackSubmitPayload {
  projectId: string;
  title: string;
  description: string;
  email?: string;
  metadata?: {
    userAgent?: string;
    url?: string;
    referrer?: string;
    userId?: string;
    customFields?: Record<string, unknown>;
  };
}

export interface FeedbackSubmitResponse {
  success: boolean;
  data: {
    feedbackId: string;
    type: 'technical' | 'non-technical';
    category: 'bug' | 'feature' | 'improvement' | 'general';
  };
}

export interface WidgetHandle {
  open: () => void;
  close: () => void;
}
