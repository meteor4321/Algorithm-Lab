def hash_search(table, target):
    bucket = target % len(table)  # @line bucket
    for index, value in table[bucket]:  # @line scan
        if value == target:  # @line compare
            return index  # @line found
    return -1  # @line miss
