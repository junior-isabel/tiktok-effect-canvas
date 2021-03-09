"use strict"
import Laser from './canvas.mjs'


let scene
const constraint = {
    video: {
        width: 320,
        height: 568
    }
}
navigator.getUserMedia(constraint, stream => {
    let video = document.createElement('video')
    video.srcObject = stream
    video.autoplay = true
    video.controls = false
    
    video.width = constraint.video.width
    video.height = constraint.video.height

    canvas.width = constraint.video.width
    canvas.height = constraint.video.height
    scene = new Laser(canvas, stream, video)
    scene.init()

    scene.addEventListener('endprocess', e => {
        console.log(e)
    })
}, error => {
    console.error(error)
})


play.addEventListener('click', () => {
    if (scene) {
        scene.startRecorder()
    }
})
document.querySelector('#orientation').addEventListener('change', e => {
  scene.setOrientation(e.target.value)
})
