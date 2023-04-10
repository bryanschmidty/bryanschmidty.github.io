// create Phaser.Game object named "game"
// let game = new Phaser.Game(1000, 600, Phaser.CANVAS, 'my-game',
//     { preload: preload, create: create, update: update });
// declare global variables for game
const GRAVITY = 800
const PLAYER_SPEED = 400
const PLAYER_JUMP = 400
const FROG_SPEED = 650
const FROG_JUMP = 800
let game = new Phaser.Game({
    type: Phaser.CANVAS,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: false
        }
    },
    scene: { preload: preload, create: create, update: update }
});

let player, platforms
let cursors
let forest
let frog
let platformGroup

// preload game assets - runs once at start
function preload() {
    this.load.spritesheet('girl', 'assets/images/female_tilesheet.png', {
        frameWidth: 80,
        frameHeight: 110
    })
    this.load.image('forest', 'assets/images/bg_forest.jpeg');

    this.load.image('ground', 'assets/images/ground.png')

    this.load.spritesheet('frog', 'assets/images/frog.gif', {
        frameWidth: 50,
        frameHeight: 60
    });
}

// create game world - runs once after "preload" finished
function create() {
    this.add.image(640, 360, 'forest')
    // forest.fixedToCamera = true;

    // // game settings
    // game.world.setBounds(0, 0, 5000, 600)
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    // game.physics.arcade.checkCollision.up = false;
    //
    createPlayer(this);
    createFrog(this);
    createPlatforms(this);

    this.physics.add.collider(player, platforms)
    this.physics.add.collider(frog, platforms)

    // cursors
    cursors = this.input.keyboard.createCursorKeys();

    //
    // // TEMPORARY - distance markers
    // game.add.text(1000, 300, '1000px', { fill: 'white' });
    // game.add.text(2000, 300, '2000px', { fill: 'white' });
    // game.add.text(3000, 300, '3000px', { fill: 'white' });
    // game.add.text(4000, 300, '4000px', { fill: 'white' });
}

// update gameplay - runs in continuous loop after "create" finished
function update() {
    if (cursors.left.isDown) {
        frog.setVelocityX(-FROG_SPEED);
        frog.setScale(-3, 3)

        frog.anims.play('frog-hop', true);
    } else if (cursors.right.isDown) {
        frog.setVelocityX(FROG_SPEED);
        frog.setScale(3, 3)

        frog.anims.play('frog-hop', true);
    }
    else
    {
        frog.setVelocityX(0);

        frog.anims.play('frog-stand', true);
    }
    // game.physics.arcade.collide(player, platformGroup)
    // game.physics.arcade.collide(frog, platformGroup)
    //
    // if (arrowKey.right.isDown) {
    //     // player.body.velocity.x = PLAYER_SPEED;
    //     // player.scale.x = 1;
    //     // player.animations.play('right');
    //     frog.scale.x = 3
    //     frog.body.velocity.x = FROG_SPEED
    //     frog.animations.play('hop')
    // } else if (arrowKey.left.isDown) {
    //     // player.body.velocity.x = -PLAYER_SPEED;
    //     // player.scale.x = -1;
    //     // player.animations.play('left');
    //     frog.scale.x = -3
    //     frog.body.velocity.x = -FROG_SPEED
    //     frog.animations.play('hop')
    // } else {
    //     // player.body.velocity.x = 0;
    //     // player.animations.stop();
    //     // player.scale.x = 1;
    //     // player.frame = 0;
    //     frog.body.velocity.x = 0
    //     frog.animations.play('standing')
    // }
    //
    // if (arrowKey.up.isDown && player.body.touching.down) {
    //     player.body.velocity.y = -PLAYER_JUMP;
    // }
    //
    // forest.tilePosition.x = game.camera.x * -0.07
}

function createPlayer(game) {
    player = game.physics.add.sprite(100, 450, 'girl')
    player.setCollideWorldBounds(true)

    // player = game.add.sprite(50, 300, 'girl');
    // player.anchor.set(0.5, 0.5);
    // game.physics.arcade.enable(player);
    // game.camera.follow(player);
    // // player physics
    // player.body.gravity.y = GRAVITY;
    // // player.body.collideWorldBounds = true;
    // player.body.bounce.y = 0.15;
    // // player animations
    // player.animations.add('left', [9, 10], 10, true);
    // player.animations.add('right', [9, 10], 10, true);
}

function createFrog(game) {
    frog = game.physics.add.sprite(400, 400, 'frog')
    frog.setScale(3)


    game.anims.create({
        key: 'frog-hop',
        frames: game.anims.generateFrameNumbers('frog', { frames: [5, 6, 7, 8, 1] }),
        frameRate: 12,
        repeat: 0
    })
    game.anims.create({
        key: 'frog-stand',
        frames: game.anims.generateFrameNumbers('frog', { frames: [1, 1, 1, 1, 2, 3] }),
        frameRate: 4,
        repeat: -1
    })
    // frog = game.add.sprite(300, 400, 'frog')
    // frog.anchor.set(0.5, 0.5);
    // game.physics.arcade.enable(frog);
    // frog.body.gravity.y = GRAVITY
    // frog.scale.setTo(3)
    //
    // // frog animations
    // frog.animations.add('standing', [1, 1, 1, 1, 2, 3], 4, true)
    // frog.animations.add('hop', [5, 6, 7, 8, 1], 10, false)
}

function createPlatforms(game) {

    platforms = game.physics.add.staticGroup()
    for (let x=32; x<1000; x+=64) {
        platforms.create(x, 568, 'ground').setScale(2).refreshBody()
    }

    // platformGroup = game.add.group()
    // platformGroup.enableBody = true
    //
    // var ground = platformGroup.create(0, game.world.height - 25, 'platform-50')
    // ground.scale.setTo(40, 1)

    // platformGroup.setAll('body.immovable', true)
    // return platformGroup;
}

// add custom functions (for collisions, etc.)
function rideFrog(player, frog)
{

}