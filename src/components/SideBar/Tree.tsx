import { IFileAndFolderDetails } from '../../types/fileAndFolderTypes'
import { ITreeProps } from '../../types/reactComponentPropTypes/ITreeProps'
import TreeNode from './TreeNode'

const Tree = ({ data, selectedNode, handleNodeClick }: ITreeProps) => {
  return (
    <div className=" bg-primary h-full">
      {data.map((node: IFileAndFolderDetails) => (
        <TreeNode
          key={node.path}
          node={node}
          level={0}
          selectedNode={selectedNode}
          handleNodeClick={handleNodeClick}
        />
      ))}
    </div>
  )
}

export default Tree
