var chess = document.getElementById('chess');
var reset = document.getElementById("reset");
var logo = new Image();
logo.src = 'image/logo.jpg';
var context;
var me; //谁先下
var isAvailable; //记录棋子是否已经下过了
var winTactics; //三维数组来统计所有的赢法
var winCount; //共有多少种赢法
var myWin; //所有赢法的统计
var computerWin;
var over; //游戏是否结束
var tips; //弹窗的DOM元素

function init(){  //初始化
	//location.reload();
	me = true;  //黑棋先下
	isAvailable = new Array(15);  
	winTactics = [];  
	winCount = 0; 
	myWin = [];  
	computerWin = [];
	over = false; //游戏开始 

	context = chess.getContext('2d');
	context.clearRect(0,0,450,450);
	context.drawImage(logo,0,0,450,450);
	drawChessBoard(); //绘制棋盘
	for(var i=0; i<15; i++){
		isAvailable[i] = new Array(15);
	}
	computeWinTactics();
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

function computeWinTactics() {
	var i, j, k;
	//初始化
	for(i=0;i<15;i++){
		winTactics[i] = []; 
		for(j=0;j<15;j++){
			winTactics[i][j] = []; 
		}
	}
	//横向 
	for(i=0;i<15;i++){ 
		for(j=0;j<11;j++){ 
			for(k=0;k<5;k++){
				winTactics[i][j+k][winCount] = true; //第winCount中方法
			}
			winCount++;
		}
	}
	//纵向 
	for(i=0;i<15;i++){ 
		for(j=0;j<11;j++){ 
			for(k=0;k<5;k++){
				winTactics[j+k][i][winCount] = true; //第winCount中方法
			}
			winCount++;
		}
	}
	//对角线 
	for(i=0;i<11;i++){ 
		for(j=0;j<11;j++){ 
			for(k=0;k<5;k++){
				winTactics[i+k][j+k][winCount] = true; //第winCount中方法
			}
			winCount++;
		}
	}

	//反对角线 
	for(i=0;i<11;i++){ 
		for(j=4;j<15;j++){ 
			for(k=0;k<5;k++){
				winTactics[i+k][j-k][winCount] = true; //第winCount中方法
			}
			winCount++;
		}
	} 
	//初始化赢法的记录 如果等于5 就实现了 五连子
	for (i = 0; i < winCount; i++) {
		myWin[i] = 0;
		computerWin[i] = 0;
	};
}

function oneStep(i, j){
	var x = 15 + i * 30 ;
	var y = 15 + j * 30 ;
	context.lineWidth=0;
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

logo.onload = function(){
	init();
}

reset.onclick = function(){
	init();
}

chess.onclick = function(event){
	if( over ){  //游戏结束，直接返回
		return;
	}
	var x = event.offsetX;
	var y = event.offsetY; 
	var i = Math.round((x-15)/30);
	var j = Math.round((y-15)/30);
	if( isAvailable[i][j] ){ //如果这个位置下过了，直接返回
		//alert("下过棋的位置不能再下了，这么简单的规则你都不懂吗~~~~");
		tips = new Dialog();
		tips.open({ 
			title:"芬芬友情提示",
			content:"下过棋的位置不能再下了，这么简单的规则你都不懂吗~~~~",
			isShowCancel:false,
			okBtnTxt: "我记住啦"
		});
		return;
	}
	oneStep(i, j); 
	for (var k = 0; k < winCount; k++) {
		if(winTactics[i][j][k]){
			myWin[k]++;
			computerWin[k] = 6;
			if(myWin[k]==5){
				setTimeout(function(){
					tips = new Dialog();
					tips.open({ 
						title:"芬芬友情提示",
						content:"你好厉害，你赢了！",
						isShowCancel:true,
						okBtnTxt: "再来一局",
						okBtnFunc:init,
						cancelBtnTxt:"不玩了",
						cancelBtnFunc: leave
					}); 
				},300);
				over = true; 			
			} 
		}
	};
	if(!over){
		computerStep(); //计算机自动下棋
	}
} 

function computerStep() {
	var u=0,v=0,maxScore=0;
	var myScore, computerScore;
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if( isAvailable[i][j] ){ //如果这个位置下过了，进入下一次循环
				continue;
			}
			myScore = 0;  //i j 黑棋的得分
			computerScore = 0;  //i j 计算机的得分

			for (var k = 0; k < winCount; k++) {
			 	if(winTactics[i][j][k]){
			 		if(myWin[k]==1){
			 			myScore += 200; //权重参数，调整参数可以让计算机是攻击性的还是防守型的。
			 		}
			 		else if(myWin[k]==2){
			 			myScore += 400; //参数只是经验值，并不是最优的值
			 		}
			 		else if(myWin[k]==3){ //分两种情况:如果有白棋存在，权重就小一些。
			 			if(computerWin[k]==1){
			 				myScore += 1500;
			 			}
			 			else{
			 				myScore += 4000;
			 			}
			 		}
			 		else if(myWin[k]==4){ 
			 			myScore += 6000;
			 		}

			 		if(computerWin[k]==1){
			 			computerScore += 220;
			 		}
			 		else if(computerWin[k]==2){
			 			computerScore += 1000;
			 		}
			 		else if(computerWin[k]==3){
			 			computerScore += 3000;
			 		}
			 		else if(computerWin[k]==4){
			 			computerScore += 20000;
			 		}

			 		if(myScore>maxScore){ //计算机挡住黑棋的去路比较重要 
			 			u = i;
			 			v = j;
			 			maxScore = myScore;
			 		}

			 		if(computerScore>maxScore){ //计算机下自己的棋
			 			u = i;
			 			v = j;
			 			maxScore = computerScore;
			 		}
			 	} 
			}
		}	 
	}
	oneStep(u,v);
	for (var k = 0; k < winCount; k++) {
		if(winTactics[u][v][k]){
			computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k]==5){
				setTimeout(function(){
					tips = new Dialog();
					tips.open({ 
						title:"芬芬友情提示",
						content:"哈哈，芬芬赢了！",
						isShowCancel:true,
						okBtnTxt: "再来一局",
						okBtnFunc:init,
						cancelBtnTxt:"不玩了",
						cancelBtnFunc: leave
					}); 
				},300);
				over = true; 			
			} 
		}
	};	
}

//离开游戏
function leave(){
	tips = new Dialog();
	tips.open({ 
		title:"芬芬友情提示",
		content:"觉得这个Demo赞不赞？赞的话就去给芬芬一个好评吧！前往github给她一个star就好~~~",
		isShowCancel:true,
		okBtnTxt: "前往github",
		okBtnFunc: function(){ location.href = "https://github.com/wufenfen/Five_in_A_Row"; },
		cancelBtnTxt:"太差劲了",
		cancelBtnFunc: function(){location.href = "http://qian.163.com/";}
	}); 
}