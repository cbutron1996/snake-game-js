// Snake Game with OOP
// Based on BlendyCat's Snake Game
// Source: https://BlendyCat.com/sourcecode/javascriptsnake/
//
// Updated with OOP design
// Some improvements

var width = 27; // 25x25 board
var height = 27; // 25x25 board
var snake; //storing global snake object
var food; //storing global food object
var int;
var interval = 100; // speed game plays at
var running = false; // pauses or plays game
var gameOver = false; // ends game if true
var score = 0; // current score
var increment = 4; // body and score increment amount

// basic game object
function GameObject(x,y,value) {
  this.x = x;
  this.y = y;
  this.value = value; // class attribute
  
  // update graphics and position
  this.update = function() {
    document.getElementById(this.x+"-"+this.y).setAttribute("class",this.value);
  }
  
  //change position
  this.changePos = function(nx,ny) {
    this.x = nx;
    this.y = ny;
  }
}

// snake head and body are seperated to allow game ending when head and body collide
// snake head object
function Head(x,y) {
  GameObject.call(this,x,y,"head");
  this.update = function() {
    // instead of iterating through the body and checking if it another object,
    // we simply check if the head is about to hit a body part by comparing
    // classes
    // Same for wall
    if(getClass(this.x,this.y) == "body" || getClass(this.x,this.y) == "wall") {
      gameOver = true;
      return;
    }
    document.getElementById(this.x+"-"+this.y).setAttribute("class","head");
  }
}
// snake body object
function Body(x,y) {
  GameObject.call(this,x,y,"body");
}

// food object
function Food(x,y) {
  GameObject.call(this,x,y,"food");
}

// snake object
function Snake() {
  this.head = new Head(1,1); // head
  this.body = []; // list of body objects
  this.bodyLength = 0; // length of body
  this.move = 0; // integer representing move
  // 0 = stop (default)
  // 1 = up
  // 2 = down
  // 3 = left
  // 4 = right
  
  // updates the snake and its components
  this.update = function() {
    if(this.head.x == food.x && this.head.y == food.y) {
      this.bodyLength += increment;
      score += increment;
      initFood();
    }
    
    for(var i = 0; i < this.body.length; i++) {
      this.body[i].update();
    }
    this.head.update();
    this.makeMove();
  }
  
  this.makeMove = function() {
    var newX = this.head.x;
    var newY = this.head.y;
    if(this.move == 1) { //up
      newY -= 1;
    } else if(this.move == 2) { //down
      newY += 1;
    } else if(this.move == 3) { //left
      newX -= 1;
    } else if(this.move == 4) { //right
      newX += 1;
    }
    this.grow(); //uses head's last x and y positions, must go before head changes position
    this.head.changePos(newX, newY); //must go after grow since it updates x and y
  }
  
  this.changeMove = function(move) {
    this.move = move;
  }
  
  this.grow = function() {
    var lx = this.head.x;
    var ly = this.head.y;
    this.body.push(new Body(lx,ly));
    if(this.body.length > this.bodyLength) {
      this.body.shift();
    }
  }
}

// runs the game
// uses BlendyCat's method
function run() {
  init();
  int = setInterval(gameLoop, interval);
}

// runs the game
// uses BlendyCat's method
function init() {
  running = true;
  initMap();
  snake = new Snake();
  initFood();
}

// slightly modified createMap method
function initMap() {
  document.write("<center><table>"); 
  for(var y = 0; y < height; y++) {
    document.write("<tr>"); 
      for(var x = 0; x < width; x++) {
        if(y == 0 || y == height-1 || x == 0 || x == width-1) 
          document.write("<td class='wall' id='"+ x + "-" + y + "'></td>"); 
        else 
          document.write("<td class='blank' id='"+ x + "-" + y + "'></td>"); 
      } 
      document.write("</tr>"); 
  } 
  document.write("</table></center>"); 
  document.write("<h1 id='score'>Score: " + score + "</h1>");
}

// BlendyCat's rand method
function rand(min, max) { 
    return Math.floor(Math.random() * (max - min) ) + min; 
}

// BlendyCat's method
function getClass(x,y) {
  return document.getElementById(x+"-"+y).getAttribute("class");
}

// slightly modified createFruit method
function initFood() {
  var found = false; 
  var x = 1;
  var y = 1;
  while(!found) { 
    x = rand(1,width-1); 
    y = rand(1,height-1); 
    if(getClass(x,y) == "blank") 
      found = true; 
  }
  food = new Food(x, y);
}

// BlendyCat's gameLoop method
function gameLoop() {
  if(running && !gameOver) {
    update();
  } else if(gameOver) {
    document.getElementById("game").innerHTML = "You lost.";
    clearInterval(int);
  }
}

// My own update method
function update() {
  // Sets ALL of the tds to blank
  // This is okay to do since snake and food objects are stored anyway
  // Simply update the snake and food objects on top of the blank tds
  for(var y = 1; y < height-1; y++) {
    for(var x = 1; x < width-1; x++) {
      document.getElementById(x+"-"+y).className = "blank";
    }
  }
  // Updates the snake and food on top of the blank tds
  snake.update();
  food.update();
  // Updates the score
  document.getElementById("score").innerHTML = "Score: " + score;
}

// BlendyCat's event/key listener
window.addEventListener("keypress", function key(){ 
    var keyCode = event.keyCode;
    var direction = snake.move;
    
    //if key is W set direction up 
    if(direction != 2 && (keyCode == 119 || keyCode == 87)) 
      snake.changeMove(1);
    //if key is S set direction down 
    else if(direction != 1 && (keyCode == 115 || keyCode == 83)) 
      snake.changeMove(2);
    //if key is A set direction left 
    else if(direction != 4 && (keyCode == 97 || keyCode == 65)) 
      snake.changeMove(3);
    //if key is D set direction right 
    else if(direction != 3 && (keyCode == 100 || keyCode == 68)) 
      snake.changeMove(4);
    else if(keyCode == 114 || keyCode == 82) 
      location.reload();
    if(!running) 
      running = true;
    else if(running && keyCode == 32) 
      running = false; 
});

run();