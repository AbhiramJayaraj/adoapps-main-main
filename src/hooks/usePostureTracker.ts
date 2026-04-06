import { useEffect, useRef, useState } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { WorkoutAgent } from '../services/ai/agents/workoutAgent';

export function usePostureTracker(videoRef: React.RefObject<HTMLVideoElement>, isTracking: boolean) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const lastAlertTime = useRef<number>(0);

  useEffect(() => {
    if (!isTracking || !videoRef.current) {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      return;
    }

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(async (results: Results) => {
      if (!results.poseLandmarks) return;

      // Extremely simple mock logic for demonstration
      // E.g. Check knee position
      const leftKnee = results.poseLandmarks[25];
      const rightKnee = results.poseLandmarks[26];
      
      const now = Date.now();
      // Only alert once every 5 seconds to avoid spam
      if (leftKnee && rightKnee && now - lastAlertTime.current > 5000) {
        if (leftKnee.visibility && leftKnee.visibility > 0.8) {
           // Simulate a detected flaw randomly
           if (Math.random() > 0.8) {
             lastAlertTime.current = now;
             const aiFeedback = await WorkoutAgent.generateCorrectionFeedback("Squat", "Knees dropping too drastically");
             setFeedback(aiFeedback);
             setTimeout(() => setFeedback(null), 4000);
           }
        }
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await pose.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });
    
    cameraRef.current = camera;
    camera.start();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      pose.close();
    };
  }, [isTracking, videoRef]);

  return { feedback };
}
