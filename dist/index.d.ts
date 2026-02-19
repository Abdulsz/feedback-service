import { default as default_2 } from 'react';

export declare interface EmbedInitConfig {
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
    onSubmit?: (data: {
        feedbackId: string;
        type: string;
    }) => void;
    onError?: (error: string) => void;
}

export declare const FeedbackWidget: default_2.ForwardRefExoticComponent<FeedbackWidgetProps & default_2.RefAttributes<WidgetHandle>>;

export declare interface FeedbackWidgetProps {
    projectId: string;
    apiKey: string;
    apiBaseUrl?: string;
    config?: WidgetConfig;
    onOpen?: () => void;
    onClose?: () => void;
    onSubmit?: (data: {
        feedbackId: string;
        type: string;
    }) => void;
    onError?: (error: string) => void;
    userId?: string;
    userEmail?: string;
    customMetadata?: Record<string, unknown>;
}

export declare interface WidgetConfig {
    theme?: WidgetTheme;
    position?: WidgetPosition;
    primaryColor?: string;
    title?: string;
    showEmail?: boolean;
}

export declare interface WidgetHandle {
    open: () => void;
    close: () => void;
}

export declare type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export declare type WidgetTheme = 'light' | 'dark';

export { }
