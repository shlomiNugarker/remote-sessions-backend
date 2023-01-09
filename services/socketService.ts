import { Socket } from 'socket.io'

let gIo: any

let connectedSockets: string[] = []

const watchingOnCodeBlocks: any = {} // key: codeBlockId, value: socketId

function connectSockets(http: any, session: any) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
      pingTimeout: 60000,
    },
  })

  gIo &&
    gIo.on('connection', (socket: Socket) => {
      // browser connected
      // console.log('someone connected, with socketId:', socket.id)
      if (!connectedSockets.includes(socket.id))
        connectedSockets.push(socket.id)
      console.log({ connectedSockets })

      // code-block saved
      socket.on('code-block-saved', async (codeBlock) => {
        socket.broadcast.emit('update-code-block', codeBlock)
      })

      // someone is watching code block
      socket.on('someone-enter-code-block', async (codeBlockId) => {
        // console.log({ codeBlockId })
        // console.log('socketId', socket.id)
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
        console.log({ codeBlockId })
        console.log('socketId', socket.id)
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
