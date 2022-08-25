import { FormEvent, useState } from "react";

import { getResizedImage } from "./utils/image";

import "./styles.css";

function App() {
  const [original, setOriginal] = useState<string>();
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget?.files?.[0];

    if (!input) return false;

    setOriginal(window.URL.createObjectURL(input));
    getResizedImage(input, 1248).then((base64) => setPreview(base64));
  };

  return (
    <div className="App">
      <h1>Image re-sizer</h1>
      <hr />

      <div>
        <h2>Upload from laptop</h2>
        <input type="file" onInput={handleImageUpload} />
      </div>

      <div>
        <h2>Re-sized</h2>
        {preview ? (
          <img src={`data:image/png;base64, ${preview}`} alt="Resized result" />
        ) : (
          <i>No resized image</i>
        )}
      </div>
      <div>
        <h2>Original</h2>
        {original ? (
          <img src={original} width={1248} alt="Original upload" />
        ) : (
          <i>No selected image</i>
        )}
      </div>
    </div>
  );
}

export default App;
