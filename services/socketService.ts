import { Socket } from 'socket.io'

let gIo: any

interface IgWatchingOnCodeBlocks {
  [key: string]: string[] // key-codeBlockId, value- sockets-ids
}

let gConnectedSockets: string[] = []
const gWatchingOnCodeBlocks: IgWatchingOnCodeBlocks = {}

function connectSockets(http: any, session: any) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
      pingTimeout: 60000,
    },
  })

  gIo &&
    gIo.on('connection', (socket: Socket) => {
      addSocketToConnectedSockets(socket.id)
      // code-block saved
      socket.on('code-block-saved', async (codeBlock) => {
        socket.broadcast.emit('update-code-block', codeBlock)
      })

      // someone is watching the code-block-page
      socket.on('someone-enter-code-block', async (codeBlockId) => {
        addSocketToWatching(codeBlockId, socket)
      })
      // someone leave the code-block-page
      socket.on('someone-leave-code-block', async (codeBlockId) => {
        removeSocketFromWatching(codeBlockId, socket.id)
      })

      // browser disconnected
      socket.on('disconnect', async () => {
        removeConnectedSocket(socket.id)
        findAndRemoveCodeBlockOfWatchingSocket(socket.id)
      })
    })
}

function findAndRemoveCodeBlockOfWatchingSocket(socketId: string) {
  for (const codeBlockId in gWatchingOnCodeBlocks) {
    if (gWatchingOnCodeBlocks[codeBlockId].includes(socketId)) {
      removeSocketFromWatching(codeBlockId, socketId)
    }
  }
}

function removeConnectedSocket(socketIdToRemove: string) {
  gConnectedSockets = gConnectedSockets.filter(
    (socketId) => socketId !== socketIdToRemove
  )
}

function addSocketToConnectedSockets(socketId: string) {
  if (!gConnectedSockets.includes(socketId)) gConnectedSockets.push(socketId)
}

function addSocketToWatching(codeBlockId: string, socket: Socket) {
  if (!gWatchingOnCodeBlocks[codeBlockId])
    gWatchingOnCodeBlocks[codeBlockId] = [socket.id]
  else if (
    gWatchingOnCodeBlocks[codeBlockId] &&
    !gWatchingOnCodeBlocks[codeBlockId].includes(socket.id)
  ) {
    gWatchingOnCodeBlocks[codeBlockId].push(socket.id)
  }
}

function removeSocketFromWatching(
  codeBlockId: string,
  socketIdToRemove: string
) {
  if (gWatchingOnCodeBlocks[codeBlockId]) {
    gWatchingOnCodeBlocks[codeBlockId] = gWatchingOnCodeBlocks[
      codeBlockId
    ].filter((socketId) => socketId !== socketIdToRemove)
  }
}

export default {
  connectSockets,
}
