"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createTokens = (user) => {
    const accessToken = (0, jsonwebtoken_1.sign)({ username: user.userName, id: user._id }, process.env.TOKEN_SECRET);
    return accessToken;
};
const validateToken = (req, res, next) => {
    const { headers: { cookie }, } = req;
    // get The "access-token" value:
    const accessToken = cookie === null || cookie === void 0 ? void 0 : cookie.split('; ')[0].split('=')[1];
    if (!accessToken)
        return res.status(400).json({ error: 'User not Authenticated!' });
    try {
        const validToken = (0, jsonwebtoken_1.verify)(accessToken, process.env.TOKEN_SECRET);
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    }
    catch (err) {
        return res.status(400).json({ error: err });
    }
};
exports.jwtService = {
    createTokens,
    validateToken,
};
