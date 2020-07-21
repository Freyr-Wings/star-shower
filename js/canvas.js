import utils from './utils.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

addEventListener('click', event => {
    stars.push(new Star(event.clientX, event.clientY, 25, '#E3EAEF', Math.random() * 180, 40))
})

// Objects
function Star(x, y, radius, color, rotate, shadowBlur) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.rotate = rotate
    this.shadowBlur = shadowBlur
    this.velocity = {
        x: -20,
        y: 10
    }
    this.friction = 0.8
    this.gravity = 1
}

// prototype only create once: don't write it in function
// Star.prototype.draw = function() {
//     c.save()
//     c.beginPath()
//     c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
//     c.fillStyle = this.color
//     c.shadowColor = '#E3EAEF'
//     c.shadowBlur = 20
//     c.fill()
//     c.closePath()
//     c.restore()
// }

Star.prototype.draw = function() {
    c.save();
    c.beginPath();
    // 画五角星
    for (let i = 0; i < 5; i++) {
        c.lineTo(
            Math.cos((18 + i * 72 - this.rotate) / 180 * Math.PI) * this.radius + this.x, 
            Math.sin((18 + i * 72 - this.rotate) / 180 * Math.PI) * this.radius + this.y 
        );
        c.lineTo(
            Math.cos((54 + i * 72 - this.rotate) / 180 * Math.PI) * this.radius * 0.5 + this.x, 
            Math.sin((54 + i * 72 - this.rotate) / 180 * Math.PI) * this.radius * 0.5 + this.y
        );
    }
    c.fillStyle = this.color
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = this.shadowBlur

    c.fill()
    c.closePath()
    c.restore()
}

Star.prototype.update = function() {
    this.draw()

    this.tail(this.x-this.velocity.x, this.y-this.velocity.y)
    
    // when star hits ground
    // if (this.y + this.radius + this.velocity.y > canvas.height) {
    //     this.velocity.y = -this.velocity.y * this.friction
    //     this.shatter()
    // }
    // else{
    //     this.velocity.y += this.gravity
    // }
    this.y += this.velocity.y
    this.x += this.velocity.x
    
}

Star.prototype.shatter = function() {
    this.radius *= 0.8
    for (let i = 0; i < 8; i++) {
        ministars.push(new MiniStar(this.x, this.y, 2))
    }
}

Star.prototype.tail = function(prevX, prevY) {
    tails.push(new Tail(this.x, this.y, prevX, prevY, '#E3EAEF'))
}

function Tail(x, y, prevX, prevY, color) {
    this.x = x
    this.y = y
    this.prevX = prevX
    this.prevY = prevY
    this.color = color
    this.ttl = 100
    this.width = 12
    this.opacity = 1
}

Tail.prototype.draw = function() {
    c.save()
    c.strokeStyle = `rgba(227, 234, 239, ${this.opacity})`
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.lineWidth = this.width
    c.beginPath()
    c.moveTo(this.x, this.y)
    c.lineTo(this.prevX, this.prevY)
    c.stroke()
    c.closePath()
    c.restore()
}

Tail.prototype.update = function() {
    this.draw()

    this.ttl -= 1
    this.opacity *= 0.93
    this.width *= 0.95
}

function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color, 20)
    this.velocity = {
        x: utils.randomIntFromRange(-15, 15),
        y: utils.randomIntFromRange(-10, 10)
    }
    this.friction = 0.8
    this.gravity = 0.5
    this.ttl = 100
    this.opacity = 1
}

MiniStar.prototype.draw = function() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(227, 234, 239, ${this.opacity})`
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
}

MiniStar.prototype.update = function() {
    this.draw()

    // when star hit ground
    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction
    }
    else{
        this.velocity.y += this.gravity
    }
    this.y += this.velocity.y
    this.x += this.velocity.x
    this.ttl -= 1
    this.opacity -= 1 / this.ttl
}

// Implementation
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#131e26')
backgroundGradient.addColorStop(1, '#3f586b')
let stars
let tails
let ministars
let backgroundstars
let orions
function init() {
    stars = []
    tails = []
    ministars = []
    backgroundstars = []
    orions = []

    // for (let i = 0; i < 5; i++) {
    //     stars.push(new Star(canvas.width * Math.random(), 30, 100, '#E3EAEF', Math.random() * 180))
    // }

    for (let i = 0; i < 500; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 5
        
        backgroundstars.push(new Star(x, y, radius, 'white', Math.random() * 180, utils.randomIntFromRange(1, 50)))
    }

    // const ox = canvas.width / 4 + Math.random() * canvas.width / 2
    // const oy = canvas.height / 4 + Math.random() * canvas.height / 2

    // orions.push(new Star(ox, oy, radius, 'white', Math.random() * 180, 30))
    // orions.push(new Star(ox+25, oy+10, radius, 'white', Math.random() * 180, 40))
    // orions.push(new Star(ox-25, oy-10, radius, 'white', Math.random() * 180, 30))
    // orions.push(new Star(ox, oy, radius, 'white', Math.random() * 180, 30))
    // orions.push(new Star(ox, oy, radius, 'white', Math.random() * 180, 30))
    // orions.push(new Star(ox, oy, radius, 'white', Math.random() * 180, 30))
    // orions.push(new Star(ox, oy, radius, 'white', Math.random() * 180, 30))
    // orions.push(new Star(ox, oy, radius, 'white', Math.random() * 180, 30))
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = backgroundGradient
    c.fillRect(0, 0, canvas.width, canvas.height)

    stars.forEach((star, index) => {
        star.update()
        if(star.radius <= 1 || star.x+star.radius < 0) {
            stars.splice(index, 1)
            // stars.push(new Star(canvas.width * Math.random(), 30, 100, '#E3EAEF', Math.random() * 180))
        }
    })

    ministars.forEach((ministar, index) => {
        ministar.update()
        if(ministar.ttl == 0) {
            ministars.splice(index, 1)
        }
    })

    backgroundstars.forEach(backgroundstar => {
        backgroundstar.draw()
    })

    orions.forEach(orion => {
        orion.draw()
    })

    tails.forEach((tail, index) => {
        tail.update()
        if(tail.ttl == 0) {
            tails.splice(index, 1)
        }
    })
}

init()
animate()
