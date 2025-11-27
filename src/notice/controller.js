import * as noticeService from './service.js';

// 생성
export const create = async (req, res, next) => {
    try {
        const adminId = req.user._id;
        const result = await noticeService.createNotice(adminId, req.body, req.files);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// 목록 조회
export const getList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await noticeService.getNoticeList(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 상세 조회
export const getOne = async (req, res, next) => {
    try {
        const { noticeId } = req.params;
        const result = await noticeService.getNoticeById(noticeId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 삭제
export const remove = async (req, res, next) => {
    try {
        const { noticeId } = req.params;
        await noticeService.deleteNotice(noticeId);
        res.status(200).json({ message: '공지사항이 삭제되었습니다.' });
    } catch (error) {
        next(error);
    }
};

// 수정
export const update = async (req, res, next) => {
    try {
        const { noticeId } = req.params;
        const result = await noticeService.updateNotice(noticeId, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};