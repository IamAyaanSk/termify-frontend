import { IFileAndFolderDetails } from '../fileAndFolderTypes'

interface ITreeProps {
  data: IFileAndFolderDetails[]
  selectedNode: IFileAndFolderDetails | null
  handleNodeClick: (node: IFileAndFolderDetails) => void
}

export type { ITreeProps }
