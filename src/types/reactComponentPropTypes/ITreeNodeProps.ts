import { IFileAndFolderDetails } from '../fileAndFolderTypes'

interface ITreeNodeProps {
  node: IFileAndFolderDetails
  level: number
  selectedNode: IFileAndFolderDetails | null
  handleNodeClick: (node: IFileAndFolderDetails) => void
}

export type { ITreeNodeProps }
