import { Router } from 'express';
import * as reportController from './controller.js';
import { authMiddleware, adminAuthMiddleware } from '../common/authMiddleware.js';

const router = Router();

// 1. 신고 등록 (로그인한 누구나 가능)
router.post('/', 
    authMiddleware, 
    reportController.create
);

// 2. 신고 목록 조회 (관리자 전용)
router.get('/admin/list', 
    authMiddleware, 
    adminAuthMiddleware, 
    reportController.getList
);

// 3. 신고 처리 (관리자 전용)
router.patch('/admin/:reportId', 
    authMiddleware, 
    adminAuthMiddleware, 
    reportController.process
);

export default router;