import User from '../auth/model.js'; // 유성준꺼 모델 재활용

// 1. 전체 회원 목록 조회 (관리자용)
export const getUserList = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // 일반 유저만 조회 (관리자는 제외)
    const query = { role: 'user' };

    const users = await User.find(query)
        .select('-passwordHash') // 🚨 비번은 절대 내보내면 안 됨
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments(query);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
};

// 2. 회원 차단/해제 토글 (isActive: true <-> false)
export const toggleUserStatus = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('회원을 찾을 수 없습니다.');

    // 상태 뒤집기 (활성 -> 차단, 차단 -> 활성)
    user.isActive = !user.isActive;
    await user.save();

    return user;
};