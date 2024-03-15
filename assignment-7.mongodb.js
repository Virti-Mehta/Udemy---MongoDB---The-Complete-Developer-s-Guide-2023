//Find persons older than 50 then group them by gender and find out number of persons in each gender and calculate their average age and sort according to number of people in each gender
use("analytics");
db.persons.aggregate([
  { $match: { "dob.age": { $gt: 50 } } },
  {
    $group: {
      _id: { gender: "$gender" },
      totalPersons: { $sum: 1 },
      averageAge: { $avg: "$dob.age" },
    },
  },
  {
    $sort: {
      totalPersons: -1,
    },
  },
]);
