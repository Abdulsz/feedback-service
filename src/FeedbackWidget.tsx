import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import type {
  FeedbackWidgetProps,
  FeedbackSubmitPayload,
  FeedbackSubmitResponse,
  WidgetHandle,
  WidgetTheme,
} from './types';

const DEFAULT_API_BASE_URL = 'http://localhost:8787';

type WidgetState = 'idle' | 'open' | 'submitting' | 'success';

interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  shadow: string;
}

function getThemeColors(theme: WidgetTheme): ThemeColors {
  if (theme === 'dark') {
    return {
      bg: '#1a1a2e',
      surface: '#16213e',
      text: '#e0e0e0',
      textSecondary: '#a0a0b0',
      border: '#2a2a4a',
      inputBg: '#0f3460',
      inputBorder: '#2a2a4a',
      inputText: '#e0e0e0',
      shadow: 'rgba(0, 0, 0, 0.4)',
    };
  }
  return {
    bg: '#ffffff',
    surface: '#f8f9fa',
    text: '#1a1a1a',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    inputBg: '#ffffff',
    inputBorder: '#d1d5db',
    inputText: '#1a1a1a',
    shadow: 'rgba(0, 0, 0, 0.15)',
  };
}

function getPositionStyles(
  position: string
): React.CSSProperties {
  const base: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
  const offset = 20;
  switch (position) {
    case 'bottom-left':
      return { ...base, bottom: offset, left: offset };
    case 'top-right':
      return { ...base, top: offset, right: offset };
    case 'top-left':
      return { ...base, top: offset, left: offset };
    default:
      return { ...base, bottom: offset, right: offset };
  }
}

function getPanelPosition(position: string): React.CSSProperties {
  const isTop = position.startsWith('top');
  const isLeft = position.endsWith('left');
  const style: React.CSSProperties = {
    position: 'absolute',
    ...(isLeft ? { left: 0 } : { right: 0 }),
    ...(isTop ? { top: 64 } : { bottom: 64 }),
  };
  return style;
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export const FeedbackWidget = forwardRef<WidgetHandle, FeedbackWidgetProps>(
  function FeedbackWidget(props, ref) {
    const {
      projectId,
      apiKey,
      apiBaseUrl = DEFAULT_API_BASE_URL,
      config = {},
      onOpen,
      onClose,
      onSubmit,
      onError,
      userId,
      userEmail,
      customMetadata,
    } = props;

    const {
      theme = 'light',
      position = 'bottom-right',
      primaryColor = '#007bff',
      title = 'Send us your feedback',
      showEmail = true,
    } = config;

    const [widgetState, setWidgetState] = useState<WidgetState>('idle');
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formEmail, setFormEmail] = useState(userEmail ?? '');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 400);
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }, []);

    const openWidget = useCallback(() => {
      setWidgetState('open');
      requestAnimationFrame(() => setIsVisible(true));
      onOpen?.();
    }, [onOpen]);

    const closeWidget = useCallback(() => {
      setIsVisible(false);
      setTimeout(() => {
        setWidgetState('idle');
        setFormTitle('');
        setFormDescription('');
        setFormEmail(userEmail ?? '');
        setErrorMessage('');
      }, 200);
      onClose?.();
    }, [onClose, userEmail]);

    useImperativeHandle(ref, () => ({ open: openWidget, close: closeWidget }), [
      openWidget,
      closeWidget,
    ]);

    const handleToggle = useCallback(() => {
      if (widgetState === 'idle') {
        openWidget();
      } else {
        closeWidget();
      }
    }, [widgetState, openWidget, closeWidget]);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!formTitle.trim() || !formDescription.trim()) {
          setErrorMessage('Title and description are required.');
          return;
        }

        setWidgetState('submitting');

        const payload: FeedbackSubmitPayload = {
          projectId,
          title: formTitle.trim(),
          description: formDescription.trim(),
          ...(formEmail.trim() && { email: formEmail.trim() }),
          metadata: {
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer,
            ...(userId && { userId }),
            customFields: customMetadata,
          },
        };

        try {
          const res = await fetch(`${apiBaseUrl}/api/feedback/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': apiKey,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const messages: Record<number, string> = {
              400: 'Missing required fields. Please fill in all required fields.',
              401: 'Authentication failed. Invalid API key.',
              403: 'Access denied. Invalid API key or project mismatch.',
            };
            const msg = messages[res.status] ?? `Something went wrong (${res.status}). Please try again.`;
            setErrorMessage(msg);
            setWidgetState('open');
            onError?.(msg);
            return;
          }

          const data: FeedbackSubmitResponse = await res.json();
          onSubmit?.({ feedbackId: data.data.feedbackId, type: data.data.type });

          setWidgetState('success');
          setTimeout(() => closeWidget(), 2000);
        } catch {
          const msg = 'Network error. Please check your connection and try again.';
          setErrorMessage(msg);
          setWidgetState('open');
          onError?.(msg);
        }
      },
      [
        formTitle,
        formDescription,
        formEmail,
        projectId,
        apiKey,
        apiBaseUrl,
        userId,
        customMetadata,
        onSubmit,
        onError,
        closeWidget,
      ]
    );

    const colors = getThemeColors(theme);
    const posStyles = getPositionStyles(position);
    const panelPos = getPanelPosition(position);

    const buttonStyle: React.CSSProperties = {
      width: 52,
      height: 52,
      borderRadius: '50%',
      border: 'none',
      backgroundColor: primaryColor,
      color: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 12px ${colors.shadow}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
    };

    const panelWidth = isMobile ? 'calc(100vw - 32px)' : 360;
    const panelStyle: React.CSSProperties = {
      ...panelPos,
      width: panelWidth,
      backgroundColor: colors.bg,
      borderRadius: 12,
      boxShadow: `0 8px 30px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
      overflow: 'hidden',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.2s ease, transform 0.2s ease',
      pointerEvents: isVisible ? 'auto' : 'none',
      ...(isMobile && {
        position: 'fixed' as const,
        left: 16,
        right: 16,
        width: 'auto',
        ...(position.startsWith('top') ? { top: 80 } : { bottom: 80 }),
      }),
    };

    const headerStyle: React.CSSProperties = {
      padding: '16px 20px',
      backgroundColor: primaryColor,
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '10px 12px',
      borderRadius: 8,
      border: `1px solid ${colors.inputBorder}`,
      backgroundColor: colors.inputBg,
      color: colors.inputText,
      fontSize: 14,
      fontFamily: 'inherit',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.15s ease',
    };

    const labelStyle: React.CSSProperties = {
      display: 'block',
      fontSize: 13,
      fontWeight: 500,
      color: colors.textSecondary,
      marginBottom: 6,
    };

    const submitBtnStyle: React.CSSProperties = {
      width: '100%',
      padding: '11px 16px',
      borderRadius: 8,
      border: 'none',
      backgroundColor: primaryColor,
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 600,
      cursor: widgetState === 'submitting' ? 'not-allowed' : 'pointer',
      opacity: widgetState === 'submitting' ? 0.7 : 1,
      transition: 'opacity 0.15s ease',
      outline: 'none',
    };

    const isOpen = widgetState !== 'idle';

    return (
      <div style={posStyles} data-feedback-widget>
        <button
          onClick={handleToggle}
          style={buttonStyle}
          aria-label={isOpen ? 'Close feedback' : 'Open feedback'}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </button>

        {isOpen && (
          <div ref={panelRef} style={panelStyle}>
            {widgetState === 'success' ? (
              <div
                style={{
                  padding: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ color: '#22c55e' }}>
                  <CheckIcon />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: colors.text,
                    textAlign: 'center',
                  }}
                >
                  Thanks for your feedback!
                </p>
              </div>
            ) : (
              <>
                <div style={headerStyle}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
                  <button
                    onClick={closeWidget}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0.8,
                    }}
                    aria-label="Close"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div>
                    <label style={labelStyle}>
                      Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Brief summary of your feedback"
                      style={inputStyle}
                      disabled={widgetState === 'submitting'}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Description <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Describe your feedback in detail..."
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      disabled={widgetState === 'submitting'}
                    />
                  </div>

                  {showEmail && (
                    <div>
                      <label style={labelStyle}>Email (optional)</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={inputStyle}
                        disabled={widgetState === 'submitting'}
                      />
                    </div>
                  )}

                  {errorMessage && (
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        backgroundColor: theme === 'dark' ? '#3b1111' : '#fef2f2',
                        border: `1px solid ${theme === 'dark' ? '#5c1e1e' : '#fecaca'}`,
                        color: '#ef4444',
                        fontSize: 13,
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  <button type="submit" style={submitBtnStyle} disabled={widgetState === 'submitting'}>
                    {widgetState === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);
