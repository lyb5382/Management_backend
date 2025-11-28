import * as userManageService from './service.js';

// 목록 조회
export const getList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await userManageService.getUserList(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 차단/해제
export const toggleBlock = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await userManageService.toggleUserStatus(userId);
        
        const statusMsg = result.isActive ? '활성화(차단 해제)' : '차단';
        res.status(200).json({ 
            message: `회원이 ${statusMsg} 되었습니다.`, 
            user: { _id: result._id, name: result.name, isActive: result.isActive }
        });
    } catch (error) {
        next(error);
    }
};