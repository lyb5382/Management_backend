import { Router } from 'express';
import * as roomController from './controller.js';
import { authMiddleware, businessAuthMiddleware } from '../common/authMiddleware.js';
import { s3Uploader } from '../common/s3Uploader.js';

const router = Router();

// 1. 객실 등록 (사업자만)
router.post('/', 
    authMiddleware, 
    businessAuthMiddleware, 
    roomController.create
);

// 2. 호텔별 객실 목록 조회 (누구나)
// GET /api/rooms/hotel/:hotelId
router.get('/hotel/:hotelId', 
    roomController.getList
);

// 3. 객실 수정 (사업자만)
router.patch('/:roomId', 
    authMiddleware, 
    businessAuthMiddleware, 
    roomController.update
);

// 4. 객실 삭제 (사업자만)
router.delete('/:roomId', 
    authMiddleware, 
    businessAuthMiddleware, 
    roomController.remove
);

// 5. 객실 이미지 업로드
router.post('/:roomId/images',
    authMiddleware,
    businessAuthMiddleware,
    s3Uploader.array('roomImages', 10), // 키 이름: roomImages
    roomController.uploadImages
);

export default router;