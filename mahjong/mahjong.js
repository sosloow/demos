function extend(Child, Parent) {
  var F = function() {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.superclass = Parent.prototype;
}

var Tile = (function(){
  Tile = function (set, val) {
    var sets = 'man pin sou honor'.split(' '),
    honors = 'haku hatsu chun e s w n'.split(' ');

    this.set = set;
    this.val = val;
    this.weight = (sets.indexOf(set) + 1) * 10 +
      (set == 'honor' ? honors.indexOf(val) : val);
  };

  Tile.prototype.inPonWith = function(tile) {
    return (this.set == tile.set) && (this.val == tile.val)
  };
  
  Tile.prototype.inChiWith = function(tile) {
    return ((this.set == tile.set) && (this.set != 'honor') && 
            (tile.val == this.val + 1));
  };
  
  return Tile;

})();

var Tileset = (function() {
  Tileset = function() {this.tiles = []};

  Tileset.prototype.shuffle = function() {
    for (var i = this.tiles.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = this.tiles[i];
      this.tiles[i] = this.tiles[j];
      
      this.tiles[j] = temp;
    }
    return this.tiles;
  };

  Tileset.prototype.sort = function() {
    this.tiles.sort(function(a,b) {return a.weight - b.weight})
  };

  Tileset.prototype.push = function(tile) { return this.tiles.push(tile) };
  Tileset.prototype.pop = function() { return this.tiles.pop() };

  return Tileset;
})();

var Hand = (function () {
  Hand = function () {this.tiles = []; this.sets = []}

  extend(Hand, Tileset);

  Hand.prototype._findSets = function(){
    var i, j, k;
    var tiles = this.tiles
    
    for (i = 0; i < tiles.length; i++) {
      for (j = i + 1; j < tiles.length; j++) {
        if (tiles[i].inPonWith(tiles[j]) || tiles[i].inChiWith(tiles[j])) {
          for (k = j + 1; k < tiles.length; k++) {
            if ((tiles[i].inPonWith(tiles[j]) && tiles[j].inPonWith(tiles[k])) || 
                (tiles[i].inChiWith(tiles[j]) && tiles[j].inChiWith(tiles[k]))) {
              this.sets.push([tiles[i], tiles[j], tiles[k]]);
            }
          }
        }
      }
    }
    
    return this.sets
  }

  return Hand
})();

var Wall = (function () {
  
  Wall = function () {
    this.tiles = [];
    this._populate();
    this._imagefy();
    this.shuffle();
  };

  extend(Wall, Tileset);

  Wall.prototype._populate = function() {
    var sets = 'man pin sou honor'.split(' '),
    honors = 'haku hatsu chun e s w n'.split(' ');

    for (var i = 0; i < sets.length; i++) {
      if (sets[i] == 'honor') {
        for (var j = 0; j < honors.length; j++) {
          for (var k = 0; k < 4; k++) this.tiles.push(new Tile(sets[i], honors[j]));
        }
      } else {
        for (var j = 1; j < 10; j++) {
          for (var k = 0; k < 4; k++) this.tiles.push(new Tile(sets[i], j));
        }
      }
    }
  };

  Wall.prototype._imagefy = function() {
    var folder = 'images/64/', i, tile
    honorsImages = ['dragon-haku.png',  'dragon-hatsu.png', 'dragon-chun.png',
                         'wind-east.png', 'wind-south.png', 'wind-west.png', 'wind-north.png'];
    
    for (i = 0; i < this.tiles.length; i++) {
      tile = this.tiles[i]
      if (tile.set == 'honor') {
        tile.image = folder + honorsImages[tile.weight - 40];
      } else {
        tile.image = folder + tile.set + tile.val + '.png';
      }
    }
  }

  return Wall;
})();

var Player = function() {};

var Game = (function() {
  Game = function() {
    this.wall = new Wall;
    this.hand = new Hand;  
    
    for (var i = 0; i < 14; i++) this.hand.push(this.wall.pop());
    
    this.hand.sort();
  }
  
  Game.prototype.makeTurn = function(index) {
    this.hand.tiles.splice(index, 1);
    this.hand.tiles.push(this.wall.pop());
    this.hand.sort();
    
    for (var i = 0; i < 14; i++) {
      var img = document.getElementById('tile-' + i).firstChild;
      img.src = this.hand.tiles[i].image
    }
  };
  
  return Game
})();

var tileClick = function() {
  var table = document.getElementById('game-table');
  var index = parseInt(this.id.match(/\d+/)[0]);

  table.game.makeTurn(index)  
};

var init = function() {
  var table, spot, i;
  
  table = document.getElementById('game-table');
  table.game = new Game;
  table.tiles = table.game.hand.tiles;

  for (i = 0; i < table.tiles.length; i++) {
    spot = document.createElement('div');
    image = document.createElement('img');
    image.src = table.tiles[i].image;

    spot.className = 'tile';
    spot.id = 'tile-' + i;
    spot.onclick = tileClick;
    spot.appendChild(image)

    table.appendChild(spot);
  }
  console.log(table.tiles)
};

window.onload = function() {init()};
