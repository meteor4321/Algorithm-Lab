def selection_sort(values):
    values = values.copy()  # @line copy
    for index in range(len(values) - 1):  # @line outer
        smallest = index  # @line smallest
        for scan in range(index + 1, len(values)):  # @line scan
            if values[scan] < values[smallest]:  # @line compare
                smallest = scan  # @line update
        if smallest != index:  # @line needs-swap
            values[index], values[smallest] = values[smallest], values[index]  # @line swap
    return values  # @line result
