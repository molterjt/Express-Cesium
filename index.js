const fs = require('fs');
const express = require('express');
const app = express();
const makeWayPoints = require('./utils')
const cors = require('cors')
app.use(cors({
  origin: ['http://localhost:8080'],
  methods: ['GET', 'POST'],
  // allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/gltf', (req, res) => {
  res.sendFile('./points.gltf', { root: '.'})
})

app.get('/gltf2', (req, res) => {
  res.sendFile('./waypoints.gltf', { root: '.'})
})

// Endpoint to read a file
app.get('/readfile', (req, res) => {
    fs.readFile('./points.gltf', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        res.send(data);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Latitude and longitude of Miami, FL
const miamiLatitude = 25.7617;
const miamiLongitude = -80.1918;

// const vertices = [
//   980055, -5663187, 2756307,
//   981962.726401046, -5462550.573886704, 2757309.1282505183,
//   989870.2042444095, -5631913.297220479, 2758311.0084854984,
//   // 982777.4593705342, -5661275.702611342, 2759312.809105286,
//   // 983684.4916680276, -5660637.7901359005, 2760314.5300792516,
//   // 984591.3010255323, -5659999.559870797, 2761316.1713767652,
//   // 985497.8873317075, -5659361.011892715, 2762317.7329672007,
//   // 986404.2504752476, -5658722.146278373, 2763319.214819935,
//   // 987310.3903448696, -5658082.963104533, 2764320.616904344,
//   // 988216.3068293127, -5657443.462447997, 2765321.939189809,
// ]
const vertices = [
  // 1, 0, 0,
  // 0, 1, 0,
  0, 0, 0,
  0.5, 0, 0.5,
  1, 0, 1,
  1.5, 0, 1.5,
]

const indexes = [0, 1, 2, 3]

const UNSIGNED_SHORT_BYTES = 2;
const FLOAT_BYTES = 4;
const verticesBytes = vertices.length * FLOAT_BYTES;
const indexesBytes = indexes.length * UNSIGNED_SHORT_BYTES;
const remainder = indexesBytes % FLOAT_BYTES
const paddingBytes = remainder ? FLOAT_BYTES - remainder : 0;
const byteLength = indexesBytes + paddingBytes + verticesBytes;
const buffer = new ArrayBuffer(byteLength);
const dat = new DataView(buffer, 0, byteLength);

for (let i = 0; i < indexesBytes; i+= UNSIGNED_SHORT_BYTES) {
  dat.setUint16(i, indexes[i / UNSIGNED_SHORT_BYTES], true);
}

for (let j = indexesBytes + paddingBytes; j < byteLength; j += FLOAT_BYTES) {
  dat.setFloat32(j, vertices[(j - indexesBytes - paddingBytes) / FLOAT_BYTES], true);
}

const dataURI = `data:application/gltf-buffer;base64,${Buffer.from(buffer).toString('base64')}`;
console.log(dataURI);

fs.writeFile('buffer.bin', Buffer.from(buffer), 'binary', function(err) {
  if(err) {
    console.log(err);
  }
});

// const buffer = new ArrayBuffer(cartPosList.length * 3 * Float32Array.BYTES_PER_ELEMENT);
// const float32Array = new Float32Array(buffer);
// cartPosList.forEach((cartesian, index) => {
//   float32Array[index * 3] = cartesian.x;
//   float32Array[index * 3 + 1] = cartesian.y;
//   float32Array[index * 3 + 2] = cartesian.z;
// });


// const buffer = Buffer.alloc(cartPosList.length * 3 * 4); // 3 floats per position, 4 bytes per float
// for (let i = 0; i < cartPosList.length; i++) {
//     buffer.writeFloatLE(cartPosList[i].x, i * 12);
//     buffer.writeFloatLE(cartPosList[i].y, i * 12 + 4);
//     buffer.writeFloatLE(cartPosList[i].z, i * 12 + 8);
// }
// const base64String = Buffer.from(buffer).toString('base64');
// const dataUri = `data:application/octet-stream;base64,${base64String}`;

// console.log('dataUri', dataUri)
console.log('byteLength', byteLength)
console.log('indexBytes', indexesBytes)
console.log('verticesBytes', verticesBytes)
console.log('vertices', vertices.length)


const gltf = {
    "asset": {
        "version": "2.0"
    },
    "buffers": [
        {
            "byteLength": byteLength,
            "uri": dataURI,
            // "uri": "data:application/octet-stream;base64," + buffer.toString('base64')
        }
    ],
    "bufferViews": [
        {
            "buffer": 0,
            "byteOffset": 0,
            "byteLength": indexesBytes,
            "target": 34963 
        },
        {
            "buffer": 0,
            "byteOffset": indexesBytes + paddingBytes,
            "byteLength": verticesBytes,
            "byteStride": 12,
            "target": 34962 // ARRAY_BUFFER
        }
    ],
    "accessors": [
      {
        "bufferView": 0,
        "byteOffset": 0,
        "componentType": 5123,
        "count": indexes.length,
        "type": "SCALAR",
        "max": [0],
        "min": [indexes.length - 1]
      },
      {
        "bufferView": 1,
        "byteOffset": 0,
        // "byteOffset": indexesBytes + paddingBytes,
        "componentType": 5126, // FLOAT
        "count": indexes.length,
        "type": "VEC3",
        "name": "Position",
        "max": [
          1.5, 0, 1.5,
        ],
        // "max": [
        //   980055, -5663187, 2756307,
        // ],
        "min": [
         0,
         0,
         0
        ]
        // "min": [
        //   980055, -5663187, 2756307,

        // ]
      }
    ],
    "materials" : [ {
      "pbrMetallicRoughness" : {
        "baseColorFactor" : [ 1.0, 0.0, 1.0, 1.0 ],
     
        "metallicFactor" : 0.0,
        "roughnessFactor" : 1.0
      },
      "alphaMode" : "OPAQUE",
      "doubleSided" : false
    } ],
    "meshes": [
        {
            "primitives": [
                {
                    "attributes": {
                        "POSITION": 1
                    },
                    "indices": 0,
                    "material" : 0,
                    "mode": 2 
                }
            ]
        }
    ],
    "nodes": [
        {
            "mesh": 0,
            "scale": [1000, 1000, 1000]
        }
    ],
    "scenes": [
        {
            "nodes": [0]
        }
    ],
    "scene": 0
};

// Step 4: Write GLTF JSON and binary buffer to files
const gltfString = JSON.stringify(gltf, null, 2);
fs.writeFileSync('points.gltf', gltfString);

makeWayPoints() 
console.log('GLTF file saved successfully.');


