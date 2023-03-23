/**
 * Cells workshop starter for IS51030B Graphics
 * Create a 3D sphere-shaped container of virtual "cells"
 * 
 * by Evan Raskob, 2021 <e.raskob@gold.ac.uk>
 */


// add a color property to the cell
// add a texture to the cell


let cells = []; // array of cells objects

/**
 * Initialise the cells array with a number of new Cell objects
 * 
 * @param {Integer} maxCells Number of cells for the new array
 * @returns {Array} array of new Cells objects 
 */
function createCellsArray(maxCells)
{
  // EXERCISE: finish this function. It should: 
  // Create an empty new array, fill it with maxCells number of cells, return the array
  // steps:
  // 1. create new variable for empty array (to return at end)
    let randCells = [];
    
  // 2. add a new Cell to the array *maxCells* times (for loop?)
    
for(let i = 0; i < maxCells; i++){     
    let cellsVector = new Cell(
        
  // 2b. maybe use random vectors for position and velocity
        
    {
        position: p5.Vector.random3D().mult(2), 
        diameter: random(5,40),
        // random life amount so they age at seperate times
        life: random(20,80)
    });
    
    //pushes cell to array
    randCells.push(cellsVector)     
    
   }  
    
  // 3. return the array variable
    
    return randCells;
}


/**
 * Exercise: draw each of the cells to the screen
 * @param {Array} cellsArray Array of Cell objects to draw 
 */
function drawCells3D(cellsArray){
  // Loop through the cells array, for each cell:
for (let cell of cellsArray){
       
    // 1. update the cell (call the update function)
    cell.update();
    // 2. draw the cell (first push the drawing matrix) 
    push();
    // 2.1. translate to cell's position
    translate(cell.getPosition());
    //rotate on X axis
    rotateX(millis() / 500);
    // 2.2 draws an eelipsoid with the cell diameter
    ellipsoid(30, cell.getDiameter() / 2, 40, 12, 2);
    // 2.3 pop the drawing matrix   
    pop();
   }
}



/**
 * Check collision between two cells (overlapping positions)
 * @param {Cell} cell1 
 * @param {Cell} cell2 
 * @returns {Boolean} true if collided otherwise false
 */
function checkCollision(cell1, cell2)
{
 // Exercise: finish this (see the online notes for a full explanation)
 //  
 // 1. find the distance between the two cells using p5.Vector's dist() function

//gets position of two cells and stores to variable
let vec1 = cell1.getPosition();
let vec2 = cell2.getPosition();
    
//finds distance between two cells
let distance = vec1.dist(vec2);
    
 // 2. if it is less than the sum of their radii, they are colliding
let radiusCell = (cell1.getDiameter() / 2) + (cell2.getDiameter() / 2);
 // 3. return whether they are colliding, or not 
    
    if (distance < radiusCell) {
	return true;
}
//return false if not colliding
return false;
}



/**
 * Collide two cells together
 * @param {Array} cellsArray Array of Cell objects to draw 
 */
function collideCells(cellsArray) 
{
  // 1. go through the array
  for (let cell1 of cellsArray)
  {
    for (let cell2 of cellsArray)
    {
      if (cell1 !== cell2) // don't collide with itself or *all* cells will bounce!
      {
        if (checkCollision(cell1,cell2)) {
          // get direction of collision, from cell2 to cell1
          let collisionDirection = p5.Vector.sub(cell1.getPosition(), cell2.getPosition()).normalize();
          cell2.applyForce(collisionDirection);
          cell1.applyForce(collisionDirection.mult(-3)); // opposite direction
        }
      }
    }
  }
}

/**
 * Constrain cells to sphere world boundaries.
 * @param {Array} cellsArray Array of Cell objects to draw 
 */
function constrainCells(cellsArray, worldCenterPos, worldDiameter) 
{
  // 1. go through the array
  for (let cell of cellsArray)
  {
    cell.constrainToSphere(worldCenterPos,worldDiameter);
  }
}

function handleLife(cellsArray)
{
    //iterates through cells array
    for(let i=0 ; i< cells.length; i++){
        //finds cells with life 0 or less
        if(cells[i]._life <= 0)
            //splice out cell if found
        cells.splice(i);
    }
        
}

function mitosis(cellsArray)
{
    //iterates through cells array
    for(let i = 0; i < cellsArray.length; i++){
        //if cell life is less that 10 and a random number is high than 0.95 creates new cell
        if (cellsArray[i]._life < 10 && random() > 0.95){
            
            let smallerCell = new Cell({
                position: p5.Vector.random3D().mult(2), 
                diameter: random(5,40),
                life: random(40,150)
            })
            //pushes new cell to array and splice 1 out
            cellsArray.push(smallerCell);
            cellsArray.splice(i, 1);
        }
    }
}

                          
function setup() {
  createCanvas(800, 600, WEBGL);

  
  // Exercise 1: test out the constructor function

//  let testCell = new Cell({
//    position: createVector(1,2,3),
//    velocity: createVector(-1,-2,-3)
//  });
//  
//  console.log("Testing cell:");
//  console.log(testCell);
    
// create a cell object with random properties

    
//   This is for part 2: creating a list of cells
   cells = createCellsArray(15);
   console.log(cells)
}


///----------------------------------------------------------------------------
/// p5js draw function 
///---------------------------------------------------------------------------
function draw() {

  orbitControl(); // camera control using mouse

  //lights(); // we're using custom lights here
  directionalLight(180,180,180, 0,0,-width/2);
  directionalLight(255,255,255, 0,0,width/2);
  
  ambientLight(60);
  pointLight(200,200,200, 0,0,0, 50);
  noStroke();
  background(80); // clear screen
  fill(220);
  ambientMaterial(150, 100, 150); // magenta material
  
  mitosis(cells);
  handleLife(cells);
  collideCells(cells); // handle collisions
  constrainCells(cells, createVector(0,0,0), width); // keep cells in the world
  drawCells3D(cells); // draw the cells

  // draw world boundaries
  ambientMaterial(120, 100, 150); // magenta material for subsequent objects
  sphere(width); // this is the border of the world, a little like a "skybox" in video games
}
