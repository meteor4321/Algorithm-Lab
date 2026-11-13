def insertion_sort(values):
    values = values.copy()  # @line copy
    for index in range(1, len(values)):  # @line outer
        key, values[index] = values[index], None  # @line hold
        scan = index - 1  # @line scan
        while scan >= 0 and values[scan] > key:  # @line inner
            values[scan + 1], values[scan] = values[scan], None  # @line shift
            scan -= 1  # @line retreat
        values[scan + 1] = key  # @line insert
    return values  # @line result
