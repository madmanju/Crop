import { z } from 'zod';

export const SoilTypeEnum = z.enum([
  'Alluvial',
  'Black',
  'Red',
  'Laterite',
  'Arid',
  'Saline',
  'Peaty',
]);

export const SeasonEnum = z.enum([
  'Spring',
  'Summer',
  'Monsoon',
  'Autumn',
  'Winter',
]);

export const IrrigationEnum = z.enum([
  'Rainfed',
  'Drip',
  'Sprinkler',
  'Canal',
  'Tube well',
]);

export const BudgetRangeEnum = z.enum(['Low', 'Medium', 'High']);

export const AdvisoryRequestSchema = z.object({
  region: z.string().min(2, 'Region must be at least 2 characters'),
  landSizeAcre: z
    .number({ invalid_type_error: 'Land size must be a number' })
    .positive('Land size must be greater than 0')
    .max(100000, 'Land size seems unrealistically large'),
  soilType: SoilTypeEnum,
  season: SeasonEnum,
  irrigation: IrrigationEnum,
  budgetRange: BudgetRangeEnum,
  primaryGoal: z.string().max(500, 'Goal must be under 500 characters').optional(),
});

export type AdvisoryRequest = z.infer<typeof AdvisoryRequestSchema>;
export type SoilType = z.infer<typeof SoilTypeEnum>;
export type Season = z.infer<typeof SeasonEnum>;
export type Irrigation = z.infer<typeof IrrigationEnum>;
export type BudgetRange = z.infer<typeof BudgetRangeEnum>;

// ------------------------------------------------------------------
// Advisory types (mirroring backend)
// ------------------------------------------------------------------
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
