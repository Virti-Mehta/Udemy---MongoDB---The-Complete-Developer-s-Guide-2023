// Cursors
const dataCursor = db.movies.find();
dataCursor.next();
dataCursor.forEach((doc) => {
  printjson(doc);
});
db.movies.find().sort({ "rating.average": 1, runtime: -1 });
db.movies.find().sort({ "rating.average": 1, runtime: -1 }).skip(20).limit(10);

// Projection
db.movies.find({}, { name: 1, genres: 1, runtime: 1, rating: 1 });
db.movies.find(
  {},
  { name: 1, genres: 1, runtime: 1, rating: 1, _id: 0, "schedule.time": 1 }
);
db.movies.find(
  { genres: "Drama" },
  { genres: { $elemMatch: { $eq: "Horror" } } }
);
db.movies.find(
  { "rating.average": { $gt: 9 } },
  { genres: { $slice: [1, 2] }, name: 1 }
);

// Update
db.users.updateOne(
  { _id: ObjectId("65dec88286b7fe6447de2bfe") },
  {
    $set: {
      hobbies: [
        { title: "Sports", frequency: 5 },
        { title: "Cooking", frequency: 3 },
        { title: "Hiking", frequency: 1 },
      ],
    },
  }
);
db.users.updateMany(
  { "hobbies.title": "Sports" },
  { $set: { isSporty: true } }
);
db.users.updateOne(
  { _id: ObjectId("65dec88286b7fe6447de2bfe") },
  { $set: { age: 40, phone: 67864298729 } }
);
db.users.updateMany({}, { $rename: { age: "totalAge" } });
db.users.updateOne(
  { name: "Maria" },
  {
    $set: {
      age: 29,
      hobbies: [{ title: "Good food", frequency: 3 }],
      isSporty: true,
    },
  },
  { upsert: true }
);
// Update array
db.users.updateMany(
  { hobbies: { $elemMatch: { title: "Sports", frequency: { $gte: 3 } } } },
  { $set: { "hobbies.$.highFrequency": true } }
);
db.users.updateMany(
  { totalAge: { $gt: 30 } },
  { $inc: { "hobbies.$[].frequency": -1 } }
);
db.users.updateMany(
  { "hobbies.frequency": { $gt: 2 } },
  { $set: { "hobbies.$[el].goodFrequency": true } },
  { arrayFilters: [{ "el.frequency": { $gt: 2 } }] }
);
db.users.updateOne(
  { name: "Maria" },
  { $push: { hobbies: { title: "Sports", frequency: 2 } } }
);
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: {
        $each: [
          { title: "Good wine", frequency: 1 },
          { title: "Hiking", frequency: 2 },
        ],
        $sort: { frequency: -1 },
      },
    },
  }
);
db.users.updateOne(
  { name: "Maria" },
  { $pull: { hobbies: { title: "Good wine" } } }
);
db.users.updateOne({ name: "Chris" }, { $pop: { hobbies: 1 } });
// Indexes
use("contactData");
db.contacts.find({ "dob.age": { $gt: 60 } }).pretty();
db.contacts.explain().find({ "dob.age": { $gt: 60 } });
db.contacts.explain("executionStats").find({ "dob.age": { $gt: 60 } });
db.contacts.createIndex({ "dob.age": 1 });
db.contacts.dropIndex({ "dob.age": 1 });
db.contacts.createIndex({ "dob.age": 1, gender: 1 });
db.contacts.explain().find({ "dob.age": 35, gender: "male" });
db.contacts.explain().find({ "dob.age": 35 }).sort({ gender: 1 });
db.contacts.getIndexes();
db.contacts.dropIndex({ "dob.age": 1, gender: 1 });
db.contacts.createIndex({ email: 1 }, { unique: true });
db.contacts.createIndex(
  { "dob.age": 1 },
  { partialFilterExpression: { gender: "male" } }
);
db.contacts.find({ "dob.age": { $gt: 60 }, gender: "male" });
db.users.insertMany([{ name: "Max", email: "max@test.com" }, { name: "Manu" }]);
db.users.createIndex({ email: 1 }, { unique: true });
// Text indexes
db.products.insertMany([
  {
    title: "A Book",
    description: "This is an awesome book about a young artist!",
  },
  {
    title: "Red T-shirt",
    description: "This T-Shirt is red and its pretty awesome!",
  },
]);
db.products.createIndex({ description: "text" });
db.products.find({ $text: { $search: "awesome" } });
db.products.find({ $text: { $search: "red book" } });
db.products.find({ $text: { $search: '"red book"' } });
db.products.find(
  { $text: { $search: "awesome t-shirt" } },
  { score: { $meta: "textScore" } }
);
db.products
  .find(
    { $text: { $search: "awesome t-shirt" } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } });
db.products.createIndex({ title: "text" });
db.products.getIndexes();
db.products.dropIndex("description_text");
db.products.createIndex({ title: "text", description: "text" });
db.products.find({ $text: { $search: "awesome -t-shirt" } });
db.products.createIndex(
  { title: "text", description: "text" },
  { default_language: "english", weights: { title: 1, description: 10 } }
);
// Geospatial queries
// 21.1929579,72.8057454,
db.places.insertOne({
  name: "Jagdishchandra Bose Muncipal Aquarium",
  location: { type: "Point", coordinates: [72.8057454, 21.1929579] },
});
// 21.1833618,72.7932664,
db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [21.1929579, 21.1833618] },
    },
  },
});
// geospatial index
db.places.createIndex({ location: "2dsphere" });
db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [21.1929579, 21.1833618] },
      $maxDistance: 500,
      $minDistance: 10,
    },
  },
});
// 21.1930147,72.7876444
db.places.insertOne({
  name: "Crest",
  location: { type: "Point", coordinates: [72.7876444, 21.1930147] },
});
// 21.1950021,72.7875904
db.places.insertOne({
  name: "OneIros",
  location: { type: "Point", coordinates: [72.7875904, 21.1950021] },
});
// 21.1953853,72.7925983
db.places.insertOne({
  name: "DMart",
  location: { type: "Point", coordinates: [72.7925983, 21.1953853] },
});
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
db.places.insertOne({
  name: "insidePt1",
  location: { type: "Point", coordinates: [72.79086, 21.20222] },
});
db.places.insertOne({
  name: "insidePt2",
  location: { type: "Point", coordinates: [72.79171, 21.20229] },
});
db.areas.insertOne({
  name: "Jyotindra Dave Garden",
  area: { type: "Polygon", coordinates: [[p1, p2, p3, p4, p1]] },
});
db.areas.createIndex({ area: "2dsphere" });
db.areas.find({
  area: {
    $geoIntersects: {
      $geometry: { type: "Point", coordinates: [72.79124, 21.20166] },
    },
  },
});
