/**
 * A simple Snake game where the player controls the snake to eat food and avoid collisions.
 * The game includes functionality for pausing, restarting, and displaying a game-over message.
 * The snake also has eyes represented by two small dots.
 * @author MGC https://github.com/mgc-00/mgc-git-repo 07/02/2025
 */

let cols, rows;
let cellSize = 20;
let snake;
let food;
let paused = false;
let gameOver = false; // Variable to track the game-over state

function setup() {
  createCanvas(windowWidth * 0.9, windowHeight * 0.75); // Set canvas size
  cols = floor(width / cellSize); // Calculate number of columns based on canvas width
  rows = floor(height / cellSize); // Calculate number of rows based on canvas height
  frameRate(5); // Set the frame rate to control the snake's speed
  snake = new Snake(); // Initialize the snake
  spawnFood(); // Spawn the first piece of food
}

function draw() {
  background(0); // Set background color to black
  drawBorder(); // Draw the border around the game area

  // If the game is paused, display the pause message
  if (paused) {
    fill(255); // Set text color to white
    textSize(32);
    textAlign(CENTER, CENTER);
    text("🐍🐍🐍 GAME PAUSED 🐍🐍🐍", width / 2, height / 2);
    return; // Skip the rest of the drawing and updates when paused
  }

  // If the game is over, display the game-over message
  if (gameOver) {
    fill(255); // Set text color to white
    textSize(32);
    textAlign(CENTER, CENTER);
    text("🐍🐍🐍 GAME OVER! Press ENTER to restart 🐍🐍🐍", width / 2, height / 2);
    return; // Skip the rest of the drawing when the game is over
  }

  // Update and show the snake
  snake.update();
  snake.show();
  
  // Draw the food at its current position
  fill(255, 0, 0); // Set food color to red
  rect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function keyPressed() {
  // Change snake direction based on arrow key press
  if (keyCode === UP_ARROW && snake.ydir === 0) {
    snake.setDirection(0, -1);
  } else if (keyCode === DOWN_ARROW && snake.ydir === 0) {
    snake.setDirection(0, 1);
  } else if (keyCode === LEFT_ARROW && snake.xdir === 0) {
    snake.setDirection(-1, 0);
  } else if (keyCode === RIGHT_ARROW && snake.xdir === 0) {
    snake.setDirection(1, 0);
  }

  // Toggle pause state when the Space bar is pressed
  if (keyCode === 32) {
    paused = !paused;
    if (!paused) {
      loop(); // Resume the game
    } else {
      noLoop(); // Pause the game
    }
  }

  // Restart the game when Enter is pressed
  if (keyCode === ENTER && gameOver) {
    resetGame(); // Reset the game
  }
}

function spawnFood() {
  // Ensure food spawns within the playable area (not on the borders)
  food = createVector(floor(random(1, cols - 1)), floor(random(1, rows - 1)));
}

function drawBorder() {
  // Draw the border around the game area
  for (let i = 0; i < width; i += cellSize) {
    for (let j = 0; j < height; j += cellSize) {
      if (i < cellSize || i >= width - cellSize || j < cellSize || j >= height - cellSize) {
        fill((i + j) % 40 === 0 ? 'green' : 'black'); // Alternating border colors
        rect(i, j, cellSize, cellSize); // Draw each border cell
      }
    }
  }
}

class Snake {
  constructor() {
    // Initialize snake with a starting position and direction
    this.body = [createVector(4, 6)];
    this.xdir = 0;
    this.ydir = 1;
  }

  setDirection(x, y) {
    // Set the direction of the snake's movement
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    // Update the snake's position
    let head = this.body[0].copy(); // Copy the current head position
    head.x += this.xdir; // Move the head in the x direction
    head.y += this.ydir; // Move the head in the y direction
    
    if (this.checkCollision(head)) {
      gameOver = true; // Set game over state on collision
      noLoop(); // Stop the game by halting the draw loop
      console.log("Game Over");
      return;
    }
    
    this.body.unshift(head); // Add the new head to the body
    if (head.x === food.x && head.y === food.y) {
      spawnFood(); // Spawn a new piece of food if eaten
    } else {
      this.body.pop(); // Remove the last segment of the snake if no food was eaten
    }
  }

  checkCollision(pos) {
    // Check for collision with walls or the snake's body
    return pos.x < 0 || pos.y < 0 || pos.x >= cols || pos.y >= rows || this.body.some(seg => seg.x === pos.x && seg.y === pos.y);
  }

  show() {
    // Display the snake on the canvas
    fill(0, 255, 0); // Set snake color to green
    for (let i = 0; i < this.body.length; i++) {
      let part = this.body[i];
      rect(part.x * cellSize, part.y * cellSize, cellSize, cellSize); // Draw each part of the snake's body
    }
    
    // Add eyes to the snake's head
    let head = this.body[0];
    fill(255); // White color for eyes
    ellipse((head.x + 0.25) * cellSize, (head.y + 0.25) * cellSize, 5, 5); // Left eye
    ellipse((head.x + 0.75) * cellSize, (head.y + 0.25) * cellSize, 5, 5); // Right eye
    
    // Draw the mouth as a black circle underneath the eyes
    fill(0); // Black color for the mouth
    ellipse((head.x + 0.5) * cellSize, (head.y + 0.75) * cellSize, 8, 8); // Mouth (black circle)
  }
}

function resetGame() {
  // Reset game variables and state
  snake = new Snake();
  spawnFood();
  gameOver = false; // Set gameOver state to false
  paused = false; // Set paused state to false
  loop(); // Resume the game loop
}

function windowResized() {
  // Resize the canvas and adjust grid size when the window is resized
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.75);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
}
