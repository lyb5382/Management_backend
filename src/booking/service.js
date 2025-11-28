import Booking from './model.js'; // Booking 모델 임포트
import Hotel from '../hotel/model.js';

// 1. [사업자] 내 예약 목록 조회
export const getBusinessBookings = async (businessId, status) => {
    const myHotels = await Hotel.find({ business: businessId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    const query = { hotel: { $in: hotelIds } };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
        .populate('user', 'name email phoneNumber')
        .populate('hotel', 'name')
        .populate('room', 'name')
        .sort({ createdAt: -1 });

    return bookings;
};

// 2. [사업자] 예약 승인 / 거절
export const updateBookingStatus = async (bookingId, businessId, status) => {
    const booking = await Booking.findById(bookingId).populate('hotel');

    if (!booking) throw new Error('예약 정보를 찾을 수 없습니다.');

    if (booking.hotel.business.toString() !== businessId.toString()) {
        throw new Error('권한이 없습니다. (내 호텔의 예약이 아님)');
    }

    booking.status = status;
    await booking.save();

    return booking;
};