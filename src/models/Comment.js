import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    authorAvatar: {
        type: String,
        default: '/vite.svg'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 创建索引
commentSchema.index({ postId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ createdAt: 1 });

// 虚拟字段
commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// 确保虚拟字段被序列化
commentSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export default mongoose.model('Comment', commentSchema);
