import React from "react";
import { MenuSection as MenuSectionType } from "../types";
import '../styles/MenuSection.css';

const makeSafeId = (str: string) =>
    str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');

interface MenuSectionProps {
    section: MenuSectionType;
}

const MenuSection: React.FC<MenuSectionProps> = ({ section }) => {
    const safeSectionId = makeSafeId(section.section_name);
    
    return (
        <>
            <div className="custom-section-accordion" id={`custom-section-accordion-${safeSectionId}`}>
                <div className="accordion-item">
                    <h1 className="custom-section-accordion-header" id={`heading-${safeSectionId}`}>
                        <button
                            className="custom-section-accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${safeSectionId}`}
                            aria-expanded="false"
                            aria-controls={`collapse-${safeSectionId}`}
                        >
                            {section.section_name}
                        </button>
                    </h1>
                </div>

                {/* Outer collapse area */}
                <div
                    id={`collapse-${safeSectionId}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading-${safeSectionId}`}
                    data-bs-parent={`#accordion-${safeSectionId}`}
                >
                    {/* Inner accordion for items */}
                    <div className="accordion-body">
                        <div className="accordion" id={`accordion-${safeSectionId}-items`}>
                            {section.items.map((item, index) => (
                                <div className="accordion-item" key={index}>
                                    <h2 className="accordion-header" id={`heading-${safeSectionId}-${index}`}>
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${safeSectionId}-${index}`}
                                            aria-expanded="false"
                                            aria-controls={`collapse-${safeSectionId}-${index}`}
                                        >
                                            {item.name}
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse-${safeSectionId}-${index}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading-${safeSectionId}-${index}`}
                                    >
                                        <div className="accordion-body">
                                            <p>{item.description}</p>
                                            <p>
                                                {item.price !== null
                                                    ? `$${item.price.toFixed(2)}`
                                                    : "Price not available"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuSection;