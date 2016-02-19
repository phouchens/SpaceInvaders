$(function main()  {

      var CANVAS_WIDTH = 480;
      var CANVAS_HEIGHT = 320;
      var FPS = 30;



        var starSize = 10;
        var columns = CANVAS_WIDTH/starSize; //number of columns for the stars
        //an array of drops - one per column
        var drops = [];
        //x below is the x coordinate
        //1 = y co-ordinate of the drop(same for every drop initially)
        for(var i = 0; i < columns; i++)
            drops[i] = 1;


      //player object
      var player = {

          color: "#00A",
          x: 50,
          y: 270,
          width: 20,
          height: 30,
          sprite: Sprite("player"),
          alive: true,

          draw: function() {
            this.sprite.draw(canvas, this.x, this.y);
          },

        };

      player.explode = function() {
          //Insert explosion and end game
          kill(player, enemies);
      }

      function kill(player, enemies){
          enemies.forEach(function(enemy){
              enemy.active=false;
            });
          player.alive=false;

       }



      var playerBullets = [];


      //bullet constructor to creat bullet instances
      function Bullet(I) {
          I.active = true;
         // I.speed = 5;
          I.xVelocity = 0;
          I.yVelocity = -I.speed - 20;
          I.width = 3;
          I.height = 3;
          I.color = "#ff9933";

          I.inBounds = function() {
            return I.x >= 0 && I.x <= CANVAS_WIDTH &&
              I.y >= 0 && I.y <= CANVAS_HEIGHT;
          };

          I.draw = function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
          };

          I.update = function() {
            I.x += I.xVelocity;
            I.y += I.yVelocity;

            I.active = I.active && I.inBounds();
          };

          I.explode = function() {
            this.active = false;
            // Extra Credit: Add an explosion graphic
          };

          return I;
        }



      enemies =[];

      function Enemy(I) {
          //sets I to the parameter supplied or an empty object if none are provided.
          I = I || {};
          I.active = true;
          I.age = Math.floor(Math.random() * 128);
          I.color = "#A2B";
          I.x = CANVAS_WIDTH/4 + Math.random() * CANVAS_WIDTH/2;
          I.y = 0;
          I.xVelocity = 0;
          I.yVelocity = 2;
          I.width = 32;
          I.height = 32;

          I.inBounds = function() {
              return I.x >= 0 && I.x <= CANVAS_WIDTH &&
                  I.y >= 0 && I.y <= CANVAS_HEIGHT;
          };
          I.sprite = Sprite("enemy");

          I.draw = function() {
            this.sprite.draw(canvas,this.x,this.y);
          };
          I.update = function() {
            I.x += I.xVelocity;
            I.y += I.yVelocity;
            I.xVelocity = 3 * Math.sin(I.age * Math.PI/65);
            I.age ++;
            I.active = I.active && I.inBounds();
          };

          I.explode = function() {
              this.active = false;
              //Insert explosion graphic
          }
          return I;
      }

      function collides(a,b){
          return ((a.x < b.x + b.width) &&
                 (a.x + a.width > b.x ) &&
                 (a.y < b.y + b.height) &&
                 (a.y+ a.height > b.y));
      }

      function handleCollision() {
          playerBullets.forEach(function(bullet) {
              enemies.forEach(function(enemy) {
                  if(collides(bullet, enemy)) {
                      enemy.explode();
                      bullet.active =false;
                  }
              });
          });

          enemies.forEach(function(enemy) {
              if(collides(enemy, player)) {
                  enemy.explode();
                  player.explode();
              }
          });
      }







      //convention develop in JavaScript to use the $() function as a shortcut way to refer to document.getElementById().
      // or $(x) is the equivalent to document.getElementById(x)
      var canvasElement = $("#myCanvas");

      //tells what type of canvas - 2d
      var canvas = canvasElement.get(0).getContext("2d");





      setInterval(function(){
          update();
          draw();
          drawStars();

          }, 1200/FPS);



      function update(){
          if(keydown.space) {
              player.shoot();
             //singleshot mode: keydown.space = false;

          }

          if(keydown.left) {
            player.x -= 5;
          }

          if(keydown.right) {
            player.x += 5;
          }

          player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);

          playerBullets.forEach(function(bullet) {
            bullet.update();
          });

          playerBullets = playerBullets.filter(function(bullet) {
            return bullet.active;
          });

          enemies.forEach(function(enemy) {
             enemy.update();
          });
          enemies = enemies.filter(function(enemy) {
              return enemy.active;
          });

          if (Math.random()< 0.1) {
              enemies.push(Enemy());
          }

          handleCollision();
      }

      //when a player shoots, creat a bullet instance and add it to collection
      player.shoot = function() {
          var bulletPosition = this.midpoint();

          playerBullets.push(Bullet({
            speed: 5,
            x: bulletPosition.x,
            y: bulletPosition.y
          }));
      };

      player.midpoint = function() {
          return {
            x: this.x + this.width/2,
            y: this.y + this.height/2
          };
        };

      function draw() {
          canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          if(player.alive=== true){
              player.draw();
          }

          playerBullets.forEach(function(bullet) {
            bullet.draw();
          });

          enemies.forEach(function(enemy) {
              enemy.draw();
          });
      }



     function drawStars() {
        //Black BG for the canvas
        //translucent BG to show trail
        canvas.fillStyle = "rgba(0, 0, 0, 0.05)";
        canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        canvas.fillStyle = "#fff"; //white stars
        //looping over drops
        for(var i = 0; i < drops.length; i++)
        {

            canvas.fillText(".", i*starSize, drops[i]*starSize);

            //sending the drop back to the top randomly after it has crossed the screen
            //adding a randomness to the reset to make the drops scattered on the Y axis
            if(drops[i]*starSize > CANVAS_HEIGHT && Math.random() > 0.975)
                drops[i] = 0;

            //incrementing Y coordinate
            drops[i]++;
        }
    }



})
