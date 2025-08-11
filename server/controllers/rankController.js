const Rank = require("../models/Rank");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.getRank = asyncHandler(async (req, res) => {
    try {
        const rank = await Rank.find().sort({ playCount: -1 });
        return res.status(200).json({
            rank,
        });
    } catch (error) {
        console.error("[rank] 랭킹 조회 실패:", error);
        return res.status(500).json({
            message: "랭킹 정보를 불러오는 중 오류가 발생했습니다. : "+ error.message,
        });
    }
});