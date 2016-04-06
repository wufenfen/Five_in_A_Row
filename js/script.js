var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var logo = new Image();
logo.src = 'image/logo.jpg';
var me = true; //我先下 我是黑棋
var isAvailable = new Array(15); //记录棋子是否已经下过了

logo.onload = function(){
	context.drawImage(logo,0,0,450,450);
	drawChessBoard(); //绘制棋盘
	for(var i=0; i<15; i++){
		isAvailable[i] = new Array(15);
	}
}

chess.onclick = function(event){
	var x = event.offsetX;
	var y = event.offsetY; 
	var i = Math.round((x-15)/30);
	var j = Math.round((y-15)/30);
	oneStep(i, j); 
}

function drawChessBoard(){	
	context.strokeStyle = '#BFBFBF';
	for (var i = 0; i < 15; i++) {
		context.moveTo(15+30*i,15);
		context.lineTo(15+30*i,435);
		context.stroke();

		context.moveTo(15, 15+30*i);
		context.lineTo(435,15+30*i);
		context.stroke();
	};
}

function oneStep(i, j){
	if( isAvailable[i][j] ){ //如果这个位置下过了，直接返回
		return;
	}

	var x = 15 + i * 30 ;
	var y = 15 + j * 30 ;
	context.beginPath();
	context.arc(x,y,13,0,2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(x+2,y-2,13,x+2,y-2,0);
	if(me){
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,"#636766");
		isAvailable[i][j] = 1;
	}
	else{
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
		isAvailable[i][j] = 2;
	}
	me = !me;
	context.fillStyle = gradient;
	context.fill();
}

