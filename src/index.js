import Phaser from "phaser";
import MainScene from './scenes/MainScene.js';

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 640,
  scene: [MainScene],
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
