
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
export const initSentry = () => {
    if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
            integrations: [
                new BrowserTracing()
            ],
            tracesSampleRate: 1.0,
            environment: import.meta.env.MODE
        });
    }
};

// Initialize Google Analytics
export const initGoogleAnalytics = () => {
    if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GOOGLE_ANALYTICS_ID}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        
        function gtag(...args: any[]) {
            window.dataLayer.push(arguments);
        }
        
        gtag('js', new Date());
        gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
    }
};

// Track page view
export const trackPageView = (path: string) => {
    if (window.gtag) {
        window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
            page_path: path
        });
    }
};

// Track event
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};

// Log error to Sentry
export const logError = (error: Error, context?: any) => {
    Sentry.captureException(error, {
        extra: context
    });
};
