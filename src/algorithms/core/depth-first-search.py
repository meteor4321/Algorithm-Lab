def visit(graph, node, target, seen):
    seen.add(node)  # @line mark
    if node == target:  # @line compare
        return True  # @line hit
    for neighbor in graph[node]:  # @line neighbor
        if neighbor not in seen:  # @line unvisited
            if visit(graph, neighbor, target, seen):  # @line descend
                return True  # @line propagate
    return False  # @line retreat

def depth_first_search(graph, start, target):
    seen = set()  # @line seen
    found = visit(graph, start, target, seen)  # @line start
    return found  # @line result
