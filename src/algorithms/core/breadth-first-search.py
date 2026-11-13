from collections import deque

def breadth_first_search(graph, start, target):
    queue = deque([start])  # @line queue
    seen = {start}  # @line seen
    parent = [-1] * len(graph)  # @line parent
    while queue:  # @line loop
        node = queue.popleft()  # @line pop
        if node == target:  # @line compare
            path = [node]  # @line path
            while parent[path[-1]] != -1:  # @line backtrack
                path.append(parent[path[-1]])  # @line prepend
            return path[::-1]  # @line found
        for neighbor in graph[node]:  # @line neighbor
            if neighbor not in seen:  # @line unvisited
                seen.add(neighbor)  # @line discover
                parent[neighbor] = node  # @line link
                queue.append(neighbor)  # @line push
    return []  # @line miss
