
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
import bonus2 from '../assets/bonus2.png';
import bonus3 from '../assets/bonus3.png';
import bonus4 from '../assets/bonus4.png';
import playBtnSprites from '../assets/play_button.png';

export default class MainGame extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.tilemapTiledJSON("level1", lvl1_map);
        this.load.image('tilesetNameInPhaser', lvl1_sprites);
        this.load.spritesheet("play_button", playBtnSprites, {
            frameWidth: 80,
            frameHeight: 40
        });
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
        this.load.spritesheet("leftArrow", leftArrow, {
            frameWidth: 80,
            frameHeight: 68
        });
        this.load.spritesheet("rightArrow", rightArrow, {
            frameWidth: 80,
            frameHeight: 68
        });
        this.load.spritesheet("jumpArrow", jumpArrow, {
            frameWidth: 162,
            frameHeight: 68
        });

        this.load.spritesheet("bonus1", bonus1, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("bonus2", bonus2, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("bonus3", bonus3, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("bonus4", bonus4, {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'sky')
            .setOrigin(0, 0)
            .setScale(5)
            .setScrollFactor(0);
        this.mounatinsTileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'mountains')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setOrigin(0, .1);
        this.mounatins2TileSprite = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'mountains2')
            .setOrigin(0, 0)
            .setScrollFactor(0);
        this.playBtn = this.add.sprite(this.game.config.width * .5, this.game.config.height * .5, 'play_button');
        this.playBtn.setInteractive()
            .on('pointerdown', () => {
                this.playBtn.setFrame(1);

            })
            .on('pointerup', () => {
                this.playBtn.setFrame(0);
                this.cameras.main.fade(1000);
                this.cameras.main.on('camerafadeoutcomplete', () => {
                    this.scene.start('MainScene');
                })
            });

            this.add.text(this.game.config.width * .5, this.game.config.height* 0.2,
                 'Pomóż odnaleźć Kubusiowi \nwszystkie misie', {align: 'center'}).setOrigin(0.5);
    }

    update() {
        this.mounatinsTileSprite.tilePositionX += 1;
        this.mounatins2TileSprite.tilePositionX += 1.3;
    }
}