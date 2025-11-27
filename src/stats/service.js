import { Payment, Reservation } from './model.js';
import Hotel from '../hotel/model.js';

// 1. [사업자용] 내 호텔 매출 통계 (월별)
export const getBusinessStats = async (businessId) => {
    // 내 호텔들의 ID를 싹 다 가져옴
    const myHotels = await Hotel.find({ business: businessId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    // Aggregation (집계) 마법
    const monthlySales = await Payment.aggregate([
        {
            $match: {
                hotel: { $in: hotelIds }, // 내 호텔 결제만 골라내고
                status: 'paid', // 결제 완료된 것만
            }
        },
        {
            $group: {
                _id: { 
                    year: { $year: "$createdAt" }, // 연도별
                    month: { $month: "$createdAt" } // 월별로 묶어
                },
                totalSales: { $sum: "$amount" }, // 금액 합치기
                count: { $sum: 1 } // 결제 건수 세기
            }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } } // 최신순 정렬
    ]);

    return { 
        totalHotels: hotelIds.length, 
        monthlySales 
    };
};

// 2. [관리자용] 전체 통계 (대시보드용)
export const getAdminStats = async () => {
    // 총 매출 (전체)
    const totalRevenue = await Payment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 총 예약 건수
    const totalReservations = await Reservation.countDocuments();
    
    // 총 호텔 수
    const totalHotels = await Hotel.countDocuments();

    // (심화) 최근 6개월 매출 추이 같은 것도 여기서 뽑으면 됨. 일단은 총계만.
    
    return {
        revenue: totalRevenue[0]?.total || 0,
        reservations: totalReservations,
        hotels: totalHotels
    };
};