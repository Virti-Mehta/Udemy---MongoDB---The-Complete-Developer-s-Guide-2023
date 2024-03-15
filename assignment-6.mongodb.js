// 1. Pick 3 points in google map and store them in a collection
db.places.insertOne({
  name: "Crest",
  location: { type: "Point", coordinates: [72.7876444, 21.1930147] },
});

db.places.insertOne({
  name: "OneIros",
  location: { type: "Point", coordinates: [72.7875904, 21.1950021] },
});

db.places.insertOne({
  name: "DMart",
  location: { type: "Point", coordinates: [72.7925983, 21.1953853] },
});
// 2. Pick a point and find the nearest points with min and max distance
db.places.createIndex({ location: "2dsphere" });
db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [72.79284, 21.19566] },
      $maxDistance: 50,
      $minDistance: 10,
    },
  },
});
// 3. Pick an area and see which points it contains
// Creating polygon
const p1 = [72.79041, 21.20279];
const p2 = [72.79201, 21.20302];
const p3 = [72.7923, 21.20142];
const p4 = [72.79069, 21.20118];
// Finding place
db.places.find({
  location: {
    $geoWithin: {
      $geometry: { type: "Polygon", coordinates: [[p1, p2, p3, p4, p1]] },
    },
  },
});
// 4. Store atleast one area in a different collection
db.areas.insertOne({
  name: "Jyotindra Dave Garden",
  area: { type: "Polygon", coordinates: [[p1, p2, p3, p4, p1]] },
});
// 5. Pick a point and find out which areas in your collection contain that point
db.areas.createIndex({ area: "2dsphere" });
db.areas.find({
  area: {
    $geoIntersects: {
      $geometry: { type: "Point", coordinates: [72.79124, 21.20166] },
    },
  },
});
