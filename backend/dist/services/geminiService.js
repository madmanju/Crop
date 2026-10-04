"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdvisory = generateAdvisory;
const genai_1 = require("@google/genai");
const env_1 = require("../config/env");
// -----------------------------------------------------------------------
// Gemini client (lazy-initialised only when API key is available)
// -----------------------------------------------------------------------
let ai = null;
function getAI() {
    if (!ai) {
        if (!env_1.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }
        ai = new genai_1.GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY });
    }
    return ai;
}
// -----------------------------------------------------------------------
// Structured response schema enforced via Gemini responseSchema API
// -----------------------------------------------------------------------
const advisoryResponseSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        recommendedCrops: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    cropName: { type: genai_1.Type.STRING },
                    expectedYieldPerAcre: { type: genai_1.Type.STRING },
                    reasonForRecommendation: { type: genai_1.Type.STRING },
                },
                required: ['cropName', 'expectedYieldPerAcre', 'reasonForRecommendation'],
            },
        },
        fertilizerSchedule: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    phase: {
                        type: genai_1.Type.STRING,
                        description: 'e.g., Pre-sowing, Vegetative, Flowering, Harvesting',
                    },
                    action: { type: genai_1.Type.STRING },
                },
                required: ['phase', 'action'],
            },
        },
        riskFactors: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
        },
    },
    required: ['recommendedCrops', 'fertilizerSchedule', 'riskFactors'],
};
// -----------------------------------------------------------------------
// System prompt
// -----------------------------------------------------------------------
const SYSTEM_INSTRUCTION = `You are an elite Agronomist and Agricultural AI Assistant. 
Your goal is to provide highly scientific, practical, and localized crop advisories based 
on specific land, soil, and weather parameters. You must only respond in the exact JSON 
structure requested. Ensure recommendations account for sustainable practices, resource 
efficiency, and the user's stated budget. Provide 3–5 recommended crops, 4–6 fertilizer 
schedule phases covering the full crop lifecycle, and 4–6 concrete risk factors with brief 
mitigation notes.`;
// -----------------------------------------------------------------------
// User prompt builder
// -----------------------------------------------------------------------
function buildUserPrompt(params) {
    return `Generate a comprehensive crop advisory for the following farm profile:

- Region / Climate Zone: ${params.region}
- Total Land Area: ${params.landSizeAcre} acres
- Soil Type: ${params.soilType}
- Growing Season: ${params.season}
- Irrigation Method: ${params.irrigation}
- Budget Range: ${params.budgetRange}
- Primary Farming Goal: ${params.primaryGoal ?? 'Not specified — optimise for maximum sustainable yield'}

Based on these parameters, provide:
1. The top recommended crops best suited for these conditions.
2. A complete fertilizer and soil amendment schedule across the crop lifecycle phases.
3. The key risk factors (pests, climate events, diseases, soil degradation) the farmer should actively manage.

Tailor all recommendations specifically to the ${params.soilType} soil type in a ${params.season} season, 
using ${params.irrigation} irrigation, within a ${params.budgetRange} budget.`;
}
// -----------------------------------------------------------------------
// Mock advisory for development / when GEMINI_API_KEY is not set
// -----------------------------------------------------------------------
function generateMockAdvisory(params) {
    return {
        recommendedCrops: [
            {
                cropName: 'Wheat (Triticum aestivum)',
                expectedYieldPerAcre: '18–22 quintals/acre',
                reasonForRecommendation: `Highly suited to ${params.soilType} soil with ${params.irrigation} irrigation. Excellent yield-to-input ratio fitting a ${params.budgetRange} budget in ${params.season} season.`,
            },
            {
                cropName: 'Chickpea (Cicer arietinum)',
                expectedYieldPerAcre: '6–9 quintals/acre',
                reasonForRecommendation: `Nitrogen-fixing legume ideal as a rotation crop. Low water requirement aligns with ${params.irrigation} system. Boosts soil fertility for next season.`,
            },
            {
                cropName: 'Mustard (Brassica juncea)',
                expectedYieldPerAcre: '8–12 quintals/acre',
                reasonForRecommendation: `Short duration oilseed crop with strong market value. Tolerates ${params.soilType} soil. ${params.season} season provides optimal temperature for oil content development.`,
            },
            {
                cropName: 'Sunflower (Helianthus annuus)',
                expectedYieldPerAcre: '10–14 quintals/acre',
                reasonForRecommendation: `Drought-tolerant variety suitable for ${params.irrigation} irrigation. High market demand and compatible with ${params.soilType} soil's drainage characteristics.`,
            },
        ],
        fertilizerSchedule: [
            {
                phase: 'Pre-Sowing (2–3 weeks before)',
                action: `Apply 8–10 tonnes/acre of well-composted farmyard manure (FYM). Incorporate 45 kg/acre of Di-ammonium Phosphate (DAP) as basal dose. Conduct soil pH test; adjust to 6.5–7.5 using lime if needed for ${params.soilType} soil.`,
            },
            {
                phase: 'Sowing / Germination',
                action: 'Seed treatment with Trichoderma viride (4g/kg seed) + Rhizobium inoculant for legumes. Apply Zinc Sulphate (25 kg/acre) if soil test indicates deficiency — common in degraded soils.',
            },
            {
                phase: 'Vegetative Growth (3–6 weeks)',
                action: `First top-dressing: 25–30 kg/acre of Urea. Supplement with potassium (MOP 20 kg/acre) for ${params.soilType} soil. Begin weekly foliar spray of micronutrient mix (Fe, Mn, Zn) for robust leaf development.`,
            },
            {
                phase: 'Pre-Flowering',
                action: 'Second top-dressing: 15–20 kg/acre of Urea. Apply Boron (0.5%) foliar spray to improve flower set and seed formation. Ensure adequate soil moisture — critical stage for yield determination.',
            },
            {
                phase: 'Grain Filling / Maturation',
                action: 'Apply 1% KNO₃ (Potassium Nitrate) foliar spray to enhance grain weight. Reduce nitrogen applications — excess at this stage causes delayed maturity. Maintain consistent soil moisture using available irrigation.',
            },
            {
                phase: 'Post-Harvest Soil Restoration',
                action: 'Incorporate crop residues with 10 kg/acre of urea to accelerate decomposition. Apply green manure (Dhaincha/Sesbania) or cover crop immediately after harvest to restore organic matter.',
            },
        ],
        riskFactors: [
            `Water stress during critical growth stages: ${params.irrigation} irrigation may be insufficient during peak demand — monitor soil moisture weekly and have contingency water access planned.`,
            `Aphid and whitefly infestation: Common in ${params.season} season. Scout fields bi-weekly, deploy yellow sticky traps early, and apply neem-based bio-pesticide (Azadirachtin) at first signs of infestation.`,
            'Powdery mildew and rust fungal diseases: High humidity increases risk. Ensure proper row spacing for air circulation; apply propiconazole (0.1%) fungicide preventively at vegetative stage.',
            `Soil salinity build-up: Prolonged ${params.irrigation} irrigation can concentrate salts in ${params.soilType} soil. Conduct annual soil EC tests; if EC exceeds 4 dS/m, apply gypsum (200 kg/acre) and increase leaching irrigation.`,
            'Climate variability and unseasonal rainfall: Unpredictable weather patterns in the region can affect pollination and grain filling. Purchase crop insurance (PMFBY scheme) before sowing.',
            'Nutrient leaching on light soils: Excessive irrigation or rain can wash out applied nitrogen — use split application approach and consider slow-release coated urea for efficiency.',
        ],
    };
}
const CANDIDATE_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
];
// -----------------------------------------------------------------------
// Main exported function
// -----------------------------------------------------------------------
async function generateAdvisory(params) {
    // Return mock data if Gemini is not configured
    if (!env_1.env.hasGemini) {
        console.log('[GEMINI] Using mock advisory data (GEMINI_API_KEY not set)');
        return generateMockAdvisory(params);
    }
    const client = getAI();
    const userPrompt = buildUserPrompt(params);
    for (const model of CANDIDATE_MODELS) {
        try {
            console.log(`[GEMINI] Generating advisory with model: ${model}...`);
            const response = await client.models.generateContent({
                model,
                contents: userPrompt,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: advisoryResponseSchema,
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                },
            });
            const rawText = response.text;
            if (!rawText) {
                throw new Error('Gemini returned an empty response');
            }
            const parsed = JSON.parse(rawText);
            // Basic structural validation
            if (!parsed.recommendedCrops || !parsed.fertilizerSchedule || !parsed.riskFactors) {
                throw new Error('Gemini response is missing required fields');
            }
            console.log(`[GEMINI] ✅ Advisory successfully generated using ${model}`);
            return parsed;
        }
        catch (error) {
            console.warn(`[GEMINI] ⚠️ Model ${model} failed: ${error?.message || error}. Trying next model...`);
        }
    }
    // Graceful fallback if all online models are temporarily throttled (503/429)
    console.warn('[GEMINI] ⚠️ All Gemini models temporarily unavailable (e.g. 503 high demand). Falling back to mock dataset.');
    return generateMockAdvisory(params);
}
//# sourceMappingURL=geminiService.js.map