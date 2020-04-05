export default function mergeClassNames(...classNames: string[]): string {
  let fullClassName = ''
  classNames.forEach((className) => {
    fullClassName += className ? ` ${className}` : ''
  })
  return fullClassName.trim()
}
