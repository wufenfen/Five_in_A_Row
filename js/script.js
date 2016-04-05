var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var logo = new Image();
logo.src = 'image/logo.jpg';
logo.onload = function(){
	context.drawImage(logo,0,0,450,450);
	drawChessBoard(); //绘制棋盘

	context.beginPath();
	context.arc(200,200,100,0,2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(200,200,50,200,200,20);
	gradient.addColorStop(0,"#0A0A0A");
	gradient.addColorStop(1,"#636363");
	context.fillStyle = gradient;
	context.fill();
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



