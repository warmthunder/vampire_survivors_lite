const canvas = document.getElementById("canva");

canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');

let mousex = 0;
let mousey = 0;
let bullet_s = 3;
let bullet = false;
let bullet_c = 0;
let bullets = [];
let enemies = [];

let pdist = 0;
let hdist = 0;
let vdist = 0;

const player = new Player_Circle(innerWidth/2,innerHeight/2);
enemies.push(new Enemy());

let keys = [false, false, false, false, false];


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

if(event.key == ' '){
    
    bullets.push(new Bullet_Circle(player.x,player.y,5));
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
        c.arc(this.x,this.y,75,0,6.28);
        c.fill();
    }

    this.update = function(){
        if(keys[0]==true)
            this.y-=2;
        if(keys[1]==true)
            this.y+=2;
        if(keys[2]==true)
            this.x-=2;
        if(keys[3]==true)
            this.x+=2;
        

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
        c.fillStyle = '#ffffffff'
        c.arc(this.x,this.y,r,0,6.28);
        c.fill();
    }

    this.update = function(){ 
     if(this.bullet){   
    this.pdist = Math.sqrt((player.x-mousex)**2 + (player.y-mousey)**2);
    this.dx = 3*(mousex-x)/this.pdist;
    this.dy = 3*(mousey-y)/this.pdist;
      this.bullet = false;
    }


    this.x+=this.dx;
    this.y+=this.dy;

   
        this.draw();



    }





}

function Enemy(){
    this.x = Math.random()*innerWidth;
    this.y = Math.random()*innerHeight;

    this.draw = function(){
        c.beginPath();
        c.fillStyle = '#704115'
        c.arc(this.x,this.y,30,0,6.28);
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

let enemy = new Enemy();

function animate(){

//clear everything
c.clearRect(0,0,innerWidth,innerHeight);

//make player

player.update();

//enemy
if(enemies[0])
enemies[0].update();



for(let i =0; i<bullets.length;i++){
if(bullets[i])
{   
    bullets[i].update();
    if(enemies[0]&&detect(bullets[i].x, bullets[i].y, bullets[i].r, enemies[0].x,enemies[0].y, 30))
    {
        enemies.splice(0,1);
        bullets.splice(i,1);

    }
    
}
if(bullets[i] && (bullets[i].x>innerWidth || bullets[i].x<0 || bullets[i].y>innerHeight || bullets[i].y<0))
{
    bullets.splice(i,1);
}
}
    requestAnimationFrame(animate);
}

animate();