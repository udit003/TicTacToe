//in the js code, always p1 starts.


var game_mode = 1 ;  // 1 for single player 2 for double player 

var p1_color = 'red'; //  1 is red 2 is blue
var p2_color = 'blue';
var p1_name = "KHILADI 1";
var p2_name = "KHILADI 2";

var max_time = 600;


let game_matrix = [];

for(let i = 0;i<3;i++){
	game_matrix[i] = [0,0,0];
}


//////ALL GAME VARIABLES ARE SET //////////////

var av_btns,p1_obj,p2_obj,cur_player,next_player;


let game_theme = {red:function(){
	for(let i = 0;i<av_btns.length;i++)
		{
			av_btns[i].classList.add("btn-box-active-red");
		}
},blue:function(){
	for(let i = 0;i<av_btns.length;i++)
		{
			av_btns[i].classList.add("btn-box-active-blue");
		}
},nocolor:function(){
	for(let i = 0;i<av_btns.length;i++)
	{
		av_btns[i].classList.remove("btn-box-active-red");
		av_btns[i].classList.remove("btn-box-active-blue");
	}
}};

let add_icon = {red:function(){
	return "<img src = 'red.png' style = 'max-width:70%'>";
},blue:function(){
	return "<img src = 'blue.png' style = 'max-width:90%'>";
}};


function Timer(display){
	this.display = display;
	this.sec_left = max_time;
	this.offset = 0;
	this.show_time = function(){
		let duration = this.sec_left;
		minutes = (duration / 60) | 0;
		seconds = (duration % 60) | 0;

		minutes = minutes < 10 ? "0" + minutes : minutes;
   		 seconds = seconds < 10 ? "0" + seconds : seconds;

    	this.display.innerHTML = minutes + ":" + seconds;
    	this.last_printed = duration;
   		 if(duration==0)
    		this._timeUp();
	};


	this._timeUp = function(){
		clearTimeout(this._handler);
		console.log("Time UP");
	};

	//var _lastStart,_handler;   //they act as private variables to the class


	this._runTimer = function(){        //private helper method to the class
		this._lastStart = Date.now();
		this.offset =0;
	if(this.last_printed>this.sec_left)
		this.show_time();
	var temp_obj = this;
	this._handler = setInterval(function(){
		temp_obj.sec_left--;
		temp_obj.show_time();
		temp_obj._lastStart = Date.now();
	},1000);

	};

	this.resume_timer = function(){
		this._lastStart = Date.now();
		var temp_obj = this;
		 this._handler = setTimeout(function(){
			temp_obj._runTimer();
			},this.offset);
	};

	

	this.pause_timer = function(){
		clearTimeout(this._handler);
	if(this.offset ==0)
	{
		this.offset = 1000;
		this.sec_left--;
	}
	let delta_time = Date.now() - this._lastStart;
	this.offset -= delta_time;
	if(this.offset<0)
		this.offset = 0;
	}
}




function Player(color,player_id,name,score_card,automated  = false)
{
	this.score_card = score_card;
	this.player_id = player_id;
	this.automated = automated;
	this.name = name;
	this.color = color;
	this.timer = new Timer(score_card.getElementsByClassName("card-text")[0]);	

	//card set up part start
	this.score_card.classList.add('card-'+this.color);
	this.score_card.getElementsByClassName("card-title")[0].innerHTML = this.name;
	this.timer.show_time();
	// card set up part end

	this.made_a_move = function(btn){
		if(this.automated && this.last_chosen!=btn)
			return false;
		this.timer.pause_timer();
		game_theme['nocolor']();
		av_btns = av_btns.filter(cur_btn => cur_btn!=btn);
		btn.innerHTML = add_icon[this.color]();
		btn.classList.add('btn-box-dead-'+this.color);
		return true;
	};

	this.make_a_move = function(){
		this.timer.resume_timer();
		if(this.automated){
			let btn_chosen = this.generate_move(this.player_id);
			this.last_chosen = btn_chosen;
			btn_chosen.click();
		}
		else
		{
			game_theme[this.color]();
		}

	}

}



document.onload =start_game();

function apply_game_setup()
{
	let p1_block = document.getElementById("p1-card");
	let p2_block = document.getElementById("p2-card");
	p1_obj = new Player(p1_color,1,p1_name,p1_block);
	p2_obj = new Player(p2_color,2,p2_name,p2_block);
	cur_player = p1_obj;
	next_player = p2_obj;
	cur_player.make_a_move();

}

function start_game(){
	av_btns = document.getElementsByClassName("btn-box");
	av_btns = Array.from(av_btns);
	for(let i = 0;i < av_btns.length ; i++) {
		av_btns[i].addEventListener('click',catch_move);
	}
	apply_game_setup();
}

function print_matrix()
{
	for(let i = 0;i<3;i++)
	{
		for(let j = 0;j<3;j++)
			console.log(game_matrix[i][j]);
	}
}

function check_won(x)
{
	//check for row
	for(var i = 0;i<3;i++)
	{
		var cnt = 0;
		for(var j = 0;j<3;j++)
		{
			if(game_matrix[i][j]==x)
				cnt++;
			else
				break;
		}
		if(cnt==3)
			return true;
	}
	//check for columns
	for(var i = 0;i<3;i++)
	{
		var cnt = 0;
		for(var j = 0;j<3;j++)
		{
			if(game_matrix[j][i]==x)
				cnt++;
			else
				break;
		}
		if(cnt==3)
			return true;
	}

	//check for diagonal 
	var cnt = 0;
	for(var i = 0;i<3;i++)
	{
		if(game_matrix[i][i]==x)
			cnt++;
		else
			break;
	}
	if(cnt==3)
		return true;
	cnt = 0;
	for(var i = 0;i<3;i++)
	{
		if(game_matrix[i][2-i]==x)
			cnt++;
		else
			break;
	}
	if(cnt==3)
		return true;

	return false;
}


function catch_move()
{
	var btn_num = (this.id).match(/\d+/)[0];
	var x = Math.floor(btn_num/10) ;
	var y = btn_num%10;
	x = x-1;
	y = y-1;
	if(game_matrix[x][y]!=0)
		return;
	if(cur_player.made_a_move(this))
	{
		cur_player = [next_player , next_player = cur_player][0];
		game_matrix[x][y] = cur_player.player_id;
		let result = check_won(cur_player.player_id);
		if(result)
		{
			alert(next_player.name + "Won !!");
		}
		else
			cur_player.make_a_move();
	}
}

