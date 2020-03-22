import ApiHost from '@/modules/api-host'
import { GetPostById } from '@payw/eodiro-one-api/api/one/scheme'
import './style.scss'

type PostViewerFileContainerProps = {
  files: GetPostById['payload']['data']['files']
}

export const PostViewerFileContainer: React.FC<PostViewerFileContainerProps> = (
  props
) => {
  const imageFiles = props.files.filter((file) =>
    file.mimeType.startsWith('image/')
  )

  const otherFiles = props.files.filter(
    (file) => !file.mimeType.startsWith('image/')
  )

  console.log(imageFiles)

  return (
    <div id="post-viewer-file-container">
      <div className="images">
        {imageFiles.map((image) => {
          return (
            <div className="image-container" key={image.fileId}>
              <img src={ApiHost.getHost(true) + image.path} alt="" />
            </div>
          )
        })}
      </div>
      {otherFiles.map((file) => {
        return (
          <a
            href={ApiHost.getHost(true) + file.path}
            download
            className="file"
            key={file.fileId}
          >
            {file.name}
          </a>
        )
      })}
    </div>
  )
}
