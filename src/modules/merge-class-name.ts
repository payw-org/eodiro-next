export default function mergeClassName(
  defaultClassName?: string,
  ...additionalClassNames: string[]
): string {
  let fullClassName = defaultClassName
  additionalClassNames.forEach((className) => {
    fullClassName += className ? ` ${className}` : ''
  })
  return fullClassName
}
