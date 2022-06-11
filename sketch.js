//### Professora Carla Vasconcelos ###//
//Programando o jogo do trex deixando responsivo

/*declaramos variaveis com letra MAIÚSCULAS quando elas contém valores constantes que 
não podem mudar dentro do programa*/
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//declarando as variáveis
var trex ,trex_running, trex_collided;
var edges;
var ground, groundImage; //groun é o solo
var invisibleGround; //Solo invisível para retirar o bug o trex flutuando
var cloud, cloudImg;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver, restart, gameOverImg, restartImg;

var jumpSound, dieSound, checkPointSound;

var obstaclesGroup, cloudGroup;

score = 0;

//função para carregar as imagens no jogo
function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //crie um sprite de trex, adição de animação e escala
  trex = createSprite(50,height/2+140,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
 
  trex.scale = 0.6
  //criação das edges
  edges = createEdgeSprites();

  //criação do solo e adição de imagem
  ground = createSprite(width/2, height/2+150, width, 20);
  ground.addImage("ground", groundImage);
  ground.scale = 2;

  gameOver = createSprite(width/2,height/2 - 30);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.6;
  gameOver.visible = false;
   

  restart = createSprite(width/2, height/2 + 30);
  restart.addImage(restartImg);
  restart.scale = 0.6;
  restart.visible = false;

  invisibleGround = createSprite(width/2, height-145, width, 125);
  invisibleGround.visible = false; //.visible(booleano) permite que o sprite se torne visivel ou não.

  obstaclesGroup = new Group();
  cloudGroup = new Group();

  trex.setCollider("circle", 0, 0, 40) //alterar a forma do colisor
  //trex.debug = true; //mostra a colisor
  

}

function draw(){
  background(255)
  textSize(20);
  text("Pontuação: " + score, width-200, 50); //Usando a concatenação para somar uma string e uma variavel numerica. 
  

  //o if e o else if vão nos dar a condição de estado de jogo
  if(gameState === PLAY){ 
    //velocidade do solo 
    ground.velocityX = -(4 + 3*score/100); //velocidade negativa para ir para a esqueda
    /*a frameCout que conta toda a contagem de pontos,
    mesmo quando o gameState é end. então ela não é interessante aqui pq os quadros 
    vão continuar sendo contados*/

    /*já a getFrameRate() diferente da frameCout analisa a frequencia de quadros, e ela é 
    quase constante durante o jogo quando igual a 60. em alguns sistemas quando igual a 30*/

    score = score + Math.round(getFrameRate()/60); //só contamos os pontos no gameState === PLAY 

    if(score>0 && score % 100 ===0){ //adicionando o som do checkpoint
      checkPointSound.play();
    }
    //condição para o solo retornar
    if(ground.x<0){
      ground.x = ground.width/2;
    }

    //usando a linguagem condicional para programar o pulo 
    if(keyDown("space") && trex.y>=height-270){
      trex.velocityY = -10;
      jumpSound.play(); //adicionando o som do pulo 
    }
    //implementando a gravidade
    trex.velocityY = trex.velocityY + 0.8;

    spawClouds(); //gerar nuvens
    spawObstacles(); //gerar obstáculos

    //condição para o jogo acabar
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play(); //adicionando o som da morte hehe
      gameState = END;
    }


  }
  else if(gameState ===END){
    ground.velocityX = 0; //velocidade é 0 quando o o trex colide
    trex.velocityY = 0; 

    gameOver.visible = true;
    restart.visible = true;

    trex.changeAnimation("collided");
    //mudança de velocidade para grupos
    obstaclesGroup.setVelocityXEach(0); 
    cloudGroup.setVelocityXEach(0);
    //evita que os sprites que estão na tela morram.
    obstaclesGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);

    }
  
  //console.log(ground.x); //o console.log printa algo no console, nos mostra uma informação

 

  
  //colisão com a edges
  //trex.collide(edges[3]);
  trex.collide(invisibleGround); //colisão com o solo

  if(mousePressedOver(restart)){
    reset(); //função reset quando chamada retorna a configurações iniciais.
  }
  

  drawSprites();
}

//criação da função reset
function reset(){ 
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudGroup.destroyEach();

  trex.changeAnimation("running");
  score = 0;
}

function spawClouds(){ //função para a criação das nuvens

  //cloud = createSprite(600, 100, 40, 10);
  //cloud.velocityX = -3;    aqui teremos um problema, testa antes de fazer o código abaixo.

  if(frameCount % 60 === 0){  // nuvens vai aparecer a cada 60 quadros
    cloud = createSprite(width, 100, 40, 10);
    cloud.addImage(cloudImg);
    cloud.y = Math.round(random(20, height/2-100)); //usando uma altura aleatória na produção das nuvens
    //usando o round para não vir numeros decimais.ex.: 11,5
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    cloud.lifetime = 210; //tempo de vida da nossa nuvem
    //tempo = distancia/velocidade 600/3 = 200 (gosto de por 210 pq ver ela sumindo me irrita)

    cloud.depth = trex.depth
    trex.depth = trex.depth + 1; //deixando a profundidade mais coerente

    cloudGroup.add(cloud);

  }


}
function spawObstacles(){

  if(frameCount % 60 ===0){
    var obstacle = createSprite(width, height/2+150, 10, 40);
    obstacle.velocityX = -(6 + score/100) //arrumando aqui a velocidade dos cactos

    //gerar obstáculos aleatorios
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;

    }

    obstacle.scale = 0.6;
    obstacle.lifetime = 300; //tempo de vida da variavél para evitar o vazamento de memoria
    
    obstaclesGroup.add(obstacle);

  
  }
}
