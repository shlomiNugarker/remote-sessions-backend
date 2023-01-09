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
const codeBlockService_1 = __importDefault(require("./codeBlockService"));
exports.default = {
    getCodeBlock,
    getCodeBlocks,
    updateCodeBlock,
    addCodeBlock,
};
function getCodeBlocks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const codeBlocks = yield codeBlockService_1.default.query();
            res.send(codeBlocks);
        }
        catch (err) {
            console.log('Failed to get code blocks', err);
            res.status(500).send({ err: 'Failed to get code' });
        }
    });
}
function getCodeBlock(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const codeBlock = yield codeBlockService_1.default.getById(req.params.id);
            res.send(codeBlock);
        }
        catch (err) {
            console.log('Failed to get code block', err);
            res.status(500).send({ err: 'Failed to get code block' });
        }
    });
}
function updateCodeBlock(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const codeBlock = req.body;
            const updatedCodeBlock = yield codeBlockService_1.default.update(codeBlock);
            res.json(updatedCodeBlock);
        }
        catch (err) {
            console.log(err);
            res.status(500).send({ err: 'Failed to update codeBlock' });
        }
    });
}
function addCodeBlock(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const codeBlock = req.body;
            const addedCodeBlock = yield codeBlockService_1.default.add(codeBlock);
            res.json(addedCodeBlock);
        }
        catch (err) {
            console.log('Failed to add code block', err);
            res.status(500).send({ err: 'Failed to add codeBlock' });
        }
    });
}
