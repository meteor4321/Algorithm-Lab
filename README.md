# 演算法實驗室

繁體中文互動式演算法教材。每個單元都可先看原理，再逐行觀察經典範例，最後換成自己的資料練習。

## 本機執行

使用 Node.js 24 LTS。開發與 GitHub Actions 採用 [`.nvmrc`](.nvmrc) 中的版本。執行測試時也需要 Python 3，Windows 使用 `python`，macOS 與 Linux 使用 `python3`。

```sh
npm ci
npm run dev
```

開啟 [本機開發預覽](http://localhost:5173/)。開發伺服器執行時，儲存原始檔會自動更新瀏覽器。交件前可執行以下指令。

```sh
npm run typecheck
npm run test
npm run build
npm run preview
```

## 單元與擴充

| 分類 | 單元 | 網址片段 |
| --- | --- | --- |
| 排序 | 氣泡排序 | `#/sorting/bubble-sort` |
| 排序 | 插入排序 | `#/sorting/insertion-sort` |
| 排序 | 選擇排序 | `#/sorting/selection-sort` |
| 排序 | 合併排序 | `#/sorting/merge-sort` |
| 排序 | 快速排序 | `#/sorting/quick-sort` |
| 排序 | 堆積排序 | `#/sorting/heap-sort` |
| 排序 | 計數排序 | `#/sorting/counting-sort` |
| 排序 | 基數排序 | `#/sorting/radix-sort` |
| 排序 | 桶排序 | `#/sorting/bucket-sort` |
| 搜尋 | 線性搜尋 | `#/searching/linear-search` |
| 搜尋 | 二分搜尋 | `#/searching/binary-search` |
| 搜尋 | 雜湊查找 | `#/searching/hash-search` |
| 搜尋 | 二元搜尋樹查找 | `#/searching/bst-search` |
| 搜尋 | 快速選擇 | `#/searching/quickselect` |
| 搜尋 | 廣度優先搜尋 | `#/searching/breadth-first-search` |
| 搜尋 | 深度優先搜尋 | `#/searching/depth-first-search` |
| 搜尋 | KMP 字串搜尋 | `#/searching/kmp-search` |
| 搜尋 | Rabin–Karp 字串搜尋 | `#/searching/rabin-karp` |

依 [AGENTS.md](AGENTS.md) 新增分類或單元。演算法快照、單元教材與測試各自維護，分類與單元登記在 [單元目錄](src/units/index.ts)。程式碼欄直接讀取可獨立執行的 [Python 核心函式](src/algorithms/core/)，顯示時移除行尾的 `@line` 標記。測試會執行畫面上的 Python，核對回傳值和時間軸記錄的執行行。

## 教學程式參考

- 氣泡排序採用右界倒數與同時賦值交換，以 `values`、`end`、`index` 命名，先複製輸入再回傳排序結果。[Runestone Academy 氣泡排序章節](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBubbleSort.html)
- 插入排序保留外層迴圈及內層的索引與數值條件，將待插入值命名為 `key`，用 `index` 和 `scan` 區分取出與比對位置。程式在輸入的副本上執行，用 `None` 對應畫布的空格。[ThinkPy 插入排序](https://www.thinkpy.org/chapters/14-algorithms/1403-sorting.html#insertion-sort)
- 線性搜尋沿用 `enumerate`、首次命中即回傳和查無時回傳 `−1` 的寫法，以 `index` 和 `value` 對應畫布的索引和值。[Loyola University Chicago 線性搜尋教材](https://introcs-python.cs.luc.edu/lists/searching.html#writing-linear-search-explicitly)
- 二分搜尋沿用閉區間、`left`、`right`、`mid` 與三個分支，以 `sorted_values` 提醒輸入前提，實驗台負責檢查資料順序。[Stephen Marz 的二分搜尋講義](https://marz.utk.edu/python/searching-and-sorting/#binary-search)
- 選擇排序沿用逐輪找最小索引的版本，將內層掃描與最小索引命名為 `scan` 和 `smallest`，略過同一位置的交換。[Stephen Marz 的排序講義](https://marz.utk.edu/python/searching-and-sorting/#selection-sort)
- 合併排序用由下往上的區段寬度取代遞迴拆分，保留合併的雙指標及等值先取左段。堆積排序保留最大堆的下沉、建堆與縮小堆範圍，分別標出選子節點、比較和交換。[Open Data Structures 的比較排序](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html)
- 快速排序與快速選擇採右端基準值、單向掃描的分區。快速排序遞迴處理兩側，快速選擇把使用者的排名轉為索引，每輪只保留含目標排名的一側。[Cornell 快速選擇講義](https://people.orie.cornell.edu/vc333/orie5270/lectures/04/) · [Princeton 快速排序](https://algs4.cs.princeton.edu/23quicksort/)
- 計數排序在值域加上最小值偏移，保留累計與反向填入。基數排序改用十進位的穩定分桶，負整數以共同偏移量計算位數。桶排序用四個等寬整數區間與穩定的桶內排序，將各桶結果依序收集。[Open Data Structures 的計數與基數排序](https://opendatastructures.org/ods-python/11_2_Counting_Sort_Radix_So.html) · [LiteratePrograms 的 Python 桶排序](https://www.literateprograms.org/bucket-sort-python.html) · [NIST 桶排序](https://xlinux.nist.gov/dads/HTML/bucketsort.html)
- 雜湊查找用固定五桶的取餘數示範鏈結法，桶內記下原索引，碰撞時依輸入順序比較。二元搜尋樹把節點記成值與左右子節點編號，查找以迴圈沿左或右連結移動。實驗台先依資料建表或建樹，再播放查找。[MIT 雜湊講義](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ce9e94705b914598ce78a00a70a1f734_MIT6_006S20_lec4.pdf) · [Open Data Structures 的二元搜尋樹](https://opendatastructures.org/ods-python/6_2_BinarySearchTree_Unbala.html)
- BFS 保留前驅與分層走訪，用佇列逐格取出，找到終點後沿前驅回溯。DFS 保留遞迴與已走訪集合，命中時將結果逐層回傳。兩者使用同一張格子迷宮。實驗台依上、右、下、左的順序建立無向鄰接表，再交給核心函式。[MIT BFS 講義](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/6afd7e9a85d7d36e204533569f9fccf6_MIT6_006S20_r09.pdf) · [MIT DFS 講義](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/d9265b3b33d238ff914b0223ac8e7628_MIT6_006S20_r10.pdf)
- KMP 把前綴表的建表與搜尋分成兩段，畫面追蹤 `i` 和 `j`。Rabin–Karp 把視窗移動拆成移除與加入兩行，使用小模數呈現碰撞，雜湊相同時核對原字串。兩者回傳第一個命中的字元索引。[Princeton 子字串搜尋](https://algs4.cs.princeton.edu/53substring/) · [MIT 滾動雜湊講義](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2008/2cc0efa30d154a5ec5e161a0adcfc373_lec6.pdf)

## GitHub Pages

公開網址待部署後補上。將專案推送至 GitHub，在儲存庫的 **Settings → Pages** 選擇 **GitHub Actions**，再執行 [發布流程](.github/workflows/pages.yml)。流程會驗證原始碼、依 Pages 路徑建置並發布 `dist/`。部署完成後可從 Actions 取得網址，並以首頁、分類與單元直連重新整理驗證。
