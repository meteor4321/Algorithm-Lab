def binary_search(sorted_values, target):
    left, right = 0, len(sorted_values) - 1  # @line bounds
    while left <= right:  # @line loop
        mid = (left + right) // 2  # @line middle
        if sorted_values[mid] == target:  # @line equal
            return mid  # @line found
        elif sorted_values[mid] < target:  # @line compare
            left = mid + 1  # @line right-half
        else:
            right = mid - 1  # @line left-half
    return -1  # @line miss
