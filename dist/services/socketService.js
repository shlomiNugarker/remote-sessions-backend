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
Object.defineProperty(exports, "__esModule", { value: true });
let gIo;
let gConnectedSockets = [];
const gWatchersOnCodeBlocks = {};
function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
            pingTimeout: 60000,
        },
    });
    gIo.on('connection', (socket) => {
        addSocketToConnectedSockets(socket.id);
        // console.log({ gWatchersOnCodeBlocks })
        // when code-block saved, updating other users:
        socket.on('code-block-saved', (codeBlock) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const socketsIdsToUpdate = (_a = gWatchersOnCodeBlocks[codeBlock._id]) === null || _a === void 0 ? void 0 : _a.filter((socketId) => socketId !== socket.id);
            if (socketsIdsToUpdate === null || socketsIdsToUpdate === void 0 ? void 0 : socketsIdsToUpdate.length) {
                socketsIdsToUpdate.forEach((socketId) => __awaiter(this, void 0, void 0, function* () {
                    yield emitToSocket({
                        type: 'update-code-block',
                        data: codeBlock,
                        socketId,
                    });
                }));
            }
        }));
        // when someone is watching the code-block-page
        socket.on('someone-enter-code-block', (codeBlockId) => __awaiter(this, void 0, void 0, function* () {
            // console.log('someone-enter-code-block')
            addSocketToWatchers(codeBlockId, socket);
            send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId);
            // console.log({ gWatchersOnCodeBlocks })
        }));
        // when someone leave the code-block-page
        socket.on('someone-left-code-block', (codeBlockId) => __awaiter(this, void 0, void 0, function* () {
            // console.log('someone-left-code-block')
            removeSocketFromWatchers(codeBlockId, socket.id);
            yield send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId);
            // console.log({ gWatchersOnCodeBlocks })
        }));
        // when browser disconnected
        socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
            // console.log('disconnect')
            removeConnectedSocket(socket.id);
            find_And_Remove_Socket_In_Watcher_Sockets(socket.id);
            for (const codeBlockId in gWatchersOnCodeBlocks) {
                send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId);
            }
            // console.log({ gWatchersOnCodeBlocks })
        }));
    });
}
function emitToSocket({ type, data, socketId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const socket = yield getSocketById(socketId);
        if (socket)
            socket.emit(type, data);
        else {
            console.log('socket not found');
        }
    });
}
function getSocketById(socketId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sockets = yield getAllSockets();
        if (!sockets)
            return;
        const socket = sockets.find((s) => s.id === socketId);
        return socket;
    });
}
function getAllSockets() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!gIo)
            return;
        const sockets = yield gIo.fetchSockets();
        return sockets;
    });
}
// sending watchers to all sockets who watching the code-block:
function send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId) {
    return __awaiter(this, void 0, void 0, function* () {
        const watchersOnSpecificCodeBlock = gWatchersOnCodeBlocks[codeBlockId];
        watchersOnSpecificCodeBlock === null || watchersOnSpecificCodeBlock === void 0 ? void 0 : watchersOnSpecificCodeBlock.forEach((socketId) => __awaiter(this, void 0, void 0, function* () {
            const socket = yield getSocketById(socketId);
            if (!socket)
                return;
            socket.emit('update-watchers-on-specific-code-block', watchersOnSpecificCodeBlock);
        }));
    });
}
// updating "gWatchersOnCodeBlocks" after browser disconnected:
function find_And_Remove_Socket_In_Watcher_Sockets(socketId) {
    for (const codeBlockId in gWatchersOnCodeBlocks) {
        if (gWatchersOnCodeBlocks[codeBlockId].includes(socketId)) {
            removeSocketFromWatchers(codeBlockId, socketId);
        }
    }
}
function removeConnectedSocket(socketIdToRemove) {
    gConnectedSockets = gConnectedSockets.filter((socketId) => socketId !== socketIdToRemove);
}
function addSocketToConnectedSockets(socketId) {
    if (!gConnectedSockets.includes(socketId))
        gConnectedSockets.push(socketId);
}
function addSocketToWatchers(codeBlockId, socket) {
    if (!gWatchersOnCodeBlocks[codeBlockId])
        gWatchersOnCodeBlocks[codeBlockId] = [socket.id];
    else if (gWatchersOnCodeBlocks[codeBlockId] &&
        !gWatchersOnCodeBlocks[codeBlockId].includes(socket.id)) {
        gWatchersOnCodeBlocks[codeBlockId].push(socket.id);
    }
}
function removeSocketFromWatchers(codeBlockId, socketIdToRemove) {
    if (gWatchersOnCodeBlocks[codeBlockId]) {
        gWatchersOnCodeBlocks[codeBlockId] = gWatchersOnCodeBlocks[codeBlockId].filter((socketId) => socketId !== socketIdToRemove);
    }
}
exports.default = {
    connectSockets,
};
