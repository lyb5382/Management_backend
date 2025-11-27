import * as reportService from './service.js';

// 신고 등록
export const create = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const result = await reportService.createReport(userId, req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// 목록 조회 (관리자)
export const getList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await reportService.getReportList(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 신고 처리 (관리자)
export const process = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const { status, adminMemo } = req.body; // resolved or dismissed
        
        const result = await reportService.processReport(reportId, status, adminMemo);
        res.status(200).json({ message: '신고 처리가 완료되었습니다.', data: result });
    } catch (error) {
        next(error);
    }
};