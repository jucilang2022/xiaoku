import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30
    },
    avatar: {
        type: String,
        default: '/vite.svg'
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 创建索引
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// 虚拟字段
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// 确保虚拟字段被序列化
userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

export default mongoose.model('User', userSchema);
