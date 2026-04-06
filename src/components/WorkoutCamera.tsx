import React, { useRef } from 'react';
import { usePostureTracker } from '../hooks/usePostureTracker';

interface WorkoutCameraProps {
  isActive: boolean;
}

export const WorkoutCamera: React.FC<WorkoutCameraProps> = ({ isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { feedback } = usePostureTracker(videoRef, isActive);

  if (!isActive) return null;

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl bg-black border-2 border-primary/20 aspect-video">
      <video
        ref={videoRef}
        className="h-full w-full object-cover transform scale-x-[-1]"
        autoPlay
        playsInline
        muted
      />
      {/* Decorative overlays */}
      <div className="absolute top-2 left-2 flex items-center gap-2">
         <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
         <span className="text-[10px] text-white font-bold tracking-widest shadow-black drop-shadow-md">LIVE AI</span>
      </div>
      
      {/* AI Feedback Banner */}
      {feedback && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] animate-fade-in">
          <div className="gym-gradient-orange text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg text-center border border-white/20">
            🤖 {feedback}
          </div>
        </div>
      )}
    </div>
  );
};
