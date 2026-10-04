"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvisoryRequestSchema = exports.BudgetRangeEnum = exports.IrrigationEnum = exports.SeasonEnum = exports.SoilTypeEnum = void 0;
const zod_1 = require("zod");
exports.SoilTypeEnum = zod_1.z.enum([
    'Alluvial',
    'Black',
    'Red',
    'Laterite',
    'Arid',
    'Saline',
    'Peaty',
]);
exports.SeasonEnum = zod_1.z.enum([
    'Spring',
    'Summer',
    'Monsoon',
    'Autumn',
    'Winter',
]);
exports.IrrigationEnum = zod_1.z.enum([
    'Rainfed',
    'Drip',
    'Sprinkler',
    'Canal',
    'Tube well',
]);
exports.BudgetRangeEnum = zod_1.z.enum(['Low', 'Medium', 'High']);
exports.AdvisoryRequestSchema = zod_1.z.object({
    region: zod_1.z.string().min(2, 'Region must be at least 2 characters'),
    landSizeAcre: zod_1.z
        .number()
        .positive('Land size must be a positive number')
        .max(100000, 'Land size seems unrealistically large'),
    soilType: exports.SoilTypeEnum,
    season: exports.SeasonEnum,
    irrigation: exports.IrrigationEnum,
    budgetRange: exports.BudgetRangeEnum,
    primaryGoal: zod_1.z.string().max(500).optional(),
});
//# sourceMappingURL=advisorySchema.js.map