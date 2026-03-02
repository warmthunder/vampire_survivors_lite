const canvas = document.getElementById("canva");

canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');
c.imageSmoothingEnabled = false;    // keep pixel art crisp

//gameover = 1, hp is zero
//gameover = 0, game is running
//gameover = 2, menu
//gameover = 3, level up
let gameover = 2;

let mousex = 0;
let mousey = 0;
let bullet = false;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let enemytime = 2;
let enemytimecooldown = 2;
let is_hit = 0;
// let shoot = 120;
let enemyCount = 0;
let mousebtn = false;
let score = 8;
let nextlevel = 10;
let levelup = false;
let animationID;
let paused = false;
let blr = false;
let playerdamage = 1;
let playerspeed = 200;
let shootcooldown = 0;
let cooldownshot = 0.5;
let enemyfirerate = 1.3;
let bullt = false;
let maxhp = 5;
let parry = false;

let bigboss;

let pdist = 0;
let hdist = 0;
let vdist = 0;

const player = new Player_Circle(innerWidth/2,innerHeight/2);
//enemies.push(new Grunt('#38184C88'));

let keys = [false, false, false, false];


canvas.addEventListener('mousedown',function(event){

    if(event.button == 0){ 
    mousebtn = true;
    if(!paused && gameover == 0)
    bullt = true;
}
    if(event.button == 2){
        parry = true;
    }
})

document.addEventListener('contextmenu', function(e) {
  e.preventDefault(); // Prevents the default context menu from appearing
});


canvas.addEventListener('mouseup',function(event){
    if(event.button == 0){
    mousebtn = false;
    bullt = false;
}

    if(event.button == 2){
        parry = false;
    }
})

window.addEventListener('resize', ()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;

})

window.addEventListener('keydown', function(event){

if(event.key == 'Escape'){
    if(paused){
        paused = false;
    }
        else
        paused = true;
    

}})


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

canvas.addEventListener('mousemove',function(event){

mousex = event.clientX;
mousey = event.clientY;

})

// Load image
const playerImage = new Image();
playerImage.src = 'player_sprite.png'; 

function Player_Circle(x,y){
    this.x = x;
    this.y = y;
    this.hp = 5;

    const size = 60; 
    const playerRadius = size / 2; 
    
    this.draw = function(){
        // c.beginPath();
        // c.fillStyle = '#1C646D'
        // c.arc(this.x,this.y,30,0,6.28);
        // c.fill();

        if (playerImage.complete) { // ensure image is loaded
            c.drawImage(playerImage, this.x - playerRadius, this.y - playerRadius, size, size);
        }
    }

    this.update = function(dt){
        if(keys[0]==true && this.y>0)
            this.y-=playerspeed * dt;
        if(keys[1]==true && this.y<innerHeight)
            this.y+=playerspeed * dt;
        if(keys[2]==true && this.x>0)
            this.x-=playerspeed* dt;
        if(keys[3]==true && this.x<innerWidth)
            this.x+=playerspeed * dt;       

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
    this.speed = 600;

    this.draw = function(){
        c.beginPath();
        c.fillStyle = '#a6fcdb'

        c.arc(this.x,this.y,r,0,6.28);
        c.fill();
    }

    this.update = function(dt){ 
        if(this.bullet){   
            this.pdist = Math.sqrt((this.x-x2)**2 + (this.y-y2)**2);
            this.dx = (x2-this.x)/this.pdist;
            this.dy = (y2-this.y)/this.pdist;
            this.bullet = false;
        }

        this.x += this.dx * this.speed * dt;
        this.y += this.dy * this.speed * dt;
        
        this.draw();
    }

}

function Grunt(color){
    
    this.whatiszero = Math.random()-0.5;
    this.x = Math.random()*innerWidth;
    this.y = Math.random()*innerHeight;
    this.speed = 100
    
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

    this.update = function(dt){
        this.pdist = Math.sqrt((player.x-this.x)**2 + (this.y-player.y)**2);
        this.dx = 1*(player.x-this.x)/this.pdist;
        this.dy = 1*(player.y-this.y)/this.pdist;

        this.x+=this.dx * this.speed * dt;
        this.y+=this.dy * this.speed * dt;
   
        this.draw();
    }
}

function Shooter(color){
    
    this.whatiszero = Math.random()-0.5;
    this.timer = enemyfirerate;
    this.x = Math.random()*innerWidth;
    this.y = Math.random()*innerHeight;
    this.speed = 100;
    
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

    this.update = function(dt){

        this.pdist = Math.sqrt((player.x-this.x)**2 + (this.y-player.y)**2);
        this.dx = 1*(player.x-this.x)/this.pdist;
        this.dy = 1*(player.y-this.y)/this.pdist;
        this.timer -= dt;
        
        this.x += this.dx * this.speed * dt;
        this.y += this.dy * this.speed * dt;

        if(this.timer<=0){
            enemyBullets.push(new Bullet_Circle(this.x,this.y,3,player.x,player.y))
            this.timer = enemyfirerate;
        }
   
        this.draw();
    }
}

function Boss(hp){

    this.whatiszero = Math.random()-0.5;
    this.hp = hp;
    this.intialhealth = hp;
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
        c.fillStyle = "#4d161aff"
        c.arc(this.x,this.y,35,0,6.28);
        c.fill();

        c.beginPath();
        c.strokeStyle = "#4ad645ff"
        c.arc(this.x, this.y, 40,0,(6.28*this.hp)/this.intialhealth);
        c.stroke();

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


function detect(x1,y1,r1,x2,y2,r2){
    return (Math.sqrt((y2-y1)**2 + (x2-x1)**2)<r2+r1 )

}


function animate(deltaTime = 0){
    //clear everything and changes canvas size
    c.clearRect(0,0,innerWidth,innerHeight);
    c.fillStyle = "#1F0802";
    c.fillRect(0,0,canvas.width,canvas.height);

    if(gameover == 0)
    {
        //hp text
        c.fillStyle = "#CEF09D"
        c.textAlign = 'right';
        c.textBaseline = 'top';
        c.font = "30px Arial"
        c.fillText(`HP: ${player.hp}`,canvas.width -30,30)
        c.fillText(`SCORE: ${score}`,canvas.width -30,70)
        c.fillText(`LEVEL UP: ${nextlevel}`,canvas.width -30,110)

        //update player
        player.update(deltaTime);

        //enemy bullets timer
        // shoot-=1;

    //spawn boss
    if(score%30==0 && !bigboss && score!=0){
        bigboss = new Boss(Math.floor(score/2));
    }

    if(bigboss){
        bigboss.update();
        if(is_hit<=0 && detect(bigboss.x,bigboss.y,35, player.x, player.y, 30 )){
            player.hp-=1;
            is_hit = 60;
            if (player.hp == 0)
                gameover = 1;
        }
    }

    //spawn enemy
    enemytime -= deltaTime;

    if(enemytime <= 0){
        if (enemyCount %3 == 0){
            enemies.push(new Shooter('#910332ff')) 
        }
        else{
            enemies.push(new Grunt('#dc7d1188')) 
        }
        enemyCount++;
        enemytime = enemytimecooldown;
    }

    // //spawn shooting enemies
    // if(shoot == 0 && enemies.length>0){
    //     for(let i = 0;i<enemies.length;i++){
    //         if(enemyCount%3 == 0){
    //     enemyBullets.push(new Bullet_Circle(enemies[i].x,enemies[i].y,3,player.x,player.y))
    //     }
    //     }
    //     shoot = 180;
    // }


    //invincibility 
    if(is_hit >0)
    is_hit -=1;

    //player shooting
    shootcooldown-=deltaTime;
    if(shootcooldown<0 && bullt){
        bullets.push(new Bullet_Circle(player.x,player.y,3, mousex, mousey));
        shootcooldown = cooldownshot;
    }

    //level up 
    if(score == nextlevel){
        nextlevel = nextlevel *2;
        gameover = 3;
    }

    for(let i = enemyBullets.length-1;i>=0;i--){        
        if (is_hit==0 && (detect(player.x, player.y, 30, enemyBullets[i].x,enemyBullets[i].y, 3)))
        {   
            if (parry){
                enemyBullets[i].dx *= -1;
                enemyBullets[i].dy *= -1
            }
            else{
                player.hp-=1;
                if(player.hp<=0)
                    gameover = true;
                is_hit = 60;
            }
        }
    }

    //enemy
    if(enemies.length>0){
        for(let i = 0; i<enemies.length;i++){
            enemies[i].update(deltaTime);
  
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
        if (
            enemyBullets[i].x > innerWidth ||
            enemyBullets[i].x < 0 ||
            enemyBullets[i].y > innerHeight ||
            enemyBullets[i].y < 0
        ) {
            enemyBullets.splice(i, 1);
            continue;
        }

        enemyBullets[i].update(deltaTime);
    }

    for(let i = bullets.length -1; i >=0 ;i--){
        
        if(bullets!= [])
        {   
            if((bullets[i].x>innerWidth || bullets[i].x<0 || bullets[i].y>innerHeight || bullets[i].y<0)){   
                bullets.splice(i,1);
                continue;
            }
            
            bullets[i].update(deltaTime);
            for(let a =enemies.length -1;a>=0;a--){
                if(detect(bullets[i].x, bullets[i].y, bullets[i].r, enemies[a].x,enemies[a].y, 15 ))
                {   
                    score+=1;
                    enemies.splice(a,1);
                    bullets.splice(i,1);   
                    break;
                }
                
                if(bigboss){
                    if(detect(bullets[i].x, bullets[i].y, bullets[i].r, bigboss.x,bigboss.y, 35)){
                        bigboss.hp -= playerdamage;
                        bullets.splice(i,1); 
                        if(bigboss.hp <=0){
                            score+=Math.floor(bigboss.intialhealth/2);
                        
                            bigboss = 0;
                        }
                        break;
                    }
                }   
            }   
        }
    }
    }

    else if (gameover == 1){

        score = 0;
        player.hp = 5;
        enemies = []
        enemyBullets = []
        player.x = innerWidth/2;
        player.y = innerHeight/2;

        c.fillStyle = "#CEF09D"
    c.textAlign = 'center';
    c.font = "80px Arial"
    c.fillText("GAME OVER",innerWidth/2,innerHeight/2-30)




    //restart button
    c.fillRect(innerWidth/2-200,innerHeight/2 + 70,400,50)

    c.fillStyle = "#38184C"
    c.textAlign = 'center';
    c.font = "40px Arial"
    c.fillText("PLAY",innerWidth/2,innerHeight/2+80)

    if(mousex>innerWidth/2-200 && mousex<innerWidth/2+200 && mousey>innerHeight/2 + 70 && mousey<innerHeight/2 + 120){
            
        if(mousebtn){
            gameover = 0;
        }  
    }  

    }

    else if(gameover ==2){
        c.fillStyle = "#CEF09D"
    c.textAlign = 'center';
    c.font = "80px Arial"
    c.fillText("SHOOTING BALLS",innerWidth/2,innerHeight/2 - 30)

        c.fillRect(innerWidth/2-200,innerHeight/2 + 30,400,50)


    c.fillStyle = "#38184C"
    c.textAlign = 'center';
    c.font = "40px Arial"
    c.fillText("PLAY",innerWidth/2,innerHeight/2+70)

    if(mousex>innerWidth/2-200 && mousex<innerWidth/2+200 && mousey>innerHeight/2 + 30 && mousey<innerHeight/2 + 80){

        if(mousebtn){
            gameover = 0;
        }

    }
    }

    else if(gameover==3){
        paused = true;
        levelup = true;
        blr = false;
    }

}

let lastTime = 0;
function gameloop(timestamp){
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if(!paused){

        if(blr){
            c.filter = 'none';
            blr = false;
        }
        animate(deltaTime);
    }
    
    else if(paused && gameover == 0){
        if(!blr){
            c.filter = 'blur(10px)';
            animate();
            blr = true;
        }

        c.filter = 'none';
        c.fillStyle = "#CEF09D"
        c.textAlign = 'center';
        c.font = "80px Arial"
        c.fillText("Paused",innerWidth/2,innerHeight/2 - 100)

        c.fillRect(innerWidth/2-200,innerHeight/2 + 30,400,50)


        c.fillStyle = "#38184C"
        c.textAlign = 'center';
        c.font = "40px Arial"
        c.fillText("PLAY",innerWidth/2,innerHeight/2+40)

        if(mousex>innerWidth/2-200 && mousex<innerWidth/2+200 && mousey>innerHeight/2 + 30 && mousey<innerHeight/2 + 80){
            if(mousebtn){
                paused = false;
            }
        }
    }

    else if(paused && levelup){
        if(!blr){
        c.filter = 'blur(10px)';
        animate();
        blr = true;
        }

        c.filter = 'none';
        
        //level up
        c.fillStyle = "#CEF09D"
        c.textAlign = 'center';
        c.font = "80px Arial"
        c.fillText("Level Up!",innerWidth/2,50);

        c.font = "40px Arial"
        c.fillText("Health Restored!",innerWidth/2,130)

        player.hp = maxhp;

        //options
        c.fillRect(innerWidth/4-200,innerHeight/4 + 30,400,50)
        c.fillRect(innerWidth/4-200,innerHeight*3/4 + 30,400,50)
        c.fillRect(innerWidth*3/4-200,innerHeight/4 + 30,400,50)
        c.fillRect(innerWidth*3/4-200,innerHeight*3/4 + 30,400,50)

        c.fillStyle = "#38184C"
        c.textAlign = 'center';
        c.font = "40px Arial"
        c.fillText("Increase Health!",innerWidth/4,innerHeight/4+40)
        
        c.fillStyle = "#38184C"
        c.textAlign = 'center';
        c.font = "40px Arial"
        c.fillText("Increase Damage!",innerWidth/4,innerHeight*3/4+40)

        c.fillStyle = "#38184C"
        c.textAlign = 'center';
        c.font = "28px Arial"
        c.fillText("Increase Enemy Spawn Rate!",innerWidth*3/4,innerHeight/4+40)

        c.fillStyle = "#38184C"
        c.textAlign = 'center';
        c.font = "40px Arial"
        c.fillText("Increase Shot-Speed!",innerWidth*3/4,innerHeight*3/4+40)

        if(mousex>innerWidth/4-200 && mousex<innerWidth/4+200 && mousey>innerHeight/4 + 30 && mousey<innerHeight/4 + 80){
        if(mousebtn){
                maxhp+= 1;
                paused = false;
                gameover = 0;
            }
        }

        if(mousex>innerWidth/4-200 && mousex<innerWidth/4+200 && mousey>innerHeight*3/4 + 30 && mousey<innerHeight*3/4 + 80){
            if(mousebtn){
                playerdamage +=1;
                paused = false;
                gameover = 0;
            }
        }
        
        if(mousex>innerWidth*3/4-200 && mousex<innerWidth*3/4+200 && mousey>innerHeight/4 + 30 && mousey<innerHeight/4 + 80){
            if(mousebtn){
                enemytimecooldown -= 0.1;
                paused = false;
                gameover = 0;
            }
        }
        if(mousex>innerWidth*3/4-200 && mousex<innerWidth*3/4+200 && mousey>innerHeight*3/4 + 30 && mousey<innerHeight*3/4 + 80){
            if(mousebtn){
                cooldownshot-=0.1;
                paused = false;
                gameover = 0;
            }
        }
    }

    requestAnimationFrame(gameloop);
}
requestAnimationFrame(gameloop);