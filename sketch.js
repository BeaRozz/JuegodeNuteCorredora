var INTRO = 2;
var PLAY = 1;
var END = 0;
var gameState = INTRO;

var floor, floorImg;
var nutella, nuteRun, nuteJump; 
var nute, nuteintro1, nuteintro2, nuteLose;
var invisibleFloor;
var obstacle, obstacleGroup, obstacle1, obstacle2, obstacle3;
var points, pointGroup, point1, point2;
var score, distance, frame;
var instruction, instruction1, instruction2, instruction3;
var texting, text1, text2;


function preload(){
  
  floorImg = loadImage("fondo.jpeg");
  
  nuteRun = loadAnimation("perfil1.jpg", "perfil2.jpg", "perfil3.jpg", "perfil4.jpg", "perfil5.jpg");
  nuteJump = loadImage("jump.png");
  
  nuteintro1 = loadImage("intro1.jpeg");
  nuteintro2 = loadImage("intro2.jpeg");
  nuteLose = loadImage("lose.jpeg");
  
  obstacle1 = loadImage("books.png");
  obstacle2 = loadImage("box.png");
  obstacle3 = loadImage("broom.png");
  
  point1 = loadImage("bone.png");
  point2 = loadImage("fillet.png");
  
  text1 = loadImage("text1.png");
  text2 = loadImage("text2.png");
  
  instruction1 = loadImage("instruccion1.png");
  instruction2 = loadImage("instruccion2.png");
  instruction3 = loadImage("instruccion3.png");

  backgroundImg = loadImage("FondoPantalla.png");
}

function setup() {
 createCanvas(displayWidth, displayHeight);
  
  //mensaje
  console.log("Dato, esa es mi perrita, se llama Nutella");
  console.log("Gráficos raros pero es la mejor calidad que nute puede dar en movimiento jiji");
  
  floor = createSprite(displayWidth/2, displayHeight/2);
  floor.addImage("floor", floorImg);
  floor.scale = 0.6;
  
  nute = createSprite(displayWidth/2 + 200, displayHeight/2 + 10);
  nute.addImage("intro1", nuteintro1);
  nute.addImage("intro2", nuteintro2);
  nute.addImage("lose", nuteLose);
  nute.scale = 0.4;
  
  texting = createSprite(displayWidth/2 - 250, displayHeight/2);
  texting.addImage("primerTexto", text1);
  texting.addImage("últimoTexto", text2);
  texting.scale = 0.8
    
  instruction = createSprite(displayWidth/2 - 210, displayHeight/2 + 250);
  instruction.addImage("instruccion1", instruction1);
  instruction.addImage("instruction2", instruction2);
  instruction.addImage("instru", instruction3);
  instruction.scale = 0.8;
  
  nutella = createSprite(displayWidth/2 - 290, displayHeight/2 + 140);
  nutella.addAnimation("running", nuteRun);
  nutella.addAnimation("jump", nuteJump);
  nutella.scale = 0.6;
  nutella.setCollider("rectangle",0,0,270,150);
  nutella.debug = false;
  
  invisibleFloor = createSprite(displayWidth/2,displayHeight/2 +150,floor.width,10);
  invisibleFloor.visible = false;
  
  //creación de grupos
  obstacleGroup = createGroup();
  pointGroup = createGroup();
  
  score = 0;
  distance = 0;
}

function draw() {
  
  background(backgroundImg);
  //nute colisiona con el suelo invisible
    nutella.collide(invisibleFloor);
  
  if (gameState === INTRO) {
    nutella.visible = false;
    
    //mantiene las animaciones iniciales
    if (nute.scale === 0.3){
      nute.changeImage("intro1", nuteintro1);
      texting.changeImage("primerTexto", text1);
      instruction.changeImage("instruccion1", instruction1);
    }
    
    
    if (keyDown("R")){
      nute.changeImage("intro2", nuteintro2);
      nute.scale = 0.35;
      texting.visible = false;
      instruction.changeImage("instruction2", instruction2);
    }
    
    if (keyDown("enter")){
      gameState = PLAY;
    }
  }
  
  
  else if (gameState === PLAY) {
    nute.visible = false;
    instruction.visible = false;
    texting.visible = false;
    nutella.visible = true;
    
    /*movimiento del fondo
    floor.velocityX = -(4 + 3 * score/80);
    
    //reinicia la arena
    if (floor.x < 220){
      floor.x = 440;
    }*/
    
    nutella.changeAnimation("running", nuteRun)
    
    //salto cuando se precione la barra espaciadora
    if(keyDown("space") && nutella.y > displayHeight/2 - 100){
      nutella.velocityY = -22
      camera.position.x = displayWidth/2;
      camera.position.y = displayHeight/2;
    }
    
    //cambia la animación de nutella
    if(nutella.y < displayHeight/2 - 50){
      nutella.changeAnimation("jump", nuteJump);
    }
    
    //adición de la gravedad de nutella
    nutella.velocityY += 0.8;
    
    //se spawnean los obstáculos y premios
    spawner();
    
    //forma de ganar puntos
    if(pointGroup.isTouching(nutella)){
      score += 1;
      pointGroup.destroyEach();
    }
    distance += Math.round(getFrameRate()/60);
    
    //forma de perder
    if(obstacleGroup.isTouching(nutella)){ 
      gameState = END;
    }
    
  }
  
  
  else if (gameState === END){
    //cambio de pantalla
    floor.velocityX = 0;
    nutella.visible = false;
    obstacleGroup.destroyEach();
    pointGroup.destroyEach();
    
    
    nute.visible = true;
    texting.visible = true;
    instruction.visible = true;
    nute.changeImage("lose", nuteLose);
    nute.scale = 0.3;
    texting.changeImage("últimoTexto", text2);
    instruction.changeImage("instru", instruction3);
    texting.scale = 0.7;
    //texting.x = displayWidth/2 - ;
    
    if(keyDown("space")){
      gameState = INTRO;
      distance = 0;
      score = 0;
    }
    
    if(keyDown("R")){
      gameState = PLAY;
      distance = 0;
      score = 0;
    }
    
  }
  
  drawSprites();
  
  //scoring y distacia
    textSize(35);
    fill("yellow");
    text("Distancia: "+ distance,displayWidth/2 - 410,displayHeight/2 - 270);
    text("Premios: "+ score,displayWidth/2 - 410,displayHeight/2 - 240);
}
  

function spawner(){
  var rand = Math.round(random(1,3));
  
  if (frameCount%100 === 0){
    obstacle = createSprite(displayWidth - displayWidth/4, displayHeight/2 +140);
    obstacle.velocityX = -(8 + score/80);
    obstacle.scale = 0.4;

    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        obstacle.setCollider("rectangle",0,0,300,250);
        break;
      case 2: obstacle.addImage(obstacle2);
        obstacle.setCollider("rectangle",0,0,250,280)
        break;
      case 3: obstacle.addImage(obstacle3);
        obstacle.setCollider("rectangle",-150,200,200,200);
        obstacle.y = displayHeight/2 +100
        break;
      default: break;
    }
    
    //asiganndo un tiempo de vida
    obstacle.lifetime = 100;
    obstacle.debug = false;
    
    //ajuste de profundidad
    nutella.depth = obstacle.depth;
    nutella.depth += 1;
    
    //agregar al grupo
    obstacleGroup.add(obstacle);
  }
  
  var ran = Math.round(random(1,2))
  
  if (frameCount%250 === 0){
    points = createSprite(displayWidth - displayWidth/4, displayHeight/2 +140);
    points.velocityX = obstacle.velocityX
    
    switch (ran){
        case 1: points.addImage(point1);
          break;
        case 2: points.addImage(point2);
          break;
        default: break;
    }
    
    points.scale = 0.15;
    
    //asignación de tiempo de vida
    points.lifetime = 130;
    
    if (points.x === obstacle.x){
      points.x += 270;
    }
    
    //ajuste de profundidad
    points.depth = nutella.depth;
    points.depth += 1;
    
    //agregando a un grupo
    pointGroup.add(points);
    }
}