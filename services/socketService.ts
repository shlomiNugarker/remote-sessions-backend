import { Socket } from 'socket.io'

let gIo: any

interface IWatching {
  [key: string]: string[] // key-codeBlockId, value- sockets-ids
}

let connectedSockets: string[] = []
const watchingOnCodeBlocks: IWatching = {}

function connectSockets(http: any, session: any) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
      pingTimeout: 60000,
    },
  })

  gIo &&
    gIo.on('connection', (socket: Socket) => {
      if (!connectedSockets.includes(socket.id))
        connectedSockets.push(socket.id)
      console.log({ connectedSockets })

      // code-block saved
      socket.on('code-block-saved', async (codeBlock) => {
        socket.broadcast.emit('update-code-block', codeBlock)
      })

      // someone is watching code block
      socket.on('someone-enter-code-block', async (codeBlockId) => {
        if (!watchingOnCodeBlocks[codeBlockId])
          watchingOnCodeBlocks[codeBlockId] = [socket.id]
        else if (
          watchingOnCodeBlocks[codeBlockId] &&
          !watchingOnCodeBlocks[codeBlockId].includes(socket.id)
        ) {
          watchingOnCodeBlocks[codeBlockId].push(socket.id)
        }
        console.log({ watchingOnCodeBlocks })
      })
      // someone leave the code block
      socket.on('someone-leave-code-block', async (codeBlockId) => {
        if (watchingOnCodeBlocks[codeBlockId]) {
          watchingOnCodeBlocks[codeBlockId] = watchingOnCodeBlocks[
            codeBlockId
          ].filter((socketId) => socketId !== socket.id)
        }
        console.log({ watchingOnCodeBlocks })
      })

      // browser disconnected
      socket.on('disconnect', async () => {
        // console.log('someone disconnected, with socketId:', socket.id)
        connectedSockets = connectedSockets.filter(
          (socketId) => socketId !== socket.id
        )
        console.log({ connectedSockets })
      })
    })
}

export default {
  connectSockets,
}
