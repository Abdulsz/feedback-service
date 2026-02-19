import React from 'react';
import { createRoot } from 'react-dom/client';
import { FeedbackWidget } from '../src/FeedbackWidget';

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 40 }}>
      <h1>Feedback Widget — React Demo</h1>
      <p>Click the chat bubble in the bottom-right corner to open the feedback form.</p>

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <button
          onClick={() => document.querySelector<HTMLButtonElement>('[data-feedback-widget] button')?.click()}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ccc', cursor: 'pointer' }}
        >
          Toggle Widget
        </button>
      </div>

      <FeedbackWidget
        projectId="proj_demo123"
        apiKey="fbk_demo_key"
        apiBaseUrl="url"
        config={{
          theme: 'light',
          position: 'bottom-right',
          primaryColor: '#5c5ce6',
          title: 'Help us improve!',
        }}
        onSubmit={(data) => console.log('Submitted:', data)}
        onError={(err) => console.error('Error:', err)}
        onOpen={() => console.log('Widget opened')}
        onClose={() => console.log('Widget closed')}
      />
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
