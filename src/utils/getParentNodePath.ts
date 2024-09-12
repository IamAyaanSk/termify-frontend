const getParentPath = (path: string) => {
  const parts = path.split('/').filter((part) => part.length > 0)
  parts.pop()
  return '/' + parts.join('/')
}

export default getParentPath
