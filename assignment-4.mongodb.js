// 1. Find all movies with exactly two genres
db.moviestatsex.find({ genre: { $size: 3 } });
// 2. Find all movies which aired in 2018
db.moviestatsex.find({ "meta.aired": 2018 });
// 3. Find all movies which have ratings greater than 8 but lower than 10
db.moviestatsex.find({ ratings: { $elemMatch: { $gt: 8, $lt: 10 } } });
