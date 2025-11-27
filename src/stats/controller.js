import * as statsService from './service.js';

// 사업자 대시보드
export const getBusinessDashboard = async (req, res, next) => {
    try {
        const businessId = req.business._id; // 미들웨어가 줌
        const stats = await statsService.getBusinessStats(businessId);
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

// 관리자 대시보드
export const getAdminDashboard = async (req, res, next) => {
    try {
        const stats = await statsService.getAdminStats();
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};