"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const codeBlockController_1 = __importDefault(require("./codeBlockController"));
const jwtService_1 = require("../../services/jwtService");
const { getCodeBlocksIds, getCodeBlock, updateCodeBlock, addCodeBlock } = codeBlockController_1.default;
const { validateToken } = jwtService_1.jwtService;
const router = express_1.default.Router();
router.get('/', getCodeBlocksIds);
router.get('/:id', validateToken, getCodeBlock);
router.put('/:id', validateToken, updateCodeBlock);
router.post('/', validateToken, addCodeBlock);
exports.default = router;
