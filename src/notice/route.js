import { Router } from 'express';
import * as noticeController from './controller.js';
import { authMiddleware, adminAuthMiddleware } from '../common/authMiddleware.js';
import { s3Uploader } from '../common/s3Uploader.js';

const router = Router();

// 1. 공지 등록 (관리자만 + 이미지 최대 5장)
router.post('/',
    authMiddleware,
    adminAuthMiddleware,
    s3Uploader.array('noticeImages', 5),
    noticeController.create
);

// 2. 공지 목록 조회 (누구나)
router.get('/', noticeController.getList);

// 3. 공지 상세 조회 (누구나)
router.get('/:noticeId', noticeController.getOne);

// 4. 공지 수정 (관리자만)
router.patch('/:noticeId',
    authMiddleware,
    adminAuthMiddleware,
    noticeController.update
);

// 5. 공지 삭제 (관리자만)
router.delete('/:noticeId',
    authMiddleware,
    adminAuthMiddleware,
    noticeController.remove
);

export default router;