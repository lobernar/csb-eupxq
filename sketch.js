/* eslint-disable no-undef, no-unused-vars 
Authors: Andrea Gonzato, Loïc Bernard

The basic idea if the code is the following:
  - Grouping the pixels in squares
  - Computing the nearest site/point to the square using the L_p norm
  - Color square and store it
  - Display the square
  - Repeat for every square

We chose to implement a brute force algorithm. An 
alternative would be Fortune's algorithm to compute
the Voronoi diagram but is is also way more difficult to
implement.

*/

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // generate a random color of the point r,g,b are in range [1, 255]
    this.r = int(Math.floor(Math.random() * 255)) + 1;
    this.g = int(Math.floor(Math.random() * 255)) + 1;
    this.b = int(Math.floor(Math.random() * 255)) + 1;
    this.isBlack = false;
  }

  setBlackColor() {
    this.isBlack = true;
  }

  draw() {
    if (this.isBlack) {
      fill(0, 0, 0);
    } else {
      fill(this.r, this.g, this.b);
    }
    ellipse(this.x, this.y, 4, 4);
  }
}

class Square {
  constructor(x, y, pointSite) {
    this.x = x;
    this.y = y;
    this.pointSite = pointSite;
  }
  draw() {
    noStroke();
    if (this.pointSite !== null) {
      fill(this.pointSite.r, this.pointSite.g, this.pointSite.b);
    } else {
      fill("black");
    }
    rect(this.x, this.y, SQUARE_SIZE, SQUARE_SIZE);
  }
  getCenterPoint() {
    return new Point(
      int(this.x + SQUARE_SIZE / 2),
      int(this.y + SQUARE_SIZE / 2)
    );
  }
  setPointSite(pointSite) {
    this.pointSite = pointSite;
  }
}

var SQUARE_SIZE = 5;
var points = [];
var squares = [];
var input;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Put setup code here
  fill("black");
  computeButton = createButton("Compute Voronoi diagram");
  cerbysevButton = createButton("Chebyshev");
  resetButton = createButton("Reset");
  reportButton = createButton("Report");

  let txt = createElement(
    "h3",
    "Enter a p-value to define a distance inducted by Lp norm"
  );
  txt.position(width / 2 - 70, 0);
  input = createInput();

  computeButton.position(width / 2, height / 6);
  cerbysevButton.position(width / 2 - 200, height / 6);
  resetButton.position(width / 2 + 200, height / 6);
  reportButton.position(0, 0);
  input.position(width / 2, height / 8);

  computeButton.mousePressed(assignPAndComputeVoronoi);
  cerbysevButton.mousePressed(LInfinityDistance);
  resetButton.mousePressed(reset);
  reportButton.mousePressed(loadReport);

  //test();
}

function test() {
  points.push(new Point(100, 200));
  points.push(new Point(300, 300));
  points.push(new Point(250, 500));
  points.push(new Point(400, 542));
  points.push(new Point(500, 500));
  points.push(new Point(784, 432));
  points.push(new Point(900, 525));
  points.push(new Point(1000, 700));
  points.push(new Point(1000, 600));
  points.push(new Point(1200, 455));
  points.push(new Point(1300, 700));
  points.push(new Point(89, 825));
  points.push(new Point(1200, 271));
  points.push(new Point(1300, 625));
  points.push(new Point(1500, 390));
  points.push(new Point(1700, 890));
  points.push(new Point(1800, 200));
}

function reset() {
  points = [];
  squares = [];
}

function draw() {
  // Put drawings here
  background("white");

  // draw all the squares
  for (i in squares) {
    squares[i].draw();
  }

  for (i in points) {
    points[i].draw();
  }
}

function mousePressed() {
  if (mouseOnButton(computeButton)) {
    return;
  }
  if (mouseOnButton(resetButton)) {
    return;
  }
  if (mouseOnButton(cerbysevButton)) {
    return;
  }
  if (mouseOnInput()) return;
  points.push(new Point(mouseX, mouseY));
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

function getNearestPt(centerPt, p) {
  let minDist = Infinity;
  let nearest;
  for (let i = 0; i < points.length; i++) {
    let currDist = distanceInducedByLP(points[i], centerPt, p);
    if (currDist < minDist) {
      minDist = currDist;
      nearest = points[i];
    }
  }
  return nearest;
}

function distanceInducedByLP(point1, point2, p) {
  if (p === Infinity) {
    return cerbysevDistance(point1, point2);
  }
  var dx = Math.abs(point2.x - point1.x);
  var dy = Math.abs(point2.y - point1.y);
  return Math.pow(Math.pow(dx, p) + Math.pow(dy, p), 1 / p);
}

function cerbysevDistance(point1, point2) {
  var dx = Math.abs(point2.x - point1.x);
  var dy = Math.abs(point2.y - point1.y);
  return max(dx, dy); // cerbysev distance formula
}

function LInfinityDistance() {
  p = Infinity;
  computeVoronoi(p);
}

function assignPAndComputeVoronoi() {
  let p = Number(input.value());

  // set default value of p
  if (isNaN(p) || p <= 0) {
    p = 2;
  }

  computeVoronoi(p);
}

function computeVoronoi(p) {
  // Compute Voronoi regions
  for (let i = 0; i < height; i += SQUARE_SIZE) {
    for (let j = 0; j < width; j += SQUARE_SIZE) {
      let square = new Square(j, i, null);
      let nearestSite = getNearestPt(square.getCenterPoint(), p);
      square.setPointSite(nearestSite);
      squares.push(square);
    }
  }

  // change the color of the points to black
  points.forEach((point) => {
    point.setBlackColor();
  });
}

// return true if the mouse is on the given button
function mouseOnButton(button) {
  if (
    (mouseX >= button.x) &
    (mouseX <= button.x + button.width) &
    (mouseY > button.y) &
    (mouseY < button.y + button.height)
  ) {
    return true;
  } else {
    return false;
  }
}

function mouseOnInput() {
  if (
    (mouseX >= input.x) &
    (mouseX <= input.x + input.width) &
    (mouseY > input.y) &
    (mouseY < input.y + input.height)
  ) {
    return true;
  } else {
    return false;
  }
}

function loadReport() {
  window.open("report.html", "_self");
}
