import * as reviewService from './service.js';
import Hotel from '../hotel/model.js'
import Review from './model.js';

// 목록 조회
export const getList = async (req, res, next) => {
    try {
        const { role, _id } = req.user;
        let query = {};

        // 🚨 사업자라면? -> 내 호텔에 달린 리뷰만 가져와야 함
        if (role === 'business') {
            // 1. 내 호텔 ID들을 먼저 찾음
            const myHotels = await Hotel.find({ business: _id }).select('_id');
            const hotelIds = myHotels.map(h => h._id);

            // 2. 그 호텔들에 달린 리뷰만 검색
            query = { hotel: { $in: hotelIds } };
        }

        const reviews = await Review.find(query)
            .populate('user', 'name email')
            .populate('hotel', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

// 상세 조회
export const getOne = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const result = await reviewService.getReviewById(reviewId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 삭제
export const remove = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        await reviewService.deleteReview(reviewId);
        res.status(200).json({ message: '리뷰가 삭제되었습니다.' });
    } catch (error) {
        next(error);
    }
};

// 상태 변경
export const updateStatus = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { status } = req.body;
        await reviewService.updateReviewStatus(reviewId, status);
        res.status(200).json({ message: '리뷰 상태가 변경되었습니다.' });
    } catch (error) {
        next(error);
    }
};