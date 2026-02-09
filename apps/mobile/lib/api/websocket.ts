export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

type LogCallback = (log: LogEntry) => void;

const SAMPLE_LOGS: string[] = [
  'Scanning port 443...',
  'Handshake established.',
  'Cert validation: OK',
  'Analyzing packet headers...',
  'Traffic anomaly detected.',
  'Heuristic analysis complete.',
  'Cross-referencing database...',
  'Signature match verified.',
  'Uplink stable.',
  'Encrypting payload...',
  'Data packet sent.',
  'Latency: 24ms',
];

export class LiveIntelSocket {
  private static instance: LiveIntelSocket;
  private ws: WebSocket | null = null;
  private listeners: LogCallback[] = [];
  private mockInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): LiveIntelSocket {
    if (!LiveIntelSocket.instance) {
      LiveIntelSocket.instance = new LiveIntelSocket();
    }
    return LiveIntelSocket.instance;
  }

  connect(url?: string) {
    if (url) {
        try {
            this.ws = new WebSocket(url);
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.notifyListeners(data);
            };
            this.ws.onerror = (e) => {
                console.log('WebSocket error, falling back to simulation', e);
                this.startSimulation();
            };
        } catch (e) {
             console.log('WebSocket connection failed, falling back to simulation');
             this.startSimulation();
        }
    } else {
        this.startSimulation();
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }

  subscribe(callback: LogCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(log: LogEntry) {
    this.listeners.forEach(l => l(log));
  }

  private startSimulation() {
    if (this.mockInterval) return;

    this.mockInterval = setInterval(() => {
      const log = this.generateMockLog();
      this.notifyListeners(log);
    }, 2000);
  }

  private generateMockLog(): LogEntry {
    const message = SAMPLE_LOGS[Math.floor(Math.random() * SAMPLE_LOGS.length)];
    const type = message.includes('anomaly') ? 'warn' : message.includes('verified') ? 'success' : 'info';
    return {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
  }
}
