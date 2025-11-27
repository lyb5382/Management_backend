import { Router } from 'express';
import * as businessController from './controller.js';
import { s3Uploader } from '../common/s3Uploader.js'; // 경로 주의
import { authMiddleware, adminAuthMiddleware } from '../common/authMiddleware.js'; // 경로 주의

const router = Router();

router.post('/register',
    authMiddleware,
    s3Uploader.single('license'),
    businessController.register // 컨트롤러 연결
);

router.get('/admin/pending',
    authMiddleware,
    adminAuthMiddleware,
    businessController.getPending // 컨트롤러 연결
);

// 관리자가 '승인' 처리
router.patch('/admin/approved/:businessId',
    authMiddleware,
    adminAuthMiddleware,
    businessController.approve // Controller의 approve 함수 실행
);

// 관리자가 '거부' 처리
router.patch('/admin/rejected/:businessId',
    authMiddleware,
    adminAuthMiddleware,
    businessController.reject // Controller의 reject 함수 실행
);

// 1. 전체 사업자 목록 조회 (필터링 가능)
// GET /api/business/admin/list?status=approved
router.get('/admin/list',
    authMiddleware,
    adminAuthMiddleware,
    businessController.getList
);

// 2. 사업자 상세 조회
// GET /api/business/admin/:businessId
router.get('/admin/:businessId',
    authMiddleware,
    adminAuthMiddleware,
    businessController.getDetail
);

// 3. 사업자 강제 정지
// PATCH /api/business/admin/suspend/:businessId
router.patch('/admin/suspend/:businessId',
    authMiddleware,
    adminAuthMiddleware,
    businessController.suspend
);

export default router;