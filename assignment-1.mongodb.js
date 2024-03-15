// 1. Insert 3 documents in patients with atleast 1 history per patient
use('hospitalData');
db.patients.insertMany([{firstName: "Virti", lastName: "Mehta", age:20, history: [{disease:"cold", treatment:"medicine"}]}, {firstName: "Rucha", lastName: "Mehta", age:18, history: [{disease:"headache", treatment:"pain killer"}]}, {firstName: "Drashti", lastName: "Gor", age:22, history: [{disease:"wound", treatment:"bandage"}]}])
// 2. Update patient data of 1 patient with new age, name, and history entry 
db.patients.updateOne({"history.disease": "headache"}, {$inc:{age: 1}, $set:{firstName: "Richa", history: {disease: "migrain", treatment: "medicine"}}});
//3. Find all the patients older than 19
db.patients.find({age: {$gt: 19}})
//4. Delete all patients who have got cold
db.patients.deleteMany({"history.disease": "cold"})