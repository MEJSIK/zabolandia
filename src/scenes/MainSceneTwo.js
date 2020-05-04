export default class MainSceneTwo extends Phaser.Scene {
    constructor() {
        super('MainSceneTwo');
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
    createGamepad() {
        //Gamepad
        let height = this.cameras.main.height * .9;
        console.log('dupa', height);
        this.leftArrowController = this.add.sprite(0, height, 'leftArrow')
            .setOrigin(0, 0).setInteractive()
            .on('pointerdown', (pointer1) => {
                this.move = 'left';
                this.leftArrowController
                    .setFrame(1)
            }).on('pointerup', () => {
                this.move = null;
                this.leftArrowController.setFrame(0);
            }).setScrollFactor(0, 0)
            .setAlpha(0.7);
        this.rightArrowController = this.add.image(100, height, 'rightArrow')
            .setOrigin(0, 0).setInteractive()
            .setFrame(1)
            .on('pointerdown', (pointer1) => {
                this.move = 'right';
                this.rightArrowController.setFrame(0);
            }).on('pointerup', () => {
                this.move = null;
                this.rightArrowController.setFrame(1);
            }).setScrollFactor(0, 0)
            .setAlpha(0.7);

        this.jumpArrowController = this.add.image(this.game.config.width * .55, height, 'jumpArrow')
            .setOrigin(0, 0).setInteractive()
            .on('pointerdown', (pointer1) => {
                if (this.onGround) {
                    this.player.setVelocityY(-370);
                    this.sound.play('jumpSound');
                    this.jumpArrowController.setFrame(1);
                }
            }).on('pointerup', (pointer1) => {
                this.jumpArrowController.setFrame(0);
            }).setScrollFactor(0, 0)
            .setAlpha(.7);
    }
    create() {
        this.input.addPointer(3);
        this.skyTileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'sky_yellow')
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

        this.map = this.make.tilemap({ key: 'level2' });
        window.map = this.map;
        this.map.forEachTile(tile => {
            if (tile.properties.collidesTop != undefined) {
                tile.setCollision(false, false, true, false, true);
            }
        })
        let tileset = this.map.addTilesetImage('lvl2_sprites', 'tilesetNameInPhaser');
        this.floor = this.map.createStaticLayer('floor', tileset, 0, 0);
        // this.collisions = this.map.createStaticLayer('collisions', tileset, 0, 0).setAlpha(0);
        // this.endGame = this.map.createStaticLayer('endGame', tileset, 0, 0).setAlpha(0);

        this.floor.setCollisionByProperty({ collides: true });

        // PLAYER
        let playerSpawnPlace = this.findTilemapObject(this.map, "playerSpawn", 'PlayerSpawner');
        this.player = this.physics.add.sprite(playerSpawnPlace.x, playerSpawnPlace.y, "player");
        window.player = this.player;
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate:15,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy1_walk',
            frames: this.anims.generateFrameNames('enemy1'),
            frameRate: 4,
            repeat: -1
        });
       
        //this.player.body.setSize(32, 32);
        this.player.setName('Player');

        // Collisions
        this.physics.add.collider([this.player], this.floor);


        // allow key inputs to control the player
        this.cursors = this.input.keyboard.createCursorKeys();

        // set workd bounds to allow camera to follow the player
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, 185 * 32, game.config.height);

        // making the camera follow the player
        this.myCam.startFollow(this.player);
        //this.cameras.main.zoom = 1.7;

        this.createGamepad();

    }
    update() {
        // this.cloudsTileSprite.tilePositionX = this.myCam.scrollX * 0.2;
        this.mounatinsTileSprite.tilePositionX = this.myCam.scrollX * 0.3;
        this.mounatins2TileSprite.tilePositionX = this.myCam.scrollX * 0.7;


        this.onGround = this.player.body.blocked.down || this.player.body.touching.down;
        if (this.cursors.left.isDown || this.move == 'left') {
            this.player.setVelocityX(-180);
            this.player.flipX = true;
            if(!this.player.anims.isPlaying){
                this.player.play("walk");
            }
           

        } else if (this.cursors.right.isDown || this.move == 'right') {
            this.player.setVelocityX(180);
            this.player.flipX = false;
            if(!this.player.anims.isPlaying){
                this.player.play("walk");
            }

        } else {
            this.player.setVelocityX(0);
            this.player.anims.stop("walk");
        }

        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.onGround) {
            this.player.setVelocityY(-370);
            this.sound.play('jumpSound');
        }


        if (this.player.y >= this.game.config.height) {
            if (this.gameRestartState == 0) {
                this.restartGame();
                this.gameRestartState++;
            }

        }
    }
}