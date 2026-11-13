def partition(values, left, right):
    pivot = values[right]  # @line pivot
    boundary = left  # @line boundary
    for scan in range(left, right):  # @line scan
        if values[scan] < pivot:  # @line compare
            values[boundary], values[scan] = values[scan], values[boundary]  # @line move-small
            boundary += 1  # @line advance
    values[boundary], values[right] = values[right], values[boundary]  # @line place
    return boundary  # @line partition-result

def quick_range(values, left, right):
    if left >= right:  # @line base
        return  # @line stop
    pivot_index = partition(values, left, right)  # @line partition
    quick_range(values, left, pivot_index - 1)  # @line recurse-left
    quick_range(values, pivot_index + 1, right)  # @line recurse-right

def quick_sort(values):
    values = values.copy()  # @line copy
    quick_range(values, 0, len(values) - 1)  # @line start
    return values  # @line result
