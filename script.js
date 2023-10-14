	var canvas=document.getElementById("canvas1");
	var ctx=canvas.getContext("2d");
// Get the form element
var nameForm = document.getElementById("nameForm");
/*ctx.beginPath();
ctx.rect(20,40,50,50);
ctx.fillStyle="#FF0000";
ctx.fill();
ctx.strokeStyle='rgba(0,0,255,0.5)';
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.arc(240,160,20,0,Math.PI*2,false);
ctx.fillStyle="green";
ctx.fill();
ctx.strokeStyle='rgba(0,0,255,0.5)';
ctx.stroke();
ctx.closePath();*/

var x=canvas.width/2;
var y=canvas.height-30;
var dx=2;
var dy=-2;
var ballRadius=5;
var paddleHeight=10;
var paddleWidth=75;
var paddleX=(canvas.width-paddleWidth)/2;
var rightPressed=false;
var leftPressed=false;
var brickRowCount=6;
var brickColumnCount=8;
var brickWidth=75;
var brickHeight=20;
var brickPadding=10;
var brickOffSetTop=30;
var brickOffSetLeft=30;
var score=0;
var lives=3;
var user;
var bricks=[];
var finalScore=0;

// Add an event listener to capture the username when the form is submitted
nameForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page
	
	var gameImage = document.getElementById("gameImage");
    gameImage.style.display = "none"; // Hide the image

    // Get the username entered by the user
    var usernameInput = document.getElementById("username");
    var username = usernameInput.value;

    // Hide the form after capturing the username
    nameForm.style.display = "none";

    // Display the username on the page
    var usernameDisplay = document.createElement("p");
    usernameDisplay.textContent = "Username: " + username;

    user=username;
    // Start the game with the captured username
    startGame(username);
	showTopScoresButton();
	
});

function startGame(username) {
    

    // Example of displaying the username on the canvas
    function drawUsername() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Username: " + username, 8, 40);
    }

    // The rest of your game code...

    // Call the drawUsername function to display the username on the canvas
   drawUsername();

	
for(let c=0;c<brickColumnCount;c++)
{
	bricks[c]=[];
	for(let r=0;r<brickRowCount;r++)
	{
		bricks[c][r]={x:0,y:0,status:1};
	}
}
    // Start the game loop only after capturing the username
    setInterval(draw, 16);
}



document.addEventListener("keydown",keyDownHandler);
document.addEventListener("keyup",keyUpHandler);

document.addEventListener("mousemove",mouseMoveHandler);

function mouseMoveHandler(e)
{
	var relativeX = e.clientX-canvas.offsetLeft;
	if(relativeX>0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2)
	{
		paddleX= relativeX-paddleWidth/2;
	}
}
function drawBricks()
{
	for(let c=0;c<brickColumnCount;c++)
	{
		for(let r=0;r<brickRowCount;r++)
		{
			if(bricks[c][r].status==1)
			{
			var brickX=(c*(brickWidth+brickPadding)+brickOffSetLeft);
			var brickY=(r*(brickHeight+brickPadding)+brickOffSetTop);
			bricks[c][r].x=brickX;
			bricks[c][r].y=brickY;
			
			ctx.beginPath();
			ctx.rect(brickX,brickY,brickWidth,brickHeight);
			ctx.fillStyle="#00095DD";
			ctx.fill();
			ctx.strokeStyle='rgba(0,0,255,0.5)';
			ctx.stroke();
			ctx.closePath();
			}

		}
	}
}
function keyDownHandler(e){
	if(e.keyCode==39)
	{
		rightPressed=true;
	}
	else if(e.keyCode==37)
	{
		leftPressed=true;
	}

}

function keyUpHandler(e){
	if(e.keyCode==39)
	{
		rightPressed=false;
	}
	else if(e.keyCode==37)
	{
		leftPressed=false;
	}

}

function drawBall()
{
	ctx.beginPath();
	ctx.arc(x,y,ballRadius,0,Math.PI*2);
	ctx.fillStyle="#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle()
{
	ctx.beginPath();
	ctx.rect(paddleX,canvas.height-(paddleHeight),paddleWidth,paddleHeight);
	ctx.fillStyle="#0095DD";
	ctx.fill();
	ctx.closePath();
}
function collisonDetection()
{
	for(var c=0;c<brickColumnCount;c++)
	{
		for(var r=0;r<brickRowCount;r++)
		{
			var b=bricks[c][r];
			if(b.status==1)
			{
				if(x>b.x && x< b.x+brickWidth && y>b.y && y< b.y+brickHeight )
				{
					dy=-dy;
					b.status=0;
					++score;
					if(brickColumnCount*brickRowCount==score)
					{
						alert("YOU WIN");
						captureFinalScore(); 
						document.location.reload();
					}

				}
			}
		}
	}
}

function drawScore()
{
	ctx.font="16px Arial";
	ctx.fillStyle="#0095DD";
	ctx.fillText("Score:"+score,8,20);
	ctx.fillText("Score:"+user,350,20);
	
}
function captureFinalScore() {
    finalScore=score;
     // Call the function to send data to the server
	 sendUserData(user, finalScore);
}
function sendUserData(username, score) {
    var data = {
        username: username,
        score: score
    };

    fetch("http://localhost:3000/api/submit-user-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        console.log("Server response:", data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

// Function to fetch and display the top scores
function fetchTopScores() {
	fetch("http://localhost:3000/api/top-scores")
	  .then((response) => {
		if (!response.ok) {
		  throw new Error('Network response was not ok');
		}
		return response.json();
	  })
	  .then((data) => {
		const topScoresTableBody = document.getElementById('topScoresTableBody');
		topScoresTableBody.innerHTML = ''; // Clear existing table data
		data.forEach((record) => {
		  const row = document.createElement('tr');
		  row.innerHTML = `<td>${record.username}</td><td>${record.score}</td>`;
		  topScoresTableBody.appendChild(row);
		});
	  })
	  .catch((error) => {
		console.error('Error:', error);
	  });
  }
  
 // Call the fetchTopScores function when the page loads
 fetchTopScores();

 // Add an event listener to show top scores when the button is clicked
 document.getElementById('showTopScoresButton').addEventListener('click', () => {
   fetchTopScores();
   showTopScoresTable();
 });

 function showTopScoresTable() {
	var table = document.getElementById('topScoresTable');
	table.style.display = 'table'; // Set the table to be displayed as a table
  }
   
 function showTopScoresButton() {
    var button = document.getElementById('showTopScoresButton');
    button.style.display = 'block'; // Show the button
}

function drawLives()
{
	ctx.font="16px Arial";
	ctx.fillStyle="#0095DD";
	ctx.fillText("Lives:"+lives,canvas.width-65,20);

}
function draw()
{
	ctx.clearRect(0,0,canvas.width,canvas.height)
	drawBricks();
	drawLives();
	drawBall();
	drawPaddle();
	drawScore();
	
	collisonDetection();

	if(y+dy < ballRadius){
			dy=-dy;
	}
	else if(y+dy > canvas.height-2*ballRadius)
	{

		if(x>paddleX && x<paddleX +paddleWidth)
		{
			dy=-dy;
		}
		else{
			lives=lives-1;
			if(!lives)
			{
				alert("GAME OVER");
				captureFinalScore();
		    	document.location.reload();
			}
			else
			{
				x=canvas.width/2;
				y=canvas.height-30;
				dx=2;
				dy=-2;
				 paddleX=(canvas.width-paddleWidth)/2;
			}
	    }
	}

	if((x+dx < ballRadius|| (x+dx > canvas.width-ballRadius)) ){
			dx=-dx;
	}
	if(rightPressed && paddleX <canvas.width-paddleWidth)
	{
		paddleX+=7;
	}
	else if(leftPressed && paddleX>0){
		paddleX-=7;
	}
	x += dx;
	y += dy;
}



