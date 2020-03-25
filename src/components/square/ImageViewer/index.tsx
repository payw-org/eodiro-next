type ImageViewerProps = {
  src: string
}
const ImageViewer: React.FC<ImageViewerProps> = (props) => {
  return (
    <div className="image-viewer">
      <img src={props.src} alt="" />
    </div>
  )
}

export default ImageViewer
