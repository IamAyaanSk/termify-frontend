import { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

import Terminal from './components/Terminal'
import SocketContext from './contexts/SocketContext'
import Tree from './components/SideBar/Tree'
import {
  FileAndFolderEvent,
  FileAndFolderType,
  IFileAndFolderDetails,
} from './types/fileAndFolderTypes'
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from './types/socketEventTypes'
import getParentPath from './utils/getParentNodePath'
import CodeEditor from './components/CodeEditor'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_URL,
  {
    extraHeaders: {
      authorization: import.meta.env.VITE_CONTAINER_ACCESS_TOKEN,
    },
  }
)

function App() {
  const [rootDirTreeData, setRootDirTreeData] = useState<
    IFileAndFolderDetails[] | null
  >(null)

  const [selectedNode, setSelectedNode] =
    useState<IFileAndFolderDetails | null>(null)

  const [lastFileNode, setLastFileNode] =
    useState<IFileAndFolderDetails | null>(null)

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    socket.on('connect_error', (err) => {
      console.log(err.message)

      console.log(err)
    })

    return () => {
      if (socket.connected) socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.emit('filesAndFolders:input', {
      name: 'code',
      path: '/home/damner/code',
      type: FileAndFolderType.FOLDER,
      event: FileAndFolderEvent.LIST,
    })

    socket.on('filesAndFolders:output', (response) => {
      if (
        response.status === 'Success' &&
        response.event === FileAndFolderEvent.LIST &&
        response.path === '/home/damner/code' &&
        response.data
      ) {
        setRootDirTreeData(response.data)
      } else if (response.status === 'Error') {
        // TODO: Implement Toast
        console.log(response.message)
      } else if (
        response.event === FileAndFolderEvent.ADD ||
        response.event === FileAndFolderEvent.REMOVE
      ) {
        socket.emit('filesAndFolders:input', {
          name: '',
          path: getParentPath(response.path!),
          type: FileAndFolderType.FOLDER,
          event: FileAndFolderEvent.LIST,
        })
      }
    })

    return () => {
      socket.off('filesAndFolders:output')
      if (socket.connected) socket.disconnect()
    }
  }, [])

  const handleNodeClick = (node: IFileAndFolderDetails) => {
    if (node.type === FileAndFolderType.FILE) setLastFileNode(node)
    setSelectedNode(node)
  }

  return (
    <>
      <section className="bg-primary flex h-[110vh] items-center border-b-2 border-slate-500 p-20">
        <div className=" flex max-w-2xl flex-col gap-8">
          <h1 className="w-full font-mono text-9xl font-semibold text-white">
            Termify<span className="animate-pulse">.</span>
          </h1>
          <p className="pl-4 text-3xl font-light text-gray-400">
            Explore your favorite programming language without the hassle of
            setting environment.
          </p>
          <a href="#playground" className="mx-4">
            <button className="text-primary mt-4 w-44 rounded bg-white px-4  py-2 text-base hover:bg-white/90">
              Get Started
            </button>
          </a>
        </div>
      </section>
      <SocketContext.Provider value={socket}>
        <section className="bg-white px-4 py-10">
          <div className="mx-auto mb-10 max-w-4xl space-y-6 text-center">
            <h2 className="text-primary text-4xl font-semibold">
              Run your code directly from the Web...
            </h2>
            <p className="text-primary/80 font-mono text-lg font-medium">
              <span className="font-semibold">
                Currently supported languages:
              </span>{' '}
              Javascript, Python, Typescript, HTML, CSS
            </p>
          </div>
          <div
            className="grid-rows-editor bg-primary mx-auto grid max-w-7xl grid-cols-5 overflow-hidden rounded-xl border-4 border-slate-400 shadow-2xl"
            id="playground"
          >
            <div className="bg-primary col-span-1 border-r border-slate-800 px-2 py-4 ">
              {rootDirTreeData ? (
                <Tree
                  data={rootDirTreeData}
                  selectedNode={selectedNode}
                  handleNodeClick={handleNodeClick}
                />
              ) : (
                <div className="bg-primary flex h-[600px] w-full flex-col items-center justify-center gap-4 text-xl font-bold text-white">
                  <h2 className="font-mono text-lg font-bold text-zinc-200">
                    Create files/folders from terminal
                  </h2>
                </div>
              )}
            </div>
            <div className="col-span-4 col-start-2 h-[600px]">
              {lastFileNode ? (
                <CodeEditor node={lastFileNode} />
              ) : (
                <div className="bg-primary flex h-[600px] w-full flex-col items-center justify-center gap-4 text-xl font-bold text-white">
                  <h2 className="font-mono text-2xl font-bold text-zinc-200">
                    Welcome to Termify
                  </h2>
                  <p className="font-mono text-sm font-bold text-zinc-300">
                    No file selected
                  </p>
                </div>
              )}
            </div>
            <div className="bg-primary col-span-5 border-t-2 border-slate-800">
              <Terminal />
            </div>
          </div>
        </section>
      </SocketContext.Provider>

      <footer className="space-y-4 pb-8 text-center text-base text-black/80">
        <p>
          🔴 <span className="font-bold underline">Note:</span> Although this
          project has a scalable architecture but currently only one user can
          use this at a time as I wanted to save server costs 😁.
        </p>
        <p>
          Made with ❤️ by{' '}
          <a className="hover:underline" href="https://github.com/IamAyaanSk">
            Ayaan Shaikh
          </a>
        </p>
      </footer>
    </>
  )
}

export default App
