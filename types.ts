export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingChunks?: GroundingChunk[];
}

export interface SendMessageResponse {
  text: string;
  groundingChunks?: GroundingChunk[];
}
