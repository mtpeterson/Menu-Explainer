import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    console.log("Selected file:", file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    console.log("Image ready to be sent to the backend:", image);
    alert("Image upload functionality will be implemented later.");
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