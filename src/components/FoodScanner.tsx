import React, { useState, useRef } from "react";
import { Camera, Upload, Loader2, X } from "lucide-react";
import { DietAgent } from "../services/ai/agents/dietAgent";
import { Toaster, toast } from "sonner";

interface FoodScannerProps {
  onScanComplete: (mealDetail: any) => void;
  onCancel: () => void;
}

export const FoodScanner: React.FC<FoodScannerProps> = ({ onScanComplete, onCancel }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setIsScanning(true);
    
    try {
      // MOCK GCP VISION CALL
      // In a real app we'd upload 'file' to Vision API and get labels.
      const mockLabels = ["Dosa", "Coconut Chutney", "Sambar", "Indian food"];
      
      const result = await DietAgent.analyzeFood(mockLabels);
      if (result) {
        toast.success("Food scanned successfully!");
        onScanComplete(result);
      } else {
        toast.error("Failed to parse food. Try again.");
      }
    } catch (e) {
      toast.error("Error analyzing image.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-in relative">
      <button onClick={onCancel} className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
      
      <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
        <Camera className="h-4 w-4" /> AI Food Scanner
      </h4>
      
      {!imagePreview ? (
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 p-4 text-primary hover:bg-primary/10 transition-colors"
          >
            <Upload className="h-6 w-6" />
            <span className="text-[10px] font-semibold">Upload Photo</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()} // Can be extended to open MediaDevices camera
            className="flex-1 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 p-4 text-primary hover:bg-primary/10 transition-colors"
          >
            <Camera className="h-6 w-6" />
            <span className="text-[10px] font-semibold">Take Picture</span>
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <img src={imagePreview} alt="Scanning" className="w-full h-32 object-cover rounded-lg" />
          {isScanning && (
            <div className="flex items-center gap-2 text-xs text-primary font-semibold justify-center">
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing with Gemini...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
