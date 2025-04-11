import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [image, setImage] = useState<File | null>(null);

  interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
  }

  interface SubmitEvent extends React.FormEvent<HTMLFormElement> {
    target: HTMLFormElement & EventTarget;
  }

  const handleImageUpload = (event: ImageUploadEvent): void => {
    const file: File | null = event.target.files ? event.target.files[0] : null;
    setImage(file);
    console.log("Selected file:", file);
  };

  const handleSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
        alert("Image uploaded successfully!");
      } else {
        console.error("Failed to upload image");
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  return (
    <>
      <header className="app-header">
        <h1>Home Page</h1>
      </header>
      <div className="container mt-5">
        <form onSubmit={handleSubmit} className="d-flex align-items-center mt-4">
          <div className="me-3">
            <label htmlFor="imageUpload" className="form-label visually-hidden">
              Upload an Image
            </label>
            <input
              type="file"
              className="form-control"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Upload
          </button>
        </form>
      </div>
    </>
  );
}

export default App;