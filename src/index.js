import Phaser from "phaser";
import MainScene from './scenes/MainScene.js';
import GameOver from './scenes/GameOver.js';
import EndGame from './scenes/EndGame.js';
import MainMenu from './scenes/MainMenu.js';



const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 360 ,
  height: 640,
  scene: [MainMenu, MainScene, GameOver, EndGame],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
},
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false
    }
  }

};

window.game = new Phaser.Game(config);
