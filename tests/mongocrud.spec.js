const { test, expect } = require('@playwright/test');
const { getMongoDB, closeMongoDB } = require('../utils/mongodb');

test('MongoDB Employee CRUD Operations', async ({ page }) => {

    // Open browser
    await page.goto('about:blank');

    // Connect to Thinktime database
    const db = await getMongoDB();

    // Connect to employee collection
    const employees = db.collection('employee');

    // =========================
    // CREATE
    // =========================

    const insertResult = await employees.insertOne({
        name: 'TestUser',
        age: 25,
        role: 'Automation Tester',
        experience: 3,
        city: 'Chennai'
    });

    expect(insertResult.acknowledged).toBeTruthy();

    console.log('CREATE: Employee inserted');
    console.log('Inserted ID:', insertResult.insertedId.toString());


    // =========================
    // READ
    // =========================

    let employee = await employees.findOne({
        _id: insertResult.insertedId
    });

    expect(employee).not.toBeNull();

    expect(employee.name).toBe('TestUser');
    expect(employee.age).toBe(25);
    expect(employee.role).toBe('Automation Tester');
    expect(employee.experience).toBe(3);
    expect(employee.city).toBe('Chennai');

    console.log('READ: Employee found');
    console.log(employee);


    // =========================
    // UPDATE
    // =========================

    const updateResult = await employees.updateOne(
        {
            _id: insertResult.insertedId
        },
        {
            $set: {
                experience: 4
            }
        }
    );

    expect(updateResult.matchedCount).toBe(1);
    expect(updateResult.modifiedCount).toBe(1);

    console.log('UPDATE: Experience changed from 3 to 4');


    // =========================
    // READ AFTER UPDATE
    // =========================

    employee = await employees.findOne({
        _id: insertResult.insertedId
    });

    expect(employee).not.toBeNull();
    expect(employee.experience).toBe(4);

    console.log('READ after UPDATE:');
    console.log(employee);


    // =========================
    // DELETE
    // =========================

    const deleteResult = await employees.deleteOne({
        _id: insertResult.insertedId
    });

    expect(deleteResult.deletedCount).toBe(1);

    console.log('DELETE: Employee deleted');


    // =========================
    // READ AFTER DELETE
    // =========================

    employee = await employees.findOne({
        _id: insertResult.insertedId
    });

    expect(employee).toBeNull();

    console.log('READ after DELETE: Employee not found');

    console.log('MongoDB CRUD test completed');


    // Close MongoDB connection
    await closeMongoDB();
});