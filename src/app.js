
const leftScoreHTML = "left-score";
const rightScoreHTML = "right-score";

const WIDTH = 900;
const HEIGHT = 600;

const TOP = 0;
const BOTTOM = HEIGHT;

const LEFTSCOREZONE = 100;
const RIGHTSCOREZONE = 800;

function drawMidline(obj)//draws the mid court line takes an obj that has the width(x) and height(y) of the canvas
{
    let lineWidth = 5;
    let lineHeight = 15;
    for(let i = 0; i < obj.y; i+=20)//i will be the y height we are drawing on || i changes by 20 to allow a gap between lines 
    {
        rect(obj.x/2, i, lineWidth, lineHeight);
    }
}


function PaddleObject(Width, Height, posx, posy)
{
    let width = Width;
    let height = Height;
    let posX = posx;
    let posY = posy;

    this.draw = function()
    {
        rect(posX, posY, width, height);
    } 

    this.updatePos = function(posx, posy)
    {
        posX = posx;
        posY = posy;
    }

    this.getPos = function()
    {
        return {x: posX, y: posY};
        
    }

    this.getSize = function()
    {
        return{x:width, y:height};
    }

}

function BallObject(Size, X, Y)
{
    let size = Size;
    let pos = {x:X, y:Y};
    let speed = 10;

    let velocity = {x: 0, y:0};//commiting crimes in both direction and magnitude
    velocity.x = Math.random(-speed, speed);
    velocity.y = Math.random(-speed, speed);

    this.draw = function()
    {
        square(pos.x, pos.y, size);
    }

    function checkBounceOffWall()
    {
        if(pos.y > BOTTOM) velocity.y = -velocity.y;
        if(pos.y < TOP) velocity.y = -velocity.y;
    }

    function isScoring()//is the ball in either of the scoring bounds || -1: no, 0: left has scored, 1: right has scored
    {
        if(pos.x < LEFTSCOREZONE) return 1;
        if(pos.x > RIGHTSCOREZONE) return 0;
        return -1;

    }

    function isCol(objPos, objSize)
    {
        return pos.x - size/2 < objPos.x +objSize.x/2 && pos.x + size/2 > objPos.x - objSize.x/2 && pos.y - size/2 < objPos.y + objSize.y/2 && pos.y + size/2 > objPos.y - objSize.y/2;
    }

    this.checkCollision = function(left, right)
    {
        if(isCol(left.getPos(), left.getSize()))
        {
            let yIntersect = (left.getPos().y - pos.y) / (left.getSize().y/2);

            let bounce = Math.map(yIntersect, 1, 1, 5 * PI/12, -5/12);



            velocity.x =  -speed* Math.cos(bounce);
            velocity.y =  -speed* Math.sin(bounce);

            pos.x = left.getPos().x - size/2 - left.getSize().x/2 - 1;
        }
        else if(isCol(right.getPos(), right.getSize()))
        {
            let yIntersect = (right.getPos().y - pos.y) / (right.getSize().y/2);

            let bounce = Math.map(yIntersect, 1, 1, 5 * PI/12, -5/12);



            velocity.x =  -speed* Math.cos(bounce);
            velocity.y =  -speed* Math.sin(bounce);

            pos.x = right.getPos().x - size/2 - right.getSize().x/2 - 1;
        }
    }

    this.update = function(onScore)
    {
        pos.x+= velocity.x;
        pos.y+= velocity.y;
        checkBounceOffWall();
        let hasScore = isScoring();
        if(hasScore != -1) onScore(hasScore);
        
    }

}

let EventArray = [];

let paddleLeft = new PaddleObject(10, 60, 150, 240);
let paddleRight = new PaddleObject(10, 60, 750, 240);
let ball = new BallObject(10, WIDTH/2, HEIGHT/2);


function updateGame()
{
    drawMidline();

    ball.update();
    ball.checkCollision(paddleLeft, paddleRight);
    ball.draw();

    paddleLeft.update();
    paddleLeft.draw();

    paddleRight.update();
    paddleRight.draw();
}




function setup()//this is the p5.js setup function || we don't really have to use this other than to setup the rendering object; we can initialize and use objects created outside of this function in the draw() function
{
    createCanvas(900, 600);
}

function draw()//this is the p5.js update function and game loop || this is where all game objects are drawn and the code to calc collision and handle user input are called
{
    background(3);
    drawMidline({x:900, y:600});
    paddleLeft.draw();
    paddleRight.draw();
    ball.draw();
    
}