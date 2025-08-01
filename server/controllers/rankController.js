const Rank = require("../models/Rank");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.getRank = asyncHandler(async (req, res) => {
    const rank = await Rank.find().sort({ playCount: -1 });
    return res.status(200).json({
        success: true,
        message: "랭킹 조회",
        rank,
    });
});