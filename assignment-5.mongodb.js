// 1. Create a new collection ("sports") and upsert two new documents into it (with these fields: "title", "requiresTeam")
use("sportsData");
db.sports.updateOne(
  {},
  { $set: { title: "Cricket", requiresTeam: true } },
  { upsert: true }
);
db.sports.updateOne(
  {},
  { $set: { title: "Chess", requiresTeam: false } },
  { upsert: true }
);
db.sports.updateOne(
  {},
  { $set: { title: "Kabaddi", requiresTeam: true } },
  { upsert: true }
);
// 2. Update all documents which do require a team  by adding a new field with the minimum amount of players required
db.sports.updateMany({ requiresTeam: true }, { $set: { minPlayers: 10 } });
// 3. Update all documents that require a team by increasing the number of required players by 10
db.sports.updateMany({ requiresTeam: true }, { $inc: { minPlayers: 10 } });
