const size = Math.max(window.innerWidth,window.innerHeight)/3
class GalleryButtonComponent extends HTMLElement {
    constructor() {
        super()
        this.imageSrcs = this.getAttribute('images').split(',')
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#E0E0E0'
        context.fillRect(0,0,size,size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        var loaded = 0
        this.images = this.imageSrcs.map((imageSrc)=>{
            const image =   new Image()
            image.src = imageSrc
            image.onload = ()=>{
                loaded ++
                if(loaded == this.imageSrcs.length) {
                    console.log("all images are loaded")
                    this.render()
                }
            }
            return image
        })
    }
}
class GalleryButon  {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.scale = 0
        this.dir = 0
    }
    draw(context) {
        context.fillStyle = 'blue'
        context.strokeStyle = 'blue'
        context.lineWidth = this.r/8
        context.beginPath()
        context.save()
        context.translate(this.x,this.y)
        context.arc(0,0,r,0,2*Math.PI)
        context.stroke()
        context.save()
        context.scale(this.scale,this.scale)
        context.arc(0,0,r,0,2*Math.PI)
        context.fill()
        context.restore()
        context.restore()
    }
    update() {
        this.scale += this.dir*0.2
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 0
        }
    }
    setDir(dir) {
        this.dir = dir
    }
}
class GalleryContainer {
    constructor(image) {
        this.x = 0
        this.currIndex = 0
        this.speed = 0
        this.images = images
    }
    setSpeed(index) {
        const diff = (index-this.currIndex)
        this.speed = (diff*0.8*size)/6
    }
    draw(context) {
        this.images.forEach((image,index)=>{
            context.save()
            context.translate(this.x,0)
            context.drawImage(image,0,0,0.8*size,0.8*size*(image.height/image.width))
            context.restore()
        })
    }
    update() {
        this.x -= this.speed
    }
}
customElements.define('gallery-button-component',GalleryButtonComponent)
