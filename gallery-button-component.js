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
customElements.define('gallery-button-component',GalleryButtonComponent)
