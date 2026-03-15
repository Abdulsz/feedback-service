# @devfeedback/react-widget

A lightweight feedback widget for React apps, with an optional embeddable script build for non-React pages.

## Features

- Drop-in React component (`FeedbackWidget`)
- Script embed API (`window.FeedbackWidget`)
- Shadow DOM isolation for embed usage
- TypeScript type definitions included
- Theming and position configuration

## How it works

The backend is powered by **Cloudflare Workers**, providing a globally distributed, low-latency API for receiving and storing feedback submissions.

When technical feedback is submitted through the widget, a **GitHub PR Agent** automatically opens a pull request in your repository summarizing the feedback — so developers can review, discuss, and act on it directly in their existing workflow. All feedback is also surfaced in the **developer dashboard**, giving your team a central place to track and triage user-reported issues and suggestions.

## Installation

```bash
npm install @devfeedback/react-widget
```

Peer dependencies:

- `react >= 17`
- `react-dom >= 17`

## React usage

```tsx
import { FeedbackWidget } from '@devfeedback/react-widget';

export function App() {
  return (
    <FeedbackWidget
      projectId="your-project-id"
      apiKey="your-api-key"
      config={{
        theme: 'light',
        position: 'bottom-right',
        primaryColor: '#5c5ce6',
        title: 'Help us improve!',
        showEmail: true,
      }}
      onSubmit={(data) => console.log('submitted', data)}
      onError={(error) => console.error(error)}
    />
  );
}
```

## Embed usage (non-React)

Load the built embed script and initialize it from `window.FeedbackWidget`.

```html
<script src="https://unpkg.com/@devfeedback/react-widget@latest/dist/embed/feedback-widget.js"></script>
<script>
  window.FeedbackWidget.init({
    projectId: 'your-project-id',
    apiKey: 'your-api-key',
    apiBaseUrl: 'https://your-api.example.com',
    theme: 'light',
    position: 'bottom-right',
    title: 'Help us improve!',
    showEmail: true
  });
</script>
```

Available embed methods:

- `window.FeedbackWidget.init(config)`
- `window.FeedbackWidget.open()`
- `window.FeedbackWidget.close()`
- `window.FeedbackWidget.destroy()`

## API reference

### `FeedbackWidget` props

- `projectId` (string, required): Feedback project identifier
- `apiKey` (string, required): API key sent in `X-API-Key` header
- `apiBaseUrl` (string, optional): Base API URL. If it does not end with `/api/feedback/submit`, that path is appended automatically.
- `config` (object, optional):
  - `theme`: `'light' | 'dark'`
  - `position`: `'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`
  - `primaryColor`: string
  - `title`: string
  - `showEmail`: boolean
- `onOpen` (function, optional)
- `onClose` (function, optional)
- `onSubmit` (function, optional): receives `{ feedbackId, type }`
- `onError` (function, optional): receives error message string
- `userId` (string, optional)
- `userEmail` (string, optional)
- `customMetadata` (object, optional)

### Imperative handle (React ref)

`FeedbackWidget` supports a ref with:

- `open()`
- `close()`

## Build commands

```bash
npm run typecheck
npm run build
npm run build:embed
npm run build:all
```

## Package contents

Published files:

- `dist/index.mjs`
- `dist/index.cjs`
- `dist/index.d.ts`
- `dist/embed/feedback-widget.js`

## Notes

- You can create an account and get API keys at [https://github-pr-agent.zakariatimalma.workers.dev/auth](https://github-pr-agent.zakariatimalma.workers.dev/auth).
- Keep real `apiKey` values out of committed demo code.
- To preview publish contents locally, run `npm pack --dry-run`.
