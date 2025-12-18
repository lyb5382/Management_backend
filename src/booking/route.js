import { Router } from 'express';
import * as bookingController from './controller.js';
import { authMiddleware, businessAuthMiddleware, adminAuthMiddleware } from '../common/authMiddleware.js';

const router = Router();

// 👇 [추가] 관리자랑 사업자 둘 다 통과시키는 미들웨어 (복붙해)
const allowAdminOrBusiness = (req, res, next) => {
    const role = req.user.role;
    if (role === 'admin' || role === 'business') {
        next();
    } else {
        res.status(403).json({ message: '권한이 없습니다.' });
    }
};

// 1. 목록 조회 (이건 사업자 전용 페이지용, 냅둬)
router.get('/business',
    authMiddleware,
    businessAuthMiddleware,
    bookingController.getList
);

// 2. 상태 변경 (이것도 냅둬)
router.patch('/:bookingId/status',
    authMiddleware,
    businessAuthMiddleware,
    bookingController.updateStatus
);

// 👇 [수정] 여기가 핵심! 프론트 '예약 관리' 페이지가 이걸 씀.
router.get('/admin/all',
    authMiddleware,
    allowAdminOrBusiness, // 👈 adminAuthMiddleware 대신 이거 넣어!
    bookingController.getAdminList
);

// 관리자 강제 취소 (이건 관리자만 하는 게 맞으니까 냅둬)
router.patch('/admin/:bookingId/cancel',
    authMiddleware,
    adminAuthMiddleware,
    bookingController.cancelByAdmin
);

export default router;