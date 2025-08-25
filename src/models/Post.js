import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    image: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 创建索引
postSchema.index({ userId: 1 });
postSchema.index({ createdAt: -1 });

// 虚拟字段
postSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// 确保虚拟字段被序列化
postSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export default mongoose.model('Post', postSchema);
