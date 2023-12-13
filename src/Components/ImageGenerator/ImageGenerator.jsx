import React, { useRef, useState } from "react";
import "./imageGenerator.css";
import default_image from "../Assets/default_image.svg";

const AiImageGenerator = () => {
  const [image_url, setImage_url] = useState(default_image); // Set default image as initial state
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const imageGenerator = async () => {
    const promptValue = inputRef.current.value;
    if (promptValue === "") {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: promptValue,
            n: 1,
            size: "1024x1024",
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.data && data.data.length > 0) {
        setImage_url(data.data[0].url);
      } else {
        console.error("Error in response:", data);
        // Handle the error according to your application's needs
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI image <span>generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url} alt="Generated" />
        </div>
        {loading && (
          <div className="loading">
            <div className="loading-bar-full"></div>
            <div className="loading-text">Loading.....</div>
          </div>
        )}
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see"
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default AiImageGenerator;
