import React from "react";
import { useLocation } from "react-router-dom";
import { ResponseData } from '../types';

const Result: React.FC = () => {
    const location = useLocation();
    const { responseData } = location.state as { responseData: ResponseData };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Processing Complete</h1>
            {responseData.enrichedText.sections.map((section, index) => (
                <div key={index}>
                    <h3>{section.section_name}</h3>
                    <ul>
                        {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                                <strong>{item.name}</strong>: {item.description}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Result;