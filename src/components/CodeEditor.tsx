import { useContext, useEffect, useRef, useState } from 'react'
import { editor } from 'monaco-editor'
import { FileAndFolderEvent } from '../types/fileAndFolderTypes'
import SocketContext from '../contexts/SocketContext'
import { Editor } from '@monaco-editor/react'
import { ICodeEditorProps } from '../types/reactComponentPropTypes/ICodeEditorProps'
import { ISocketResponseMessage } from '../types/socketEventTypes'
import useDebounce from '../hooks/useDebounce'
import getLanguageFromFileName from '../utils/getLanguageFromFileName.ts'

const CodeEditor = ({ node }: ICodeEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const socket = useContext(SocketContext)
  const [editorContent, setEditorContent] = useState<string>('')

  const writeEditorContentToServer = (content: string) => {
    socket?.emit('filesAndFolders:input', {
      name: node.name,
      path: node.path,
      type: node.type,
      event: FileAndFolderEvent.WRITE,
      content,
    })
  }

  const handleEditorContentChange = useDebounce(
    writeEditorContentToServer,
    1000
  )

  useEffect(() => {
    socket?.emit('filesAndFolders:input', {
      name: node.name,
      path: node.path,
      type: node.type,
      event: FileAndFolderEvent.READ,
    })

    const handleSocketResponse = (response: ISocketResponseMessage) => {
      if (
        response.status === 'Success' &&
        response.path === node.path &&
        response.event === FileAndFolderEvent.READ
      ) {
        setEditorContent(response.message)
      }
    }

    socket?.on('filesAndFolders:output', handleSocketResponse)

    return () => {
      socket?.off('filesAndFolders:output', handleSocketResponse)
    }
  }, [socket, node])

  const onMount = async (monacoEditor: editor.IStandaloneCodeEditor) => {
    editorRef.current = monacoEditor
    editorRef.current?.focus()
  }

  return (
    <>
      <div>
        <Editor
          height="600px"
          theme="vs-dark"
          path={node.path}
          loading={
            <div className="bg-primary flex h-[600px] w-full flex-col items-center justify-center gap-4 text-xl font-bold text-white">
              <h2 className="font-mono text-2xl font-bold text-zinc-200">
                Setting things up...
              </h2>
            </div>
          }
          language={getLanguageFromFileName(node.name)}
          value={editorContent}
          onMount={(editor) => onMount(editor)}
          onChange={(content) => {
            handleEditorContentChange(content)
          }}
        />
      </div>
    </>
  )
}

export default CodeEditor
