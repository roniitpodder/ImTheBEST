import { DSAProblem } from '../types';

export const INITIAL_DSA_PROBLEMS: DSAProblem[] = [
  {
    id: 'dsa-1',
    name: 'Two Sum',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    leetCodeUrl: 'https://leetcode.com/problems/two-sum/',
    status: 'Not Started',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    notes: 'Complement Map (target - num[i]). Single pass lookup.',
    dateAttempted: ''
  },
  {
    id: 'dsa-2',
    name: 'Valid Anagram',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    leetCodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    status: 'Not Started',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1) with 26-char int array',
    notes: 'Increment frequencies for s, decrement for t. Check all zero.',
    dateAttempted: ''
  },
  {
    id: 'dsa-3',
    name: 'Longest Substring Without Repeating Characters',
    topic: 'Sliding Window',
    difficulty: 'Medium',
    leetCodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    status: 'Not Started',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(M, N))',
    notes: 'Sliding window tracking last observed index in HashMap; jump left pointer.',
    dateAttempted: ''
  },
  {
    id: 'dsa-4',
    name: 'Trapping Rain Water',
    topic: 'Two Pointers',
    difficulty: 'Hard',
    leetCodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    status: 'Not Started',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    notes: 'Two pointer approach maintaining max_left and max_right boundaries.',
    dateAttempted: ''
  },
  {
    id: 'dsa-5',
    name: 'Invert Binary Tree',
    topic: 'Trees',
    difficulty: 'Easy',
    leetCodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    status: 'Not Started',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    notes: 'Recursively swap left and right subtrees.',
    dateAttempted: ''
  },
  {
    id: 'dsa-6',
    name: 'Course Schedule I (Cycle Detection)',
    topic: 'Graphs',
    difficulty: 'Medium',
    leetCodeUrl: 'https://leetcode.com/problems/course-schedule/',
    status: 'Not Started',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    notes: 'Kahn algorithm using indegree array or DFS with 3-state coloring (visiting, visited).',
    dateAttempted: ''
  },
  {
    id: 'dsa-7',
    name: 'Coin Change',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    leetCodeUrl: 'https://leetcode.com/problems/coin-change/',
    status: 'Not Started',
    timeComplexity: 'O(Amount * N)',
    spaceComplexity: 'O(Amount)',
    notes: 'Bottom-up 1D DP array initialized with amount + 1 as sentinel infinity value.',
    dateAttempted: ''
  },
  {
    id: 'dsa-8',
    name: 'LRU Cache',
    topic: 'System & Data Structure Design',
    difficulty: 'Medium',
    leetCodeUrl: 'https://leetcode.com/problems/lru-cache/',
    status: 'Not Started',
    timeComplexity: 'O(1) get, O(1) put',
    spaceComplexity: 'O(Capacity)',
    notes: 'HashMap combined with doubly linked list with dummy head and tail.',
    dateAttempted: ''
  },
  {
    id: 'dsa-9',
    name: 'Search in Rotated Sorted Array',
    topic: 'Binary Search',
    difficulty: 'Medium',
    leetCodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    status: 'Not Started',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    notes: 'Identify which half is cleanly sorted (nums[low] <= nums[mid]), then test if target falls in range.',
    dateAttempted: ''
  },
  {
    id: 'dsa-10',
    name: 'Serialize and Deserialize Binary Tree',
    topic: 'Trees',
    difficulty: 'Hard',
    leetCodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    status: 'Not Started',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    notes: 'Preorder traversal with "#" delimiter for null nodes or BFS queue level encoding.',
    dateAttempted: ''
  },
  {
    id: 'dsa-11',
    name: 'Longest Increasing Subsequence',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    leetCodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    status: 'Not Started',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    notes: 'Patience sorting technique using tails array and binary search (Arrays.binarySearch).',
    dateAttempted: ''
  },
  {
    id: 'dsa-12',
    name: 'Merge Intervals',
    topic: 'Intervals & Greedy',
    difficulty: 'Medium',
    leetCodeUrl: 'https://leetcode.com/problems/merge-intervals/',
    status: 'Not Started',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    notes: 'Sort intervals by start time. Compare current start with previous merged interval end.',
    dateAttempted: ''
  }
];

export const DSA_TOPICS_LIST = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Linked Lists',
  'Stacks & Queues',
  'Trees',
  'Binary Search Trees',
  'Heaps & Priority Queues',
  'Graphs',
  'Dynamic Programming',
  'Intervals & Greedy',
  'Backtracking',
  'Trie (Prefix Tree)',
  'Bit Manipulation',
  'System & Data Structure Design'
];
