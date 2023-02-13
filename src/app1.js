const leftScoreHTML = "left-score";
const rightScoreHTML = "right-score";
const winnerHTML = "who-won";

const WIDTH = 900;
const HEIGHT = 600;

const TOP = 0;
const BOTTOM = HEIGHT - 20;

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

function Paddle(posX, posY)
{   
    let initPos = {x:posX, y:posY};
    let pos = {x: posX, y: posY};

    this.draw = function()
    {
        rect(pos.x, pos.y, 10, 60);
    }

    this.moveUp = function()
    {
        if(pos.y - 5 > TOP) pos.y+= -5;
    }
    this.moveDown = function()
    {
        if(pos.y + 65 < HEIGHT) pos.y+= 5;
    }

    this.getPos = function()
    {
        return pos;
    }
    this.getSize = function()
    {
        return {x: 10, y: 60}
    }

    this.reset = function()
    {
        pos.x = initPos.x;
        pos.y = initPos.y;
    }
}

function Ball(Size)
{
    let size = Size;
    let pos = {x:WIDTH/2,y:HEIGHT/2 }

    const speed = 2;
    let velocity = {x: 0, y: 0}
    velocity.x = speed;
    velocity.y = Math.random(-speed, speed);
    console.log(velocity);


    this.draw = function()
    {
        square(pos.x, pos.y, size);
    }

    function isCol(objPos, objSize)
    {
        return pos.x - size/2 < objPos.x +objSize.x/2 && pos.x + size/2 > objPos.x - objSize.x/2 && pos.y - size/2 < objPos.y + objSize.y/2 && pos.y + size/2 > objPos.y - objSize.y/2;
    }

    this.checkCollision = function(left, right)
    {
        if(isCol(left.getPos(), left.getSize()))
        {
            pos.x += 10;
            velocity.x = -velocity.x;
        }
        else if(isCol(right.getPos(), right.getSize()))
        {
            pos.x -= 10;
            velocity.x = -velocity.x;
        }
    }

    this.getPos = function()
    {
        return pos;
    }

    function checkBounceOffWall()
    {
        if(pos.y > BOTTOM) velocity.y = -velocity.y;
        if(pos.y < TOP) velocity.y = -velocity.y;
    }

    this.reset = function()
    {
        pos.x = WIDTH/2;
        pos.y = HEIGHT/2;
        velocity.x = speed;
        velocity.y = Math.random(-speed, speed)*2;
    }

    this.update = function()
    {
        pos.x+=velocity.x;
        pos.y+=velocity.y;
        checkBounceOffWall();
    }
    
}


function Game()
{
    const leftPaddle = new Paddle(150, 240);
    const rightPaddle = new Paddle(750, 240);
    const ball = new Ball(10);

    let leftScore = 0;
    let rightScore = 0;

    function reset()
    {
        document.getElementById(leftScoreHTML).innerHTML = leftScore;
        document.getElementById(rightScoreHTML).innerHTML = rightScore;
        leftPaddle.reset();
        rightPaddle.reset();
        ball.reset();
    }

    function hasScored()
    {
        if(ball.getPos().x > RIGHTSCOREZONE)
        {
            leftScore++;
            reset();
        }
        if(ball.getPos().x  < LEFTSCOREZONE)
        {
            rightScore++;
            reset();
        }
    }
    
    function checkPlayerInputs()
    {
        if(keyIsDown(UP_ARROW))
        {
            rightPaddle.moveUp();
        }
        else if(keyIsDown(DOWN_ARROW))
        {
            rightPaddle.moveDown();
        }
        else if(keyIsDown(87))
        {
            leftPaddle.moveUp();
        }
        else if(keyIsDown(83))
        {
            leftPaddle.moveDown();
        }
    }
    this.update = function()
    {
        hasScored();
        if(leftScore === 10)
        {
            reset();
            document.getElementById(winnerHTML).innerHTML = "Player 1 has won the game!";
        }
        if(rightScore === 10)
        {
            reset();
            document.getElementById(winnerHTML).innerHTML = "Player 2 has won the game!";
        }

        checkPlayerInputs();
        drawMidline({x:WIDTH, y:HEIGHT});

        ball.update();
        ball.checkCollision(leftPaddle, rightPaddle);
        ball.draw();

        leftPaddle.draw();
        rightPaddle.draw();
        
        
    }
}

let game = new Game();

function setup()
{
    createCanvas(900, 600);
}

function draw()
{
    background(0);
    game.update();
}