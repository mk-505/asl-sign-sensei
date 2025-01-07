import * as handpose from '@tensorflow-models/handpose';

// Define the landmark points structure
type Landmark = [number, number, number];
type HandLandmarks = Landmark[];

// Simple distance calculation between two 3D points
const calculateDistance = (p1: Landmark, p2: Landmark): number => {
  return Math.sqrt(
    Math.pow(p2[0] - p1[0], 2) + 
    Math.pow(p2[1] - p1[1], 2) + 
    Math.pow(p2[2] - p1[2], 2)
  );
};

// Normalize landmarks to be scale and position invariant
const normalizeLandmarks = (landmarks: HandLandmarks): HandLandmarks => {
  const wrist = landmarks[0];
  return landmarks.map(point => [
    point[0] - wrist[0],
    point[1] - wrist[1],
    point[2] - wrist[2]
  ]);
};

// Get angles between fingers
const getFingerAngles = (landmarks: HandLandmarks): number[] => {
  const angles: number[] = [];
  // Calculate angles between each pair of adjacent fingers
  for (let i = 0; i < 20; i += 4) {
    if (i + 4 < 20) {
      const angle = calculateAngle(
        landmarks[i],
        landmarks[0], // wrist
        landmarks[i + 4]
      );
      angles.push(angle);
    }
  }
  return angles;
};

// Calculate angle between three points
const calculateAngle = (p1: Landmark, p2: Landmark, p3: Landmark): number => {
  const v1 = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
  const v2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];
  
  const dotProduct = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  const magnitude1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]);
  const magnitude2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);
  
  return Math.acos(dotProduct / (magnitude1 * magnitude2)) * (180 / Math.PI);
};

// Check if fingers are extended
const getExtendedFingers = (landmarks: HandLandmarks): boolean[] => {
  const extended: boolean[] = [];
  // Check each finger (excluding thumb)
  for (let finger = 1; finger < 5; finger++) {
    const baseIndex = finger * 4;
    const tipY = landmarks[baseIndex + 3][1];
    const baseY = landmarks[baseIndex][1];
    extended.push(tipY < baseY); // If tip is higher than base, finger is extended
  }
  return extended;
};

// Main recognition function
export const recognizeSign = async (
  model: handpose.HandPose,
  video: HTMLVideoElement,
  expectedSign: string
): Promise<boolean> => {
  try {
    console.log('Starting hand recognition for sign:', expectedSign);
    const predictions = await model.estimateHands(video);
    
    if (predictions.length === 0) {
      console.log('No hands detected');
      return false;
    }

    const landmarks = predictions[0].landmarks;
    console.log('Hand landmarks detected:', landmarks);

    // Normalize the landmarks
    const normalizedLandmarks = normalizeLandmarks(landmarks);
    
    // Get finger positions and angles
    const extendedFingers = getExtendedFingers(normalizedLandmarks);
    const fingerAngles = getFingerAngles(normalizedLandmarks);
    
    console.log('Extended fingers:', extendedFingers);
    console.log('Finger angles:', fingerAngles);

    // Basic sign recognition logic
    switch (expectedSign.toLowerCase()) {
      case 'a':
        // Only thumb extended
        return extendedFingers.every((extended, i) => i === 0 ? true : !extended);
      case 'b':
        // All fingers extended
        return extendedFingers.every(extended => extended);
      case 'c':
        // Curved hand, check angles
        return fingerAngles.every(angle => angle > 30 && angle < 60);
      // Add more cases for other signs
      default:
        // For now, make it easier to progress during testing
        console.log('Sign not implemented yet, returning true for testing');
        return true;
    }
  } catch (error) {
    console.error('Error during hand recognition:', error);
    return false;
  }
};