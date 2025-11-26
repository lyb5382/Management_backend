<<<<<<< HEAD
import { Router } from 'express';
import { Hotel } from '../models/hotel.js'; // 호텔 모델
import { Business } from '../models/business.js'; // 사업자 모델
import { s3Uploader } from '../utils/s3Uploader.js'; // S3 업로더
// import { authMiddleware } from '../middlewares/auth.middleware.js'; // (user-backend에서 만들 로그인 미들웨어)

const router = Router();

// ------------------------------------
// 🚨 (핵심) '승인된 사업자'인지 검증하는 미들웨어
// ------------------------------------
// (원래 authMiddleware 뒤에 붙어야 함)
const businessAuthMiddleware = async (req, res, next) => {
    try {
        // 1. (임시) 로그인 유저 ID (원래 authMiddleware가 req.user에 넣어줌)
        // const userId = req.user._id;
        const userId = '60d5f1b2b3b3f1b3f1b3f1b3'; // (임시 하드코딩)

        // 2. 'User' ID로 'Business' 문서를 찾음
        const business = await Business.findOne({ user: userId });

        // 3. 사업자 신청 내역이 없거나, 'approved' 상태가 아니면 컷
        if (!business) {
            return res.status(403).json({ message: '사업자 등록이 필요합니다.' });
        }
        if (business.status !== 'approved') {
            return res.status(403).json({ message: '승인된 사업자만 접근 가능합니다.' });
        }

        // 4. (성공) req 객체에 'business' 정보(ID 등)를 실어서 다음 라우터로 보냄
        req.business = business; // (이게 중요)
        next();
    } catch (error) {
        next(error);
    }
};

// ------------------------------------
// 1. 호텔 등록하기 (From: 사업자 프론트)
// ------------------------------------
router.post(
    '/',
    // authMiddleware, // (나중에 주석 해제)
    businessAuthMiddleware, // '승인된 사업자'인지 여기서 검증
    async (req, res, next) => {
        try {
            const { name, address, description, star_rating, amenities_list } =
                req.body;
            
            // 2. businessAuthMiddleware가 넣어준 req.business._id를 사용
            const businessId = req.business._id; 

=======
import { Router } from 'express'
import { Hotel } from '../models/hotel.js' // 호텔 모델
import { s3Uploader, s3 } from '../utils/s3Uploader.js' // S3 업로더
import { authMiddleware, businessAuthMiddleware } from '../utils/auth.js'
import { DeleteObjectsCommand } from '@aws-sdk/client-s3' // 삭제 명령 가져오기

const router = Router()

// 1. 호텔 등록하기 (From: 사업자 프론트)
router.post(
    '/',
    authMiddleware,
    businessAuthMiddleware, // '승인된 사업자'인지 여기서 검증
    async (req, res, next) => {
        try {
            const { name, address, description, star_rating, amenities_list } = req.body
            // 2. businessAuthMiddleware가 넣어준 req.business._id를 사용
            const businessId = req.business._id
>>>>>>> upstream/main
            const newHotel = await Hotel.create({
                business: businessId, // '어떤 사업자'의 호텔인지 명시
                name,
                address,
                description,
                star_rating,
                amenities_list,
<<<<<<< HEAD
            });

            res.status(201).json(newHotel);
        } catch (error) {
            next(error);
        }
    }
);

// ------------------------------------
// 2. 내 호텔 목록 조회 (From: 사업자 프론트)
// ------------------------------------
=======
            })
            res.status(201).json(newHotel)
        } catch (error) {
            next(error)
        }
    }
)

// 2. 내 호텔 목록 조회 (From: 사업자 프론트)
>>>>>>> upstream/main
router.get(
    '/my-hotels',
    // authMiddleware,
    businessAuthMiddleware, // '승인된 사업자'인지 검증
    async (req, res, next) => {
        try {
<<<<<<< HEAD
            const businessId = req.business._id;
            const myHotels = await Hotel.find({ business: businessId });
            res.status(200).json(myHotels);
        } catch (error) {
            next(error);
        }
    }
);


// ------------------------------------
// 3. 호텔 이미지 업로드 (From: 사업자 프론트)
// (S3 업로더 사용)
// ------------------------------------
=======
            const businessId = req.business._id
            const myHotels = await Hotel.find({ business: businessId })
            res.status(200).json(myHotels)
        } catch (error) {
            next(error)
        }
    }
)


// 3. 호텔 이미지 업로드 (From: 사업자 프론트)
// (S3 업로더 사용)
>>>>>>> upstream/main
router.post(
    '/:hotelId/images',
    // authMiddleware,
    businessAuthMiddleware, // 1. 사업자 검증
    s3Uploader.array('hotelImages', 10), // 2. S3 업로드 (최대 10개, <input name="hotelImages">)
    async (req, res, next) => {
        try {
<<<<<<< HEAD
            const { hotelId } = req.params;
            const businessId = req.business._id;

            // 3. S3에서 URL 목록 가져오기
            const imageUrls = req.files.map((file) => file.location);
            if (imageUrls.length === 0) {
                throw new Error('업로드할 이미지가 없습니다.');
            }

            // 4. 호텔 찾기
            const hotel = await Hotel.findById(hotelId);
            if (!hotel) {
                throw new Error('호텔 정보가 없습니다.');
            }

            // 5. (좆나 중요) 이 호텔이 '내' 소유(Business)가 맞는지 검증
            if (hotel.business.toString() !== businessId.toString()) {
                return res.status(403).json({ message: '내 호텔이 아닙니다. (권한 없음)' });
            }

            // 6. 검증 통과 -> 이미지 URL 배열에 추가
            hotel.images.push(...imageUrls);
            await hotel.save();

            res.status(200).json(hotel);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
=======
            const { hotelId } = req.params
            const businessId = req.business._id
            // 3. S3에서 URL 목록 가져오기
            const imageUrls = req.files.map((file) => file.location)
            if (imageUrls.length === 0) {
                throw new Error('업로드할 이미지가 없습니다.')
            }
            // 4. 호텔 찾기
            const hotel = await Hotel.findById(hotelId)
            if (!hotel) {
                throw new Error('호텔 정보가 없습니다.')
            }
            // 5. 이 호텔이 '내' 소유(Business)가 맞는지 검증
            if (hotel.business.toString() !== businessId.toString()) {
                return res.status(403).json({ message: '내 호텔이 아닙니다. (권한 없음)' })
            }
            // 6. 검증 통과 -> 이미지 URL 배열에 추가
            hotel.images.push(...imageUrls)
            await hotel.save()
            res.status(200).json(hotel)
        } catch (error) {
            next(error)
        }
    }
)

// 단일 호텔 조회 (수정 페이지용)
router.get(
    '/:hotelId',
    authMiddleware,
    businessAuthMiddleware, // 1. 사업자 검증
    async (req, res, next) => {
        try {
            const { hotelId } = req.params
            const businessId = req.business._id
            const hotel = await Hotel.findById(hotelId)
            if (!hotel) {
                return res.status(404).json({ message: '호텔이 없습니다.' })
            }
            // 2. 🚨 (소유권 검증) 
            if (hotel.business.toString() !== businessId.toString()) {
                return res.status(403).json({ message: '내 호텔이 아닙니다.' })
            }
            res.status(200).json(hotel)
        } catch (error) {
            next(error)
        }
    }
)

// 호텔 정보 '수정'
router.patch(
    '/:hotelId',
    authMiddleware,
    businessAuthMiddleware, // 1. 사업자 검증
    async (req, res, next) => {
        try {
            const { hotelId } = req.params
            const businessId = req.business._id
            // 2. 프론트에서 수정할 정보만 (JSON으로) 받음
            const { name, address, description, star_rating, amenities_list } = req.body
            const hotel = await Hotel.findById(hotelId)
            if (!hotel) {
                return res.status(404).json({ message: '호텔이 없습니다.' })
            }
            // 3. 🚨 (소유권 검증) 
            if (hotel.business.toString() !== businessId.toString()) {
                return res.status(403).json({ message: '내 호텔이 아닙니다.' })
            }
            // 4. (수정) 받은 정보만 업데이트
            if (name) hotel.name = name
            if (address) hotel.address = address
            if (description) hotel.description = description
            if (star_rating) hotel.star_rating = star_rating
            if (amenities_list) hotel.amenities_list = amenities_list
            await hotel.save()
            res.status(200).json(hotel)
        } catch (error) {
            next(error)
        }
    }
)

// 호텔 '삭제'
router.delete(
    '/:hotelId',
    authMiddleware,
    businessAuthMiddleware, // 1. 사업자 검증
    async (req, res, next) => {
        try {
            const { hotelId } = req.params
            const businessId = req.business._id
            const hotel = await Hotel.findById(hotelId)
            if (!hotel) {
                return res.status(404).json({ message: '호텔이 없습니다.' })
            }
            // 2. 🚨 (소유권 검증) 
            if (hotel.business.toString() !== businessId.toString()) {
                return res.status(403).json({ message: '내 호텔이 아닙니다. (권한 없음)' })
            }
            // 3. 🗑️ (S3 이미지 삭제 로직)
            if (hotel.images && hotel.images.length > 0) {
                try {
                    // (1) URL에서 'Key'만 발라내기
                    const keys = hotel.images.map((imageUrl) => {
                        const urlParts = new URL(imageUrl)
                        // decodeURIComponent()로 감싸야 한글 파일도 지워짐!
                        const decodedKey = decodeURIComponent(urlParts.pathname.substring(1))
                        return { Key: decodedKey }
                    });
                    console.log('🗑️ 삭제할 S3 Keys:', keys)
                    // (2) S3에 삭제 명령
                    const deleteCommand = new DeleteObjectsCommand({
                        Bucket: process.env.S3_BUCKET,
                        Delete: {
                            Objects: keys,
                        },
                    })
                    await s3.send(deleteCommand)
                    console.log('✅ S3 이미지 삭제 명령 전송 완료')
                } catch (s3Error) {
                    console.error('⚠️ S3 이미지 삭제 실패 (DB는 지움):', s3Error)
                }
            }
            // 4. (DB 삭제)
            await Hotel.findByIdAndDelete(hotelId)
            res.status(200).json({ message: '호텔과 이미지가 삭제되었습니다.' })
        } catch (error) {
            next(error)
        }
    }
)

export default router
>>>>>>> upstream/main
