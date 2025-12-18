import { Router } from 'express';
// 👇 1. 니가 여기서 이름을 'userManageController'라고 지었음!
import * as userManageController from './controller.js';
import { authMiddleware, adminAuthMiddleware } from '../common/authMiddleware.js';

const router = Router();

// 👇 2. [수정] 그러니까 쓸 때도 'userManageController'라고 불러야지!
// (controller.getMyInfo -> userManageController.getMyInfo)
router.get('/me', authMiddleware, userManageController.getMyInfo);

// 1. 전체 회원 조회
router.get('/admin/all',
    authMiddleware,
    adminAuthMiddleware,
    userManageController.getList
);

// 2. 회원 차단/해제
router.patch('/admin/:userId/status',
    authMiddleware,
    adminAuthMiddleware,
    userManageController.toggleStatus
);

export default router;