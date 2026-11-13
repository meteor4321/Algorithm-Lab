def radix_sort(values):
    offset = min(0, min(values))  # @line offset
    maximum = max(1, max(values) - offset)  # @line maximum
    place = 1  # @line place
    while place <= maximum:  # @line pass
        buckets = [[], [], [], [], [], [], [], [], [], []]  # @line buckets
        for value in values:  # @line value
            digit = (value - offset) // place % 10  # @line digit
            buckets[digit].append(value)  # @line distribute
        values = []  # @line output
        for bucket in buckets:  # @line collect
            values.extend(bucket)  # @line append
        place *= 10  # @line advance
    return values  # @line result
