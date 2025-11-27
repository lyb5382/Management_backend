import { Schema, model } from 'mongoose';

const roomSchema = new Schema(
    {
        // 어떤 호텔의 방인지 연결
        hotel: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
        },
        // 방 이름 (예: 디럭스 더블, 스위트룸)
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // 1박 가격
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        // 최대 수용 인원
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        // 방 개수 (재고)
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        // 방 설명
        description: {
            type: String,
        },
        // 방 이미지 (S3 URL 배열)
        images: [
            { type: String },
        ],
    },
    { timestamps: true }
);

export default model('Room', roomSchema);