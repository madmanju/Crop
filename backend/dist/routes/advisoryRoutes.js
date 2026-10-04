"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const advisoryController_1 = require("../controllers/advisoryController");
const router = (0, express_1.Router)();
// All advisory routes require authentication
router.use(auth_1.authMiddleware);
// POST /api/advisories/generate
router.post('/generate', advisoryController_1.generateAdvisoryHandler);
// GET /api/advisories
router.get('/', advisoryController_1.getAdvisoriesHandler);
// GET /api/advisories/:id
router.get('/:id', advisoryController_1.getAdvisoryByIdHandler);
// DELETE /api/advisories/:id
router.delete('/:id', advisoryController_1.deleteAdvisoryHandler);
exports.default = router;
//# sourceMappingURL=advisoryRoutes.js.map