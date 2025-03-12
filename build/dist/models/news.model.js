"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const NewsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    // Relations
    authorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    // Metadata
    publicationDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    },
    // Optional Fields
    content: { type: String },
    summary: { type: String },
    author: { type: String },
    source: { type: String },
    url: { type: String },
    socialMedia: { type: String },
    // References
    relatedNews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "News" }],
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }],
    reactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "NewsReaction" }],
}, { timestamps: true });
// ✅ Virtual Fields (For Populating)
NewsSchema.virtual("populatedComments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "newsId",
});
NewsSchema.virtual("populatedReactions", {
    ref: "NewsReaction",
    localField: "_id",
    foreignField: "newsId",
});
exports.default = mongoose_1.default.model("News", NewsSchema);
