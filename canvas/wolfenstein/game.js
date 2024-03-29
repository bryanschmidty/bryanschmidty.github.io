
const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')

// FPS and rendering
const FPS = 60
const cycleDelay = Math.floor(1000 / FPS)
let oldCycleTime = 0
let cycleCount = 0
let fps_rate = '...'

// game
const WIDTH = 300
const HEIGHT = 200
let paused = true

// load textures
const WALLS = []
for (let filename = 0; filename <= 9; filename++) {
    let image = document.createElement('img')
    image.src = 'assets/walls/' + filename + '.png'
    WALLS.push(image)
}

// map
let Map = function () {
    this.display = true
    this.showRays = true
    this.canvas = document.getElementById('map')
    this.context = this.canvas.getContext('2d')
    this.size = {x:0, y:0}
    this.scale = 64
    this.drawScale = 1;//this.scale * 3
    this.directionReference = {S: 0, SE: 1, E: 2, NE: 3, N: 4, NW: 5, W: 6, SW: 7}
    this.data = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    // this.data = [
    //     [1, 1, 1, 1, 1],
    //     [1, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 1],
    //     [1, 1, 1, 1, 1],
    // ]
    this.player = {
        x: 2,
        y: 3,
        angle: 'E'
    }
    this.size = {
        x: this.data[0].length,
        y: this.data.length
    }

    this.draw = function () {
        this.canvas.style.visibility = this.display ? 'visible' : 'hidden'

        // update canvas size
        // this.canvas.width = window.innerWidth;
        // this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        // update scale
        this.drawScale = Math.floor((this.canvas.width / this.canvas.height < this.size.x / this.size.y) ? this.canvas.width / this.size.x : this.canvas.height / this.size.y)

        // update offset. center on screen
        this.offset = {
            x: Math.floor(this.canvas.width / 2 - this.size.x * this.drawScale / 2),
            y: Math.floor(this.canvas.height / 2 - this.size.y * this.drawScale / 2)
        }

        if (this.display) {
            let color, texture
            for (let row = 0; row < this.size.y; row++) {
                for (let col = 0; col < this.size.x; col++) {
                    texture = this.data[row][col];
                    color = texture == 0 ? '#aaaaaa' : '#444444'
                    this.drawSquare({col, row, color, texture})
                }
            }

            // draw player triangle
            this.drawPlayer(player)
        }

        // this.rayCasting3()
        // if (!this.showRays)
        //     this.rayCasting2()
        // else
            this.rayCasting()
    }

    this.rayCasting3 = function () {
        let fov = Math.PI / 3
        let startAngle = player.coords.angle + fov / 2

        let point = player.coords
        let angle = player.coords.angle
        let response
        while (true) {
            if (!point?.x) {
                debugger
            }
            response = this.calculateRay(point, angle)
            if (response.error) break;
            if (response.texture) break;

            point = response.point
        }

        // for (let ray = 0; ray < WIDTH; ray++) {
        //     angle = startAngle - ray * fov / WIDTH
        //
        //
        // }
    }

    this.drawLine = function(fromPoint, toPoint, color) {
        fromPoint = this.translateDrawingCoords(fromPoint)
        toPoint = this.translateDrawingCoords(toPoint)
        this.context.strokeStyle = color || 'yellow'
        this.context.beginPath()
        this.context.moveTo(fromPoint.x, fromPoint.y)
        this.context.lineTo(toPoint.x, toPoint.y)
        this.context.stroke()
    }

    this.drawSquare = function (args) {
        let texture = Math.abs(args?.texture || 0)
        let x = args?.x || args?.col * this.drawScale + this.offset.x
        let y = args?.y || args?.row * this.drawScale + this.offset.y
        let w = args?.w || this.drawScale - 1
        let h = args?.h || this.drawScale - 1

        if (!x || !y) return

        this.context.save()
        this.context.globalAlpha = args?.alpha || 1
        if (texture) {
            this.context.drawImage(
                WALLS[texture],
                0, 0, 64, 64,
                x, y, w, h
            )
        } else {
            this.context.fillStyle = args?.color || 'cyan'
            this.context.fillRect(x, y, w, h)
        }
        this.context.restore()
    }

    this.drawDot = function (x, y, color) {
        let coords = this.translateDrawingCoords({x, y})

        this.context.fillStyle = color
        this.context.beginPath()
        this.context.arc(coords.x, coords.y, 5, 0, Math.PI * 2)
        this.context.fill()
    }

    this.mapTruncate = function (value) {
        return Math.floor(value - Math.floor(value / map.scale) * map.scale)
    }

    this.calculateRay = function (point, angle) {
        console.log(angle)
        let sin = Math.sin(angle) || +'1e-9'
        let cos = Math.cos(angle) || +'1e-9'
        let tile = {
            x: Math.floor(point.x / this.scale),
            y: Math.floor(point.y / this.scale)
        }

        let dirX = sin >=0 ? 1 : -1
        let dirY = cos >=0 ? 1 : -1

        let diffX = dirX < 0 ? point.x - tile.x * map.scale : (tile.x + 1) * map.scale - point.x
        let diffY = dirY < 0 ? point.y - tile.y * map.scale : (tile.y + 1) * map.scale - point.y

        // let distX = diffX * Math.abs(1 / (sin || +'1e30'))
        // let distY = diffY * Math.abs(1 / (cos || +'1e30'))
        let distX = Math.abs(diffX / sin) || +'1e3'
        let distY = Math.abs(diffY / cos) || +'1e3'

        let newPoint = {
            x: Math.round(point.x + sin * Math.min(distX, distY)),
            y: Math.round(point.y + cos * Math.min(distX, distY))
        }
        console.log(dirX, dirY, distX, distY, newPoint)

        let collisionVertical = distX < distY
        let collisionHorizontal = distY < distX

        // shouldn't happen, but just in case
        if (newPoint.x <= 0 || newPoint.x >= this.size.x * this.scale || newPoint.y <=0 || newPoint.y >= this.size.y * this.scale) {
            return {
                error: 'out of bounds'
            }
        }

        let newTile = {
            x: Math.floor(newPoint.x / this.scale) - (collisionVertical && dirX < 0),
            y: Math.floor(newPoint.y / this.scale) - (collisionHorizontal && dirY < 0)
        }

        this.drawLine(point, newPoint, 'yellow')

        if (this.data[newTile.y][newTile.x] !== 0) {
            this.drawSquare({col: newTile.x, row: newTile.y, alpha:0.4})

            return {
                tile: newTile,
                texture: this.data[newTile.y][newTile.x],
                collisionHorizontal,
                collisionVertical,
                collisionPoint: newPoint,
                textureOffset: this.mapTruncate(collisionVertical ? newPoint.y : newPoint.x)
            }
        }

        return {
            point: newPoint,
            angle
        }
    }

    this.rayCasting2 = function () {
        // https://lodev.org/cgtutor/raycasting.html
        // https://www.youtube.com/watch?v=eOCQfxRQ2pY
        let coords = player.coords
        let fov = Math.PI / 3
        let startAngle = coords.angle + fov / 2
        let stepAngle = fov / WIDTH

        loop: for (let ray = 0; ;) {
            let coords = player.coords
            // let angle = startAngle - ray * stepAngle
            angle = 1.7693292519943298

            let tileStep = {
                x: Math.sin(angle) >= 0 ? 1 : -1,
                y: Math.cos(angle) >= 0 ? 1 : -1
            }
            // if (ray !== 11) continue
            while (true) {
                // console.log(coords)
                let tile = {
                    x: Math.floor(coords.x / this.scale) + 1,
                    y: Math.floor(coords.y / this.scale) + 1
                }
                let d = {
                    x: tileStep.x < 0 ? coords.x - (tile.x - 1) * this.scale : tile.x * this.scale - coords.x,
                    y: tileStep.y < 0 ? coords.y - (tile.y - 1) * this.scale : tile.y * this.scale - coords.y
                }
                let dDist = {
                    x: Math.abs(1 / (Math.sin(angle) || +'1e30')),
                    y: Math.abs(1 / (Math.cos(angle) || +'1e30'))
                }
                let sideDist = {
                    x: d.x * dDist.x,
                    y: d.y * dDist.y
                }

                let distance = Math.min(sideDist.x, sideDist.y)
                coords = {
                    x: coords.x + Math.sin(angle) * distance,
                    y: coords.y + Math.cos(angle) * distance
                }
                let inTile
                if (sideDist.x < sideDist.y) {
                    inTile = {x: coords.x + tileStep.x, y: coords.y}
                } else if (sideDist.y < sideDist.x) {
                    inTile = {x: coords.x, y: coords.y + tileStep.y}
                } else {
                    inTile = {x: coords.x + tileStep.x, y: coords.y + tileStep.y}
                }
                // this.drawLine(player.coords, coords)
                if (this.showRays) {
                    this.drawLine(player.coords, coords, 'yellow')
                }
                if (inTile.x <= 0 || inTile.x >= this.size.x * this.scale || inTile.y <= 0 || inTile.y >= this.size.y * this.scale) {
                    console.log(angle)
                    break
                }

                let square = this.pointToSquare(inTile)
                let texture = this.data[square.row][square.col]
                debugger
                // break
                if (texture !== 0) {
                    let depth = Math.floor((coords.x - player.coords.x) / Math.sin(angle))
                    let wallHeight = Math.floor(this.scale * 280 / (depth + 0.0001))
                    let wallY = Math.floor(HEIGHT / 2 - wallHeight / 2)
                    let isVertical = sideDist.x < sideDist.y

                    let isHorizontal = !isVertical
                    let flipTexture = isVertical && Math.sin(angle) < 0 || isHorizontal && Math.cos(angle) < 0
                    // let textureOffset = isVertical ?

                    /* colors */
                    context.fillStyle = isVertical ? (flipTexture ? 'red' : 'blue') : (flipTexture ? 'green' : 'yellow')
                    context.fillRect(screenX + ray, screenY + wallY, 1, wallHeight)

                    /* textures */
                    // context.drawImage(
                    //     WALLS[Math.abs(texture)],
                    //     flip ? 64 -
                    // )

                    break
                }
                // coords = {x:coords.x + Math.sin(angle), y: coords.y + Math.cos(angle)}
            }
        }
    }

    this.rayCasting = function () {
        const FOV = Math.PI / 3
        const STEP_ANGLE = FOV / WIDTH
        const MAP_SCALE = this.scale
        let playerX = player.coords.x
        let playerY = player.coords.y

        let textureX, textureY

        let startAngle = player.coords.angle + (FOV / 2)
        let rayStartX = Math.floor(playerX / MAP_SCALE) * MAP_SCALE
        let rayStartY = Math.floor(playerY / MAP_SCALE) * MAP_SCALE

        let currentAngle
        for (let ray = 0; ray < WIDTH; ray++) {
            currentAngle = startAngle - ray * STEP_ANGLE
            let currentSin = Math.sin(currentAngle) || 0.000001
            let currentCos = Math.cos(currentAngle) || 0.000001

            // vertical line intersection
            let rayEndX, rayEndY, rayDirectionX, verticalDepth, textureEndY, textureY
            if (currentSin > 0) {
                rayEndX = rayStartX + this.scale
                rayDirectionX = 1
            } else {
                rayEndX = rayStartX
                rayDirectionX = -1
            }
            for (; rayEndX > 0 && rayEndX < map.size.x * MAP_SCALE; rayEndX += rayDirectionX * MAP_SCALE) {
                verticalDepth = (rayEndX - playerX) / currentSin;
                rayEndY = playerY + verticalDepth * currentCos
                let mapTargetX = Math.floor(rayEndX / this.scale)
                let mapTargetY = Math.floor(rayEndY / this.scale)
                if (currentSin < 0) mapTargetX += rayDirectionX
                if (mapTargetY < 0 || mapTargetY >= map.size.y) break
                textureY = map.data[mapTargetY][mapTargetX];
                if (textureY !== 0) break
            }
            textureEndY = rayEndY

            let tempX = rayEndX
            let tempY = rayEndY

            // horizontal line intersection
            let rayDirectionY, horizontalDepth, textureEndX, textureX
            if (currentCos > 0) {
                rayEndY = rayStartY + MAP_SCALE
                rayDirectionY = 1
            } else {
                rayEndY = rayStartY
                rayDirectionY = -1
            }
            for (; rayEndY > 0 && rayEndY < map.size.y * MAP_SCALE; rayEndY += rayDirectionY * MAP_SCALE) {
                horizontalDepth = (rayEndY - playerY) / currentCos;
                rayEndX = playerX + horizontalDepth * currentSin
                mapTargetX = Math.floor(rayEndX / MAP_SCALE)
                mapTargetY = Math.floor(rayEndY / MAP_SCALE)
                if (currentCos <= 0) mapTargetY += rayDirectionY
                if (mapTargetX < 0 || mapTargetX >= map.size.x) break
                textureX = map.data[mapTargetY][mapTargetX];
                if (textureX !== 0) break
            }
            textureEndX = rayEndX

            let endX = verticalDepth < horizontalDepth ? tempX : rayEndX
            let endY = verticalDepth < horizontalDepth ? tempY : rayEndY
            let texture = Math.abs(verticalDepth < horizontalDepth ? textureY : textureX)
            let wallFacing = verticalDepth < horizontalDepth ? (currentSin < 0 ? 'E' : 'W') : (currentCos < 0 ? 'S' : 'N')

            if (this.display && this.showRays) {
                // draw ray
                this.context.strokeStyle = 'Yellow';
                this.context.lineWidht = 1;
                this.context.beginPath();
                let fromCoords = this.translateDrawingCoords({x: playerX, y: playerY})
                this.context.moveTo(fromCoords.x, fromCoords.y)
                let toCoords = this.translateDrawingCoords({x: endX, y: endY})
                this.context.lineTo(toCoords.x, toCoords.y)
                this.context.stroke();
            }

            // render 3d projection
            let depth = Math.min(verticalDepth, horizontalDepth)
            // depth *= Math.cos(player.coords.angle - currentAngle)
            let textureOffsetX = verticalDepth < horizontalDepth ? textureEndY : textureEndX
            textureOffsetX = Math.floor(textureOffsetX - Math.floor(textureOffsetX / MAP_SCALE) * MAP_SCALE)
            let wallHeight = Math.floor(MAP_SCALE * 280 / (depth + 0.0001))
            let wallY = Math.floor(HEIGHT / 2 - wallHeight / 2)

            /* Just colors */
            // context.fillStyle = verticalDepth < horizontalDepth ? (currentSin < 0 ? 'red' : 'blue') : (currentCos < 0 ? 'green' : 'yellow')
            // context.fillRect(screenX + ray, screenY + wallY, 1, wallHeight)

            // textures
            let flip = (verticalDepth < horizontalDepth && currentSin < 0) || (horizontalDepth < verticalDepth && currentCos > 0)
            context.drawImage(
                WALLS[texture],
                flip ? 64 - textureOffsetX -1 : textureOffsetX, 0,
                1, 64,
                screenX + ray, screenY + wallY,
                1, wallHeight
            )

            /* fix texture overflow */
            // let textureHeight = wallHeight < HEIGHT ? this.scale : Math.floor(HEIGHT / wallHeight * this.scale)
            // context.drawImage(
            //     WALLS[1],
            //     textureOffsetX, Math.floor(Math.max(0, -wallY) / wallHeight * this.scale),
            //     1, textureHeight,
            //     screenX + ray, screenY + Math.max(wallY, 0),
            //     1, Math.min(wallHeight, HEIGHT)
            // )
        }
    }

    this.drawPlayer = function (player) {
        let coords = this.translateDrawingCoords(player.coords)
        let sin = Math.sin(player.coords.angle)
        let cos = Math.cos(player.coords.angle)

        /* dot and arrow */
        this.drawDot(player.coords.x, player.coords.y, 'red')
        this.context.strokeStyle = 'red'
        this.context.beginPath()
        this.context.moveTo(coords.x + sin * 10, coords.y + cos * 10)
        this.context.lineTo(coords.x + sin * 128, coords.y + cos * 128)
        this.context.stroke()

        /* Triangle */
        // this.context.fillStyle = '#f00'
        // this.context.beginPath()
        // this.context.moveTo(coords.x + Math.sin(player.coords.angle) * this.drawScale / 2, coords.y + Math.cos(player.coords.angle) * this.drawScale / 2)
        // this.context.lineTo(coords.x + Math.sin(player.coords.angle + Math.PI * 2 / 3) * this.drawScale / 3, coords.y + Math.cos(player.coords.angle + Math.PI * 2 / 3) * this.drawScale / 3)
        // this.context.lineTo(coords.x + Math.sin(player.coords.angle - Math.PI * 2 / 3) * this.drawScale / 3, coords.y + Math.cos(player.coords.angle - Math.PI * 2 / 3) * this.drawScale / 3)
        // this.context.fill()
    }

    this.pointToSquare = function (point) {
        return {
            col: Math.floor(point.x / this.scale),
            row: Math.floor(point.y / this.scale)
        }
    }

    this.translateDrawingCoords = function (point) {
        return {
            x: Math.floor(point.x * this.drawScale / this.scale + this.offset.x),
            y: Math.floor(point.y * this.drawScale / this.scale + this.offset.y)
        }
    }

    this.checkCollision = function (oldPoint, newPoint) {
        oldPoint = this.pointToSquare(oldPoint)
        newPoint = this.pointToSquare(newPoint)
        return {
            x: this.data[oldPoint.row][newPoint.col] > 0,
            y: this.data[newPoint.row][oldPoint.col] > 0
        }
    }

    this.playerStart = function() {
        return {
            x: map.scale * (this.player.x - 0.5),
            y: map.scale * (this.player.y - 0.5),
            angle: Math.PI / 4 * this.directionReference[this.player.angle]
        }
    }
}

let map = new Map()

let Player = function () {
    this.TURNING_SPEED = 0.003
    this.speed = {
        walk: 1,
        run: 2
    }
    this.coords = map.playerStart()
    this.newCoords = {x: null, y: null}
    this.movement = {
        moving: false,
        speed: this.speed.walk,
        forward: 0,
        strafe: 0,
        angle: 0
    }
    this.movementArray = [
        [1,    2,    3],
        [0,    null, 4],
        [7,    6,    5]
    ]

    this.walkForward = function () {
        this.movement.forward = 1
    }
    this.walkBackward = function () {
        this.movement.forward = -1
    }
    this.stopWalking = function () {
        this.movement.forward = 0
    }
    this.strafeLeft = function () {
        this.movement.strafe = 1
    }
    this.strafeRight = function () {
        this.movement.strafe = -1
    }
    this.stopStrafing = function () {
        this.movement.strafe = 0
    }
    this.turn = function (movementX) {
        this.movement.angle = movementX
    }
    this.stopTurning = function () {
        this.movement.angle = 0
    }

    this.running = function(isRunning) {
        this.movement.speed = isRunning ? this.speed.run : this.speed.walk
    }

    this.stopMoving = function () {
        this.stopWalking()
        this.stopStrafing()
    }

    this.update = function() {
        let direction = this.movementArray[this.movement.strafe + 1][this.movement.forward + 1];
        if (direction !== null) {
            let directionAngle = Math.PI / 4 * direction - Math.PI;
            let angle = this.coords.angle + directionAngle
            let dx = Math.sin(angle) * this.movement.speed * map.scale / 10;
            let dy = Math.cos(angle) * this.movement.speed * map.scale / 10;
            this.newCoords.x = this.coords.x + dx
            this.newCoords.y = this.coords.y + dy

            let collisions = map.checkCollision(this.coords, this.newCoords)
            if (!collisions.x) this.coords.x = this.newCoords.x
            if (!collisions.y) this.coords.y = this.newCoords.y
        }

        this.coords.angle += this.TURNING_SPEED * this.movement.angle
        if (this.coords.angle > Math.PI) this.coords.angle = -Math.PI
        if (this.coords.angle < -Math.PI) this.coords.angle = Math.PI
    }
}
let player = new Player()

// handle user input
document.onkeydown = function(event) {
    if (!document.pointerLockElement) return
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            player.walkForward()
            break
        case 's':
        case 'ArrowDown':
            player.walkBackward()
            break
        case 'a':
        case 'ArrowLeft':
            player.strafeLeft()
            break
        case 'd':
        case 'ArrowRight':
            player.strafeRight()
            break
        case 'Shift':
            player.running(true)
            break
        case 'Escape':
            document.exitPointerLock()
            player.stopMoving()
            break
        case 'm':
            map.display = !map.display
            break
        case 'r':
            map.showRays = !map.showRays
            break
    }
}
document.onkeyup = function (event) {
    if (!document.pointerLockElement) return
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
        case 's':
        case 'ArrowDown':
            player.stopWalking()
            break
        case 'a':
        case 'ArrowLeft':
        case 'd':
        case 'ArrowRight':
            player.stopStrafing()
            break
        case 'Shift':
            player.running(false)
            break
    }
}
document.onpointermove = function (event) {
    if (document.pointerLockElement) {
        player.turn(-event.movementX)
    } else {
        player.stopTurning()
    }
}
document.onpointerdown = function (event) {
    if (event.button === 0) {
        canvas.requestPointerLock()
        paused = false
    }
}

// game loop
let screenX, screenY
function gameLoop() {
    // resize canvas
    let scale = (window.innerWidth / window.innerHeight < WIDTH / HEIGHT) ? WIDTH / window.innerWidth : HEIGHT / window.innerHeight
    canvas.width = window.innerWidth * scale
    canvas.height = window.innerHeight * scale

    screenX = canvas.width / 2 - WIDTH / 2
    screenY = canvas.height / 2 - HEIGHT / 2

    // draw background
    context.fillStyle = 'Black'
    context.fillRect(screenX, screenY, WIDTH, HEIGHT)
    context.drawImage(WALLS[0], screenX, screenY)

    // update player
    player.update()

    // draw map
    map.draw()

    // fix texture overflow
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, screenY + 1)
    context.fillRect(0, screenY + HEIGHT, canvas.width, canvas.height - screenY - HEIGHT)

    // calculate FPS
    let startTime = Date.now()
    let cycleTime = startTime - oldCycleTime
    oldCycleTime = startTime
    if (cycleCount++ >= FPS) {
        cycleCount = 0
        fps_rate = Math.floor(1000 / cycleTime)
    }

    // render FPS to screen
    context.fillStyle = 'Orange'
    context.font = '12px Monospace'
    context.fillText('FPS: ' + fps_rate, 0, 20)

    // infinite loop
    setTimeout(gameLoop, cycleDelay)
}

window.onload = function() {
    gameLoop()
}