const rest = require('restler');

let directions = [
  'north',
  'east',
  'south',
  'west'
];

let multi = [];
let moves = 0;

const maze = {

  go: function(){
    return maze.init()
    .then( maze.explore )
    .catch( console.error );
  },

  explore: function( cell ) {
    moves++;
    console.log( 'pos:', [ cell.x, cell.y ], 'total:', moves );
    if ( cell.atEnd === true ) {
      console.log( cell.note );
      return Promise.resolve();
    } else {
      let countUE = 0;
      let direction;
      let checkDirections = function( dir ) {
        if ( cell[dir] === 'UNEXPLORED' ) {
          direction = dir;
          countUE++;
        }
      };
      directions.forEach( checkDirections );
      if ( countUE > 1 ) multi.push( { x: cell.x, y: cell.y, mazeGuid: cell.mazeGuid } );
      if ( countUE > 0 ) {
        return maze.move( { direction: direction.toUpperCase(), mazeGuid: cell.mazeGuid } );
      } else {
        return maze.jump( multi.pop() );
      }
    }
  },

  move: function( data ){
    console.log( 'move', data.direction );
    return maze.api( 'move', data )
    .then( maze.explore );
  },

  jump: function( data ) {
    console.log( 'jump' );
    return maze.api( 'jump', data )
    .then( maze.explore );
  },

  init: function(){
    return maze.api( 'init' );
  },

  api: function( path, data ) {
    let host = 'epdeveloperchallenge.com'; // TODO : extract host
    let url = 'http://' + host + '/api/' + path;

    return new Promise(function(resolve, reject) {
      let req = ( data ) ? rest.post(url, { data: data }) : rest.post(url);
      req.on('complete', function(res) {
        if (res instanceof Error) {
          reject( res );
        } else {
          resolve( res.currentCell );
        }
      });
    });
  }

};

module.exports = maze;
