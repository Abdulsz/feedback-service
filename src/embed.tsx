import React, { createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { FeedbackWidget } from './FeedbackWidget';
import type { EmbedInitConfig, WidgetHandle } from './types';

interface WidgetInstance {
  root: Root;
  container: HTMLDivElement;
  widgetRef: React.RefObject<WidgetHandle | null>;
}

let instance: WidgetInstance | null = null;

function init(config: EmbedInitConfig): void {
  if (instance) {
    console.warn('[FeedbackWidget] Already initialized. Call destroy() first to re-initialize.');
    return;
  }

  const { projectId, apiKey } = config;
  if (!projectId || !apiKey) {
    console.error('[FeedbackWidget] projectId and apiKey are required.');
    return;
  }

  const container = document.createElement('div');
  container.id = 'feedback-widget-root';
  document.body.appendChild(container);

  const shadowRoot = container.attachShadow({ mode: 'open' });
  const mountPoint = document.createElement('div');
  shadowRoot.appendChild(mountPoint);

  const widgetRef = createRef<WidgetHandle>();
  const root = createRoot(mountPoint);

  root.render(
    <FeedbackWidget
      ref={widgetRef}
      projectId={projectId}
      apiKey={apiKey}
      apiBaseUrl={config.apiBaseUrl}
      config={{
        theme: config.theme,
        position: config.position,
        primaryColor: config.primaryColor,
        title: config.title,
        showEmail: config.showEmail,
      }}
      onOpen={config.onOpen}
      onClose={config.onClose}
      onSubmit={config.onSubmit}
      onError={config.onError}
      userId={config.userId}
      userEmail={config.email}
      customMetadata={config.customMetadata}
    />
  );

  instance = { root, container, widgetRef };
}

function open(): void {
  if (!instance) {
    console.warn('[FeedbackWidget] Not initialized. Call init() first.');
    return;
  }
  instance.widgetRef.current?.open();
}

function close(): void {
  if (!instance) {
    console.warn('[FeedbackWidget] Not initialized. Call init() first.');
    return;
  }
  instance.widgetRef.current?.close();
}

function destroy(): void {
  if (!instance) return;
  instance.root.unmount();
  instance.container.remove();
  instance = null;
}

(window as unknown as Record<string, unknown>).FeedbackWidget = {
  init,
  open,
  close,
  destroy,
};
