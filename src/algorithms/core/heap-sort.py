def sift_down(values, root, size):
    while 2 * root + 1 < size:  # @line children
        child = 2 * root + 1  # @line left-child
        if child + 1 < size and values[child] < values[child + 1]:  # @line compare-children
            child += 1  # @line right-child
        if values[root] >= values[child]:  # @line compare-root
            return  # @line settled
        values[root], values[child] = values[child], values[root]  # @line sink
        root = child  # @line descend

def heap_sort(values):
    values = values.copy()  # @line copy
    for start in range(len(values) // 2 - 1, -1, -1):  # @line build
        sift_down(values, start, len(values))  # @line repair
    for end in range(len(values) - 1, 0, -1):  # @line extract
        values[0], values[end] = values[end], values[0]  # @line place-max
        sift_down(values, 0, end)  # @line restore
    return values  # @line result
