import { useRef, useEffect } from 'react';

interface HandCameraProps {
  onVideoRef: (ref: HTMLVideoElement) => void;
}

const HandCamera = ({ onVideoRef }: HandCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupCamera = async () => {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        
        videoRef.current.srcObject = stream;
        if (onVideoRef) onVideoRef(videoRef.current);
        
        console.log('Camera setup successful');
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onVideoRef]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover rounded-lg"
    />
  );
};

export default HandCamera;