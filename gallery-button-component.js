const size = Math.max(window.innerWidth,window.innerHeight)/3
class GalleryButtonComponent extends HTMLElement {
    constructor() {
        super()
        this.imageSrcs = this.getAttribute('images').split(',')
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.btns = []
        var w = size/((2*this.imageSrcs.length+1)),x = 3*w/2
        this.imageSrcs.forEach((src,index)=>{
            this.btns.push(new GalleryButon(x,size-2*w,w/2))
            x += 2*w
        })
        this.animationHandler = new AnimationHandler(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#E0E0E0'
        context.fillRect(0,0,size,size)
        this.btns.forEach((btn)=>{
            btn.draw(context)
        })
        this.galleryContainer.draw(context)
        this.img.src = canvas.toDataURL()
    }
    update() {
        this.galleryContainer.update()
        if(this.prevBtn) {
            this.prevBtn.update()
        }
        if(this.currBtn) {
            this.currBtn.update()
        }
    }
    resetX() {
        this.galleryContainer.resetX()
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
                    this.galleryContainer = new GalleryContainer(this.images)
                    this.render()
                }
            }
            return image
        })
        this.img.onmousedown = (event) => {
          const x = event.offsetX, y = event.offsetY
          this.btns.forEach((btn,index)=>{
              if(btn.handleTap(x,y) == true) {
                  if(this.currBtn) {
                      this.prevBtn = this.currBtn
                      this.prevBtn.setDir(-1)
                  }
                  this.currBtn = btn
                  this.currBtn.setDir(1)
                  this.galleryContainer.setSpeed(index)
                  this.animationHandler.start()
              }
          })
        }
    }
}
class GalleryButon  {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.scale = 0
        this.dir = 0
        //console.log(this.y)
    }
    draw(context) {
        context.fillStyle = 'blue'
        context.strokeStyle = 'blue'
        context.lineWidth = this.r/8
        context.beginPath()
        context.save()
        context.translate(this.x,this.y)
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        context.save()
        context.translate(0,0)
        context.scale(this.scale,this.scale)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.fill()
        context.restore()
        context.restore()
    }
    update() {
        this.scale += this.dir*0.1
        //console.log(this.scale)
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        else if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
    handleTap(x,y) {
        //console.log(`${x} and ${y}, ${this.x} and ${this.y}`)
        return x>=this.x-this.r && x<=this.x+this.r && y>=this.y-this.r && y<=this.y+this.r
    }
    setDir(dir) {
        this.dir = dir
        if(this.dir == 1) {
            this.scale = 0
        }
        else if(this.dir == -1) {
            this.scale = 1
        }
    }
}
class GalleryContainer {
    constructor(images) {
        this.x = 0
        this.currIndex = 0
        this.speed = 0
        this.images = images
    }
    setSpeed(index) {
        const diff = (index-this.currIndex)
        this.speed = (diff*size)/11
        this.currIndex = index
    }
    resetX() {
        this.x = -this.currIndex*size
    }
    draw(context) {
      context.save()
      context.translate(this.x,0)
        this.images.forEach((image,index)=>{
            context.save()
            context.translate(size*index,0)
            context.drawImage(image,0.1*size,0.1*size,0.8*size,0.8*size*(image.height/image.width))
            context.restore()
        })
        context.restore()
    }
    update() {
        this.x -= this.speed
        //console.log(this.x)
    }
}
class AnimationHandler {
    constructor(component) {
        this.i = 0
        this.component = component
    }
    start() {
        const interval = setInterval(()=>{
            this.component.render()
            this.i++
            //console.log(this.i)
            this.component.update()
            if(this.i == 11) {
                this.component.resetX()
                this.i = 0
                this.component.render()
                clearInterval(interval)

            }
        },20)

    }
}
customElements.define('gallery-button-component',GalleryButtonComponent)
