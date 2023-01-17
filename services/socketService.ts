import { Socket } from 'socket.io'
import { ICodeBlock } from '../interfaces/ICodeBlock'

export default {
  connectSockets,
}

let gIo: any

interface IgWatchingOnCodeBlocks {
  [key: string]: string[] // key-codeBlockId, value- sockets-ids[]
}

let gConnectedSockets: string[] = []
const gWatchersOnCodeBlocks: IgWatchingOnCodeBlocks = {}

function connectSockets(http: any, _session: any) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
      pingTimeout: 60000,
    },
  })
  gIo.on('connection', (socket: Socket) => {
    // when new socket connected:
    addSocketToConnectedSockets(socket.id)
    sendConnectedSockets()

    // when code-block saved, updating other users:
    socket.on('code-block-saved', async (codeBlock: ICodeBlock) => {
      if (!codeBlock._id) return
      const socketsIdsToUpdate = gWatchersOnCodeBlocks[codeBlock._id]?.filter(
        (socketId) => socketId !== socket.id
      )
      if (socketsIdsToUpdate?.length) {
        socketsIdsToUpdate.forEach(async (socketId) => {
          await emitToSocket({
            type: 'update-code-block',
            data: codeBlock,
            socketId,
          })
        })
      }
    })
    // when someone is watching the code-block-page
    socket.on('someone-enter-code-block', async (codeBlockId) => {
      addSocketToWatchers(codeBlockId, socket)
      await send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId)
    })
    // when someone left the code-block-page
    socket.on('someone-left-code-block', async (codeBlockId) => {
      removeSocketFromWatchers(codeBlockId, socket.id)
      await send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId)
    })
    // when browser disconnected
    socket.on('disconnect', async (args) => {
      // removeConnectedSocket(socket.id)
      gConnectedSockets = await getAllSocketsIds()
      sendConnectedSockets()
      find_And_Remove_Socket_In_Watcher_Sockets(socket.id)
      for (const codeBlockId in gWatchersOnCodeBlocks) {
        await send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId)
      }
    })
  })
}

// Functions:

function sendConnectedSockets() {
  gConnectedSockets.forEach(async (socketId) => {
    await emitToSocket({
      type: 'update-connected-sockets',
      data: gConnectedSockets,
      socketId,
    })
  })
}
async function emitToSocket<T>({
  type,
  data,
  socketId,
}: {
  type: string
  data: T
  socketId: string
}) {
  const socket = await getSocketById(socketId)
  if (socket) socket.emit(type, data)
  else {
    console.log('socket not found')
  }
}
async function getSocketById(socketId: string) {
  const sockets = await getAllSockets()
  if (!sockets) return
  const socket = sockets.find((s: Socket) => s.id === socketId)
  return socket
}
async function getAllSockets() {
  if (!gIo) return
  const sockets: Socket[] = await gIo.fetchSockets()
  return sockets
}
async function getAllSocketsIds() {
  const sockets: Socket[] = await gIo.fetchSockets()
  const socketsIds: string[] = []

  sockets.forEach((socket) => {
    socketsIds.push(socket.id)
  })
  return socketsIds
}
// sending watchers to all sockets who watching the specific code-block:
async function send_Watcher_On_Code_Block_To_Others_Watchers(
  codeBlockId: string
) {
  const watchersOnSpecificCodeBlock = gWatchersOnCodeBlocks[codeBlockId]
  watchersOnSpecificCodeBlock?.forEach(async (socketId) => {
    const socket = await getSocketById(socketId)
    if (!socket) return
    socket.emit(
      'update-watchers-on-specific-code-block',
      watchersOnSpecificCodeBlock
    )
  })
}
// updating "gWatchersOnCodeBlocks" after browser disconnected:
function find_And_Remove_Socket_In_Watcher_Sockets(socketId: string) {
  for (const codeBlockId in gWatchersOnCodeBlocks) {
    if (gWatchersOnCodeBlocks[codeBlockId].includes(socketId)) {
      removeSocketFromWatchers(codeBlockId, socketId)
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
function addSocketToWatchers(codeBlockId: string, socket: Socket) {
  if (!gWatchersOnCodeBlocks[codeBlockId])
    gWatchersOnCodeBlocks[codeBlockId] = [socket.id]
  else if (
    gWatchersOnCodeBlocks[codeBlockId] &&
    !gWatchersOnCodeBlocks[codeBlockId].includes(socket.id)
  ) {
    gWatchersOnCodeBlocks[codeBlockId].push(socket.id)
  }
}
function removeSocketFromWatchers(
  codeBlockId: string,
  socketIdToRemove: string
) {
  if (gWatchersOnCodeBlocks[codeBlockId]) {
    gWatchersOnCodeBlocks[codeBlockId] = gWatchersOnCodeBlocks[
      codeBlockId
    ].filter((socketId) => socketId !== socketIdToRemove)
  }
  // if the key is empty, delete the key:
  if (
    gWatchersOnCodeBlocks[codeBlockId] &&
    !gWatchersOnCodeBlocks[codeBlockId].length
  ) {
    delete gWatchersOnCodeBlocks[codeBlockId]
  }
}
