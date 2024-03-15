// Aggregate framework
db.persons.aggregate([{ $match: { gender: "female" } }]);
db.persons.aggregate([
  { $match: { gender: "female" } },
  { $group: { _id: { state: "$location.state" }, totalPersons: { $sum: 1 } } },
  { $sort: { totalPersons: -1 } },
]);
//Project with aggregate framework
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      gender: 1,
      fullName: { $concat: ["$name.first", " ", "$name.last"] },
    },
  },
]);
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      gender: 1,
      fullName: {
        $concat: [{ $toUpper: "$name.first" }, " ", { $toUpper: "$name.last" }],
      },
    },
  },
]);
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      gender: 1,
      name: 1,
      email: 1,
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onError: 0.0,
              onNull: 0.0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.latitude",
              to: "double",
              onError: 0.0,
              onNull: 0.0,
            },
          },
        ],
      },
      birthDate: {
        $toDate: "$dob.date",
      },
      age: "$dob.age",
    },
  },
  {
    $project: {
      gender: 1,
      email: 1,
      location: 1,
      birthDate: 1,
      age: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
          {
            $substrCP: [
              "$name.first",
              1,
              { $subtract: [{ $strLenCP: "name.first" }, 1] },
            ],
          },
          " ",
          { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
          {
            $substrCP: [
              "$name.last",
              1,
              { $subtract: [{ $strLenCP: "name.last" }, 1] },
            ],
          },
        ],
      },
    },
  },
  {
    $group: {
      _id: { birthYear: { $isoWeekYear: "$birthDate" } },
      numPersons: { $sum: 1 },
    },
  },
  {
    $sort: {
      numPersons: -1,
    },
  },
]);
// Aggregate with arrays
db.friends.aggregate([
  {$unwind: "$hobbies"},
  {$group: {_id: {age: "$age"}, allHobbies: {$push: "$hobbies"}}}
]);
db.friends.aggregate([
  {$unwind: "$hobbies"},
  {$group: {_id: {age: "$age"}, allHobbies: {$addToSet: "$hobbies"}}}
]);
//project with arrays
db.friends.aggregate([
  {$project: {
    _id: 0, examScore: {$slice: ["$examScores", 1]}
  }}
]);
db.friends.aggregate([
  {$project: {
    _id: 0, examScore: {$slice: ["$examScores", -2]}
  }}
]);
db.friends.aggregate([
  {$project: {
    _id: 0, examScore: {$slice: ["$examScores", 2, 1]}
  }}
]);
db.friends.aggregate([
  {$project: {
    _id: 0, numScores: {$size: "$examScores"}
  }}
]);
db.friends.aggregate([
  {$project: {
    _id: 0, 
    scores: {$filter: {input: '$examScores' ,as: 'sc',cond: {$gt:['$$sc.score',60]} }}
  }}
]);
db.friends.aggregate([
  {$unwind: "$examScores"},
  {
    $project: {
      _id: 1, name: 1, age: 1, score: "$examScores.score"
    }
  },
  {
    $sort: {score: -1}
  },
  {$group: {_id: "$_id",name:{$first: "$name"}, maxScore: {$max: "$score"}}},
  {
    $sort: {maxScore: -1}
  },
]);
db.persons.aggregate([
  {$bucket: {
    groupBy: "$dob.age",
    boundaries: [ 18, 30, 50, 60, 120 ],
    output: {
      numPersons: {$sum: 1},
      averageAge: {$avg: "$dob.age"}
    }
  }}
]);
db.persons.aggregate([
  {$bucketAuto: {
    groupBy: "$dob.age",
    buckets: 5,
    output: {
      numPersons: {$sum: 1},
      averageAge: {$avg: "$dob.age"}
    },
   }
  }
]);
db.persons.aggregate([
  {$match: {
    gender: "male"
  }},
  {$project: {
    _id: 0, gender: 1, name: {$concat: ["$name.first", " ", "$name.last"]}, birthdate: {$toDate: "$dob.date"}
  }},
  {
    $sort: {
      birthdate: 1
    }
  },
  {
    $skip: 10
  },
  {
    $limit: 10
  }
]);
// Copying to new collection
db.persons.aggregate([
  {
    $project: {
      _id: 0,
      gender: 1,
      name: 1,
      email: 1,
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onError: 0.0,
              onNull: 0.0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.latitude",
              to: "double",
              onError: 0.0,
              onNull: 0.0,
            },
          },
        ],
      },
      birthDate: {
        $toDate: "$dob.date",
      },
      age: "$dob.age",
    },
  },
  {
    $project: {
      gender: 1,
      email: 1,
      location: 1,
      birthDate: 1,
      age: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
          {
            $substrCP: [
              "$name.first",
              1,
              { $subtract: [{ $strLenCP: "name.first" }, 1] },
            ],
          },
          " ",
          { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
          {
            $substrCP: [
              "$name.last",
              1,
              { $subtract: [{ $strLenCP: "name.last" }, 1] },
            ],
          },
        ],
      },
    },
  },
  {$out: 'transformedPersons'}
]);
db.transformedPersons.createIndex({location: "2dsphere"});
db.transformedPersons.aggregate([
  {
    $geoNear: {
      near: { type: 'Point', coordinates: [ -18.4, -42.8 ] },
      maxDistance: 1000000,
      query: {age: {$gt: 30}},
      distanceField: 'distance'
    },
  },
  {
    $limit: 10
  }
]);
// capped collection
db.createCollection("capped", {capped: true, size: 10000, max: 3});
db.capped.insertOne({name: "Max"});
db.capped.find().sort({$natural: -1});