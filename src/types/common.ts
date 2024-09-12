enum StatusMessageMap {
  ERROR = 'Error',
  SUCCESS = 'Success',
}

enum ErroMessageMap {
  'playground/unauthorized' = 'Unauthorized to use playground',
  'fileAndFolder/type' = 'Invalid type',
  'fileAndFolder/renameNoNewName' = 'New name is required to rename a file or folder',
  'fileAndFolder/writeNoContent' = 'Content is required to write file',
}

enum SuccessMessageMap {
  'user/authenticated' = 'User authenticated successfully',
  'user/signout' = 'User signed out successfully',
  'fileAndFolder/list' = 'Files and folders listed successfully',
}

export { StatusMessageMap, ErroMessageMap, SuccessMessageMap }
