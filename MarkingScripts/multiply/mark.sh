#!/bin/bash

# Setup
echo "Running tests for the mul function..."

# Path to the student code file
STUDENT_CODE="/app/sol.js"

# Check if the file exists
if [ ! -f "$STUDENT_CODE" ]; then
    echo "Error: $STUDENT_CODE not found!"
    exit 1
fi

# Run the test cases
node -e "
const { mul } = require('$STUDENT_CODE');
const assert = require('assert');

// Initialize counter for passed tests
let PASSED_TESTS = 0;

// Test cases
console.log('Running test cases...');

// Test 1: Positive numbers
try {
    assert.strictEqual(mul(2, 3), 6, 'Test 1 Failed: mul(2, 3) should be 6');
    PASSED_TESTS++;
    console.log('Test 1 Passed');
} catch (error) {
    console.error(error.message);
}

// Test 2: Negative numbers
try {
    assert.strictEqual(mul(-2, -3), 6, 'Test 2 Failed: mul(-2, -3) should be 6');
    PASSED_TESTS++;
    console.log('Test 2 Passed');
} catch (error) {
    console.error(error.message);
}

// Test 3: Mixed numbers
try {
    assert.strictEqual(mul(-2, 3), -6, 'Test 3 Failed: mul(-2, 3) should be -6');
    PASSED_TESTS++;
    console.log('Test 3 Passed');
} catch (error) {
    console.error(error.message);
}

// Test 4: Zeros
try {
    assert.strictEqual(mul(0, 0), 0, 'Test 4 Failed: mul(0, 0) should be 0');
    PASSED_TESTS++;
    console.log('Test 4 Passed');
} catch (error) {
    console.error(error.message);
}

console.log('Number of tests passed:', PASSED_TESTS);
"
