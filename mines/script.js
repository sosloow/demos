(function(){
  var TILE_SIZE = 24,
      FIELD_SIZE =- 8,
      stage = new PIXI.Stage(0x66FF99, true),
      renderer = PIXI.autoDetectRenderer(TILE_SIZE * 8, TILE_SIZE * 8 + 150);
  document.getElementsByClassName('container')[0].appendChild(renderer.view);

  var assetsToLoader = ['tiles.json'],
     loader = new PIXI.AssetLoader(assetsToLoader);
	loader.onComplete = startGame;
	loader.load();

  function animate() {
    requestAnimFrame(animate);
    renderer.render(stage);
  }

  function startGame() {
    var field = [],
        i, j, x, y,
        texBase = PIXI.Texture.fromFrame('base'),
        texPressed = PIXI.Texture.fromFrame('base-pressed'),
        texFlag = PIXI.Texture.fromFrame('flag'),
        texMine = PIXI.Texture.fromFrame('mine'),
        texCount = [];

    for(i=0;i<=8;i++) {
      texCount.push(PIXI.Texture.fromFrame(i.toString()));
    }

    for (i=0;i<8;i++) {
      field.push(new Array);
      for (j=0;j<8;j++) {
        field[i].push(new PIXI.Sprite(texBase));
        field[i][j].mine = false;
        field[i][j].open = false;
        field[i][j].count = 0;
      }
    }

    for (i=0;i<=10;i++) {
      x = Math.floor(Math.random()*8);
      y = Math.floor(Math.random()*8);
      while(field[x][y].mine) {
        x = Math.floor(Math.random()*8);
        y = Math.floor(Math.random()*8);
      }
      field[x][y].mine = true;
    }

    for (i=0;i<8;i++) {
      for (j=0;j<8;j++) {
        if(!field[i][j].mine) {
          if(i>0 && j>0 && field[i-1][j-1].mine)
            field[i][j].count += 1;
          if(i>0 && j<7 && field[i-1][j+1].mine)
            field[i][j].count += 1;
          if(i<7 && j>0 && field[i+1][j-1].mine)
            field[i][j].count += 1;
          if(i<7 && j<7 && field[i+1][j+1].mine)
            field[i][j].count += 1;
          if(i>0 && field[i-1][j].mine)
            field[i][j].count += 1;
          if(j>0 && field[i][j-1].mine)
            field[i][j].count += 1;
          if(i<7 && field[i+1][j].mine)
            field[i][j].count += 1;
          if(j<7 && field[i][j+1].mine)
            field[i][j].count += 1;
        }
      }
    }

    for (i=0;i<8;i++) {
      for (j=0;j<8;j++) {
        field[i][j].position.x = TILE_SIZE * i;
        field[i][j].position.y = 150 + TILE_SIZE * j;
        field[i][j].interactive = true;
        field[i][j].buttonMode = true;
        field[i][j].i = i;
        field[i][j].j = j;
        field[i][j].click = field[i][j].tap = function() {
          var i = this.i, 
              j = this.j;
          if(field[i][j].mine)
            gameOver(field, i, j);
          else if (field[i][j].count==0)
            openCloseTiles(field, i, j);
          else {
            field[i][j].setTexture(texCount[field[i][j].count]);
            field[i][j].interactive = false;
          }
        };

        stage.addChild(field[i][j]);
      }
    }

    function openCloseTiles(field, i, j) {
      var tileStack = [[i,j]];

      while(tileStack.length) {
        var newPos, x, y,
            reachLeft = false, 
            reachRight = false;

        newPos = tileStack.pop();
        x = newPos[0];
        y = newPos[1];

        while(y-- > 0 && field[x][y].count==0) {}
        while(y++ < 7 && field[x][y].count==0) {
          field[x][y].setTexture(texCount[field[x][y].count]);
          field[x][y].interactive = false;
          if(x>0 && y>0) {
            field[x-1][y-1].setTexture(texCount[field[x-1][y-1].count]);
            field[x-1][y-1].interactive = false;
          }
          if(x>0) {
            field[x-1][y].setTexture(texCount[field[x-1][y].count]);
            field[x-1][y].interactive = false;
          }
          if(y>0) {
            field[x][y-1].setTexture(texCount[field[x][y-1].count]);
            field[x][y-1].interactive = false;
          }
          if(x>0 && y<7) {
            field[x-1][y+1].setTexture(texCount[field[x-1][y+1].count]);
            field[x-1][y+1].interactive = false;
          }
          if(x<7 && y>0) {
            field[x+1][y-1].setTexture(texCount[field[x+1][y-1].count]);
            field[x+1][y-1].interactive = false;
          }
          if(x<7 && y<7) {
            field[x+1][y+1].setTexture(texCount[field[x+1][y+1].count]);
            field[x+1][y+1].interactive = false;
          }
          if(x<7) {
            field[x+1][y].setTexture(texCount[field[x+1][y].count]);
            field[x+1][y].interactive = false;
          }
          if(y<7) {
            field[x][y+1].setTexture(texCount[field[x][y+1].count]);
            field[x][y+1].interactive = false;
          }

          if(x > 0) {
            if(field[x-1][y].count==0) {
              if(!reachLeft){
                tileStack.push([x-1,y]);
                reachLeft = true;
              }
            }
            else if(reachLeft)
              reachLeft = false;
          }

          if(x < 7) {
            if(field[x+1][y].count==0) {
              if(!reachRight) {
                tileStack.push([x+1,y]);
                reachRight = true;
              }
            }
            else if(reachRight)
              reachRight = false;
          }
          console.log(tileStack);
        }
      }
    }

    function gameOver(field, i, j) {
      stage.interactive = false;
      for (i=0;i<8;i++) {
        for (j=0;j<8;j++) {
          if (field[i][j].mine)
            field[i][j].setTexture(texMine);
        }
      }
    }

    requestAnimFrame(animate);
  }
})();
