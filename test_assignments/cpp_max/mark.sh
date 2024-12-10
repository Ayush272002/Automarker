#!/bin/bash

# Setup
echo "Compiling and running tests for findMax function..."

# Path to the student code file
STUDENT_CODE="/app/solution"

# Check if the file exists
if [ ! -f "$STUDENT_CODE" ]; then
    echo "Error: $STUDENT_CODE not found!"
    exit 1
fi

# Create test file
cat > test.cpp << 'EOL'
#include <iostream>
#include <cassert>

// Include student's solution
#include "solution"

int main() {
    int PASSED_TESTS = 0;
    
    // Test 1: Basic positive numbers
    {
        int arr1[] = {1, 3, 5, 2, 4};
        int result = findMax(arr1, 5);
        if (result == 5) {
            std::cout << "Test 1 Passed\n";
            PASSED_TESTS++;
        } else {
            std::cout << "Test 1 Failed: Expected 5, got " << result << "\n";
        }
    }

    // Test 2: Array with negative numbers
    {
        int arr2[] = {-5, -2, -10, -8, -1};
        int result = findMax(arr2, 5);
        if (result == -1) {
            std::cout << "Test 2 Passed\n";
            PASSED_TESTS++;
        } else {
            std::cout << "Test 2 Failed: Expected -1, got " << result << "\n";
        }
    }

    // Test 3: Mixed positive and negative numbers
    {
        int arr3[] = {-3, 0, 4, -1, 2};
        int result = findMax(arr3, 5);
        if (result == 4) {
            std::cout << "Test 3 Passed\n";
            PASSED_TESTS++;
        } else {
            std::cout << "Test 3 Failed: Expected 4, got " << result << "\n";
        }
    }

    // Test 4: Array with duplicate maximum
    {
        int arr4[] = {5, 3, 5, 2, 4};
        int result = findMax(arr4, 5);
        if (result == 5) {
            std::cout << "Test 4 Passed\n";
            PASSED_TESTS++;
        } else {
            std::cout << "Test 4 Failed: Expected 5, got " << result << "\n";
        }
    }

    std::cout << "Number of tests passed: " << PASSED_TESTS << "\n";
    return 0;
}
EOL

# Compile the test
g++ -o test test.cpp

# Check if compilation was successful
if [ $? -ne 0 ]; then
    echo "Compilation failed!"
    exit 1
fi

# Run the tests
./test

