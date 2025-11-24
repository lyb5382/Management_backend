import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// 라우터 (안내데스크) Import..
import businessRouter from './src/routes/businessRouter.js';
import hotelRouter from './src/routes/hotelRouter.js';
import authRoutes from './src/routes/authRoutes.js'

// .env 변수 로드
const { PORT, MONGO_URI, FRONT_ORIGIN } = process.env;

if (!MONGO_URI) {
    throw new Error('MONGO_URI가 .env에 없습니다.');
}

// MongoDB 연결
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB 연결 성공'))
    .catch((err) =>
        console.error('❌ MongoDB 연결 실패:', err)
    );

// Express 앱 생성 및 미들웨어
const app = express();

// 1. CORS 설정 (프론트 서버 주소 허용)
app.use(cors({ origin: FRONT_ORIGIN }));

// 2. Body Parser (JSON 파싱)
app.use(express.json());
// (참고: form 데이터용)
// app.use(express.urlencoded({ extended: false }));

// API 라우터 연결 (안내데스크)
// 헬스 체크용
app.get('/api', (req, res) => {
    res.status(200).send('API 서버 살아있음 (Management)');
});

// "사업자" 관련 API는 이쪽으로
app.use('/api/business', businessRouter);

// "호텔" 관련 API는 이쪽으로
app.use('/api/hotels', hotelRouter);

// 회원가입/로그인 (/api/auth/signup, /api/auth/login)
app.use('/api/auth', authRoutes);

// (필수) 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('❌ 전체 에러 발생:', err.stack);
    res.status(500).json({
        message: err.message || '서버에서 좆망 에러가 발생했습니다.',
    });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 관리 백엔드 서버가 ${PORT}번 포트에서 달리는 중...`);
});