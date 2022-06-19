let canvas;
let cvt;
let gbah = 20;
let gbaw = 12;
let Xstart = 4;
let YStart = 0;
let winOrLose = "....";
let cArr = [...Array(gbah)].map(e => Array(gbaw).fill(0));
let curTet = [[1,0], [0,1], [1,1], [2,1]];
let tets = [];
let tetColors = ['grey','pink','blue','black','orange','green','red'];
let curTetColor;
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordArray(){
    let xR = 0, yR = 19;
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        for(let x = 11; x <= 264; x += 23){
            cArr[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas(){
    canvas = document.getElementById('canvas');
    cvt = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;
    cvt.strokeStyle = 'black';
    cvt.strokeRect(8, 8, 280, 462);
    cvt.fillStyle = 'black';
    cvt.font = '21px Arial';
    cvt.fillText("Instructions: ", 300, 354);
    cvt.fillText("J : Move Left", 310, 388);
    cvt.fillText("L : Move Right", 310, 413);
    cvt.fillText("K : Move Down", 310, 438);
    cvt.fillText("I : Rotate Right", 310, 463);
    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();
    CreateCoordArray();
    DrawTetromino();
}

function DrawTetromino(){
    for(let i = 0; i < curTet.length; i++){
        let x = curTet[i][0] + Xstart;
        let y = curTet[i][1] + YStart;
        gameBoardArray[x][y] = 1;
        let coorX = cArr[x][y].x;
        let coorY = cArr[x][y].y;
        cvt.fillStyle = curTetColor;
        cvt.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(key){
    if(winOrLose != "Game Over"){
    if(key.keyCode === 74){
        direction = DIRECTION.LEFT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            Xstart--;
            DrawTetromino();
        }
    } else if(key.keyCode === 76) {
        direction = DIRECTION.RIGHT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            Xstart++;
            DrawTetromino();
        }
    } else if(key.keyCode === 75){MoveTetrominoDown();}
    else if(key.keyCode === 73){ RotateTetromino();}
    }
}

function MoveTetrominoDown(){
    direction = DIRECTION.DOWN;
    if(!CheckForVerticalCollison()){
        DeleteTetromino();
        YStart++;
        DrawTetromino();
    }
}

window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDown();
    }
  }, 400);

function DeleteTetromino(){
    for(let i = 0; i < curTet.length; i++){
        let x = curTet[i][0] + Xstart;
        let y = curTet[i][1] + YStart;
        gameBoardArray[x][y] = 0;
        let coorX = cArr[x][y].x;
        let coorY = cArr[x][y].y;
        cvt.fillStyle = 'white';
        cvt.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos(){
    tets.push([[1,0], [0,1], [1,1], [2,1]]);
    tets.push([[0,0], [1,0], [2,0], [3,0]]);
    tets.push([[0,0], [0,1], [1,1], [2,1]]);
    tets.push([[0,0], [1,0], [0,1], [1,1]]);
    tets.push([[2,0], [0,1], [1,1], [2,1]]);
    tets.push([[1,0], [2,0], [0,1], [1,1]]);
    tets.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino(){
    let randomTetromino = Math.floor(Math.random() * tets.length);
    curTet = tets[randomTetromino];
    curTetColor = tetColors[randomTetromino];
}

function HittingTheWall(){
    for(let i = 0; i < curTet.length; i++){
        let newX = curTet[i][0] + Xstart;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}

function CheckForVerticalCollison(){
    let tetsrominoCopy = curTet;
    let collision = false;
    for(let i = 0; i < tetsrominoCopy.length; i++){
        let square = tetsrominoCopy[i];
        let x = square[0] + Xstart;
        let y = square[1] + YStart;
        if(direction === DIRECTION.DOWN){
            y++;
        }
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            DeleteTetromino();
            YStart++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        if(YStart <= 2){
           cvt.fillText("GAME OVER", 310, 261)}
        else {
            for(let i = 0; i < tetsrominoCopy.length; i++){
                let square = tetsrominoCopy[i];
                let x = square[0] + Xstart;
                let y = square[1] + YStart;
                stoppedShapeArray[x][y] = curTetColor;
            }
            CheckForCompletedRows();
            CreateTetromino();
            direction = DIRECTION.IDLE;
            Xstart = 4;
            YStart = 0;
            DrawTetromino();
        }

    }
}

function CheckForHorizontalCollision(){
    var tetsrominoCopy = curTet;
    var collision = false;
    for(var i = 0; i < tetsrominoCopy.length; i++)
    {
        var square = tetsrominoCopy[i];
        var x = square[0] + Xstart;
        var y = square[1] + YStart;
        if (direction == DIRECTION.LEFT){
            x--;
        }else if (direction == DIRECTION.RIGHT){
            x++;
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];
        if (typeof stoppedShapeVal === 'string') {
            collision=true;
            break;
        }
    }

    return collision;
}

function CheckForCompletedRows(){
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for (let y = 0; y < gbah; y++) {
        let completed = true;
        for(let x = 0; x < gbaw; x++) {
            let square = stoppedShapeArray[x][y];
            if (square === 0 || (typeof square === 'undefined')) {
                completed=false;
                break;
            }
        }
        if (completed) {
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for(let i = 0; i < gbaw; i++){
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = cArr[i][y].x;
                let coorY = cArr[i][y].y;
                cvt.fillStyle = 'white';
                cvt.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score += 10;
        cvt.fillStyle = 'white';
        cvt.fillRect(310, 109, 140, 19);
        cvt.fillStyle = 'black';
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (var i = startOfDeletion-1; i >= 0; i--) {
        for(var x = 0; x < gbaw; x++) {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string') {
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;
                let coorX = cArr[x][y2].x;
                let coorY = cArr[x][y2].y;
                cvt.fillStyle = nextSquare;
                cvt.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = cArr[x][i].x;
                coorY = cArr[x][i].y;
                cvt.fillStyle = 'white';
                cvt.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotateTetromino() {
    let newRotation = new Array();
    let tetsrominoCopy = curTet;
    let curTetBU;

    for(let i = 0; i < tetsrominoCopy.length; i++) {
        curTetBU = [...curTet];
        let x = tetsrominoCopy[i][0];
        let y = tetsrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    try {
        curTet = newRotation;
        DrawTetromino();
    } catch (e) {
        if(e instanceof TypeError) {
            curTet = curTetBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

function GetLastSquareX() {
    let lastX = 0;
     for(let i = 0; i < curTet.length; i++) {
        let square = curTet[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}
