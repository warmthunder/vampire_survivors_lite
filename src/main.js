const canvas = document.getElementById("canva");

canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');

let gameover = false;



let mousex = 0;
let mousey = 0;
let bullet_s = 3;
let bullet = false;
let bullet_c = 0;
let bullets = [];
let enemies = [];
let enemytime = 1000;


let pdist = 0;
let hdist = 0;
let vdist = 0;

const player = new Player_Circle(innerWidth/2,innerHeight/2);
enemies.push(new Enemy());

let keys = [false, false, false, false];

window.addEventListener('click',function(){
    
    
    bullets.push(new Bullet_Circle(player.x,player.y,3));

})

window.addEventListener('keydown', function(event){

if(event.key == 'w'){
    keys[0] = true;

}
if(event.key == 's'){
  keys[1] = true;

}
if(event.key == 'a'){
    keys[2] = true;

}
if(event.key == 'd'){
    keys[3] = true;

}

})

window.addEventListener('keyup', function(event){

if(event.key == 'w'){
    keys[0] = false;

}
if(event.key == 's'){
  keys[1] = false;

}
if(event.key == 'a'){
    keys[2] = false;

}
if(event.key == 'd'){
    keys[3] = false;

}


})

window.addEventListener('mousemove',function(event){

mousex = event.clientX;
mousey = event.clientY;

})

function Player_Circle(x,y){
    this.x = x;
    this.y = y;
    

    this.draw = function(){
        c.beginPath();
        c.fillStyle = '#1C646D'
        c.arc(this.x,this.y,30,0,6.28);
        c.fill();
    }

    this.update = function(){
        if(keys[0]==true && this.y>0)
            this.y-=10;
        if(keys[1]==true && this.y<innerHeight)
            this.y+=10;
        if(keys[2]==true && this.x>0)
            this.x-=10;
        if(keys[3]==true && this.x<innerWidth)
            this.x+=10;
        

this.draw();

    }


}



function Bullet_Circle(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = 0;
    this.dy = 0;
    this.pdist = 0;
    this.bullet = true;

    this.draw = function(){
        c.beginPath();
        c.fillStyle = '#CEF09D'
        c.arc(this.x,this.y,r,0,6.28);
        c.fill();
    }

    this.update = function(){ 
     if(this.bullet){   
    this.pdist = Math.sqrt((player.x-mousex)**2 + (player.y-mousey)**2);
    this.dx = 14*(mousex-x)/this.pdist;
    this.dy = 14*(mousey-y)/this.pdist;
      this.bullet = false;
    }


    this.x+=this.dx;
    this.y+=this.dy;

   
        this.draw();



    }





}

function Enemy(){
    
    this.whatiszero = Math.random()-0.5;



    this.x = Math.random()*innerWidth;
    this.y = Math.random()*innerHeight;
//only spawn in the edge
    if(this.whatiszero>0)
    {   if(this.whatiszero>0.25)
        this.x = 0;
        else
            this.x = innerWidth;
    }
        else{
            if(this.whatiszero<-0.25)
        
            this.y = 0;
            else
                this.y = innerHeight;
        }
    this.draw = function(){
        c.beginPath();
        c.fillStyle = '#704115'
        c.arc(this.x,this.y,15,0,6.28);
        c.fill();
    }

this.update = function(){

    this.pdist = Math.sqrt((player.x-this.x)**2 + (this.y-player.y)**2);
    this.dx = 1*(player.x-this.x)/this.pdist;
    this.dy = 1*(player.y-this.y)/this.pdist;
      this.bullet = false;
    


    this.x+=this.dx;
    this.y+=this.dy;

   
        this.draw();
}
}

function detect(x1,y1,r1,x2,y2,r2){
    return (Math.sqrt((y2-y1)**2 + (x2-x1)**2)<r2+r1 )

}


//spawn enemies
setInterval(() => {
 enemies.push(new Enemy())   
}, enemytime);



function animate(){
    //clear everything
    c.clearRect(0,0,innerWidth,innerHeight);
if(!gameover)
{


//make player

player.update();




//enemy
if(enemies.length>0){
    for(let i = 0; i<enemies.length;i++){
    enemies[i].update();
    if (detect(player.x, player.y, 30, enemies[i].x,enemies[i].y, 15))
    {
    gameover = true;
}
    }

}



for(let i = bullets.length -1; i >=0 ;i--){
    
if(bullets!= [])
{   
    if((bullets[i].x>innerWidth || bullets[i].x<0 || bullets[i].y>innerHeight || bullets[i].y<0))
{   
    bullets.splice(i,1);
    continue;
}
    bullets[i].update();
    for(let a =enemies.length -1;a>=0;a--){
    if(detect(bullets[i].x, bullets[i].y, bullets[i].r, enemies[a].x,enemies[a].y, 15 ))
    {   
        
        enemies.splice(a,1);
        bullets.splice(i,1);   
        break;
        

    }
    
}
    
}



}

enemytime -=0.1;
    requestAnimationFrame(animate);
}

else{
    c.fillStyle = "#CEF09D"
c.textAlign = 'center';
c.font = "80px Arial"
c.fillText("GAME OVER",innerWidth/2,innerHeight/2)

c.textAlign = 'center';
c.font = "30px Arial"
c.fillText("Restart to Play Again",innerWidth/2 ,innerHeight/2+ 50)


}

}

animate();