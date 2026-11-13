def kmp_search(text, pattern):
    prefix = [0] * len(pattern)  # @line prefix
    j = 0  # @line prefix-reset
    i = 1  # @line prefix-start
    while i < len(pattern):  # @line prefix-loop
        if pattern[i] == pattern[j]:  # @line prefix-compare
            j += 1  # @line prefix-grow
            prefix[i] = j  # @line prefix-write
            i += 1  # @line prefix-next
        elif j > 0:  # @line prefix-can-fallback
            j = prefix[j - 1]  # @line prefix-fallback
        else:
            i += 1  # @line prefix-skip

    i, j = 0, 0  # @line cursors
    while i < len(text):  # @line loop
        if text[i] == pattern[j]:  # @line compare
            i += 1  # @line next-text
            j += 1  # @line next-pattern
            if j == len(pattern):  # @line complete
                return i - j  # @line found
        elif j > 0:  # @line can-fallback
            j = prefix[j - 1]  # @line fallback
        else:
            i += 1  # @line skip
    return -1  # @line miss
