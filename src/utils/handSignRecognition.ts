import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

type Landmark = [number, number, number];
type HandLandmarks = Landmark[];

// Convert landmarks to a format suitable for ML model
const preprocessLandmarks = (landmarks: HandLandmarks): number[] => {
  // Normalize relative to wrist position
  const wrist = landmarks[0];
  const normalized = landmarks.map(point => [
    point[0] - wrist[0],
    point[1] - wrist[1],
    point[2] - wrist[2]
  ]);
  
  // Flatten to 1D array
  return normalized.flat();
};

// Simple neural network model for hand sign classification
const createModel = () => {
  const model = tf.sequential();
  
  // Input shape: 63 features (21 landmarks × 3 coordinates)
  model.add(tf.layers.dense({
    inputShape: [63],
    units: 32,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu'
  }));
  
  // Output layer with 26 units (one for each letter)
  model.add(tf.layers.dense({
    units: 26,
    activation: 'softmax'
  }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
};

// Initialize model
let model: tf.LayersModel | null = null;
const initModel = async () => {
  if (!model) {
    console.log('Initializing hand sign recognition model...');
    model = createModel();
    // In a real application, we would load pre-trained weights here
    // For now, we'll use some basic heuristics while the model "trains"
    await model.save('localstorage://hand-sign-model');
    console.log('Model initialized');
  }
  return model;
};

// Main recognition function
export const recognizeSign = async (
  handposeModel: handpose.HandPose,
  video: HTMLVideoElement,
  expectedSign: string
): Promise<boolean> => {
  try {
    console.log('Starting hand recognition for sign:', expectedSign);
    const predictions = await handposeModel.estimateHands(video);
    
    if (predictions.length === 0) {
      console.log('No hands detected');
      return false;
    }

    const landmarks = predictions[0].landmarks;
    console.log('Hand landmarks detected:', landmarks);

    // Ensure model is initialized
    await initModel();
    
    // Preprocess landmarks
    const features = preprocessLandmarks(landmarks);
    
    // Convert to tensor and make prediction
    const inputTensor = tf.tensor2d([features]);
    const prediction = await model!.predict(inputTensor) as tf.Tensor;
    const probabilities = await prediction.array() as number[][];
    
    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();

    // Get predicted letter index (A=0, B=1, etc.)
    const predictedIndex = probabilities[0].indexOf(Math.max(...probabilities[0]));
    const predictedLetter = String.fromCharCode(65 + predictedIndex);
    
    console.log('Predicted letter:', predictedLetter);
    console.log('Confidence:', probabilities[0][predictedIndex]);

    // For now, use a combination of ML prediction and heuristics
    const isCorrect = predictedLetter.toLowerCase() === expectedSign.toLowerCase() ||
                     (probabilities[0][predictedIndex] > 0.7 && checkHeuristics(landmarks, expectedSign));

    return isCorrect;
  } catch (error) {
    console.error('Error during hand recognition:', error);
    return false;
  }
};

// Backup heuristic checks
const checkHeuristics = (landmarks: HandLandmarks, expectedSign: string): boolean => {
  const wrist = landmarks[0];
  const fingerTips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
  
  switch (expectedSign.toLowerCase()) {
    case 'a':
      // Closed fist with thumb slightly out
      return fingerTips.every((tip, i) => 
        i === 0 ? tip[1] < wrist[1] : tip[1] > wrist[1]
      );
    case 'b':
      // All fingers extended upward
      return fingerTips.every(tip => tip[1] < wrist[1]);
    case 'c':
      // Curved hand
      const heights = fingerTips.map(tip => tip[1] - wrist[1]);
      const spread = Math.max(...heights) - Math.min(...heights);
      return spread < 100 && heights.every(h => h < 0);
    default:
      return false;
  }
};