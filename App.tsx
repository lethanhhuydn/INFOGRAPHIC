import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Loader2, Sparkles, RefreshCcw, AlertTriangle } from 'lucide-react';
import { LoadingState, InfographicData, LayoutStyle } from './types';
import { analyzeContent, generateBackground } from './services/geminiService';
import InfographicView from './components/InfographicView';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [inputImages, setInputImages] = useState<File[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [resultData, setResultData] = useState<InfographicData | null>(null);
  const [backgroundImg, setBackgroundImg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInputImages(Array.from(e.target.files));
    }
  };

  const handleAPIKeySelection = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio && aiStudio.hasSelectedApiKey) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
        try {
            await aiStudio.openSelectKey();
        } catch (e) {
            console.error("API Key selection failed", e);
        }
      }
    }
  };

  const getRandomLayout = (): LayoutStyle => {
    const layouts: LayoutStyle[] = ['GRID_CARDS', 'CONNECTED_FLOW', 'ZIGZAG_TIMELINE'];
    const randomIndex = Math.floor(Math.random() * layouts.length);
    return layouts[randomIndex];
  };

  const handleGenerate = async () => {
    if (!inputText && inputImages.length === 0) {
      setErrorMsg("Vui lòng nhập nội dung hoặc tải ảnh lên để bắt đầu.");
      return;
    }

    await handleAPIKeySelection();

    setErrorMsg(null);
    setLoadingState(LoadingState.ANALYZING);
    setResultData(null);
    setBackgroundImg(null);

    try {
      // 1. Analyze Content
      const data = await analyzeContent(inputText, inputImages);
      
      // 2. Assign a random layout style
      data.layoutStyle = getRandomLayout();
      setResultData(data);
      
      // 3. Generate Background
      setLoadingState(LoadingState.GENERATING_IMAGE);
      const bgUrl = await generateBackground(data.topic, data.colorPalette);
      setBackgroundImg(bgUrl);
      
      setLoadingState(LoadingState.COMPLETED);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduInfoGen</h1>
            <p className="text-xs text-gray-500 font-medium">AI Infographic Creator</p>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
        
        {/* Left Panel: Input & Controls */}
        <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 p-6 flex flex-col overflow-y-auto z-20 shadow-lg">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Nội dung bài học
            </h2>
            <textarea
              className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm transition-all"
              placeholder="Dán nội dung bài học, tóm tắt sách giáo khoa hoặc ghi chú vào đây..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETED && loadingState !== LoadingState.ERROR}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" />
              Hình ảnh tham khảo (Tùy chọn)
            </h2>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETED && loadingState !== LoadingState.ERROR}
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">Kéo thả hoặc nhấn để tải ảnh</p>
              <p className="text-xs text-gray-400 mt-1">{inputImages.length} ảnh đã chọn</p>
            </div>
          </div>

          <div className="mt-auto">
            {errorMsg && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loadingState === LoadingState.ANALYZING || loadingState === LoadingState.GENERATING_IMAGE}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-95
                ${(loadingState === LoadingState.ANALYZING || loadingState === LoadingState.GENERATING_IMAGE)
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'
                }`}
            >
              {(loadingState === LoadingState.ANALYZING || loadingState === LoadingState.GENERATING_IMAGE) ? (
                <>
                  <Loader2 className="animate-spin" />
                  {loadingState === LoadingState.ANALYZING ? 'Đang phân tích...' : 'Đang vẽ minh họa...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Tạo Infographic Ngay
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">
              Mẹo: Cung cấp càng chi tiết, kết quả càng chính xác. Mỗi lần tạo sẽ có kiểu dáng mới.
            </p>
          </div>
        </div>

        {/* Right Panel: Preview Area */}
        <div className="w-full lg:w-2/3 bg-slate-100 flex flex-col relative overflow-hidden">
          {loadingState !== LoadingState.IDLE && loadingState !== LoadingState.ERROR && !resultData && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-white/80 backdrop-blur-sm">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="text-indigo-600 w-8 h-8 animate-pulse" />
                    </div>
                </div>
                <p className="mt-6 text-xl font-medium text-slate-700 animate-pulse">
                    AI đang suy nghĩ và thiết kế...
                </p>
             </div>
          )}

          {resultData ? (
             <div className="flex-grow overflow-auto flex items-center justify-center p-8 bg-slate-800">
               <InfographicView data={resultData} backgroundImageUrl={backgroundImg} />
             </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
                <p className="text-lg font-medium">Bản xem trước sẽ xuất hiện ở đây</p>
                <p className="text-sm">Hỗ trợ tỷ lệ 16:9 độ phân giải 4K</p>
            </div>
          )}
          
          {/* Action Bar for Result */}
          {resultData && (
             <div className="absolute top-4 right-4 z-40 flex gap-2">
                 <button 
                    onClick={handleGenerate} 
                    className="bg-white/90 backdrop-blur text-indigo-700 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                    title="Tạo lại với phong cách mới"
                 >
                     <RefreshCcw size={20} />
                 </button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
