"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const codeBlockController_1 = __importDefault(require("./codeBlockController"));
const router = express_1.default.Router();
router.get('/', codeBlockController_1.default.getCodeBlocksIds);
router.get('/:id', codeBlockController_1.default.getCodeBlock);
router.put('/:id', codeBlockController_1.default.updateCodeBlock);
router.post('/', codeBlockController_1.default.addCodeBlock);
exports.default = router;
