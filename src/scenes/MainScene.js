import Phaser from "phaser";
import Enemy from '../classes/Enemy';
import lvl1_map from "../assets/levels/lvl2.json"
import lvl1_sprites from "../assets/levels/lvl1_assets.png"
import player_sprites from '../assets/bee.png';
import coin from '../assets/coin.png';
import clouds from '../assets/clouds_tilesprite.png';
import sky from '../assets/sky.png';
import mountains from '../assets/mountains.png';
import mountains2 from '../assets/mountains_2.png';
import leftArrow from '../assets/left_arrow.png';
import rightArrow from '../assets/right_arrow.png';
import jumpArrow from '../assets/jump_arrow.png';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.tilemapTiledJSON("level1", lvl1_map);
        this.load.image('tilesetNameInPhaser', lvl1_sprites);
        this.load.spritesheet("player", player_sprites, {
            frameWidth: 37,
            frameHeight: 39
        });
        this.load.image('coin', coin);
        this.load.image('clouds', clouds);
        this.load.image('sky', sky);
        this.load.image('mountains', mountains);
        this.load.image('mountains2', mountains2);
        this.load.image("leftArrow", leftArrow);
        this.load.image("rightArrow", rightArrow);
        this.load.image("jumpArrow", jumpArrow);
    }

    create() {
        this.skyTileSprite = this.add.image(0, 0, 'sky')
            .setOrigin(0, 0)
            .setScale(5)
            .setScrollFactor(0)
        this.mounatinsTileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'mountains')
            .setOrigin(0, 0)
            .setScrollFactor(0)
        this.mounatins2TileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'mountains2')
            .setOrigin(0, 0)
            .setScrollFactor(0)

        this.cloudsTileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height * .5, 'clouds');
        this.cloudsTileSprite.setOrigin(0, 0).setScrollFactor(0);




        this.map = this.make.tilemap({ key: 'level1' });
        let tileset = this.map.addTilesetImage('lvl2_sprites', 'tilesetNameInPhaser');
        this.backgroundLayer = this.map.createStaticLayer('floor', tileset, 0, 0);
        //backgroundLayer.setCollisionBetween(0, 50);
        this.backgroundLayer.setCollisionByProperty({ collides: true });


        let coins = this.add.group();
        coins.enableBody = true;
        //map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, coins);
        this.map.createFromObjects('playerSpawn', 17, 'coin', 0, true, false, coins);
        //DEBUG TILED MAP
        //const debugGraphics = this.add.graphics().setAlpha(0.75);
        // backgroundLayer.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });


        // add player
        this.player = this.physics.add.sprite(50, 20, "player");
        window.player = this.player;
        this.anims.create({
            key: "fly",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 60,
            repeat: -1
        });
        this.player.play("fly");
        //this.physics.add.collider(this.player, this.backgroundLayer);
        this.player.body.setSize(32, 32);
        //this.player.setCollideWorldBounds(true);

        // allow key inputs to control the player
        this.cursors = this.input.keyboard.createCursorKeys();


        // set workd bounds to allow camera to follow the player
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, 6000, game.config.height);

        // making the camera follow the player
        this.myCam.startFollow(this.player);

        //Gamepad
        this.add.image(0, 0, 'leftArrow')
            .setOrigin(0, 0).setInteractive()
            .on('pointerdown', (pointer1) => {
                this.move = 'left';
            });
        this.add.image(100, 0, 'rightArrow')
            .setOrigin(0, 0).setInteractive()
            .on('pointerdown', (pointer1) => {
                this.move = 'right';
            })

        this.jumpArrowController = this.add.image(500, 0, 'jumpArrow')
            .setOrigin(0, 0).setInteractive();
            
    }

    update() {

        this.cloudsTileSprite.tilePositionX = this.myCam.scrollX * 0.2;
        this.mounatinsTileSprite.tilePositionX = this.myCam.scrollX * 0.3;
        this.mounatins2TileSprite.tilePositionX = this.myCam.scrollX * 0.7;
        this.physics.collide(this.player, this.backgroundLayer)

        let onGround = this.player.body.blocked.down || this.player.body.touching.down;
        if (this.cursors.left.isDown || this.move == 'left') {
            this.player.setVelocityX(-200);
            this.player.flipX = false;

        } else if (this.cursors.right.isDown || this.move == 'right') {
            this.player.setVelocityX(200);
            this.player.flipX = true;

        } else {
            this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.cursors.space.isDown) && onGround) {
            this.player.setVelocityY(-370);
        }

        this.jumpArrowController.on('pointerdown', (pointer1) => {
            if(onGround) this.player.setVelocityY(-370);
        })

    }
}
