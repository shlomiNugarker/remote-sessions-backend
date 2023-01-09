import { Socket } from 'socket.io'

let gIo: any

interface IgWatchingOnCodeBlocks {
  [key: string]: string[] // key-codeBlockId, value- sockets-ids[]
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

  gIo.on('connection', (socket: Socket) => {
    addSocketToConnectedSockets(socket.id)

    // when code-block saved, updating other users:
    socket.on('code-block-saved', async (codeBlock) => {
      const socketsIdsToUpdate = gWatchingOnCodeBlocks[codeBlock._id]?.filter(
        (socketId) => socketId !== socket.id
      )
      if (socketsIdsToUpdate?.length) {
        socketsIdsToUpdate.forEach((socketId) => {
          emitToSocket({
            type: 'update-code-block',
            data: codeBlock,
            socketId: socketId,
          })
        })
      }
    })

    // when someone is watching the code-block-page
    socket.on('someone-enter-code-block', async (codeBlockId) => {
      addSocketToWatching(codeBlockId, socket)
    })
    // when someone leave the code-block-page
    socket.on('someone-leave-code-block', async (codeBlockId) => {
      removeSocketFromWatching(codeBlockId, socket.id)
    })

    // when browser disconnected
    socket.on('disconnect', async () => {
      removeConnectedSocket(socket.id)
      findAndRemoveSocketInWatchingSockets(socket.id)
    })
  })
}

async function emitToSocket({ type, data, socketId }: any) {
  const socket = await getSocketById(socketId)
  if (socket) socket.emit(type, data)
  else {
    console.log('socket not found')
  }
}

async function getSocketById(socketId: string) {
  const sockets = await getAllSockets()
  const socket = sockets.find((s: Socket) => s.id === socketId)
  return socket
}

async function getAllSockets() {
  if (!gIo) return
  const sockets = await gIo.fetchSockets()
  return sockets
}

function findAndRemoveSocketInWatchingSockets(socketId: string) {
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
