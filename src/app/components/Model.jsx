"use client";
import * as tf from "@tensorflow/tfjs";
import { useEffect } from "react";

const Model = () => {
  const loadImageFromPublic = async (imagePath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Set cross-origin attribute if needed
      img.src = imagePath;
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    });
  };

  const preprocessImage = (img) => {
    const tensor = tf.browser
      .fromPixels(img)
      .resizeNearestNeighbor([224, 224]) // Resize to the expected input shape
      .toFloat()
      .div(tf.scalar(127.5))
      .sub(tf.scalar(1))
      .expandDims();
    return tensor;
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = "/model/model.json"; // Replace with your actual URL
        const loadedModel = await tf.loadLayersModel(model);
        const image = "/5_right.jpg";

        const img = await loadImageFromPublic(image);
        const preprocessedImage = preprocessImage(img);
        const prediction = loadedModel.predict(preprocessedImage);
        prediction.print(); // or handle the prediction result as needed

        loadedModel.summary();

        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Failed to load model", error);
      }
    };

    loadModel();
  }, []);

  return <>model</>;
};

export default Model;
