import { z } from 'zod';
export declare const SoilTypeEnum: z.ZodEnum<["Alluvial", "Black", "Red", "Laterite", "Arid", "Saline", "Peaty"]>;
export declare const SeasonEnum: z.ZodEnum<["Spring", "Summer", "Monsoon", "Autumn", "Winter"]>;
export declare const IrrigationEnum: z.ZodEnum<["Rainfed", "Drip", "Sprinkler", "Canal", "Tube well"]>;
export declare const BudgetRangeEnum: z.ZodEnum<["Low", "Medium", "High"]>;
export declare const AdvisoryRequestSchema: z.ZodObject<{
    region: z.ZodString;
    landSizeAcre: z.ZodNumber;
    soilType: z.ZodEnum<["Alluvial", "Black", "Red", "Laterite", "Arid", "Saline", "Peaty"]>;
    season: z.ZodEnum<["Spring", "Summer", "Monsoon", "Autumn", "Winter"]>;
    irrigation: z.ZodEnum<["Rainfed", "Drip", "Sprinkler", "Canal", "Tube well"]>;
    budgetRange: z.ZodEnum<["Low", "Medium", "High"]>;
    primaryGoal: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    region: string;
    landSizeAcre: number;
    soilType: "Alluvial" | "Black" | "Red" | "Laterite" | "Arid" | "Saline" | "Peaty";
    season: "Spring" | "Summer" | "Monsoon" | "Autumn" | "Winter";
    irrigation: "Rainfed" | "Drip" | "Sprinkler" | "Canal" | "Tube well";
    budgetRange: "Low" | "Medium" | "High";
    primaryGoal?: string | undefined;
}, {
    region: string;
    landSizeAcre: number;
    soilType: "Alluvial" | "Black" | "Red" | "Laterite" | "Arid" | "Saline" | "Peaty";
    season: "Spring" | "Summer" | "Monsoon" | "Autumn" | "Winter";
    irrigation: "Rainfed" | "Drip" | "Sprinkler" | "Canal" | "Tube well";
    budgetRange: "Low" | "Medium" | "High";
    primaryGoal?: string | undefined;
}>;
export type AdvisoryRequest = z.infer<typeof AdvisoryRequestSchema>;
export interface RecommendedCrop {
    cropName: string;
    expectedYieldPerAcre: string;
    reasonForRecommendation: string;
}
export interface FertilizerScheduleItem {
    phase: string;
    action: string;
}
export interface AdvisoryAIResponse {
    recommendedCrops: RecommendedCrop[];
    fertilizerSchedule: FertilizerScheduleItem[];
    riskFactors: string[];
}
export interface Advisory {
    id: string;
    user_id: string;
    region: string;
    land_size_acre: number;
    soil_type: string;
    season: string;
    irrigation: string;
    budget_range: string;
    primary_goal?: string;
    ai_response: AdvisoryAIResponse;
    created_at: string;
}
//# sourceMappingURL=advisorySchema.d.ts.map