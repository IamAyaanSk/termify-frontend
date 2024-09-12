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
      <section className="flex h-[110vh] items-center border-b-2 border-slate-500 bg-primary p-20">
        <div className=" flex max-w-2xl flex-col gap-8">
          <h1 className="w-full font-mono text-5xl font-semibold text-white sm:text-7xl lg:text-9xl">
            Termify<span className="animate-pulse">.</span>
          </h1>
          <p className="pl-4 text-base font-light text-gray-400 sm:text-xl lg:text-3xl">
            Explore your favorite programming language without the hassle of
            setting environment.
          </p>
          <a href="#playground" className="mx-4">
            <button className="mt-4 w-44 rounded bg-white px-4 py-2  text-base text-primary hover:bg-white/90">
              Get Started
            </button>
          </a>
        </div>
      </section>
      <SocketContext.Provider value={socket}>
        <section className="bg-white px-4 py-10">
          <div className="mx-auto mb-10 max-w-4xl space-y-6 text-center">
            <h2 className="text-4xl font-semibold text-primary">
              Run your code directly from the Web...
            </h2>
            <p className="font-mono text-lg font-medium text-primary/80">
              <span className="font-semibold">
                Currently supported languages:
              </span>{' '}
              Javascript, Python, Typescript, HTML, CSS
            </p>
          </div>
          <div
            className="mx-auto grid max-w-7xl grid-cols-5 grid-rows-editor overflow-hidden rounded-xl border-4 border-slate-400 bg-primary shadow-2xl"
            id="playground"
          >
            <div className="col-span-1 border-r border-slate-800 bg-primary px-2 py-4 ">
              {rootDirTreeData ? (
                <Tree
                  data={rootDirTreeData}
                  selectedNode={selectedNode}
                  handleNodeClick={handleNodeClick}
                />
              ) : (
                <div className="mx-auto flex h-[600px] w-full max-w-52 flex-col items-center justify-center gap-4 bg-primary">
                  <p className="font-mono text-xs font-bold text-zinc-200">
                    Create files/folders from terminal
                  </p>
                </div>
              )}
            </div>
            <div className="col-span-4 col-start-2 h-[600px]">
              {lastFileNode ? (
                <CodeEditor node={lastFileNode} />
              ) : (
                <div className="flex h-[600px] w-full flex-col items-center justify-center gap-4 bg-primary text-xl font-bold text-white">
                  <h2 className="font-mono text-2xl font-bold text-zinc-200">
                    Welcome to Termify
                  </h2>
                  <p className="font-mono text-sm font-bold text-zinc-300">
                    No file selected
                  </p>
                </div>
              )}
            </div>
            <div className="col-span-5 border-t-2 border-slate-800 bg-primary">
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
