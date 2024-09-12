interface IFileAndFolderDetails {
  name: string
  type: FileAndFolderType
  event: FileAndFolderEvent
  path: string
  newName?: string
  content?: string
}

enum FileAndFolderEvent {
  ADD = 'add',
  REMOVE = 'remove',
  RENAME = 'rename',
  LIST = 'list',
  READ = 'read',
  WRITE = 'write',
}

enum FileAndFolderType {
  FILE = 'file',
  FOLDER = 'folder',
}

export { FileAndFolderEvent, FileAndFolderType }
export type { IFileAndFolderDetails }
