import * as bookingService from './service.js';

export const getList = async (req, res, next) => {
    try {
        const businessId = req.business._id;
        const { status } = req.query;
        const list = await bookingService.getBusinessBookings(businessId, status);
        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const businessId = req.business._id;
        const { bookingId } = req.params; // 여기 바뀜
        const { status } = req.body;

        if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
            // 유저 모델 enum에 rejected가 없어서 cancelled로 처리하거나 협의 필요.
            // 일단 있는 걸로 함.
            // return res.status(400).json({ message: '잘못된 상태 값' });
        }

        const result = await bookingService.updateBookingStatus(bookingId, businessId, status);
        res.status(200).json({ message: `예약이 ${status} 되었습니다.`, data: result });
    } catch (error) {
        if (error.message.includes('권한')) return res.status(403).json({ message: error.message });
        next(error);
    }
};

// 👇 [수정] 관리자용 전체 예약 조회 (하이브리드 모드)
export const getAdminList = async (req, res, next) => {
    try {
        const { role, _id } = req.user; // 로그인한 놈 정보

        // 🚨 1. 사업자(Business)라면? -> 자기 예약 목록 가져오는 서비스로 토스!
        if (role === 'business') {
            const { status } = req.query;
            // 이미 만들어둔 getBusinessBookings 재활용 (개이득)
            const list = await bookingService.getBusinessBookings(_id, status);
            return res.status(200).json(list);
        }

        // 🚨 2. 찐 관리자(Admin)라면? -> 원래 하던 대로 전체 조회
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { startDate, endDate, status } = req.query;

        const result = await bookingService.getAdminAllBookings(page, limit, startDate, endDate, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// [관리자] 강제 취소
export const cancelByAdmin = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const result = await bookingService.cancelBookingByAdmin(bookingId);
        res.status(200).json({
            message: '관리자 권한으로 예약이 취소되었습니다.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};