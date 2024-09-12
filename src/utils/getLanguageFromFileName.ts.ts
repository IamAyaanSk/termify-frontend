import extensionToLanguageMap from '../constants/extensionToLanguageMap'

const getLanguageFromFileName = (fileName: string) => {
  const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
  return extensionToLanguageMap[extension]
}

export default getLanguageFromFileName
