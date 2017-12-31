//in the js code, always p1 starts.


var game_mode = 1 ;  // 1 for single player 2 for double player 

var p1_color = 2; //  1 is red 2 is blue
var p2_color = 1;
var p1_name = "KHILADI 1";
var p2_name = "KHILADI 2";
var cur_player = -1;  //-1 for p2 1 for p1

var p1_timer_data = {sec_left:120,offset:0};
var p2_timer_data = {sec_left:120,offset:0};
var av_btns ;
//////ALL GAME VARIABLES ARE SET //////////////

document.onload =start_game();

function apply_game_setup()
{
	var p1_block = document.getElementById("p1-card");
	var p2_block = document.getElementById("p2-card");
	p1_timer_data.display = p1_block.getElementsByClassName("card-text")[0];
	p2_timer_data.display = p2_block.getElementsByClassName("card-text")[0];
	if(p1_color==2)
	{
		p2_block.classList.replace("card-blue","card-red");
		p1_block.classList.replace("card-red","card-blue");
	}
	p1_block.getElementsByClassName("card-title")[0].innerHTML = p1_name;
	p2_block.getElementsByClassName("card-title")[0].innerHTML = p2_name;
	show_time(p1_timer_data);	
	show_time(p2_timer_data);	
	//resume_timer(p1_timer_data);

}

function change_player()
{
	cur_player *= -1;
	if((cur_player==1 && p1_color==1) || (cur_player==-1 && p2_color==1))
	{
		for(var i = 0;i<av_btns.length;i++)
		{
			av_btns[i].classList.remove("btn-box-active-blue");
			av_btns[i].classList.add("btn-box-active-red");
		}
	}
	else{
		for(var i = 0;i<av_btns.length;i++)
		{
			av_btns[i].classList.remove("btn-box-active-red");
			av_btns[i].classList.add("btn-box-active-blue");
		}
	}


}

function time_up(timer_obj)
{
	clearTimeout(timer_obj.handler);
	console.log("Time up");
}

function show_time(timer_obj)
{
	var duration = timer_obj.sec_left;
	minutes = (duration / 60) | 0;
	seconds = (duration % 60) | 0;

	minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timer_obj.display.innerHTML = minutes + ":" + seconds;
    timer_obj.last_printed = duration;
    if(duration==0)
    	time_up(timer_obj);
}

function run_timer(timer_obj)
{
	timer_obj.last_start = Date.now();
	timer_obj.offset =0;
	if(timer_obj.last_printed>timer_obj.sec_left)
		show_time(timer_obj);
	timer_obj.handler = setInterval(function(){
		timer_obj.sec_left--;
		show_time(timer_obj);

		timer_obj.last_start = Date.now();
	},1000);
}



function resume_timer(timer_obj)
{
		timer_obj.last_start = Date.now();
		timer_obj.handler = setTimeout(function(){
			run_timer(timer_obj);
		},timer_obj.offset);
}

function pause_timer(timer_obj)
{
	clearTimeout(timer_obj.handler);
	if(timer_obj.offset ==0)
	{
		timer_obj.offset = 1000;
		timer_obj.sec_left--;
	}
	var delta_time = Date.now() - timer_obj.last_start;
	timer_obj.offset -= delta_time;
	if(timer_obj.offset<0)
		timer_obj.offset = 0;
}

function start_game(){
	av_btns = document.getElementsByClassName("btn-box");
	console.log(av_btns);
	apply_game_setup();
	change_player();

}


var game_matrix = [];

for(var i = 0;i<3;i++){
	game_matrix[i] = [0,0,0];
}

var btn_boxes = document.getElementsByTagName("button");
//console.log(btn_boxes);

function print_matrix()
{
	for(var i = 0;i<3;i++)
	{
		for(var j = 0;j<3;j++)
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

function toggle_state(obj) {
	if(3%2)
		obj.innerHTML = "<img src = 'o_space.png' style = 'max-width:90%'>";
	else
		obj.innerHTML = "<img src = 'x_space.png' style = 'max-width:70%'>";

	console.log(x,y);
	if (game_matrix[x][y]==0){
		game_matrix[x][y] = 1;
	}
	else
		game_matrix[x][y] = 0;
}

var cur_player = 1;  //1 means p1 -1 means p2
function catch_move()
{
	var btn_num = (this.id).match(/\d+/)[0];
	var x = Math.floor(btn_num/10) ;
	var y = btn_num%10;
	x = x-1;
	y = y-1;
	if(game_matrix[x][y]!=0)
		return;
	game_matrix[x][y] = cur_player;
	cur_player *= -1;
	toggle_state(this);


}
btn_boxes[0].addEventListener('click',function(){
	resume_timer(p1_timer_data);
});

btn_boxes[1].addEventListener('click',function(){
	pause_timer(p1_timer_data);
});

/*for(var i = 0;i<btn_boxes.length;i++)
{
	btn_boxes[i].addEventListener('click',catch_move);
}*/

