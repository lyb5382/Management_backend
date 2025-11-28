import * as paymentService from './service.js';

// 관리자용 전체 조회
export const getAdminList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await paymentService.getAllPayments(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 사업자용 내역 조회
export const getBusinessList = async (req, res, next) => {
    try {
        const businessId = req.business._id;
        const result = await paymentService.getBusinessPayments(businessId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};