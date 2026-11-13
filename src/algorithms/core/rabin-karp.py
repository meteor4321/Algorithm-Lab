def rabin_karp(text, pattern):
    size = len(pattern)  # @line size
    if size > len(text):  # @line fits
        return -1  # @line too-long
    base, mod = 257, 101  # @line parameters
    weight = pow(base, size - 1, mod)  # @line weight
    expected, window = 0, 0  # @line initialize
    for i in range(size):  # @line init-loop
        expected = (expected * base + ord(pattern[i])) % mod  # @line pattern-hash
        window = (window * base + ord(text[i])) % mod  # @line window-hash
    for start in range(len(text) - size + 1):  # @line window-loop
        if window == expected:  # @line hash-match
            if text[start:start + size] == pattern:  # @line verify
                return start  # @line found
        if start + size < len(text):  # @line more
            window = (window - ord(text[start]) * weight) % mod  # @line remove
            window = (window * base + ord(text[start + size])) % mod  # @line roll
    return -1  # @line miss
