var game_matrix = [];

for(var i = 0;i<3;i++){
	game_matrix[i] = [0,0,0];
}


function toggle_state() {
	this.disabled = true;
	this.style.background ="#ffccff";
	var btn_num = (this.id).match(/\d+/)[0];
	var x = Math.floor(btn_num/10) ;
	var y = btn_num%10;
	x = x-1;
	y = y-1;
	if(x%2)
		this.innerHTML = "<img src = 'o_space.png' style = 'max-width:90%'>";
	else
		this.innerHTML = "<img src = 'x_space.png' style = 'max-width:70%'>";

	console.log(x,y);
	if (game_matrix[x][y]==0){
		game_matrix[x][y] = 1;
	}
	else
		game_matrix[x][y] = 0;
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

for(var i = 0;i<btn_boxes.length;i++)
{
	btn_boxes[i].addEventListener('click',toggle_state);
}

