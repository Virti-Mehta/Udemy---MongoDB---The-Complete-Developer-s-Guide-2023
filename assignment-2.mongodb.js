//1. Insert multiple companies with insertOne and insertMany
use("companyData");
db.companies.insertOne({
  _id: 1,
  company_name: "Apple",
  industry: "Technology",
  ceo: "Tim Cook",
});
db.companies.insertMany([
  { _id: 2, company_name: "Tesla", industry: "Automotive", ceo: "Elon Musk" },
  {
    _id: 3,
    company_name: "Amazon",
    industry: "E-Commerce",
    ceo: "Andy  Jassy",
  },
]);
//2. Deliberately insert duplicte id data and fix failing additions with unordered inserts
db.companies.insertMany([
  {
    _id: 3,
    company_name: "Infosys",
    industry: "Technology",
    ceo: "Narayan Murthy",
  },
  {
    _id: 4,
    company_name: "Reliance",
    industry: "Petroleum",
    ceo: "Mukesh Ambani",
  },
]);
db.companies.insertMany(
  [
    {
      _id: 3,
      company_name: "Infosys",
      industry: "Technology",
      ceo: "Narayan Murthy",
    },
    {
      _id: 4,
      company_name: "Reliance",
      industry: "Petroleum",
      ceo: "Mukesh Ambani",
    },
  ],
  { ordered: false }
);
//3. Write a data for a company with both journalling being guaranteed and not being guaranteed
db.companies.insertOne(
  {
    _id: 5,
    company_name: "Microsoft",
    industry: "Technology",
    ceo: "Satya Nadella",
  },
  { writeConcern: { j: true } }
);
db.companies.insertOne(
  {
    _id: 6,
    company_name: "Microsoft",
    industry: "Technology",
    ceo: "Satya Nadella",
  },
  { writeConcern: { j: false } }
);
