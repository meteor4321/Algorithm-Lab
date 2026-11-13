def linear_search(values, target):
    for index, value in enumerate(values):  # @line loop
        if value == target:  # @line compare
            return index  # @line found
    return -1  # @line miss
