import { Router } from 'express';
import * as statsController from './controller.js';
import { authMiddleware, adminAuthMiddleware, businessAuthMiddleware } from '../common/authMiddleware.js';

const router = Router();

// 1. 사업자 통계 (내 매출)
router.get('/business',
    authMiddleware,
    businessAuthMiddleware,
    statsController.getBusinessDashboard
);

// 2. 관리자 통계 (전체 현황)
router.get('/admin',
    authMiddleware,
    adminAuthMiddleware,
    statsController.getAdminDashboard
);

export default router;