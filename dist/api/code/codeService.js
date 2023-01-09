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
const dbService_1 = __importDefault(require("../../services/dbService"));
const ObjectId = require('mongodb').ObjectId;
exports.default = {
    getById,
    query,
};
function query() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield dbService_1.default.getCollection('code');
            var codeBlocks = yield collection.find({}).toArray();
            return codeBlocks;
        }
        catch (err) {
            console.log('cannot find code blocks', err);
            throw err;
        }
    });
}
function getById(codeId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield dbService_1.default.getCollection('code');
            const codeBlock = yield collection.findOne({ _id: ObjectId(codeId) });
            return codeBlock;
        }
        catch (err) {
            console.log(`Error while finding code id: ${codeId} `, err);
            throw err;
        }
    });
}
