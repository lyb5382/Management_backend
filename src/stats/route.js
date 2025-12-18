import { Router } from 'express';
import * as statsController from './controller.js';
import { authMiddleware } from '../common/authMiddleware.js';

const router = Router();

// 👇 [핵심] 관리자(admin)랑 사업자(business) 둘 다 통과시키는 프리패스 문지기
const allowAdminOrBusiness = (req, res, next) => {
    const role = req.user.role; // authMiddleware가 req.user는 만들어줌
    if (role === 'admin' || role === 'business') {
        next();
    } else {
        res.status(403).json({ message: '권한이 없습니다.' });
    }
};

// 1. 사업자 통계 (이건 원래 있던 거, 냅둬)
router.get('/business', authMiddleware, statsController.getBusinessDashboard);

// 2. [수정] 관리자 통계 (주소는 /admin이지만, 사업자도 들어갈 수 있게 변경!)
router.get('/admin',
    authMiddleware,
    allowAdminOrBusiness, // 👈 adminAuthMiddleware 대신 이거 넣음!
    statsController.getAdminDashboard
);

export default router;