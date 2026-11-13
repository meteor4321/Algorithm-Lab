def partition(values, left, right):
    pivot = values[right]  # @line pivot
    boundary = left  # @line boundary
    for scan in range(left, right):  # @line scan
        if values[scan] < pivot:  # @line compare
            values[boundary], values[scan] = values[scan], values[boundary]  # @line move-small
            boundary += 1  # @line advance
    values[boundary], values[right] = values[right], values[boundary]  # @line place
    return boundary  # @line partition-result

def quickselect(values, k):
    values = values.copy()  # @line copy
    wanted = k - 1  # @line wanted
    left, right = 0, len(values) - 1  # @line bounds
    while left <= right:  # @line loop
        pivot_index = partition(values, left, right)  # @line partition
        if pivot_index == wanted:  # @line hit
            return values[pivot_index]  # @line result
        if pivot_index < wanted:  # @line side
            left = pivot_index + 1  # @line right-half
        else:
            right = pivot_index - 1  # @line left-half
