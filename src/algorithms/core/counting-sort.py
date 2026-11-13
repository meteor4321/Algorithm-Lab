def counting_sort(values):
    low = min(values)  # @line low
    counts = [0] * (max(values) - low + 1)  # @line counts
    for value in values:  # @line count-loop
        counts[value - low] += 1  # @line count
    for index in range(1, len(counts)):  # @line prefix-loop
        counts[index] += counts[index - 1]  # @line prefix
    output = [None] * len(values)  # @line output
    for value in reversed(values):  # @line place-loop
        counts[value - low] -= 1  # @line position
        output[counts[value - low]] = value  # @line place
    return output  # @line result
