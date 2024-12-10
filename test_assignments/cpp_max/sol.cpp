#include <stdio.h>

// Function to find the maximum element in an array
// Parameters:
//   arr: pointer to the array
//   size: size of the array
// Returns:
//   The maximum element in the array
int findMax(int *arr, int size)
{
    if (size == 0)
    {
        return -1;
    }

    int max = arr[0];

    for (int i = 1; i < size; i++)
    {
        if (arr[i] > max)
        {
            max = arr[i];
        }
    }

    return max;
}