import {Math} from 'phaser';
import world from './world';

export default function create() {
  this.add.image(400, 300, 'sky');

  // 静态物理
  const platforms = this.physics.add.staticGroup();
  platforms.create(100, 200, "ground");
  platforms.create(300, 350, "ground");
  platforms.create(100, 500, "ground");
  platforms.create(100, 650, "ground");
  platforms.create(300, 650, "ground");

  // 活动物理
  const player = world.player = this.physics.add.sprite(100, 0, "dude");

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  // 添加星星
  const stars = world.stars = this.physics.add.group({
    key: "star",
    repeat: 8,
    setXY: { x: 12, y: 0, stepX: 40 },
  });

  stars.children.iterate(function (child: any) {
    child.setBounceY(Math.FloatBetween(0.4, 0.8));
  });


  // 计分
  world.scoreText = this.add.text(16, 16, `score: ${world.score}`, { fontSize: '24px', fill: 'red' });

  //炸弹
  const bombs = world.bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms);

  const hitBomb = () => {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    world.gameOver = true;
  }

  this.physics.add.collider(player, bombs, hitBomb, null, this);


  // 设置碰撞检测

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);

  const collectStar = function (player: any, star: any)
  {
      star.disableBody(true, true);
      world.score += 100; // 一个星星 100 分

      if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child: any) {
          child.enableBody(true, child.x, 0, true, true);
        });

        var x =
          player.x < 400
            ? Math.Between(400, 800)
            : Math.Between(0, 400);

        var bomb = world.bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
  }
  this.physics.add.overlap(player, stars, collectStar, null, this);
}