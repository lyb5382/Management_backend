import { Router } from 'express';
import * as inquiryController from './controller.js';
import { authMiddleware, adminAuthMiddleware } from '../common/authMiddleware.js';

const router = Router();

// 1. 문의 등록 (로그인한 누구나)
router.post('/', 
    authMiddleware, 
    inquiryController.create
);

// 2. 목록 조회 (유저는 지꺼만, 관리자는 전체)
router.get('/', 
    authMiddleware, 
    inquiryController.getList
);

// 3. 상세 조회
router.get('/:inquiryId', 
    authMiddleware, 
    inquiryController.getOne
);

// 4. 답변 등록 (관리자만!!)
router.post('/:inquiryId/reply', 
    authMiddleware, 
    adminAuthMiddleware, 
    inquiryController.reply
);

// 5. 삭제 (본인 or 관리자)
router.delete('/:inquiryId', 
    authMiddleware, 
    inquiryController.remove
);

export default router;