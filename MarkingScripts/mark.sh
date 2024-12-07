#!/bin/bash

# Marking script for Matrix Operations Assignment

# Ensure the script stops on the first error
set -e

# Directory where student submission is unzipped
STUDENT_DIR=$1

# Location of test cases
TEST_DIR="./test_cases"

# Logs directory for output
LOGS_DIR="$STUDENT_DIR/logs"
mkdir -p "$LOGS_DIR"

# Compilation step
echo "Compiling student code..."
gcc -o "$STUDENT_DIR/matrix_program" "$STUDENT_DIR/matrix.c" -lm > "$LOGS_DIR/compile.log" 2>&1

# Check if compilation was successful
if [ $? -ne 0 ]; then
    echo "Compilation failed. See compile.log for details." > "$LOGS_DIR/result.log"
    exit 1
fi

# Run test cases
echo "Running test cases..."
SCORE=0
MAX_SCORE=100
TEST_COUNT=0

for INPUT in "$TEST_DIR"/*.in; do
    BASENAME=$(basename "$INPUT" .in)
    EXPECTED_OUTPUT="$TEST_DIR/$BASENAME.out"
    STUDENT_OUTPUT="$LOGS_DIR/$BASENAME.output"

    # Run student program
    "$STUDENT_DIR/matrix_program" < "$INPUT" > "$STUDENT_OUTPUT"

    # Compare output
    if diff -q "$STUDENT_OUTPUT" "$EXPECTED_OUTPUT" > /dev/null; then
        SCORE=$((SCORE + 20)) # 20 marks per test
    else
        echo "Test $BASENAME failed." >> "$LOGS_DIR/result.log"
    fi
    TEST_COUNT=$((TEST_COUNT + 1))
done

# Write final score
echo "Final Score: $SCORE/$MAX_SCORE" >> "$LOGS_DIR/result.log"
echo "Marking completed. See result.log for details."
