const canvas = document.getElementById("canva");

canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');
let x = innerWidth/2;
let y = innerHeight/2;
let mousex = 0;
let mousey = 0;
let bullet_s = 3;
let bullet = false;
let bullet_c = 0;
let bullets = [];

let pdist = 0;
let hdist = 0;
let vdist = 0;
let dx = 0;
let dy = 0


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
    bullet = true;

    bullets.push(new Bullet_Circle(x,y,5))
    
    
    



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

if(event.key == ' '){
    bullet = true;
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
        c.arc(x,y,30,0,6.28);
        c.fill();
    }

    this.update = function(){
        if(keys[0]==true)
            y-=2;
        if(keys[1]==true)
            y+=2;
        if(keys[2]==true)
            x-=2;
        if(keys[3]==true)
            x+=2;
        

this.draw();

    }


}

function Bullet_Circle(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
    

    this.draw = function(){
        c.beginPath();
        c.fillStyle = '#ffffffff'
        c.arc(this.x,this.y,r,0,6.28);
        c.fill();
    }

    this.update = function(){ 
     if(bullet){   
    pdist = Math.sqrt((x-mousex)**2 + (y-mousey)**2);
    dx = 3*(mousex-x)/pdist;
    dy = 3*(mousey-y)/pdist;
      
        bullet = false;
    }


    this.x+=dx;
    this.y+=dy;

   
        this.draw();



    }





}

const player = new Player_Circle(x,y);
function animate(){

//clear everything
c.clearRect(0,0,innerWidth,innerHeight);

//make player
player.update();
if(bullets[0])
    
    bullets[0].update();



    requestAnimationFrame(animate);
}


animate();