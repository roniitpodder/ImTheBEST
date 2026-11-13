import { WeeklyAssessment } from '../types';

export const SAMPLE_WEEKLY_TESTS: WeeklyAssessment[] = [
  {
    id: 'test-w1',
    weekNumber: 1,
    monthNumber: 1,
    title: 'Week 1 Assessment: Complexity, Java OOP & Arrays',
    completed: false,
    score: 0,
    totalMarks: 100,
    codingTask: 'Implement twoSum with O(N) time and O(N) space in Java, followed by dynamic array resizing.',
    questions: [
      {
        id: 'q1',
        question: 'What is the worst-case time complexity of searching for an element in an unsorted array of size N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correctAnswer: 2,
        topic: 'Complexity Analysis',
        explanation: 'Linear scan requires inspecting each element one by one in the worst case, resulting in O(N).'
      },
      {
        id: 'q2',
        question: 'Which of the following creates a new object in the Java String Constant Pool if not already present?',
        options: ['new String("apple")', 'String s = "apple"', 's.intern()', 'Both B and C'],
        correctAnswer: 3,
        topic: 'Core Java',
        explanation: 'String literals ("apple") and the .intern() method explicitly place and reuse strings from the String Constant Pool.'
      },
      {
        id: 'q3',
        question: 'In Java, what happens if two unequal objects return the exact same hashCode()?',
        options: ['Compilation error', 'Runtime Exception', 'Valid; a hash collision occurs in the HashMap bucket', 'HashMap crashes'],
        correctAnswer: 2,
        topic: 'Java Collections',
        explanation: 'Hash collisions are completely legal; the bucket chains them via linked list or red-black tree (since Java 8).'
      },
      {
        id: 'q4',
        question: 'Which OOP principle is demonstrated when a subclass provides a specific implementation of a method defined in its parent class?',
        options: ['Encapsulation', 'Polymorphism (Method Overriding)', 'Data Hiding', 'Composition'],
        correctAnswer: 1,
        topic: 'OOP Principles',
        explanation: 'Method overriding enables dynamic runtime polymorphism in Java.'
      }
    ]
  },
  {
    id: 'test-w2',
    weekNumber: 2,
    monthNumber: 1,
    title: 'Week 2 Assessment: Sorting, Collections & Streams',
    completed: false,
    score: 0,
    totalMarks: 100,
    codingTask: 'Write a custom mergeSort implementation for an integer array and verify with JUnit 5.',
    questions: [
      {
        id: 'q5',
        question: 'Which sorting algorithm is guaranteed O(N log N) in the worst case and is stable?',
        options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'],
        correctAnswer: 1,
        topic: 'DSA Sorting',
        explanation: 'Merge sort always divides into halves regardless of input data and preserves the relative order of identical elements.'
      },
      {
        id: 'q6',
        question: 'Which Java Stream method is an intermediate and stateful operation?',
        options: ['map()', 'filter()', 'sorted()', 'forEach()'],
        correctAnswer: 2,
        topic: 'Java Streams',
        explanation: 'sorted() must inspect all elements in the stream before emitting the first element downstream, making it stateful.'
      },
      {
        id: 'q7',
        question: 'In the Java Collections Framework, which data structure provides O(1) amortized add and O(1) random access?',
        options: ['LinkedList', 'ArrayList', 'TreeSet', 'ArrayDeque'],
        correctAnswer: 1,
        topic: 'Java Collections',
        explanation: 'ArrayList is backed by a contiguous array, offering instant indexed access and amortized O(1) additions.'
      }
    ]
  },
  {
    id: 'test-w3',
    weekNumber: 3,
    monthNumber: 1,
    title: 'Week 3 Assessment: Binary Search & Concurrency Basics',
    completed: false,
    score: 0,
    totalMarks: 100,
    codingTask: 'Solve Search in Rotated Sorted Array (LeetCode 33) in O(log N) time with zero duplicate checks.',
    questions: [
      {
        id: 'q8',
        question: 'What is the primary purpose of the "volatile" keyword in Java?',
        options: [
          'Guarantees atomic increments on 64-bit integers',
          'Guarantees memory visibility across threads and prevents compiler instruction reordering',
          'Locks the entire method during execution',
          'Allocates variable memory on the native heap'
        ],
        correctAnswer: 1,
        topic: 'Java Concurrency',
        explanation: 'volatile ensures reads and writes bypass CPU registers/caches and go directly to main memory, with memory barrier semantics.'
      },
      {
        id: 'q9',
        question: 'In Binary Search, how should mid be calculated to safely prevent integer 32-bit overflow?',
        options: ['(low + high) / 2', 'low + (high - low) / 2', '(low + high) >> 1', 'Math.floor((low + high) / 2)'],
        correctAnswer: 1,
        topic: 'DSA Binary Search',
        explanation: 'low + (high - low) / 2 prevents low + high from exceeding Integer.MAX_VALUE (2,147,483,647).'
      },
      {
        id: 'q10',
        question: 'Which Java concurrency class provides lock-free thread safety based on hardware Compare-And-Swap (CAS)?',
        options: ['ReentrantLock', 'AtomicInteger', 'CountDownLatch', 'SynchronizedList'],
        correctAnswer: 1,
        topic: 'Java Concurrency',
        explanation: 'AtomicInteger uses low-level CPU CAS instructions without OS-level thread blocking.'
      }
    ]
  },
  {
    id: 'test-w4',
    weekNumber: 4,
    monthNumber: 1,
    title: 'Week 4 Assessment: Backtracking, Strings & Month 1 Capstone',
    completed: false,
    score: 0,
    totalMarks: 100,
    codingTask: 'Generate all unique permutations of an integer array containing possible duplicates.',
    questions: [
      {
        id: 'q11',
        question: 'What is the time complexity of generating all subsets of a set containing N distinct elements?',
        options: ['O(N log N)', 'O(N^2)', 'O(2^N)', 'O(N!)'],
        correctAnswer: 2,
        topic: 'Backtracking',
        explanation: 'Each element has 2 choices: include or exclude, yielding 2^N total combinations.'
      },
      {
        id: 'q12',
        question: 'In Java, why should String concatenation in loops be replaced with StringBuilder?',
        options: [
          'String is mutable and leads to race conditions',
          'String is immutable, causing repeated O(N) buffer copies and excessive heap garbage generation',
          'StringBuilder is synchronized and thread-safe',
          'The compiler cannot compile String concatenation'
        ],
        correctAnswer: 1,
        topic: 'Core Java',
        explanation: 'Immutable strings generate intermediate objects on every concatenation, transforming an O(N) loop into O(N^2).'
      }
    ]
  },
  {
    id: 'test-w5',
    weekNumber: 5,
    monthNumber: 2,
    title: 'Week 5 Assessment: Spring Boot IoC & Linked Lists',
    completed: false,
    score: 0,
    totalMarks: 100,
    codingTask: 'Reverse a Singly Linked List iteratively in O(N) time and O(1) space.',
    questions: [
      {
        id: 'q13',
        question: 'What is the default bean scope in the Spring Framework?',
        options: ['Prototype', 'Singleton', 'Request', 'Session'],
        correctAnswer: 1,
        topic: 'Spring Framework',
        explanation: 'Spring beans are singletons per ApplicationContext by default.'
      },
      {
        id: 'q14',
        question: 'Which algorithm detects a cycle in a linked list using O(1) extra space?',
        options: ['Kahn Algorithm', 'Floyd Cycle-Finding (Tortoise & Hare)', 'Tarjan Algorithm', 'Dijkstra'],
        correctAnswer: 1,
        topic: 'Linked Lists',
        explanation: 'Floyd cycle-finding uses slow (1 step) and fast (2 steps) pointers; if they collide, a cycle exists.'
      }
    ]
  }
];
