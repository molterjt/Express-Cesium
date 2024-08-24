


function makeWayPoints() {
  const cartesianWaypoints = [
    {x: 1333998.4561492582, y: -4654044.842733646, z: 4138300.2386952764},
    {x: 1311946.9757094965, y: -4770987.009499258, z: 4011069.691734685},
    {x: 1286661.0733488963, y: -4884712.565445268, z: 3881133.808717352},
    {x: 1258226.5588350594, y: -4995090.37164822, z: 3748582.0230285856},
    {x: 1226733.7827791066, y: -5101993.159488983, z: 3613505.3853629464},
    {x: 1192277.4949906385, y: -5205297.6861177385, z: 3475996.4969977853},
    {x: 1154956.6975339456, y: -5304884.8840421075, z: 3336149.443043599},
    {x: 1114874.4927349589, y: -5400640.004733325, z: 3194059.725736717},
    {x: 1072137.9263882234, y: -5492452.7561569745, z: 3049824.197833359},
    {x: 1026857.826412375, y: -5580217.434145736, z: 2903540.9961576},
    {x: 979148.6372013139, y: -5663833.047541919, z: 2755309.4753492535},
  ];



const gltf = {
  asset: {
      version: "2.0"
  },
  accessors: [{
      bufferView: 0,
      componentType: 5126,
      count: cartesianWaypoints.length,
      type: "VEC3",
      max: [Math.max.apply(null, cartesianWaypoints.map(function(p) { return p.x; })), Math.max.apply(null, cartesianWaypoints.map(function(p) { return p.y; })), Math.max.apply(null, cartesianWaypoints.map(function(p) { return p.z; }))],
      min: [Math.min.apply(null, cartesianWaypoints.map(function(p) { return p.x; })), Math.min.apply(null, cartesianWaypoints.map(function(p) { return p.y; })), Math.min.apply(null, cartesianWaypoints.map(function(p) { return p.z; }))]
  }],
  bufferViews: [{
      buffer: 0,
      byteOffset: 0,
      byteLength: cartesianWaypoints.length * 12,
      target: 34962
  }],
  buffers: [{
      byteLength: cartesianWaypoints.length * 12,
      type: "arraybuffer",
      uri: "data:application/octet-stream;base64," + Buffer.from(new Float32Array(cartesianWaypoints.flatMap(function(p) { return [p.x, p.y, p.z]; })).buffer).toString('base64')
  }],
  meshes: [
    {
      primitives: [{
          attributes: {
              POSITION: 0
          },
          mode: 0
      }]
   }
  ],
  nodes: [
    {
      "matrix": [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      "children": [1]
    },
    {
      mesh: 0,
      // scale: [
      //   10,
      //   10,
      //   10
      // ],
    }
  ],
  scenes: [{
      nodes: [0]
  }]
};

const gltfString = JSON.stringify(gltf);

const fs = require('fs');
fs.writeFileSync('waypoints.gltf', gltfString);
console.log('made waypoints')

}
module.exports = makeWayPoints;