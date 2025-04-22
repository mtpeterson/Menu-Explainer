import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponseData } from '../types';


const Upload: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false); // Track loading state

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

        setLoading(true); // Start loading

        try {
            const response = await fetch(`${backendUrl}/api/v1/restaurants/upload`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data: ResponseData = await response.json();
                console.log("File uploaded successfully:", data);
                navigate("/result", { state: { responseData: data } }); // Navigate to Result page with response data
            } else {
                // Handle specific response codes
                const errorData = await response.json();
                switch (response.status) {
                    case 400:
                        alert(`Bad Request: ${errorData.error}`);
                        break;
                    case 415:
                        alert(`Unsupported Media Type: ${errorData.error}`);
                        break;
                    case 422:
                        alert(`Unprocessable Entity: ${errorData.error}`);
                        break;
                    case 500:
                        alert(`Server Error: ${errorData.error}`);
                        break;
                    default:
                        alert(`Unexpected Error: ${errorData.error}`);
                }
                console.error(`Error ${response.status}:`, errorData.error);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Upload Restaurant Menu</h1>
            <p>Please upload an image of the restaurant menu you want to analyze.</p>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <br />
            <button onClick={handleUpload} style={{ marginTop: '10px' }} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
            </button>
            {loading && <p>Processing your image, please wait...</p>}
        </div>
    );
};

export default Upload;