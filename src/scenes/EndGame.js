import MainScene from "./MainScene";

export default class EndGame extends Phaser.Scene{
    constructor(){
        super('EndGame');
    }

    create(){

        this.add.text(this.game.config.width * .5, this.game.config.height * .2, 'Brawo!!!', { fontFamily: 'Anton', fontSize: '60px'}).setOrigin(0.5, 0.5).setDepth(1);
        this.restartButton = this.add.text(this.game.config.width * .5,this.game.config.height * .5,'Graj ponownie', {fontFamily: 'Anton'}).setOrigin(0.5,0.5);
        

        this.restartButton.setInteractive().once('pointerdown', ()=>{
            this.scene.start('MainScene');
        })
    }
}