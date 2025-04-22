// Menu types
export interface MenuItem {
    name: string;
    description: string;
    price: number | null;
    edited: boolean;
  }
  
  export interface MenuSection {
    section_name: string;
    items: MenuItem[];
  }
  
  export interface EnrichedText {
    sections: MenuSection[];
  }
  
  // API response type
  export interface ResponseData {
    message: string;
    extractedText: string;
    structuredText: string;
    enrichedText: EnrichedText;
  }
  