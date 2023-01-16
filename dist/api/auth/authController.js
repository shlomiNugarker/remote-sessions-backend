"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("./authService"));
const jwtService_1 = require("../../services/jwtService");
exports.default = { login, signup, logout };
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userName, password } = req.body;
        try {
            const user = yield authService_1.default.login(userName, password);
            req.session.user = user;
            // jwt:
            const accessToken = jwtService_1.jwtService.createTokens(user);
            res.cookie('access-token', accessToken, {
                maxAge: 60 * 1000 * 60 * 24,
                httpOnly: true,
            });
            res.json(user);
        }
        catch (err) {
            console.log('Failed to Login ' + err);
            res.status(401).send({ err: 'Failed to Login' });
        }
    });
}
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userName, password, fullName, isMentor } = req.body;
            const account = yield authService_1.default.signup(userName, password, fullName, isMentor);
            const user = yield authService_1.default.login(userName, password);
            req.session.user = user;
            res.json(user);
        }
        catch (err) {
            console.log('Failed to signup ' + err);
            res.status(500).send({ err: 'Failed to signup' });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.session.destroy((err) => console.log()); // ?
            res.clearCookie('access-token');
            res.send({ msg: 'Logged out successfully' });
        }
        catch (err) {
            res.status(500).send({ err: 'Failed to logout' });
        }
    });
}
