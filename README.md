# ngx-worker-bridge

A lightweight, reactive communication layer for **Angular** and **React** that reduces the overhead of working with Dedicated and Shared Web Workers.

## Concept: Logic vs UI

This library enforces a clean separation between your UI and your background logic:
- **Main Thread (UI)**: Your Angular Services or React Components.
- **Worker Thread (Logic)**: Pure TypeScript classes (Modules) that handle business logic, CPU-heavy tasks, or shared state.

## Quick Start (Common Core)

### 1. In your Worker (`app.worker.ts`)
```typescript
import { startWorker } from 'ngx-worker-bridge';
import { DataModule } from './data.module';

startWorker([DataModule]);
```

---

## Angular Support

### 2. In your Main App (`main.ts`)
```typescript
import { provideWorkerBridge } from 'ngx-worker-bridge/angular';

bootstrapApplication(AppComponent, {
  providers: [
    provideWorkerBridge({ 
      name: 'shared_api', 
      instance: new SharedWorker(new URL('./app.worker', import.meta.url)) 
    })
  ]
});
```

### 3. In your Service
```typescript
import { RunInWorker, workerStore } from 'ngx-worker-bridge';

@Injectable({ providedIn: 'root' })
export class DataService {
  stats$ = workerStore("stats", "shared_api");

  @RunInWorker({ bridge: "shared_api" })
  fetchData() { } 
}
```

---

## React Support

### 2. In your Entry Point (`main.tsx`)
```typescript
import { bootstrapWorker } from 'ngx-worker-bridge';

bootstrapWorker({
  name: 'shared_api',
  worker: new SharedWorker(new URL('./app.worker', import.meta.url))
});
```

### 3. In your Component
```typescript
import { useWorkerStore } from 'ngx-worker-bridge/react';
import { RunInWorker } from 'ngx-worker-bridge';

class DataService {
  @RunInWorker({ bridge: "shared_api" })
  async fetchData() { }
}

const api = new DataService();

function App() {
  const stats = useWorkerStore("stats", "shared_api");
  return <div onClick={() => api.fetchData()}>Progress: {stats?.percent}%</div>;
}
```

## Best Use Cases
- **Multi-Tab State Sync**: Use a `SharedWorker` to keep data (like notification counts or charts) in sync across all open browser tabs.
- **CPU Offloading**: Move heavy data processing (sorting, filtering large JSONs, math) out of the main thread.
- **Shared Connections**: Maintain a single WebSocket or Polling interval in a SharedWorker that broadcasts updates to all connected tabs.

## Debugging
The library automatically proxies `console.log`, `console.warn`, and `console.error` from the background worker to your main browser console, prefixed with `[Worker]`.

## Demo
Check out the [Demo Repository (Angular Only)](https://github.com/yashwantyashu/worker-demo-app) to see this in action. A React demo will be added soon.
