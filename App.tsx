import React, { useState } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

import {
  LoadingState,
  InfographicData,
  LayoutStyle,
} from "./types";

import {
  analyzeContent,
  generateBackground,
} from "./services/geminiService";

import InfographicView from "./components/InfographicView";

const App: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [inputImages, setInputImages] = useState<File[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.IDLE
  );
  const [resultData, setResultData] =
    useState<InfographicData | null>(null);
  const [backgroundImg, setBackgroundImg] =
    useState<string |
