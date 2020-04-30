import MainScene from "./MainScene";

export default class GameOver extends Phaser.Scene{
    constructor(){
        super('GameOver');
    }

    create(){

        this.add.text(this.game.config.width * .5,this.game.config.height * .2,'KONIEC GRY',{'fontSize': '60px', fontFamily: 'Anton'}).setOrigin(0.5,0.5);
        this.restartButton = this.add.text(this.game.config.width * .5,this.game.config.height * .5,'Graj ponownie', {fontFamily: 'Anton'}).setOrigin(0.5,0.5);
        

        this.restartButton.setInteractive().once('pointerdown', ()=>{
            this.scene.start('MainScene');
        })
    }
}