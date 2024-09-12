import { Terminal as XTerminal } from '@xterm/xterm'
import { useContext, useEffect, useRef } from 'react'
import '@xterm/xterm/css/xterm.css'
import SocketContext from '../contexts/SocketContext'

const Terminal = () => {
  const socket = useContext(SocketContext)
  const terminalContainerRef = useRef<HTMLDivElement>(null)
  const isRendered = useRef(false)

  useEffect(() => {
    if (isRendered.current) return

    isRendered.current = true

    const terminal = new XTerminal({
      rows: 15,
      cols: 80,
      cursorBlink: true,
      fontSize: 14,
    })

    terminal.open(terminalContainerRef.current!)
    terminal.writeln(
      `\x1b[1;35m✨ \x1b[1;37mTermify \x1b[1;35m✨ \x1b[0m\x1b[1;36m⏳ Loading Terminal... ⏳ \x1b[0m`
    )

    terminal.onData((data) => {
      socket?.emit('terminal:writeToTerminalFromClient', data)
    })
    socket?.on('terminal:writeToTerminalFromServer', (data: string) => {
      if (data.includes('Password:')) {
        socket.emit('terminal:writeToTerminalFromClient', '\n')
        return
      } else if (data.includes('su damner')) return
      else if (data.includes('su: Authentication failure')) {
        terminal.reset()
        return
      }
      terminal.write(data)
    })
  }, [socket])

  return (
    <div className="bg-primary">
      <div className="flex flex-col rounded-lg bg-black p-4">
        <span className="mb-2 flex gap-2 text-xs">
          <span>🔴</span> <span>🟡</span> <span>🟢</span>
        </span>
        <div ref={terminalContainerRef}>
          {!socket && 'Connecting to server...'}
        </div>
      </div>
    </div>
  )
}

export default Terminal
