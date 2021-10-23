import {AUTO} from 'phaser';
import create from './create';
import update from './update';
import preload from './preload';

var config = {
  type: AUTO,
  width: 375,
  height: 667,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

export default config;