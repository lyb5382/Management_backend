import { Schema, model } from 'mongoose';

const reportSchema = new Schema(
    {
        // 신고한 사람 (사업자 or 유저)
        reporter: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // 신고 대상 리뷰 ID (Review 모델은 유성준꺼라 참조만 함)
        targetReviewId: {
            type: Schema.Types.ObjectId,
            required: true,
            // ref: 'Review' (Review 모델 있으면 연결 가능)
        },
        // 신고 사유
        reason: {
            type: String,
            required: true,
        },
        // 처리 상태
        status: {
            type: String,
            enum: ['pending', 'resolved', 'dismissed'], // 대기, 처리됨(삭제), 기각
            default: 'pending',
        },
        // 관리자 답변/메모 (선택)
        adminMemo: {
            type: String,
        }
    },
    { timestamps: true }
);

export default model('Report', reportSchema);