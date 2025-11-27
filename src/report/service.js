import Report from './model.js';

// 1. 신고 하기
export const createReport = async (userId, data) => {
    const report = await Report.create({
        reporter: userId,
        targetReviewId: data.reviewId,
        reason: data.reason,
    });
    return report;
};

// 2. 신고 목록 조회 (관리자용)
export const getReportList = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // 최신순 조회
    const reports = await Report.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reporter', 'name email role'); // 신고자 정보

    const total = await Report.countDocuments();

    return { reports, total, page, totalPages: Math.ceil(total / limit) };
};

// 3. 신고 처리 (관리자용 - 승인/기각)
export const processReport = async (reportId, status, adminMemo) => {
    if (!['resolved', 'dismissed'].includes(status)) {
        throw new Error('잘못된 처리 상태입니다.');
    }

    const report = await Report.findByIdAndUpdate(
        reportId,
        { 
            status: status, 
            adminMemo: adminMemo 
        },
        { new: true }
    );

    if (!report) throw new Error('신고 내역이 없습니다.');

    // (심화) 만약 status === 'resolved'라면 여기서 실제 Review 삭제 로직을 호출할 수 있음.
    // 예: if (status === 'resolved') await Review.findByIdAndDelete(report.targetReviewId);

    return report;
};