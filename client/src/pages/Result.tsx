import React from "react";
import { useLocation } from "react-router-dom";
import { ResponseData } from '../types';
import MenuSection from "../components/MenuSection";
import "../styles/Result.css";

const Result: React.FC = () => {
    const location = useLocation();
    const { responseData } = location.state as { responseData: ResponseData };

    return (
        <div className="result-container">
            {responseData.enrichedText.sections.length === 0 ? (
                <div className="no-results">
                    <h2>No Results Found</h2>
                    <p>Sorry, we couldn't find any relevant information.</p>
                </div>
            ) : (
                responseData.enrichedText.sections.map((section, index) => (
                    <MenuSection key={index} section={section} />
                ))
            )}
        </div>
    );
};

export default Result;


{/* <div key={index}>
                    <h3>{section.section_name}</h3>
                    <ul>
                        {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                                <strong>{item.name}</strong>: {item.description}
                            </li>
                        ))}
                    </ul>
                </div> */}