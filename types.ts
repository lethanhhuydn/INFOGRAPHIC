export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type LayoutStyle =
  | 'GRID_CARDS'
  | 'CONNECTED_FLOW'
  | 'ZIGZAG_TIMELINE';

/** Một điểm nội dung trong infographic */
export interface InfographicPoint {
  title: string;
  content: string;
  icon?: string; // optional để tránh lỗi nếu API không cung cấp
}

/** Dữ liệu tổng hợp infographic */
export interface InfographicData {
  topic: string;
  subtitle?: string;
  targetAudience?: string;
  points: InfographicPoint[];
  summary?: string;

  /** Mảng màu (3 màu chính) để khớp geminiService */
  colorPalette: string[];

  /** kiểu layout cho infographic */
  layoutStyle?: LayoutStyle;
}

/** Kết quả trả về c**
