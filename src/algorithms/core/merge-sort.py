def merge_sort(values):
    values = values.copy()  # @line copy
    width = 1  # @line width
    while width < len(values):  # @line pass
        for start in range(0, len(values), 2 * width):  # @line block
            left = values[start:start + width]  # @line left
            right = values[start + width:start + 2 * width]  # @line right
            merged = []  # @line temp
            i, j = 0, 0  # @line cursors
            while i < len(left) and j < len(right):  # @line merge
                if left[i] <= right[j]:  # @line compare
                    merged.append(left[i])  # @line take-left
                    i += 1  # @line next-left
                else:
                    merged.append(right[j])  # @line take-right
                    j += 1  # @line next-right
            merged.extend(left[i:])  # @line rest-left
            merged.extend(right[j:])  # @line rest-right
            values[start:start + len(merged)] = merged  # @line write
        width *= 2  # @line grow
    return values  # @line result
