"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createTokens = (user) => {
    const accessToken = (0, jsonwebtoken_1.sign)({ username: user.userName, id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
    return accessToken;
};
const validateToken = (req, res, next) => {
    var _a;
    const { headers: { cookie }, } = req;
    let cookies = {};
    const cookiesArray = (_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.split(';');
    cookiesArray === null || cookiesArray === void 0 ? void 0 : cookiesArray.forEach((cookie) => {
        const [key, value] = cookie.trim().split('=');
        cookies[key] = value;
    });
    // get The "access-token" value:
    const accessToken = cookies['access-token'];
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
