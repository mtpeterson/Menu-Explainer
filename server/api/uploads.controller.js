import vision from "@google-cloud/vision";
// import { PredictionServiceClient } from "@google-cloud/aiplatform";
import { VertexAI } from "@google-cloud/vertexai";
import { GoogleAuth } from "google-auth-library";

// Get projectId dynamically from GOOGLE_APPLICATION_CREDENTIALS
async function getProjectId() {
    const auth = new GoogleAuth();
    return await auth.getProjectId();
}

// // Set up Vertex AI client
// const vertexAi = new VertexAI({ project: `${getProjectId}`, location: "us-central1" });
// const model = vertexAi.preview.getGenerativeModel({ model: "gemini-1.5-pro" });

export default class UploadsCtrl {
    static async apiUploadImage(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Step 1: Extract text from the image using Google Vision API
            const extractedText = await extractTextFromImage(req.file.buffer);

            if (!extractedText) {
                return res.status(200).json({ message: "No text found in the image" });
            }

            // Step 2: Structure the extracted text using Vertex AI
            const structuredText = await structureTextWithVertexAI(extractedText);
            
            // Step 3: Enrich the structured text using Vertex AI
            const enrichedText = await enrichTextWithVertexAI(structuredText);

            // Respond with the final enriched text
            res.status(200).json({
                message: "Image processed successfully",
                extractedText,
                structuredText,
                enrichedText,
            });
        } catch (e) {
            console.error(`Error processing image: ${e}`);
            res.status(500).json({ error: "Failed to process image" });
        }
    }
}

// Helper function: Extract text from image using Google Vision API
async function extractTextFromImage(imageBuffer) {
    // Check if testing mode is enabled
    if (process.env.USE_DUMMY_DATA === "true") {
        console.log("Using dummy data for text extraction.");
        return "$10.99\nPO-BOYS &\nBURGERS\nServed with Fries or one southern side\n1. Southern Single Burger $8.99\nBeef Patty, Lettuce, tomate, mayonnaise, onion, mustard,\n& pickle\n2. Southern Double Burger $10.49\nTwo Patties, Lettuce, tomato, mayonnaise, onion, mustard,\n& pickle.\n3. Philly Cheese\nSteak Sandwich\nBeef, grilled onions, peppers, swiss cheese & mayonnaise.\nSALADS\nServed with choice of dressings\n10. Green Salads\n11. Fried or Grilled\nShrimp Salad\n12. Fried or Grilled\n15.99\n$12.99\nF: Fried\nSEAFOOD\nServed with two southern side\nG: GRilled\n$12.99\nFish Salad\n13. Chicken Salad\n$12.99\nAll Salads served with lettuce, tomato, pickle\ncucumbers, & onions\n14. (4) Piece Fish\nF/G S\n15. (6) Piece Fish\nF/G S\n16. Tilapia Platter\nF/G S\nPhilly Cheese\n$10.99\nChicken Sandwich\nChicken, grilled onions, peppers, swiss cheese & mayonnaise.\n5. Chicken Po' Boy\n$10.99\nChicken, Lettuce, onions, tomato, pickle, Salt & Pepper.\n6. Oyster Po' Boy\n$10.99\n4 Oyster, Sam's sauce, Lettuce, tomato, pickle, Salt & Pepper\n7. Shrimp Po' Boy\n$10.99\n5 Jumbo Shrimp. Sam's sauce, Lettuce, onions, tomato,\npickle, Salt & Pepper\n8. Fish Po Boy\n$10,99\n2 Fish fillet, Sam's sauce, Lettuce, onions, tomato, pickle, Salt\n& Pepper\n9. Crawfish Po Boy\n$10.99\nCrewfish, Sam's sauce, Lettuce, onions, pickle, Salt & Pepper.\nDRINKS $2.49\nCoke, Sprite, Diet Coke, Dr Pepper,\nOrange Fanta, Fruit Punch, Chery Coke,\nlemonade, Sweet/Unsweetened Tea.\nSams Coffee\n$2.49\nGUMBO\nServed with Rice and Dinner Roll\n$9.99\nSIDES:\nFries, Hush Puppies,\nGreen Beans, Red Beans & Rice,\nColeslaw, Salad.\n17. 1 Fish/6 Shrimp .F/G S\n18.2 Fish/6 Shrimp .F/G $\n19. 6 Jumbo Shrimp.......F/G\n20. 8 Jumbo Shrimp F/G S\n21. 12 Jumbo Shrimp F/G $\n22. Sam's Special F/G";
    }

    // If not in testing mode, call the Vision API
    const client = new vision.ImageAnnotatorClient();

    const [result] = await client.textDetection({ image: { content: imageBuffer } });
    const detections = result.textAnnotations;

    return detections.length > 0 ? detections[0].description : null;
}

// Helper function: Structure text using Vertex AI
async function structureTextWithVertexAI(extractedText) {
    // Check if testing mode is enabled
    if (process.env.USE_DUMMY_DATA === "true") {
        console.log("Using dummy data for structured text.");
        return `\`\`\`json
            {
            "sections": [
                {
                "section_name": "PO-BOYS & BURGERS",
                "description": "Served with Fries or one southern side",
                "items": [
                    {
                    "name": "Southern Single Burger",
                    "description": "Beef Patty, Lettuce, tomate, mayonnaise, onion, mustard, & pickle",
                    "price": 8.99
                    },
                    {
                    "name": "Southern Double Burger",
                    "description": "Two Patties, Lettuce, tomato, mayonnaise, onion, mustard, & pickle.",
                    "price": 10.49
                    },
                    {
                    "name": "Philly Cheese Steak Sandwich",
                    "description": "Beef, grilled onions, peppers, swiss cheese & mayonnaise.",
                    "price": null
                    },
                    {
                    "name": "Chicken Po' Boy",
                    "description": "Chicken, Lettuce, onions, tomato, pickle, Salt & Pepper.",
                    "price": 10.99
                    },
                    {
                    "name": "Oyster Po' Boy",
                    "description": "4 Oyster, Sam's sauce, Lettuce, tomato, pickle, Salt & Pepper",
                    "price": 10.99
                    },
                    {
                    "name": "Shrimp Po' Boy",
                    "description": "5 Jumbo Shrimp. Sam's sauce, Lettuce, onions, tomato, pickle, Salt & Pepper",
                    "price": 10.99
                    },
                    {
                    "name": "Fish Po Boy",
                    "description": "2 Fish fillet, Sam's sauce, Lettuce, onions, tomato, pickle, Salt & Pepper",
                    "price": "10,99"
                    },
                    {
                    "name": "Crawfish Po Boy",
                    "description": "Crewfish, Sam's sauce, Lettuce, onions, pickle, Salt & Pepper.",
                    "price": 10.99
                    }
                ]
                },
                {
                "section_name": "SALADS",
                "description": "Served with choice of dressings\nAll Salads served with lettuce, tomato, pickle cucumbers, & onions",
                "items": [
                    {
                    "name": "Green Salads",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "Fried or Grilled Shrimp Salad",
                    "description": null,
                    "price": 12.99
                    },
                    {
                    "name": "Fried or Grilled Fish Salad",
                    "description": null,
                    "price": 15.99
                    },
                    {
                    "name": "Chicken Salad",
                    "description": null,
                    "price": 12.99
                    }
                ]
                },
                {
                "section_name": "SEAFOOD",
                "description": "Served with two southern side\nF: Fried, G: Grilled, S: (price not clear, needs clarification)",
                "items": [
                    {
                    "name": "(4) Piece Fish F/G S",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "(6) Piece Fish F/G S",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "Tilapia Platter F/G S",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "1 Fish/6 Shrimp .F/G S",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "2 Fish/6 Shrimp .F/G $",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "6 Jumbo Shrimp.......F/G",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "8 Jumbo Shrimp F/G S",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "12 Jumbo Shrimp F/G $",
                    "description": null,
                    "price": null
                    },
                    {
                    "name": "Sam's Special F/G",
                    "description": null,
                    "price": null
                    }
                ]
                },
                {
                "section_name": "Sandwiches",
                "description": null,
                "items": [
                    {
                    "name": "Philly Cheese Chicken Sandwich",
                    "description": "Chicken, grilled onions, peppers, swiss cheese & mayonnaise.",
                    "price": 10.99
                    }
                ]
                },
                {
                "section_name": "DRINKS",
                "description": null,
                "items": [
                    {
                    "name": "Coke, Sprite, Diet Coke, Dr Pepper, Orange Fanta, Fruit Punch, Chery Coke, lemonade, Sweet/Unsweetened Tea.",
                    "description": null,
                    "price": 2.49
                    },
                    {
                    "name": "Sams Coffee",
                    "description": null,
                    "price": 2.49
                    }
                ]
                },
                {
                "section_name": "GUMBO",
                "description": "Served with Rice and Dinner Roll",
                "items": [
                    {
                    "name": null,
                    "description": null,
                    "price": 9.99
                    }
                ]
                },
                {
                "section_name": "SIDES",
                "description": null,
                "items": [
                    {
                    "name": "Fries, Hush Puppies, Green Beans, Red Beans & Rice, Coleslaw, Salad.",
                    "description": null,
                    "price": null
                    }
                ]
                }
            ]
            }
            \`\`\``; // The structured text
    }

    const projectId = await getProjectId();
    const location = "us-central1";

    // Set up Vertex AI client
    const vertexAi = new VertexAI({ project: `${projectId}`, location: `${location}` });
    const model = vertexAi.preview.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Convert the following restaurant menu into a structured JSON format. The JSON should include sections, dish names, descriptions, and prices. If section names are not explicitly mentioned, infer them based on the context of the menu items. 

    If any information (e.g., description or price) is missing, represent it as null. 

    Example JSON structure:
    {
        "sections": [
            {
                "section_name": "Appetizers",
                "items": [
                    {
                        "name": "Spring Rolls",
                        "description": "Crispy rolls filled with vegetables",
                        "price": 5.99
                    }
                ]
            }
        ]
    }

    Menu Text:
    ${extractedText}`;

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            maxOutputTokens: 2048,  // Adjust as needed
            temperature: 0.2,
            topP: 0.7,
        },
    };

    try {
        const response = await model.generateContent(request);

        console.log("Structuring Full Response:", JSON.stringify(response, null, 2)); // Log the full response

        // // Access the candidates array correctly
        // const candidates = response.response?.candidates;

        // if (!candidates || candidates.length === 0) {
        //     console.error("No candidates returned in the response.");
        //     return "No response from the model.";
        // }

        // // Extract the structured response
        // const structuredText = candidates[0]?.content?.parts?.map(part => part.text).join("\n") || "No response";

        const structuredTextString = processStructuredResponse(response);

        return structuredTextString; // Return the structured text
    } catch (error) {
        console.error("Error generating text:", error);
        return "Error generating text.";
    }
}

// Helper function: Enrich structured text using Vertex AI
async function enrichTextWithVertexAI(structuredText) {
    // Check if testing mode is enabled
    if (process.env.USE_DUMMY_DATA === "true") {
        console.log("Using dummy data for enriched text.");
        const dummyResponse = {
            "response": {
              "candidates": [
                {
                  "content": {
                    "role": "model",
                    "parts": [
                      {
                        "text": "```json\n{\n  \"sections\": [\n    {\n      \"section_name\": \"PO-BOYS & BURGERS\",\n      \"description\": \"Served with Fries or one southern side\",\n      \"items\": [\n        {\n          \"name\": \"Southern Single Burger\",\n          \"description\": \"Beef Patty, Lettuce, tomate, mayonnaise, onion, mustard, & pickle\",\n          \"price\": 8.99\n        },\n        {\n          \"name\": \"Southern Double Burger\",\n          \"description\": \"Two Patties, Lettuce, tomato, mayonnaise, onion, mustard, & pickle.\",\n          \"price\": 10.49\n        },\n        {\n          \"name\": \"Philly Cheese Steak Sandwich\",\n          \"description\": \"Beef, grilled onions, peppers, swiss cheese & mayonnaise.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"Chicken Po' Boy\",\n          \"description\": \"Chicken, Lettuce, onions, tomato, pickle, Salt & Pepper.\",\n          \"price\": 10.99\n        },\n        {\n          \"name\": \"Oyster Po' Boy\",\n          \"description\": \"4 Oyster, Sam's sauce, Lettuce, tomato, pickle, Salt & Pepper\",\n          \"price\": 10.99\n        },\n        {\n          \"name\": \"Shrimp Po' Boy\",\n          \"description\": \"5 Jumbo Shrimp. Sam's sauce, Lettuce, onions, tomato, pickle, Salt & Pepper\",\n          \"price\": 10.99\n        },\n        {\n          \"name\": \"Fish Po Boy\",\n          \"description\": \"2 Fish fillet, Sam's sauce, Lettuce, onions, tomato, pickle, Salt & Pepper\",\n          \"price\": \"10,99\"\n        },\n        {\n          \"name\": \"Crawfish Po Boy\",\n          \"description\": \"Crewfish, Sam's sauce, Lettuce, onions, pickle, Salt & Pepper.\",\n          \"price\": 10.99\n        }\n      ]\n    },\n    {\n      \"section_name\": \"SALADS\",\n      \"description\": \"Served with choice of dressings\\nAll Salads served with lettuce, tomato, pickle cucumbers, & onions\",\n      \"items\": [\n        {\n          \"name\": \"Green Salads\",\n          \"description\": \"A simple salad of mixed greens.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"Fried or Grilled Shrimp Salad\",\n          \"description\": \"Shrimp, either fried or grilled, served atop a bed of greens.\",\n          \"price\": 12.99\n        },\n        {\n          \"name\": \"Fried or Grilled Fish Salad\",\n          \"description\": \"Fish, either fried or grilled, served atop a bed of greens.\",\n          \"price\": 15.99\n        },\n        {\n          \"name\": \"Chicken Salad\",\n          \"description\": \"Classic chicken salad served atop a bed of greens.\",\n          \"price\": 12.99\n        }\n      ]\n    },\n    {\n      \"section_name\": \"SEAFOOD\",\n      \"description\": \"Served with two southern side\\nF: Fried, G: Grilled, S: (price not clear, needs clarification)\",\n      \"items\": [\n        {\n          \"name\": \"(4) Piece Fish F/G S\",\n          \"description\": \"Four pieces of fish, either fried or grilled.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"(6) Piece Fish F/G S\",\n          \"description\": \"Six pieces of fish, either fried or grilled.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"Tilapia Platter F/G S\",\n          \"description\": \"A platter of tilapia, either fried or grilled.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"1 Fish/6 Shrimp .F/G S\",\n          \"description\": \"One piece of fish and six shrimp, either fried or grilled.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"2 Fish/6 Shrimp .F/G $\",\n          \"description\": \"Two pieces of fish and six shrimp, either fried or grilled.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"6 Jumbo Shrimp.......F/G\",\n          \"description\": \"Six jumbo shrimp, either fried or grilled.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"8 Jumbo Shrimp F/G S\",\n          \"description\": \"Eight jumbo shrimp, either fried or grilled.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"12 Jumbo Shrimp F/G $\",\n          \"description\": \"Twelve jumbo shrimp, either fried or grilled.\",\n          \"price\": null\n        },\n        {\n          \"name\": \"Sam's Special F/G\",\n          \"description\": \"A combination of seafood, fried or grilled, specific contents unknown.\",\n          \"price\": null\n        }\n      ]\n    },\n    {\n      \"section_name\": \"Sandwiches\",\n      \"description\": \"Likely served with a choice of side.\", \n      \"items\": [\n        {\n          \"name\": \"Philly Cheese Chicken Sandwich\",\n          \"description\": \"Chicken, grilled onions, peppers, swiss cheese & mayonnaise.\",\n          \"price\": 10.99\n        }\n      ]\n    },\n    {\n      \"section_name\": \"DRINKS\",\n      \"description\": null,\n      \"items\": [\n        {\n          \"name\": \"Coke, Sprite, Diet Coke, Dr Pepper, Orange Fanta, Fruit Punch, Chery Coke, lemonade, Sweet/Unsweetened Tea.\",\n          \"description\": null,\n          \"price\": 2.49\n        },\n        {\n          \"name\": \"Sams Coffee\",\n          \"description\": null,\n          \"price\": 2.49\n        }\n      ]\n    },\n    {\n      \"section_name\": \"GUMBO\",\n      \"description\": \"Served with Rice and Dinner Roll\",\n      \"items\": [\n        {\n          \"name\": \"Seafood Gumbo\", \n          \"description\": \"A likely traditional seafood gumbo.\",\n          \"price\": 9.99\n        }\n      ]\n    },\n    {\n      \"section_name\": \"SIDES\",\n      \"description\": null,\n      \"items\": [\n        {\n          \"name\": \"Fries, Hush Puppies, Green Beans, Red Beans & Rice, Coleslaw, Salad.\",\n          \"description\": null,\n          \"price\": null\n        }\n      ]\n    }\n  ]\n}\n```\n"
                      }
                    ]
                  },
                  "finishReason": "STOP",
                  "safetyRatings": [
                    {
                      "category": "HARM_CATEGORY_HATE_SPEECH",
                      "probability": "NEGLIGIBLE",
                      "probabilityScore": 0.34179688,
                      "severity": "HARM_SEVERITY_NEGLIGIBLE",
                      "severityScore": 0.17285156
                    },
                    {
                      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                      "probability": "NEGLIGIBLE",
                      "probabilityScore": 0.27929688,
                      "severity": "HARM_SEVERITY_NEGLIGIBLE",
                      "severityScore": 0.15039063
                    },
                    {
                      "category": "HARM_CATEGORY_HARASSMENT",
                      "probability": "NEGLIGIBLE",
                      "probabilityScore": 0.35351563,
                      "severity": "HARM_SEVERITY_NEGLIGIBLE",
                      "severityScore": 0.171875
                    },
                    {
                      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                      "probability": "NEGLIGIBLE",
                      "probabilityScore": 0.35351563,
                      "severity": "HARM_SEVERITY_NEGLIGIBLE",
                      "severityScore": 0.1484375
                    }
                  ],
                  "avgLogprobs": -0.004421430104304275,
                  "index": 0
                }
              ],
              "usageMetadata": {
                "promptTokenCount": 1546,
                "candidatesTokenCount": 1511,
                "totalTokenCount": 3057,
                "trafficType": "ON_DEMAND",
                "promptTokensDetails": [
                  {
                    "modality": "TEXT",
                    "tokenCount": 1546
                  }
                ],
                "candidatesTokensDetails": [
                  {
                    "modality": "TEXT",
                    "tokenCount": 1511
                  }
                ]
              },
              "modelVersion": "gemini-1.5-pro-001",
              "createTime": "2025-03-28T14:40:32.600511Z",
              "responseId": "4LTmZ7_TJPHc7bEP2v-toA4"
            }
          };
        const processed = processEnrichedResponse(dummyResponse);
        return processed;
    }

    const projectId = await getProjectId();
    const location = "us-central1";

    // Set up Vertex AI client
    const vertexAi = new VertexAI({ project: `${projectId}`, location: `${location}` });
    const model = vertexAi.preview.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `The following is a structured json of items on a restaurant menu. For any item that is not self-explanatory and/or does not contain a description, write a brief description of what the item likely is. If the item is self-explanatory (e.g., "Cheeseburger", "French Fries", or "Coke"), no description is needed.

    Example JSON structure:
    {
        "sections": [
            {
                "section_name": "Appetizers",
                "items": [
                    {
                        "name": "Spring Rolls",
                        "description": "Crispy rolls filled with vegetables, often composed of shredded cabbage, carrots, and other vegetables wrapped in thin pastry sheets and fried",
                        "price": 5.99
                    }
                ]
            }
        ]
    }

    Structured Menu Text:
    ${structuredText}`;

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            maxOutputTokens: 4096,  // Adjust as needed
            temperature: 0.7,
            topP: 0.7,
        },
    };

    try {
        const response = await model.generateContent(request);

        console.log("Enrichment Full Response:", JSON.stringify(response, null, 2)); // Log the full response

        const structuredTextJson = processEnrichedResponse(response);
        const structuredTextString = JSON.stringify(structuredTextJson, null, 2); // Pretty-print for readability

        console.log("Structured JSON:", structuredTextJson);
        console.log("Pretty-print JSON:", structuredTextString);

        return structuredTextJson; // Return the structured text
    } catch (error) {
        console.error("Error generating text:", error);
        return "Error generating text.";
    }

    // const vertexAi = new VertexAI({
    //     location: "us-central1",
    // });

    // const model = vertexAi.getGenerativeModel({ model: "text-bison" });

    // const prompt = `Take this structured JSON restaurant menu and add more details, such as descriptions of dishes and dietary information:
    
    // ${structuredText}`;

    // const response = await model.generateText({
    //     prompt,
    //     temperature: 0.7,
    //     maxOutputTokens: 1024,
    // });

    // return response.text; // The enriched JSON
}

// Helper function: extract the structured json (as text) from the LLM's response
function processStructuredResponse(response) {
    try {
        // Extract the content from the response
        const rawContent = response.response?.candidates[0]?.content?.parts?.map(part => part.text).join("\n");

        if (!rawContent) {
            console.error("No content found in the response.");
            return null;
        }

        // Log the raw content with code block formatting
        console.log("Extracted Text Content with Code Block Formatting:", rawContent);

        return rawContent; // Return the raw content with code block formatting
    } catch (error) {
        console.error("Error processing response:", error);
        return null;
    }
}

// Helper function: extract the structured JSON from the LLM's response
function processEnrichedResponse(response) {
    try {
        // Extract the content from the response
        const rawContent = response.response?.candidates[0]?.content?.parts?.map(part => part.text).join("\n");

        if (!rawContent) {
            console.error("No content found in the response.");
            return null;
        }

        // Log the raw content with code block formatting
        console.log("Raw Content with Code Block Formatting:", rawContent);

        // Extract JSON content safely
        const match = rawContent.match(/```json\s*\n([\s\S]*?)\n```/);
        if (!match) {
            console.error("Failed to extract JSON from response.");
            return null;
        }

        const jsonString = match[1].trim();  // Trim to remove any extra spaces

        // Parse the JSON string into a JavaScript object
        const parsedJson = JSON.parse(jsonString);

        console.log("Parsed JSON:", parsedJson);

        return parsedJson; // Return the parsed JSON object
    } catch (error) {
        console.error("Error processing response:", error);
        return null;
    }
}




// import vision from "@google-cloud/vision";

// export default class UploadsCtrl {
//     static async apiUploadImage(req, res, next) {
//         try {
//             if (!req.file) {
//                 return res.status(400).json({ error: "No file uploaded" });
//             }

//             res.status(200).json(
//                 {
//                     "message": "Example image text extraction",
//                     "extractedText": "$10.99\nPO-BOYS &\nBURGERS\nServed with Fries or one southern side\n1. Southern Single Burger $8.99\nBeef Patty, Lettuce, tomate, mayonnaise, onion, mustard,\n& pickle\n2. Southern Double Burger $10.49\nTwo Patties, Lettuce, tomato, mayonnaise, onion, mustard,\n& pickle.\n3. Philly Cheese\nSteak Sandwich\nBeef, grilled onions, peppers, swiss cheese & mayonnaise.\nSALADS\nServed with choice of dressings\n10. Green Salads\n11. Fried or Grilled\nShrimp Salad\n12. Fried or Grilled\n15.99\n$12.99\nF: Fried\nSEAFOOD\nServed with two southern side\nG: GRilled\n$12.99\nFish Salad\n13. Chicken Salad\n$12.99\nAll Salads served with lettuce, tomato, pickle\ncucumbers, & onions\n14. (4) Piece Fish\nF/G S\n15. (6) Piece Fish\nF/G S\n16. Tilapia Platter\nF/G S\nPhilly Cheese\n$10.99\nChicken Sandwich\nChicken, grilled onions, peppers, swiss cheese & mayonnaise.\n5. Chicken Po' Boy\n$10.99\nChicken, Lettuce, onions, tomato, pickle, Salt & Pepper.\n6. Oyster Po' Boy\n$10.99\n4 Oyster, Sam's sauce, Lettuce, tomato, pickle, Salt & Pepper\n7. Shrimp Po' Boy\n$10.99\n5 Jumbo Shrimp. Sam's sauce, Lettuce, onions, tomato,\npickle, Salt & Pepper\n8. Fish Po Boy\n$10,99\n2 Fish fillet, Sam's sauce, Lettuce, onions, tomato, pickle, Salt\n& Pepper\n9. Crawfish Po Boy\n$10.99\nCrewfish, Sam's sauce, Lettuce, onions, pickle, Salt & Pepper.\nDRINKS $2.49\nCoke, Sprite, Diet Coke, Dr Pepper,\nOrange Fanta, Fruit Punch, Chery Coke,\nlemonade, Sweet/Unsweetened Tea.\nSams Coffee\n$2.49\nGUMBO\nServed with Rice and Dinner Roll\n$9.99\nSIDES:\nFries, Hush Puppies,\nGreen Beans, Red Beans & Rice,\nColeslaw, Salad.\n17. 1 Fish/6 Shrimp .F/G S\n18.2 Fish/6 Shrimp .F/G $\n19. 6 Jumbo Shrimp.......F/G\n20. 8 Jumbo Shrimp F/G S\n21. 12 Jumbo Shrimp F/G $\n22. Sam's Special F/G"
//                 });
//             // // Access the uploaded file (stored in memory)
//             // const imageBuffer = req.file.buffer;

//             // // Create a Google Cloud Vision client
//             // const client = new vision.ImageAnnotatorClient();

//             // // Perform text detection on the uploaded image
//             // const [result] = await client.textDetection({ image: { content: imageBuffer } });
//             // const detections = result.textAnnotations;

//             // if (detections.length > 0) {
//             //     // Respond with the extracted text
//             //     res.status(200).json({
//             //         message: "Image processed successfully",
//             //         extractedText: detections[0].description, // The detected text
//             //     });
//             // } else {
//             //     res.status(200).json({
//             //         message: "No text found in the image",
//             //     });
//             // }
//         } catch (e) {
//             console.error(`Error processing image: ${e}`);
//             res.status(500).json({ error: "Failed to process image" });
//         }
//     }
// }