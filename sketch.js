var PLAY = 1;
var END = 0;
var gameState = PLAY;

var test = "Mop.";

var YES = 1;
var NO = 0;
var air = NO;
var oldAir = NO;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var dieSound, jumpSound, checkPointSound;
var gameOverScreen, gameOverImage;
var restartScreen, restartImage;

var score;
var highScore;
var speed;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex1.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_air = loadAnimation("trex1.png")

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  
  restartImage = loadImage("restart.png");
  
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("air/running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;


  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;
  
  gameOverScreen = createSprite(300,75,300,100);
  gameOverScreen.addImage("gameOver", gameOverImage);
  gameOverScreen.visible = false;
  
  restartScreen = createSprite(300,125,2,2)
  restartScreen.addImage("restart", restartImage);
  restartScreen.visible = false;
  restartScreen.scale =0.5;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("rectangle", 0, 0, 70, 80);

  score = 1;
  speed = 1;
  highScore = 0;
}

function draw() {
  background(180);
  //displaying score
  text("high score " + highScore + "  Score: " + Math.round(score), 425, 50);

  //console.log("this is ", gameState)
  
  fill(0);
  text(test, 300, 100);


  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -6*speed;
    //scoring
    score = score + 1.5;
    if(Math.round(score)%1000 === 0 || Math.round(score)%1000-1 === 0){
      checkPointSound.play();
      
      
      speed = speed+0.5;
      
      
      cloudsGroup.setVelocityXEach(-3*speed);
      
      obstaclesGroup.setVelocityXEach(-6*speed);
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    if (trex.collide(invisibleGround)){air = NO;}
    else{air = YES;}
    if(oldAir < air){
      trex.changeAnimation("air/running");
      trex.addAnimation("air/running", trex_air);
    }else if(oldAir > air){
      trex.changeAnimation("air/running");
      trex.addAnimation("air/running", trex_running);
    }
    oldAir = air;

    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= 165) {
      trex.velocityY = -13;
      
      
      jumpSound.play();
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8;

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      
      
      dieSound.play();
      
      
      gameOverScreen.visible = true;
      restartScreen.visible = true;
      
      
      if(score > highScore){highScore = Math.round(score);}
    }
  } else if (gameState === END) {
    ground.velocityX = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.velocityY = 0;
    
    trex.changeAnimation("collided",trex_collided);
    
    if(mousePressedOver(restartScreen)){reset();}
  }


  //stop trex from falling down
  trex.collide(invisibleGround);



  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400, 165, 10, 40);
    obstacle.velocityX = -6*speed;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3*speed;

    //assign lifetime to the variable
    cloud.lifetime = 134;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset(){
  score = 1;
  speed = 1;
  
  
  cloudsGroup.destroyEach();
  
  obstaclesGroup.destroyEach();
  
  gameOverScreen.visible = false;
  restartScreen.visible = false;
  
  
  trex.y = 180;
  
  
  trex.changeAnimation("air/running",trex_running);
  
  
  gameState = PLAY;
}