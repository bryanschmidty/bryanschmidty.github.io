const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const gravity = 0.7
const jump = -20
const speed = 6
const screen = {
    bound: {
        left: 100,
        right: 500
    }
}

class Platform {
    constructor() {
        this.position = {
            x: 400,
            y: 200
        }

        this.width = 200
        this.height = 50
    }

    draw() {
        c.fillStyle = 'green'
        c.fillRect(
            this.position.x - level.position,
            canvas.height - this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.draw()
    }
}
class Level {
    constructor() {
        this.position = 0
        this.length = 2000

        this.player = new Player()
        this.platform = new Platform()
    }

    update() {
        this.platform.update()
        this.player.update()
    }
}
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.direction = {
            left: false,
            right: false
        }
        this.action = {
            jumping: false,
            falling: true,
            standing: false
        }
        this.width = 45
        this.height = 45
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(
            this.position.x - level.position,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        // change x velocity
        if (this.direction.right && !this.direction.left) {
            this.velocity.x = speed
        } else if (this.direction.left && !this.direction.right) {
            this.velocity.x = -speed
        } else {
            this.velocity.x = 0
        }

        // change y velocity
        if (this.action.jumping && this.action.standing) {
            this.velocity.y = jump
            this.action.standing = false
        }

        // fix jittery y velocity
        if (Math.abs(this.velocity.y) < 0.1) {
            this.velocity.y = 0
        }

        // check jumping / falling
        let newY = this.position.y + this.height + this.velocity.y
        let newX = this.position.x - level.position + this.velocity.x

        if (this.action.falling && isPlatform(newX, newY, this.width)) {
            let testY = newY
            for (; testY > this.position.y + this.height; testY--) {
                if (isPlatform(newX, testY, this.width)) break
            }
            this.velocity.y = testY - this.position.y - this.height
            this.action.falling = false
            this.action.standing = true
        } else
        if (this.action.standing && isPlatform(newX, this.position.y + this.height + 1, this.width)) {
            this.velocity.y = 0
            this.action.falling = false
            this.action.standing = true
        } else
        if (newY < canvas.height) {
            this.velocity.y += gravity
            if (this.velocity.y > 0) {
                this.action.falling = true
            }
        } else if (newY > canvas.height) {
            this.velocity.y = canvas.height - (this.position.y + this.height)
            this.action.falling = false
            this.action.standing = true
        }


        // apply velocity
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // Scroll level if player moves out of bounds
        if (newX > screen.bound.right && level.position < level.length) {
            level.position += newX - screen.bound.right
        } else if (newX < screen.bound.left && level.position > 0) {
            level.position -= screen.bound.left - newX
        }


        if (this.position.x + this.width > level.length) {
            this.position.x = level.length - this.width
            this.velocity.x = 0
        } else if (this.position.x < 0) {
            this.position.x = 0
            this.velocity.x = 0
        }
        this.draw()
    }

}

const level = new Level()

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)
    level.update()
}
animate()

addEventListener('keydown', ({key}) => {
    switch (key) {
        case ' ':
        case 'w':
        case 'ArrowUp':
            level.player.action.jumping = true
            break
        case 'a':
        case 'ArrowLeft':
            level.player.direction.left = true
            break
        case 'd':
        case 'ArrowRight':
            level.player.direction.right = true
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case ' ':
        case 'w':
        case 'ArrowUp':
            level.player.action.jumping = false
            break
        case 'a':
        case 'ArrowLeft':
            level.player.direction.left = false
            break
        case 'd':
        case 'ArrowRight':
            level.player.direction.right = false
            break
    }
})

// addEventListener('mousemove', ({clientX, clientY}) => {
//     console.log(clientX, clientY, getColor(clientX, clientY))
// })

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function getColor(x, y) {
    let p = c.getImageData(x, y, 1, 1).data
    return "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)
}

function isPlatform(x, y, width) {
    return getColor(x, y) == '#008000' || getColor(x + width, y) == '#008000'
}