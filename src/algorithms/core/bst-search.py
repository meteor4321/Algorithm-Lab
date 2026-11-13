def bst_search(tree, target):
    node = 0  # @line root
    while node != -1:  # @line loop
        value, left, right = tree[node]  # @line read
        if target == value:  # @line equal
            return node  # @line found
        if target < value:  # @line compare
            node = left  # @line left
        else:
            node = right  # @line right
    return -1  # @line miss
