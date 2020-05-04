import MainScene from "./MainScene";

export default class EndGame extends Phaser.Scene{
    constructor(){
        super('EndGame');
    }

    create(){
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
        this.add.text(this.game.config.width * .5, this.game.config.height * .2, 'Brawo!!!', { fontFamily: 'Anton', fontSize: '60px'}).setOrigin(0.5, 0.5).setDepth(1);
        
        this.restartButton = this.add.sprite(this.game.config.width * .5, this.game.config.height* .5,'playAgain_button');        
        this.restartButton.setInteractive().once('pointerdown', ()=>{
            this.restartButton.setFrame(1);
            
         }).once('pointerup', ()=>{
             this.scene.start('MainScene');
             this.restartButton.setFrame(0);
         })
    }
    update(){
        this.mounatinsTileSprite.tilePositionX += 1;
        this.mounatins2TileSprite.tilePositionX += 1.3;
    }
}