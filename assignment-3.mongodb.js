//1. Import the attached data in a new database
// mongoimport boxoffice.json -d boxoffice -c moviestats --jsonArray
//2. Search all the movies with a rating > 9.2 and a runtime < 100
db.boxoffice.find({
  $and: [{ "meta.rating": { $gt: 9.2 } }, { "meta.runtime": { $lt: 100 } }],
});
//3. Search all movies that have a genre of drama or action
db.boxoffice.find({ $or: [{ genre: "drama" }, { genre: "action" }] });
//4. Search all movies where visitors exceeded expected users
db.boxoffice.find({ $expr: { $gt: ["$visitors", "$expectedVisitors"] } });
