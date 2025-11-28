import Payment from './model.js';
import Booking from '../booking/model.js';
import Hotel from '../hotel/model.js';

// 1. [관리자] 전체 결제 내역 조회
export const getAllPayments = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
        .populate('user', 'name email')
        .populate({
            path: 'booking',
            populate: { path: 'hotel', select: 'name' } // 예약 안의 호텔 이름까지
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Payment.countDocuments();

    return { payments, total, page, totalPages: Math.ceil(total / limit) };
};

// 2. [사업자] 내 호텔 결제 내역 조회
// (Payment에는 businessId가 없어서 Booking을 거쳐서 찾아야 함. 빡세다 ㅋ)
export const getBusinessPayments = async (businessId) => {
    // 1) 내 호텔 찾기
    const myHotels = await Hotel.find({ business: businessId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    // 2) 내 호텔의 예약들 찾기
    const myBookings = await Booking.find({ hotel: { $in: hotelIds } }).select('_id');
    const bookingIds = myBookings.map(b => b._id);

    // 3) 그 예약들의 결제 내역 찾기
    const payments = await Payment.find({ booking: { $in: bookingIds } })
        .populate('user', 'name email')
        .populate('booking')
        .sort({ createdAt: -1 });

    return payments;
};