import * as statsService from './service.js';

// 사업자 전용 (이건 냅둬)
export const getBusinessDashboard = async (req, res, next) => {
    try {
        // req.user._id를 써야 안전함 (authMiddleware가 파싱한 거)
        const stats = await statsService.getBusinessStats(req.user._id);
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

// 👇 [수정] 관리자 대시보드 (하이브리드 모드)
export const getAdminDashboard = async (req, res, next) => {
    try {
        // 1. 들어온 놈의 역할(Role) 확인
        const { role, _id } = req.user;

        // 2. 사업자(Business)라면? -> 지네 가게 통계 함수로 토스!
        if (role === 'business') {
            const stats = await statsService.getBusinessStats(_id);
            return res.status(200).json(stats);
        }

        // 3. 찐 관리자(Admin)라면? -> 전체 통계 함수 실행!
        const stats = await statsService.getAdminStats();
        res.status(200).json(stats);

    } catch (error) {
        next(error);
    }
};