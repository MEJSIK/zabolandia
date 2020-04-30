import Phaser from "phaser";
import Enemy from '../classes/Enemy';
import lvl1_map from "../assets/levels/lvl2.json"
import lvl1_sprites from "../assets/levels/lvl1_assets.png"
import player_sprites from '../assets/bee.png';
import enemy1_sprites from '../assets/characters/enemies/enemy1_spritesheet.png';
import coin from '../assets/coin.png';
import clouds from '../assets/clouds_tilesprite.png';
import sky from '../assets/sky.png';
import mountains from '../assets/mountains.png';
import mountains2 from '../assets/mountains_2.png';
import leftArrow from '../assets/left_arrow.png';
import rightArrow from '../assets/right_arrow.png';
import jumpArrow from '../assets/jump_arrow.png';
import bonus1 from '../assets/bonus1.png';

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
        this.load.spritesheet("enemy1", enemy1_sprites, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('coin', coin);
        this.load.image('clouds', clouds);
        this.load.image('sky', sky);
        this.load.image('mountains', mountains);
        this.load.image('mountains2', mountains2);
        this.load.image("leftArrow", leftArrow);
        this.load.image("rightArrow", rightArrow);
        this.load.image("jumpArrow", jumpArrow);

        this.load.spritesheet("bonus1", bonus1, {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    findTilemapObject(map, layer, name) {

        for (let o = 0; o < map.objects.length; o++) {
            if (map.objects[o].name == layer) {
                for (let i = 0; i < map.objects[o].objects.length; i++) {
                    if (map.objects[o].objects[i].name == name) {
                        return map.objects[o].objects[i];
                    }
                }
            }
        }
        return null
    }
    create() {
        this.skyTileSprite = this.add.image(0, 0, 'sky')
            .setOrigin(0, 0)
            .setScale(5)
            .setScrollFactor(0)
        this.mounatinsTileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'mountains')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setOrigin(0, .1);
        this.mounatins2TileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'mountains2')
            .setOrigin(0, 0)
            .setScrollFactor(0);


        this.cloudsTileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height * .5, 'clouds');
        this.cloudsTileSprite.setOrigin(0, 0).setScrollFactor(0);




        this.map = this.make.tilemap({ key: 'level1', tileWidth: 32, tileHeight: 32 });
        let tileset = this.map.addTilesetImage('lvl2_sprites', 'tilesetNameInPhaser');
        this.floor = this.map.createStaticLayer('floor', tileset, 0, 0);
        this.collisions = this.map.createStaticLayer('collisions', tileset, 0, 0).setAlpha(0);
        this.endGame = this.map.createStaticLayer('endGame', tileset, 0, 0).setAlpha(0);


        let playerSpawnPlace = this.findTilemapObject(this.map, "playerSpawn", 'PlayerSpawner');
        //backgroundLayer.setCollisionBetween(0, 50);
        this.floor.setCollisionByProperty({ collides: true });
        this.collisions.setCollisionByProperty({ collides: true });
        this.endGame.setCollisionByProperty({ collides: true });

        this.setCustomBodySize(this.map, 'floor', 'treePlatform');


        // add player
        this.player = this.physics.add.sprite(playerSpawnPlace.x, playerSpawnPlace.y, "player");
        window.player = this.player;
        this.anims.create({
            key: "fly",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 60,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy1_walk',
            frames: this.anims.generateFrameNames('enemy1'),
            frameRate: 4,
            repeat: -1
        });
        this.player.play("fly");
        this.player.body.setSize(32, 32);
        this.player.setName('Player');
        //this.player.setCollideWorldBounds(true);

        //Enemies
        this.enemies = this.physics.add.group({
            bounceY: 0.1,
            bounceX: 1,
            collideWorldBounds: false
        });
        for (let index = 0; index < 7; index++) {
            let enemyData = this.findTilemapObject(this.map, 'playerSpawn', `Enemy${index}_spawner`)

            if (enemyData) {
                this.enemies.create(enemyData.x, enemyData.y, 'enemy1').setVelocityX(enemyData.properties[0].value).play('enemy1_walk');

            }
        }

        this.enemies2 = this.physics.add.group({
            bounceY: 1,
            collideWorldBounds: false
        })
        for (let index = 0; index < 2; index++) {
            let enemyData = this.findTilemapObject(this.map, 'playerSpawn', `Enemy${index}_spawner2`)

            if (enemyData) {
                this.enemies2.create(enemyData.x, enemyData.y, 'enemy1')
                    .setVelocityY(enemyData.properties[0].value)
                    .play('enemy1_walk')

            }
        }
        window.enemies = this.enemies2;

        //Bonus
        this.bonuses = this.physics.add.group({
            bounceY: 0.1,
            bounceX: 1,
            collideWorldBounds: false,
            allowGravity: false
        });
        for (let index = 1; index <= 3; index++) {
            let bonusesData = this.findTilemapObject(this.map, 'playerSpawn', `Bonus${index}`)
            console.log(bonusesData);
            if (bonusesData) {
                this.bonuses.create(bonusesData.x, bonusesData.y, 'bonus1');

            }
        }


        //COLLISION
        this.physics.add.collider([this.player, this.enemies, this.enemies2, this.bonuses], this.floor);
        this.physics.add.collider([this.enemies, this.enemies2], this.collisions);

        this.physics.add.collider(this.player, this.endGame, (obj1, obj2) => {
            this.cameras.main.fade(1000);


            this.cameras.main.on('camerafadeoutcomplete', () => {

                this.scene.start('EndGame');
            })
        }, null, this);
        this.physics.add.overlap(this.player, [this.enemies, this.enemies2], (gameObjectA, gameObjectB) => {
            if (gameObjectA.name !== 'Player') {
                gameObjectB.setVelocityY(-600);
                this.restartGame();
            } else {
                gameObjectA.setVelocityY(-600);
                this.restartGame();
            }
        }, null, this);

        this.physics.add.overlap(this.player, [this.bonuses], (gameObjectA, gameObjectB) => {
            if (gameObjectA.name !== 'Player') {
                gameObjectA.destroy();
            } else {
                gameObjectB.destroy();
            }
        }, null, this);

        // let coins = this.add.group();
        // coins.enableBody = true;
        // //map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, coins);
        // this.map.createFromObjects('playerSpawn', 17, 'coin', 0, true, false, coins);
        //this.map.createFromObjects('playerSpawn',36,{key:'enemy1'});

        //DEBUG TILED MAP
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // this.floor.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });
        // this.endGame.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });




        // allow key inputs to control the player
        this.cursors = this.input.keyboard.createCursorKeys();

        // set workd bounds to allow camera to follow the player
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, 185 * 32, game.config.height);

        // making the camera follow the player
        this.myCam.startFollow(this.player);
        this.cameras.main.zoom = 1.7;
        //this.createGamepad();

        this.gameRestartState = 0;
    }
    setCustomBodySize(map, layername, objectname) {
        //(this.map, "floor", 'PlayerSpawner');
        window.map = map;
        console.log(map);
        // for (let l = 0; l < map.layers.length; l++) {
        //     if (map.layers[l].name == layername) {
        //         for (let i = 0; i < map.objects[l].objects.length; i++) {
        //             if (map.layers[l].objects[i].name == objectname) {
        //                 return map.objects[l].objects[i];
        //             }
        //         }
        //     }
        // }

    }

    createGamepad() {
        //Gamepad
        this.add.image(0, 0, 'leftArrow')
            .setOrigin(0, 0).setInteractive()
            .on('pointerdown', (pointer1) => {
                this.move = 'left';
            }).on('pointerup', () => {
                this.move = null;
            });
        this.add.image(100, 0, 'rightArrow')
            .setOrigin(0, 0).setInteractive()
            .on('pointerdown', (pointer1) => {
                this.move = 'right';
            }).on('pointerup', () => {
                this.move = null;
            });

        this.jumpArrowController = this.add.image(500, 0, 'jumpArrow')
            .setOrigin(0, 0).setInteractive()
            .on('pointerdown', (pointer1) => {
                this.player.setVelocityY(-370);
            })
    }
    update() {


        this.cloudsTileSprite.tilePositionX = this.myCam.scrollX * 0.2;
        this.mounatinsTileSprite.tilePositionX = this.myCam.scrollX * 0.3;
        this.mounatins2TileSprite.tilePositionX = this.myCam.scrollX * 0.7;


        let onGround = this.player.body.blocked.down || this.player.body.touching.down;
        if (this.cursors.left.isDown || this.move == 'left') {
            this.player.setVelocityX(-180);
            this.player.flipX = false;

        } else if (this.cursors.right.isDown || this.move == 'right') {
            this.player.setVelocityX(180);
            this.player.flipX = true;

        } else {
            this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.cursors.space.isDown) && onGround) {
            this.player.setVelocityY(-370);

        }


        if (this.player.y >= this.game.config.height) {
            if (this.gameRestartState == 0) {
                this.restartGame();
                this.gameRestartState++;
            }

        }

    }
    restartGame() {
        this.tweens.add({
            targets: this.player,
            alpha: { from: 1, to: 0 },
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
        })
        this.cameras.main.fade(1000);


        this.cameras.main.on('camerafadeoutcomplete', () => {

            this.scene.start('GameOver');
        })
    }
}
