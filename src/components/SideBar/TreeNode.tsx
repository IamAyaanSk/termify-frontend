import { useCallback, useContext, useEffect, useState } from 'react'
import { IFileAndFolderDetails } from '../../types/fileAndFolderTypes'
import { ITreeNodeProps } from '../../types/reactComponentPropTypes/ITreeNodeProps'
import SocketContext from '../../contexts/SocketContext'
import {
  FileAndFolderEvent,
  FileAndFolderType,
} from '../../types/fileAndFolderTypes'
import { ISocketResponseMessage } from '../../types/socketEventTypes'
import languageToIconMap from '../../constants/languageToIconMap'
import getLanguageFromFileName from '../../utils/getLanguageFromFileName.ts'
import { FaFolderOpen } from 'react-icons/fa6'
import { FaFolder } from 'react-icons/fa'

const TreeNode = ({
  node,
  level,
  selectedNode,
  handleNodeClick,
}: ITreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [childNodes, setChildNodes] = useState<IFileAndFolderDetails[] | null>(
    null
  )
  const socket = useContext(SocketContext)

  useEffect(() => {
    const handleSocketOutput = (response: ISocketResponseMessage) => {
      if (
        response.status === 'Success' &&
        response.data?.length &&
        response.path === node.path
      ) {
        setChildNodes(response.data)
      }
    }

    socket?.on('filesAndFolders:output', handleSocketOutput)

    return () => {
      socket?.off('filesAndFolders:output', handleSocketOutput)
    }
  }, [socket, node.path])

  const fetchChildNodes = useCallback(() => {
    if (node.type === FileAndFolderType.FOLDER) {
      socket?.emit('filesAndFolders:input', {
        name: node.name,
        path: node.path,
        event: FileAndFolderEvent.LIST,
        type: FileAndFolderType.FOLDER,
      })
    }
  }, [socket, node])

  const handleExpand = () => {
    handleNodeClick(node)
    if (node.type === FileAndFolderType.FILE) return

    setIsExpanded((prev) => !prev)
    if (!isExpanded) {
      fetchChildNodes()
    }
  }

  const IconComponent = languageToIconMap[getLanguageFromFileName(node.name)]

  return (
    <div style={{ marginLeft: `${level * 10}px` }}>
      {node.type === FileAndFolderType.FILE ? (
        <span
          onClick={handleExpand}
          className={`flex max-w-44 cursor-pointer items-center  px-2 transition-colors ${selectedNode === node ? 'bg-slate-900' : 'text-white'}`}
        >
          {IconComponent && <IconComponent color="white" fontSize={'14px'} />}
          <span className="px-2 text-xs text-white">{node.name}</span>
        </span>
      ) : (
        <div>
          <span
            onClick={handleExpand}
            className={`flex max-w-44 cursor-pointer items-center px-2 py-1 transition-colors ${selectedNode === node ? 'bg-slate-900' : 'text-white'}`}
          >
            {isExpanded ? (
              <FaFolderOpen color="white" fontSize={'14px'} />
            ) : (
              <FaFolder fontSize={'14px'} color="white" />
            )}{' '}
            <span className="px-2 text-xs text-white">{node.name}</span>
          </span>
          {isExpanded && (
            <div>
              {childNodes?.map((childNode) => (
                <TreeNode
                  key={childNode.path}
                  node={childNode}
                  selectedNode={selectedNode}
                  level={level + 1}
                  handleNodeClick={handleNodeClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TreeNode
