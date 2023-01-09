import { Socket } from 'socket.io'

let gIo: any

interface IgWatchingOnCodeBlocks {
  [key: string]: string[] // key-codeBlockId, value- sockets-ids[]
}

let gConnectedSockets: string[] = []
const gWatchersOnCodeBlocks: IgWatchingOnCodeBlocks = {}

function connectSockets(http: any, session: any) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
      pingTimeout: 60000,
    },
  })
  gIo.on('connection', (socket: Socket) => {
    addSocketToConnectedSockets(socket.id)
    // console.log({ gWatchersOnCodeBlocks })

    // when code-block saved, updating other users:
    socket.on('code-block-saved', async (codeBlock) => {
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
      // console.log('someone-enter-code-block')
      addSocketToWatchers(codeBlockId, socket)
      send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId)
      // console.log({ gWatchersOnCodeBlocks })
    })
    // when someone leave the code-block-page
    socket.on('someone-left-code-block', async (codeBlockId) => {
      // console.log('someone-left-code-block')
      removeSocketFromWatchers(codeBlockId, socket.id)
      await send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId)
      // console.log({ gWatchersOnCodeBlocks })
    })
    // when browser disconnected
    socket.on('disconnect', async () => {
      // console.log('disconnect')
      removeConnectedSocket(socket.id)
      find_And_Remove_Socket_In_Watcher_Sockets(socket.id)

      for (const codeBlockId in gWatchersOnCodeBlocks) {
        send_Watcher_On_Code_Block_To_Others_Watchers(codeBlockId)
      }
      // console.log({ gWatchersOnCodeBlocks })
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
  if (!sockets) return
  const socket = sockets.find((s: Socket) => s.id === socketId)
  return socket
}

async function getAllSockets() {
  if (!gIo) return
  const sockets: Socket[] = await gIo.fetchSockets()
  return sockets
}

// sending watchers to all sockets who watching the code-block:
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
}

export default {
  connectSockets,
}
