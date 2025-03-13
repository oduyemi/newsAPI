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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// News Schema
const NewsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true,
        default: "Content not available."
    },
    image: {
        type: [String],
        default: []
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
        ref: "User",
        required: true,
    },
    tagId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
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
        default: "published"
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
    reactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "NewsReaction" }],
}, { timestamps: true });
const newsData = [
    {
        title: "AI Revolution in Tech",
        image: ["https://newslist-bice.vercel.app/assets/ai.jpg"],
        excerpt: "Major tech firms unveil a new AI model...",
        views: 1200,
        text: "In recent developments, major tech firms have introduced a revolutionary AI model that could change the landscape of technology as we know it.",
        authorId: "67d1f6787ea9f5e21a862bf5",
        tagId: "67d31859d1af548fbd7599c9",
        status: "published",
        relatedNews: [],
        reactions: []
    },
    {
        title: "Travel Industry Boom in 2025",
        image: ["https://newslist-bice.vercel.app/assets/travel.jpg"],
        excerpt: "More people are exploring the world post-pandemic...",
        views: 850,
        text: "Post-pandemic, the travel industry has seen a significant surge in demand, with people eager to explore the world once more.",
        authorId: "67d1f6787ea9f5e21a862bf5",
        tagId: "67d318a1d1af548fbd7599ca",
        status: "published",
        relatedNews: [],
        reactions: []
    },
    {
        title: "Food Science Breakthroughs",
        image: ["https://newslist-bice.vercel.app/assets/food.jpg"],
        excerpt: "Scientists introduce a sustainable food tech...",
        views: 530,
        text: "New developments in food science have led to sustainable food technology, promising a greener future for global food production.",
        authorId: "67d1f6787ea9f5e21a862bf5",
        tagId: "67d318b2d1af548fbd7599cb",
        status: "published",
        relatedNews: [],
        reactions: []
    },
    {
        title: "SpaceX to Launch Lunar Mission",
        image: ["https://newslist-bice.vercel.app/assets/lunar.jpg"],
        excerpt: "Elon Musk announces plans for another moon landing...",
        views: 2200,
        text: "SpaceX has unveiled plans for a new lunar mission, aiming to make history with another moon landing in the near future.",
        authorId: "67d1f6787ea9f5e21a862bf5",
        tagId: "67d31859d1af548fbd7599c9",
        status: "published",
        relatedNews: [],
        reactions: []
    },
    {
        title: "Top 10 Travel Destinations for 2025",
        image: ["https://newslist-bice.vercel.app/assets/destination.jpg"],
        excerpt: "Must-visit places for travel lovers...",
        views: 950,
        text: "Planning your next vacation? Here are the top 10 travel destinations to visit in 2025.",
        authorId: "67d1f6787ea9f5e21a862bf5",
        tagId: "67d318a1d1af548fbd7599ca",
        status: "published",
        relatedNews: [],
        reactions: []
    }
];
// Insert the data into the News collection
newsData.forEach((newsItem) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newNews = yield mongoose_1.default.model("News", NewsSchema).create(newsItem);
        console.log(`News article titled "${newsItem.title}" created successfully!`);
    }
    catch (error) {
        console.error("Error creating news article:", error);
    }
}));
exports.default = mongoose_1.default.model("News", NewsSchema);
