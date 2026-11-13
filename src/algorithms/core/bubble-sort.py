def bubble_sort(values):
    values = values.copy()  # @line copy
    for end in range(len(values) - 1, 0, -1):  # @line outer
        for index in range(end):  # @line inner
            if values[index] > values[index + 1]:  # @line compare
                values[index], values[index + 1] = values[index + 1], values[index]  # @line swap
    return values  # @line result
