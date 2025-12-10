export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING', // Analyzing text/images
  GENERATING_IMAGE = 'GENERATING_IMAGE', // Generating background
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type LayoutStyle = 'GRID_CARDS' | 'CONNECTED_FLOW' | 'ZIGZAG_TIMELINE';

export interface InfographicPoint {
  title: string;
  content: string;
  icon: string; // Name of the icon to map to Lucide
}

export interface InfographicData {
  topic: string; // The main title
  subtitle: string;
  targetAudience: string; // e.g., "Học sinh THPT"
  points: InfographicPoint[];
  summary: string; // A concluding sentence
  colorPalette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  layoutStyle?: LayoutStyle; // New field to determine visual style
}

export interface GenerationResult {
  data: InfographicData | null;
  backgroundImageUrl: string | null;
}
