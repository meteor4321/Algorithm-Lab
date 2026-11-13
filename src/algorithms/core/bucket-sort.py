def bucket_sort(values):
    low = min(values)  # @line low
    width = (max(values) - low) // 4 + 1  # @line width
    buckets = [[], [], [], []]  # @line buckets
    for value in values:  # @line value
        index = (value - low) // width  # @line index
        buckets[index].append(value)  # @line distribute
    output = []  # @line output
    for bucket in buckets:  # @line collect
        bucket.sort()  # @line sort-bucket
        output.extend(bucket)  # @line append
    return output  # @line result
