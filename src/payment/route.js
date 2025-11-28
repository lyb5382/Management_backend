import { Router } from 'express';
import * as paymentController from './controller.js';
import { authMiddleware, adminAuthMiddleware, businessAuthMiddleware } from '../common/authMiddleware.js';

const router = Router();

// 1. 관리자용 전체 목록
router.get('/admin/list',
    authMiddleware,
    adminAuthMiddleware,
    paymentController.getAdminList
);

// 2. 사업자용 내역 목록
router.get('/business',
    authMiddleware,
    businessAuthMiddleware,
    paymentController.getBusinessList
);

export default router;