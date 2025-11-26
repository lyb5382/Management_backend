<<<<<<< HEAD
// 임시 모델

import { Schema, model } from 'mongoose';

// 🚨 (임시) 🚨
// businessRouter.js에서 import 에러 안 나게 하려는 '가짜' 모델임.
// 
const fakeUserSchema = new Schema({
    name: {
        type: String,
        default: '임시유저',
    },
    email: {
        type: String,
        default: 'temp@temp.com',
    },
    role: {
        type: String,
        enum: ['user', 'business', 'admin'], // (이 ENUM은 user-backend랑 맞춰야 함)
        default: 'user',
    },
});

export const User = model('User', fakeUserSchema);
=======
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: [EMAIL_REGEX, "유효한 이메일"],
        },

        passwordHash: {
            type: String,
            required: true,
        },

        phoneNumber: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        dateOfBirth: {
            type: Date,
        },

        role: {
            type: String,
            enum: ["user", "admin", "business"],
            default: "user",
            index: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
        },

        profileImage: {
            type: String, // S3 URL 저장할 때 사용
        },

        marketingAgree: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

// 🔐 비밀번호 비교 메서드
userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

// 🔐 save() 시 자동 해싱 (중복 방지)
userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) return next();

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);

    next();
});

// 🛡️ 응답에서 비밀번호 제거
userSchema.methods.toSafeJSON = function () {
    const obj = this.toObject({ versionKey: false });
    delete obj.passwordHash;
    return obj;
};

// 📧 이메일 인덱스 (unique)
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
>>>>>>> upstream/main
