export interface RealtimeChannel {
  subscribe(handler: (payload: unknown) => void): () => void;
  publish(payload: unknown): void;
}

export interface RealtimeClient {
  connect(channelName: string): RealtimeChannel;
  disconnect(): void;
}
