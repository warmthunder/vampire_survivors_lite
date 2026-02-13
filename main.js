const canvas = document.getElementById("canva");

canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');


//gameover = 1, hp is zero
//gameover = 0, game is running
//gameover = 2, menu

let gameover = 2;



let mousex = 0;
let mousey = 0;
let bullet = false;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let enemytime = 120;
let is_hit = 0;
let shoot = 120;
let enemyCount = 0;

let pdist = 0;
let hdist = 0;
let vdist = 0;

const player = new Player_Circle(innerWidth/2,innerHeight/2);
enemies.push(new Enemy('#704115'));

let keys = [false, false, false, false];



window.addEventListener('click',function(){
    
    bullets.push(new Bullet_Circle(player.x,player.y,3, mousex, mousey));

})

window.addEventListener('resize', ()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;

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
    this.hp = 5;
    

    this.draw = function(){
        c.beginPath();
        c.fillStyle = '#1C646D'
        c.arc(this.x,this.y,30,0,6.28);
        c.fill();
    }

    this.update = function(){
        if(keys[0]==true && this.y>0)
            this.y-=5;
        if(keys[1]==true && this.y<innerHeight)
            this.y+=5;
        if(keys[2]==true && this.x>0)
            this.x-=5;
        if(keys[3]==true && this.x<innerWidth)
            this.x+=5;
        

this.draw();

    }


}



function Bullet_Circle(x,y,r, x2, y2){
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
    this.pdist = Math.sqrt((this.x-x2)**2 + (this.y-y2)**2);
    this.dx = 14*(x2-this.x)/this.pdist;
    this.dy = 14*(y2-this.y)/this.pdist;
      this.bullet = false;
    }


    this.x+=this.dx;
    this.y+=this.dy;

   
        this.draw();

    }

}

function Enemy(color){
    
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
        c.fillStyle = color
        c.arc(this.x,this.y,15,0,6.28);
        c.fill();
    }

this.update = function(){

    this.pdist = Math.sqrt((player.x-this.x)**2 + (this.y-player.y)**2);
    this.dx = 1*(player.x-this.x)/this.pdist;
    this.dy = 1*(player.y-this.y)/this.pdist;
      
    


    this.x+=this.dx;
    this.y+=this.dy;

   
        this.draw();
}
}

function shooter(color){
    
    this.whatiszero = Math.random()-0.5;
    this.timer = 120;
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
        c.fillStyle = color
        c.arc(this.x,this.y,15,0,6.28);
        c.fill();
    }

this.update = function(){

    this.pdist = Math.sqrt((player.x-this.x)**2 + (this.y-player.y)**2);
    this.dx = 1*(player.x-this.x)/this.pdist;
    this.dy = 1*(player.y-this.y)/this.pdist;
    this.timer -= 1;
    


    this.x+=this.dx;
    this.y+=this.dy;


    if(this.timer<=0){
        enemyBullets.push(new Bullet_Circle(this.x,this.y,3,player.x,player.y))
        this.timer = 120;
    
    }
   
        this.draw();
}
}


function detect(x1,y1,r1,x2,y2,r2){
    return (Math.sqrt((y2-y1)**2 + (x2-x1)**2)<r2+r1 )

}


function animate(){
    //clear everything and changes canvas size
c.clearRect(0,0,innerWidth,innerHeight);

if(gameover == 0)
{

//hp text
c.fillStyle = "#CEF09D"
c.textAlign = 'right';
c.textBaseline = 'top';
c.font = "30px Arial"
c.fillText(`HP: ${player.hp}`,canvas.width -30,30)



//update player
player.update();

//enemy bullets timer
shoot-=1;

//spawn enemy
enemytime-=1;

if(enemytime <= 0){
    if (enemyCount %3 == 0){
 enemies.push(new shooter('#8B8000')) 
 enemyCount+=1;
    }
    else{
 enemies.push(new Enemy('#704115')) 
 enemyCount+=1;
}
enemytime = 120;
}

if(shoot == 0 && enemies.length>0){
    for(let i = 0;i<enemies.length;i++){
        if(enemyCount%3 == 0){
    enemyBullets.push(new Bullet_Circle(enemies[i].x,enemies[i].y,3,player.x,player.y))
    }
    }
    shoot = 180;
}


//invincibility 
if(is_hit >0)
is_hit -=1;

for(let i = enemyBullets.length-1;i>=0;i--){
    
            
if (is_hit==0 && (detect(player.x, player.y, 30, enemyBullets[i].x,enemyBullets[i].y, 3)))
    {   
        player.hp-=1;
        if(player.hp<=0)
            gameover = true;
        is_hit = 60;
}

}

//enemy
if(enemies.length>0){
    for(let i = 0; i<enemies.length;i++){
    enemies[i].update();

    
        
        
    if (is_hit==0 && (detect(player.x, player.y, 30, enemies[i].x,enemies[i].y, 15)))
    {   
        player.hp-=1;
        if(player.hp<=0)
            gameover = true;
        is_hit = 60;
}

    }
}


for(let i = enemyBullets.length -1;i>=0;i--){
    enemyBullets[i].update();
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

    requestAnimationFrame(animate);
}

else if (gameover == 1){
    c.fillStyle = "#CEF09D"
c.textAlign = 'center';
c.font = "80px Arial"
c.fillText("GAME OVER",innerWidth/2,innerHeight/2)

c.textAlign = 'center';
c.font = "30px Arial"
c.fillText("Restart to Play Again",innerWidth/2 ,innerHeight/2+ 70)


}


else if(gameover ==2){
    c.fillStyle = "#CEF09D"
c.textAlign = 'center';
c.font = "80px Arial"
c.fillText("SHOOTING BALLS",innerWidth/2,innerHeight/2 - 30)
}

}

animate();