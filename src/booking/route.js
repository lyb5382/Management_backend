import { Router } from 'express';
import * as bookingController from './controller.js';
import { authMiddleware, businessAuthMiddleware } from '../common/authMiddleware.js';

const router = Router();

// 1. 목록 조회
router.get('/business',
    authMiddleware,
    businessAuthMiddleware,
    bookingController.getList
);

// 2. 상태 변경
router.patch('/:bookingId/status',
    authMiddleware,
    businessAuthMiddleware,
    bookingController.updateStatus
);

export default router;