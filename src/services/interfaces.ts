export interface Squares {
  letter: string;
  premium: string;
  moving: boolean;
  playable: boolean;
  error: boolean;
  score: number;
}

export interface Origin {
  source: String;
  index: number;
}

export interface LetterOrigin {
  letter: string;
  index: number;
  origin: string;
}

export interface Connections {
  path: string;
  index: number;
}

export interface Letters {
  index: number;
  letter: string;
}

export interface Info {
  code: String;
  name: String;
}

export interface SSE {
  success: boolean;
  message: string;
  data?: string;
  max?: number;
}
