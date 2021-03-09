

export default class CanvasLaser extends EventTarget {
  ctx = null
  posLine = { x: 0, y: 0, width: 5, height: 3 }
  lineWidth = 2
  isMoveLine = false
  velocity = 1
  frames = []
  orientation = 'top'
  lastPosition = 0
  constructor(canvas, stream, video) {
    super()
    this.canvas = canvas
    this.stream = stream
    this.video = video
    this.posLine.width = canvas.width
    this.posLine.height = canvas.height

  }

  init = () => {
    this.ctx = this.canvas.getContext('2d')
    this.startTimeDraw = performance.now()
    this.draw()
  }

  draw = () => {
    const { ctx, posLine } = this
    requestAnimationFrame(this.draw)
    let currentTime = performance.now()
    if (currentTime - this.startTimeDraw < 24) return
    this.startTimeDraw = currentTime
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(this.video, 0, 0)

    if (this.isMoveLine) {
      // move cursor
      switch (this.orientation) {
        case 'left':
          posLine.x += this.velocity
          break;
        default:
          posLine.y += this.velocity
      }
      // capture last frames processed
     
        let image
        switch (this.orientation) {
          case 'left':
            image = posLine.x - this.lastPosition
            if (image) {
              let capture = ctx.getImageData(this.canvas.width - this.lastPosition, 0, image, this.canvas.height)
              this.frames.push(capture)
            }
            break;
          default:
            image = posLine.y - this.lastPosition
            if (image) {
              let capture = ctx.getImageData(0, this.lastPosition, this.canvas.width, image)
              this.frames.push(capture)
            }
        }     
    
        
      }
      for (let i = 0; i < this.frames.length; i += 1) {
        switch (this.orientation) {
          case 'left': {
            ctx.putImageData(this.frames[i], this.canvas.width - i, 0)
          }
          default: {
            ctx.putImageData(this.frames[i], 0, i)

          }
        }
      }


    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = "#00f"
    ctx.lineWidth = this.lineWidth
    switch (this.orientation) {
      case 'left': {
        ctx.moveTo(this.canvas.width - posLine.x, posLine.y)
        ctx.lineTo(this.canvas.width - posLine.x, posLine.height)
        this.lastPosition = posLine.x
        if (posLine.x > ctx.canvas.width) {
          this.isMoveLine = false
        }
      }
        break;
      default: {
        ctx.moveTo(posLine.x, posLine.y)
        ctx.lineTo(posLine.width, posLine.y)
        this.lastPosition = posLine.y
        if (posLine.y > ctx.canvas.height) {
          this.isMoveLine = false
        }
      }
    }
    ctx.stroke()
    ctx.restore()
    // end process image
  }
  startRecorder = () => {
    this.isMoveLine = !this.isMoveLine
    this.posLine.x = 0
    this.posLine.y = 0

    this.lastPosition = 0
    this.frames = []
  }

  setOrientation(value) {
    this.orientation = value
    this.startRecorder()
    this.isMoveLine = false
  }
}