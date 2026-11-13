import { DailyTask } from '../types';

export const MONTH_THEMES = [
  {
    month: 1,
    title: 'Java Fundamentals + DSA Foundations',
    subtitle: 'Core Java 21, OOP Mastery, Collections, Complexity Analysis & Basic Sorting/Searching',
    project: 'Java Console-based Banking / Expense Core Engine',
    focus: 'Building unbreakable foundations in Java memory, syntax, and array/string problem patterns'
  },
  {
    month: 2,
    title: 'Intermediate DSA + Spring Boot Fundamentals',
    subtitle: 'Recursion, Backtracking, Linked Lists, Stacks, Queues & Spring Boot REST APIs',
    project: 'Task Management REST API with Jakarta Validation & Swagger',
    focus: 'Mastering linear pointer data structures and transitioning into modern Spring architecture'
  },
  {
    month: 3,
    title: 'Advanced DSA + Databases & JPA',
    subtitle: 'Binary Trees, BST, Heaps, Sliding Window & PostgreSQL, SQL, Hibernate, Spring Data JPA',
    project: 'Production Database-backed Inventory Service with Flyway',
    focus: 'Non-linear tree traversals and database query optimization, indexing, and transactions'
  },
  {
    month: 4,
    title: 'Graphs + Backend Security & Testing',
    subtitle: 'BFS, DFS, Topological Sort, Dijkstra & Spring Security 6, JWT, RBAC, JUnit 5, Mockito',
    project: 'Secure E-Commerce Backend with JWT Authentication and Role-based Access Control',
    focus: 'Graph representations and real-world stateless security architectures with high test coverage'
  },
  {
    month: 5,
    title: 'Dynamic Programming + Distributed Backend',
    subtitle: 'Memoization, Tabulation, Knapsack, LIS, Grid DP & Redis Caching, Apache Kafka, Microservices',
    project: 'Event-driven Asynchronous Backend with Redis and Kafka Message Queues',
    focus: 'Solving complex DP patterns and designing fault-tolerant, event-driven distributed systems'
  },
  {
    month: 6,
    title: 'DevOps + Cloud & Deployment',
    subtitle: 'Timed DSA Coding Sprints, Cumulative Revision & Linux, Docker, Docker Compose, AWS, CI/CD',
    project: 'Dockerized Cloud-Deployed Backend with Automated GitHub Actions Pipeline',
    focus: 'Translating backend code into resilient, containerized, cloud-hosted microservices on AWS'
  },
  {
    month: 7,
    title: 'System Design & Scalability',
    subtitle: 'Hard Interval/Greedy DSA & Scalability, Load Balancing, Caching, Sharding, CAP Theorem',
    project: 'Architectural Blueprint & Prototype for High-Concurrency Flash Sale / Chat Engine',
    focus: 'Cracking top-tier System Design interviews with real distributed systems trade-offs'
  },
  {
    month: 8,
    title: 'Advanced Backend Resilience + Major Capstone',
    subtitle: 'High-frequency FAANG Mixed Problems & Observability, Prometheus, Grafana, Idempotency, Outbox',
    project: 'Distributed Payment Processing System (Capstone: Spring Boot, Kafka, Redis, Postgres)',
    focus: 'Building the definitive portfolio capstone project with enterprise observability and idempotency'
  },
  {
    month: 9,
    title: 'FAANG Interview Drills & CS Fundamentals',
    subtitle: 'Blind 75 / Top 150 Speed Runs, Timed Mock Interviews, OS, DBMS, Networks & Resume/Offer Sprint',
    project: 'Live Portfolio Presentation, System Design Whiteboard Artifacts & FAANG Applications',
    focus: 'Peak interview performance, mock behavioral rounds, negotiation, and landing top-tier offers'
  }
];

// Helper to build the 252 structured days
export const generate252Roadmap = (): DailyTask[] => {
  const tasks: DailyTask[] = [];

  const rawCurriculum: { m: number; days: { dsa: string; be: string; dsaRes?: string; beRes?: string }[] }[] = [
    // Month 1 (Days 1 to 28)
    {
      m: 1,
      days: [
        { dsa: 'Time & Space Complexity: Big-O, Big-Omega, Big-Theta & Asymptotics', be: 'Java JVM, JRE, Memory Model: Stack vs Heap & Bytecode Execution' },
        { dsa: 'Array Basics: Memory Contiguity, Static vs Dynamic Arrays', be: 'OOP Deep-Dive: Encapsulation, Access Modifiers & Record Types in Java' },
        { dsa: 'Two-Pointer Technique: Two Sum II & Reverse String', be: 'OOP Inheritance, Method Overriding vs Overloading & Super Keyword' },
        { dsa: 'Prefix Sums Pattern: Range Sum Query & Running Sum', be: 'Polymorphism & Dynamic Method Dispatch Mechanics' },
        { dsa: 'String Manipulation: Palindrome Verification & StringBuilder Internals', be: 'Abstract Classes vs Interfaces & Java 8+ Default/Static Methods' },
        { dsa: 'Fixed-Size Sliding Window: Maximum Average Subarray', be: 'Exception Handling: Checked vs Unchecked, Try-with-Resources' },
        { dsa: 'Week 1 Review & Timed Coding: 3 Array Easy Problems', be: 'Week 1 Consolidation: Git Branching & GitHub Project Setup' },

        { dsa: 'String Anagrams: Frequency Arrays vs Hash Map', be: 'Java Collections Framework: ArrayList vs LinkedList Internal Benchmarks' },
        { dsa: 'Hash Maps: Two Sum & Frequency Counting Mechanics', be: 'Equals() and HashCode() Contract in Java: Collision Handling' },
        { dsa: 'Hash Sets: Contains Duplicate & Longest Consecutive Sequence', be: 'Java Generics: Type Erasure, Wildcards (? extends, ? super)' },
        { dsa: 'Matrix 2D Arrays: Set Matrix Zeroes & Diagonal Traversal', be: 'Java 8 Functional Interfaces: Predicate, Consumer, Supplier, Function' },
        { dsa: 'Basic Sorting: Selection Sort & Insertion Sort Analysis', be: 'Lambda Expressions & Method References in Deep Practice' },
        { dsa: 'Merge Sort: Divide & Conquer, Recurrence Relations & Inversions', be: 'Stream API: map, filter, collect, flatMap, reduce' },
        { dsa: 'Week 2 Review & Timed Coding: 3 String/Hashing Mediums', be: 'Week 2 Consolidation: Build Java Console Application Foundation' },

        { dsa: 'Quick Sort: Lomuto vs Hoare Partitioning & Worst-Case Mitigations', be: 'Maven & Gradle Lifecycle, Dependency Scopes & Pom.xml Structure' },
        { dsa: 'Binary Search: Classic Iterative & Recursive Implementations', be: 'Modern File I/O: java.nio.file, Path, Files & Buffer Streams' },
        { dsa: 'Binary Search: Search in Rotated Sorted Array (LeetCode 33)', be: 'Java Multithreading Basics: Thread, Runnable, Thread Lifecycle' },
        { dsa: 'Binary Search: Find First and Last Position in Sorted Array', be: 'Thread Safety: synchronized keyword, volatile, AtomicInteger' },
        { dsa: 'Binary Search on Answer: Square Root & Koko Eating Bananas', be: 'Java Concurrency Utilities: ExecutorService & ThreadPoolExecutor' },
        { dsa: 'Subarray Sum Equals K: Prefix Sum combined with HashMap', be: 'Design Patterns in Java: Singleton (Thread-safe Enum/Holder), Factory' },
        { dsa: 'Week 3 Review & Timed Coding: 3 Binary Search Challenges', be: 'Week 3 Consolidation: Finalize Core Logic of Banking CLI Engine' },

        { dsa: 'Longest Substring Without Repeating Characters (Sliding Window)', be: 'Design Patterns: Builder Pattern & Strategy Pattern Implementation' },
        { dsa: 'String Pattern Matching: Two-Pointer & Rolling Hash Intro', be: 'Java Garbage Collection Algorithms: G1GC, ZGC & Profiling Roots' },
        { dsa: 'Basic Recursion Patterns: Subsets & Subsequences Generation', be: 'Unit Testing with JUnit 5: Assertions, Lifecycle Annotations' },
        { dsa: 'Permutations & Combinations via Recursive Backtracking', be: 'Mocking Dependencies with Mockito: @Mock, when, verify' },
        { dsa: 'Bit Manipulation: Single Number, Counting Set Bits & Power of Two', be: 'Code Cleanliness: SOLID Principles applied to Java Codebase' },
        { dsa: 'Bitwise XOR Tricks: Missing Number & Two Odd Occurrences', be: 'Console Banking App Polish, Test Suite & Documentation' },
        { dsa: 'Month 1 Milestone Assessment: Java Core & Foundations Test', be: 'Month 1 Retrospective & GitHub Release v1.0 of Console Project' }
      ]
    },
    // Month 2 (Days 29 to 56)
    {
      m: 2,
      days: [
        { dsa: 'Recursion Masterclass: Call Stack Visualization & Stack Overflows', be: 'HTTP Protocol Deep-Dive: Verbs, Status Codes, Request/Response Headers' },
        { dsa: 'Generate Parentheses: Valid Parentheses Generation with Pruning', be: 'Spring Framework Architecture: Inversion of Control & ApplicationContext' },
        { dsa: 'Combination Sum: Backtracking with Element Re-use', be: 'Spring Dependency Injection: @Autowired, Constructor vs Setter Injection' },
        { dsa: 'Word Search I: Grid Backtracking and Boundary Checking', be: 'Spring Boot Starter Architecture & Auto-Configuration (@EnableAutoConfiguration)' },
        { dsa: 'Singly Linked List: Node Class, Insertion, Deletion, Traversal', be: 'Building REST Controllers: @RestController, @GetMapping, @PostMapping' },
        { dsa: 'Reverse a Linked List: Iterative Pointer Swaps vs Recursive', be: 'Handling Parameters: @PathVariable, @RequestParam, and @RequestBody JSON' },
        { dsa: 'Week 5 Review: Linked Lists & Controller Scaffolding', be: 'Week 5 Consolidation: Task Management REST API Scaffolding' },

        { dsa: 'Detect Cycle in Linked List: Floyd Cycle-Finding (Tortoise & Hare)', be: 'ResponseEntity, HTTP Headers & Custom Status Codes Modeling' },
        { dsa: 'Find Middle Node & Remove Nth Node From End of List', be: 'Service Layer Architecture: Single Responsibility & Business Rules' },
        { dsa: 'Merge Two Sorted Lists & Merge K Sorted Lists Introduction', be: 'Spring DTO Pattern & Entity-DTO Mapping using MapStruct' },
        { dsa: 'Reorder List & Palindrome Linked List (O(1) Auxiliary Space)', be: 'Bean Validation: jakarta.validation (@NotNull, @Size, @Email, @Min)' },
        { dsa: 'Stack Implementation: Array-based vs Linked List-based', be: 'Global Exception Handling with @ControllerAdvice & @ExceptionHandler' },
        { dsa: 'Valid Parentheses & Min Stack (O(1) GetMin Tracking)', be: 'RFC 7807 Problem Details Standard for Clean REST API Errors' },
        { dsa: 'Week 6 Review: Stacks & DTO Validation Drills', be: 'Week 6 Consolidation: Task Management CRUD Endpoints Complete' },

        { dsa: 'Evaluate Reverse Polish Notation using Explicit Stack', be: 'Spring Configuration: application.yml, Profiles (dev, test, prod)' },
        { dsa: 'Daily Temperatures: Monotonic Decreasing Stack Pattern', be: 'Spring Boot Actuator: Health Checks, Info Endpoint, Metrics' },
        { dsa: 'Next Greater Element I & II (Circular Array via Modulo)', be: 'Spring Application Events & Decoupled Custom Event Listeners' },
        { dsa: 'Queue Implementation: Circular Array vs Doubly Linked List', be: 'CORS Configuration in Spring Boot: Global vs Controller-level' },
        { dsa: 'Implement Queue using Stacks & Implement Stack using Queues', be: 'Integration Testing Controllers with @WebMvcTest & MockMvc' },
        { dsa: 'Sliding Window Maximum: Monotonic Deque Pattern (LeetCode 239)', be: 'OpenAPI 3 / Swagger Documentation Configuration for Task API' },
        { dsa: 'Week 7 Review: Monotonic Stack/Queue & MockMvc Tests', be: 'Week 7 Consolidation: Complete Integration Test Suite for Task API' },

        { dsa: 'Introduction to Binary Trees: Node Definition & Memory Structure', be: 'Pagination and Sorting: Pageable, Sort & PagedModel in REST' },
        { dsa: 'Binary Tree Traversals: Preorder, Inorder, Postorder (Recursive)', be: 'Spring Component Scanning, @ConditionalOnProperty & Bean Lifecycle' },
        { dsa: 'Binary Tree Level Order Traversal (BFS via Queue)', be: 'HTTP Caching: ETag, Cache-Control Headers & Conditional GET' },
        { dsa: 'Maximum Depth of Binary Tree & Balanced Binary Tree Check', be: 'REST Architectural Constraints: Statelessness, Idempotency, HATEOAS' },
        { dsa: 'Diameter of Binary Tree & Invert Binary Tree', be: 'Packaging Task Management API: Multi-stage Dockerfile' },
        { dsa: 'Symmetric Tree & Path Sum I/II (Backtracking in Trees)', be: 'Postman Collection Export, Comprehensive README & GitHub Push' },
        { dsa: 'Month 2 Milestone Assessment: Spring Boot REST & Tree Basics', be: 'Month 2 Retrospective & Task Management API Live Showcase' }
      ]
    },
    // Month 3 (Days 57 to 84)
    {
      m: 3,
      days: [
        { dsa: 'Lowest Common Ancestor in Binary Tree & BST', be: 'Relational Database Theory: Relational Algebra & ACID Guarantees' },
        { dsa: 'Binary Search Tree (BST): Search, Insert & Delete Operations', be: 'PostgreSQL Architecture: WAL, Shared Buffers, Processes & Schemas' },
        { dsa: 'Validate Binary Search Tree: Range Invariant Propagation', be: 'PostgreSQL DDL & DML: Tables, Data Types, Constraints (PK, FK, Check)' },
        { dsa: 'Kth Smallest Element in BST: Inorder Traversal Property', be: 'SQL Queries: GROUP BY, HAVING, Aggregate Functions & Execution Order' },
        { dsa: 'Construct Binary Tree from Preorder and Inorder Traversal', be: 'SQL Joins: INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER & Self Joins' },
        { dsa: 'Binary Tree Maximum Path Sum (Hard Recursive Postorder)', be: 'Database Normalization: 1NF, 2NF, 3NF & BCNF with Real Examples' },
        { dsa: 'Week 9 Review: Advanced Binary Trees & SQL Joins', be: 'Week 9 Consolidation: PostgreSQL Database Schema Design for Inventory' },

        { dsa: 'Serialize and Deserialize Binary Tree (BFS String Encoding)', be: 'B-Tree Indexing Internals, Multi-Column Indexes & Leaf Page Layout' },
        { dsa: 'Heaps / Priority Queues: Binary Heap Mechanics & Heapify O(N)', be: 'EXPLAIN and EXPLAIN ANALYZE: Reading Postgres Query Execution Plans' },
        { dsa: 'Kth Largest Element in an Array: Min-Heap vs QuickSelect', be: 'Database Transactions & Isolation Levels (Dirty Read to Phantom Read)' },
        { dsa: 'Top K Frequent Elements: Bucket Sort vs Heap Approach', be: 'Spring Data JPA Architecture: EntityManager, Persistence Context' },
        { dsa: 'Find Median from Data Stream: Two Heaps (Max-Heap + Min-Heap)', be: 'Entity Mapping: @Entity, @Table, @Id, @GeneratedValue, @Column' },
        { dsa: 'Merge K Sorted Lists using Priority Queue (O(N log K))', be: 'Entity Relationships: @OneToOne and @OneToMany Bidirectional Mapping' },
        { dsa: 'Week 10 Review: Heaps & JPA Mapping Relationships', be: 'Week 10 Consolidation: Relational Entity Models for Inventory Service' },

        { dsa: 'Two Pointers: 3Sum Problem (Sort + Duplicate Avoidance)', be: 'Entity Relationships: @ManyToMany with Explicit Join Table Entity' },
        { dsa: 'Two Pointers: 4Sum & Container With Most Water', be: 'Cascade Types (PERSIST, MERGE, REMOVE) and orphanRemoval Risks' },
        { dsa: 'Two Pointers: Trapping Rain Water (Two Pointers vs Monotonic Stack)', be: 'Spring Data Repositories: JpaRepository Built-in CRUD Methods' },
        { dsa: 'Sliding Window: Longest Repeating Character Replacement', be: 'Derived Query Methods vs @Query JPQL vs Native SQL Queries' },
        { dsa: 'Sliding Window: Minimum Window Substring (Hard Window Contract)', be: 'The Dreaded N+1 Query Problem: Detection & Profiling' },
        { dsa: 'Prefix Sums: Product of Array Except Self (O(1) Space)', be: 'Solving N+1: JOIN FETCH and JPA 2.1 @EntityGraph Strategies' },
        { dsa: 'Week 11 Review: Trapping Rain Water & JPA Query Optimization', be: 'Week 11 Consolidation: Inventory Service Queries Benchmarking' },

        { dsa: 'Hash Maps: Group Anagrams (Categorization by Sorted String/Tuple)', be: 'JPA Auditing: @CreatedDate, @LastModifiedDate & AuditorAware' },
        { dsa: 'Design In-Memory LRU Cache: Doubly Linked List + HashMap', be: 'Concurrency in JPA: Optimistic Locking with @Version Annotation' },
        { dsa: 'Design LFU Cache (Least Frequently Used Cache with O(1) Ops)', be: 'Pessimistic Locking: PESSIMISTIC_WRITE & Database Row Locks' },
        { dsa: 'Trie (Prefix Tree): Insertion, Search & StartsWith Implementation', be: 'Spring @Transactional: Propagation Levels (REQUIRED vs REQUIRES_NEW)' },
        { dsa: 'Trie: Design Add and Search Words with Wildcard Dot Matching', be: 'Database Migrations: Version-controlled Schema Changes with Flyway' },
        { dsa: 'Trie: Word Search II (Trie + DFS Backtracking Matrix)', be: 'Testing Repositories with Testcontainers and Real PostgreSQL' },
        { dsa: 'Month 3 Milestone Assessment: Databases, JPA & Advanced Trees', be: 'Month 3 Retrospective & Inventory Database Service Demo' }
      ]
    },
    // Month 4 (Days 85 to 112)
    {
      m: 4,
      days: [
        { dsa: 'Graph Representation: Adjacency Matrix vs Adjacency List', be: 'Web Application Security Fundamentals: CIA Triad, HTTPS, TLS Handshake' },
        { dsa: 'Breadth First Search (BFS) in Graph: Queue & Visited Set', be: 'OWASP Top 10 Security Vulnerabilities: Injection, Broken Auth, XSS' },
        { dsa: 'Depth First Search (DFS) in Graph: Recursive & Iterative', be: 'Spring Security 6 Architecture: DelegatingFilterProxy & SecurityFilterChain' },
        { dsa: 'Number of Islands: 2D Grid Graph Traversal (BFS & DFS)', be: 'Authentication Architecture: AuthenticationManager & UserDetailsService' },
        { dsa: 'Clone Graph: Deep Copy with Visited HashMap', be: 'Password Hashing: Salt, Work Factor & BCryptPasswordEncoder Mechanics' },
        { dsa: 'Max Area of Island & Surrounded Regions (Border Connected DFS)', be: 'Session-based vs Stateless Token-based Authentication' },
        { dsa: 'Week 13 Review: Graph Traversals & Security Filters', be: 'Week 13 Consolidation: E-Commerce Backend Security Foundation' },

        { dsa: 'Rotting Oranges: Multi-Source BFS with Step Counting', be: 'JSON Web Token (JWT) Standard: Header, Payload, Signature Cryptography' },
        { dsa: 'Course Schedule I: Cycle Detection in Directed Graph (DFS 3-Colors)', be: 'Implementing JwtAuthenticationFilter & OncePerRequestFilter' },
        { dsa: 'Course Schedule II: Topological Sort (Kahn Algorithm Indegree BFS)', be: 'Extracting Claims & Injecting Authentication into SecurityContextHolder' },
        { dsa: 'Alien Dictionary: Topological Sort on Lexicographical Rules', be: 'Role-Based Access Control (RBAC): @PreAuthorize("hasRole(\'ADMIN\')")' },
        { dsa: 'Pacific Atlantic Water Flow: Multi-source Inverted Flow', be: 'Refresh Token Flow: Short-lived Access Token & Rotating Refresh Token' },
        { dsa: 'Graph Bipartition Check: 2-Coloring via BFS/DFS', be: 'Handling Security Exceptions: Custom AuthenticationEntryPoint & AccessDenied' },
        { dsa: 'Week 14 Review: Topological Sort & JWT Security Chain', be: 'Week 14 Consolidation: Role Hierarchy in E-Commerce Backend' },

        { dsa: 'Shortest Path in Unweighted Graph: BFS Level Traversal', be: 'Cross-Site Request Forgery (CSRF) & CORS Policy Configuration' },
        { dsa: 'Dijkstra Algorithm: Shortest Path in Weighted Graph via PriorityQueue', be: 'Unit Testing Security Layer: @WithMockUser & SecurityMockMvc' },
        { dsa: 'Network Delay Time: Dijkstra Implementation on Directed Graph', be: 'JUnit 5 Nested Tests, DisplayNames & Parameterized Tests' },
        { dsa: 'Cheapest Flights Within K Stops: Bellman-Ford / Modified BFS', be: 'Mockito Spying: @Spy, ArgumentCaptor & InOrder Verification' },
        { dsa: 'Disjoint Set Union (DSU / Union-Find): Path Compression & Rank', be: 'Testing Repositories with @DataJpaTest and In-Memory/Testcontainers' },
        { dsa: 'Number of Connected Components in Undirected Graph via DSU', be: 'Testing Service Layer Business Exceptions with assertThrows' },
        { dsa: 'Week 15 Review: Dijkstra & Automated Test Suites', be: 'Week 15 Consolidation: E-Commerce Shopping Cart & Order Logic' },

        { dsa: 'Redundant Connection: Cycle Detection using Union-Find', be: 'Mocking External APIs with WireMock in Spring Boot' },
        { dsa: 'Accounts Merge: Graph Connected Components via Union-Find', be: 'Database Transactions in Order Creation: Isolation & Rollback Rules' },
        { dsa: 'Introduction to Dynamic Programming: Overlapping Subproblems & Optimal Substructure', be: 'Mock Payment Gateway Integration with WebClient' },
        { dsa: 'DP: Climbing Stairs & Min Cost Climbing Stairs (1D DP)', be: 'Auditing Security Events: Logback Configuration & Masking PII' },
        { dsa: 'DP: House Robber I & House Robber II (Circular House Array)', be: 'Clean Code: Refactoring Services, Controllers & DTO Mappers' },
        { dsa: 'DP: Coin Change (Unbounded Knapsack Form)', be: 'E-Commerce Security Penetration & RBAC Verification Tests' },
        { dsa: 'Month 4 Milestone Assessment: Graphs, Spring Security & Testing', be: 'Month 4 Retrospective & E-Commerce API Showcase' }
      ]
    },
    // Month 5 (Days 113 to 140)
    {
      m: 5,
      days: [
        { dsa: 'DP Fundamentals: Memoization (Top-Down) vs Tabulation (Bottom-Up)', be: 'Distributed Systems Challenges: Network Partitions, Clock Drift, Latency' },
        { dsa: '0/1 Knapsack Problem: Recursive formulation & 2D Tabulation', be: 'Redis Architecture: In-Memory Storage, Single-Threaded Event Loop' },
        { dsa: '0/1 Knapsack Space Optimization: 2D to 1D Array Transition', be: 'Redis Data Structures: Strings, Hashes, Lists, Sets, Sorted Sets (ZSet)' },
        { dsa: 'Partition Equal Subset Sum (Subset Sum problem mapping)', be: 'Spring Data Redis & Lettuce Client Configuration' },
        { dsa: 'Target Sum: Transformation into Subset Sum with Sign Variation', be: 'Declarative Caching: @Cacheable, @CachePut, @CacheEvict Annotations' },
        { dsa: 'Longest Increasing Subsequence (LIS): O(N^2) Tabulation', be: 'Cache Strategies: Cache-Aside, Write-Through, Write-Behind' },
        { dsa: 'Week 17 Review: Knapsack & Redis Caching Layer', be: 'Week 17 Consolidation: Add Redis Caching to Product Catalog' },

        { dsa: 'Longest Increasing Subsequence (LIS): O(N log N) Binary Search (Patience Sorting)', be: 'Cache Stampede, Cache Penetration (Bloom Filters) & Cache Breakdown' },
        { dsa: 'Longest Common Subsequence (LCS): 2D Grid DP Formulation', be: 'Redis TTL Expiration, Eviction Policies (LRU, LFU, Volatile)' },
        { dsa: 'Edit Distance (Levenshtein Distance): Insertion, Deletion, Replacement', be: 'Message Brokers Overview: Message Queues vs Event Streams' },
        { dsa: 'Distinct Subsequences: Two-String Matching DP', be: 'Apache Kafka Architecture: Topics, Partitions, Brokers, Cluster Controller' },
        { dsa: 'Grid DP: Unique Paths I & Unique Paths II (Obstacles)', be: 'Kafka Producers: Partitioners, acks (0, 1, all), Retries & Batching' },
        { dsa: 'Grid DP: Minimum Path Sum & Triangle Path Minimization', be: 'Kafka Consumers: Consumer Groups, Offsets & Commit Strategies' },
        { dsa: 'Week 18 Review: 2D DP & Kafka Cluster Basics', be: 'Week 18 Consolidation: Kafka Producer Configuration in Spring' },

        { dsa: 'Maximal Square: 2D DP Formula min(top, left, diag) + 1', be: 'Spring for Apache Kafka: KafkaTemplate & Message Serialization' },
        { dsa: 'Best Time to Buy and Sell Stock with Cooldown (State Machine DP)', be: 'Spring for Apache Kafka: @KafkaListener and ErrorHandler Setup' },
        { dsa: 'Best Time to Buy and Sell Stock with Transaction Fee', be: 'Kafka Rebalancing, Poison Pills & Dead Letter Queues (DLQ)' },
        { dsa: 'Best Time to Buy and Sell Stock IV (At Most K Transactions)', be: 'Consumer Idempotency: Deduplication Strategies via Redis / DB Unique Keys' },
        { dsa: 'Word Break I: 1D Substring DP & HashSet lookups', be: 'Microservices Fundamentals: Microservices vs Monolith Architecture' },
        { dsa: 'Word Break II: DP combined with Backtracking for all sentences', be: 'Inter-Service Communication: REST vs gRPC vs Asynchronous Messaging' },
        { dsa: 'Week 19 Review: State Machine DP & Kafka Consumers', be: 'Week 19 Consolidation: Order Event Publishing & Notification Consumer' },

        { dsa: 'Palindrome Partitioning II: Minimum Cuts via DP', be: 'API Gateway Pattern: Routing, Rate Limiting & Spring Cloud Gateway' },
        { dsa: 'Burst Balloons: Interval DP (Optimal Last Balloon Strategy)', be: 'Service Discovery with Netflix Eureka or HashiCorp Consul' },
        { dsa: 'Minimum Cost to Cut a Stick (Interval DP)', be: 'Distributed Transactions: 2-Phase Commit (2PC) Limitations' },
        { dsa: 'Graph: Strongly Connected Components (Kosaraju Algorithm)', be: 'Saga Pattern: Choreography vs Orchestration for Distributed Sagas' },
        { dsa: 'Graph: Bridges and Articulation Points in Graph (Tarjan Algorithm)', be: 'Fault Tolerance: Circuit Breaker, Retry & RateLimiter via Resilience4j' },
        { dsa: 'Mixed Problem Solving: DP + Graph Interview Questions', be: 'Integration Testing Distributed Pipeline with Embedded Kafka & Testcontainers' },
        { dsa: 'Month 5 Milestone Assessment: Dynamic Programming & Kafka', be: 'Month 5 Retrospective & Event-Driven Microservice Demo' }
      ]
    },
    // Month 6 (Days 141 to 168)
    {
      m: 6,
      days: [
        { dsa: 'Cumulative Revision: Arrays, Two Pointers & Sliding Window Sprints', be: 'Linux Shell Mastery: Essential CLI commands (ls, ps, kill, curl, netstat, lsof)' },
        { dsa: 'Cumulative Revision: Linked Lists, Stacks & Monotonic Queues', be: 'Linux Text Processing: grep, awk, sed, cut, sort, uniq & pipe redirection' },
        { dsa: 'Cumulative Revision: Binary Trees, BST & Tree Traversals', be: 'Linux File Permissions, Users, Groups, SSH Keys & Process Management' },
        { dsa: 'Cumulative Revision: Heaps, Priority Queues & Sorting', be: 'Docker Architecture: Daemon, Images, Containers, Registries & Storage' },
        { dsa: 'Cumulative Revision: Graphs, BFS, DFS & Topological Sort', be: 'Writing Efficient Multi-Stage Dockerfiles for Spring Boot Apps' },
        { dsa: 'Cumulative Revision: Dynamic Programming Knapsack & 1D DP', be: 'Docker Networking: Bridge, Host, Overlay & Container Port Mapping' },
        { dsa: 'Week 21 Review: Full DSA Diagnostic Benchmark', be: 'Week 21 Consolidation: Docker Compose for Java, Postgres, Redis & Kafka' },

        { dsa: 'Timed Coding Sprint: 3 Medium LeetCode Problems in 60 Minutes', be: 'Docker Volumes: Named Volumes, Bind Mounts & Database Persistence' },
        { dsa: 'Hard Problem Solving: Trapping Rain Water II (2D Heap BFS)', be: 'Cloud Fundamentals: IaaS vs PaaS vs SaaS & Cloud Architecture' },
        { dsa: 'Hard Problem Solving: Sliding Window Median (Two Heaps with Lazy Deletion)', be: 'AWS Overview: Regions, Availability Zones, IAM Roles & Policies' },
        { dsa: 'Hard Problem Solving: Word Ladder I & II (Shortest Path BFS)', be: 'AWS EC2: Instance Types, Key Pairs, Security Groups & Inbound Rules' },
        { dsa: 'Hard Problem Solving: Course Schedule III (Greedy Priority Queue)', be: 'AWS S3: Buckets, Object Storage, Access Control & Presigned URLs' },
        { dsa: 'Hard Problem Solving: Longest Valid Parentheses (DP vs Stack)', be: 'AWS RDS: Managed PostgreSQL, Multi-AZ, Read Replicas & Backups' },
        { dsa: 'Week 22 Review: Hard Problems & AWS Infrastructure', be: 'Week 22 Consolidation: Provision AWS VPC, EC2 & RDS Instance' },

        { dsa: 'Hard Problem Solving: Regular Expression Matching (2D DP)', be: 'Configuration Management: Environment Variables & AWS Systems Manager' },
        { dsa: 'Hard Problem Solving: Wildcard Matching (2D DP)', be: 'Deploying Spring Boot to AWS EC2: Systemd Daemon & Log Rotation' },
        { dsa: 'Hard Problem Solving: Median of Two Sorted Arrays (Binary Search)', be: 'Continuous Integration: GitHub Actions Workflow Triggers & Runners' },
        { dsa: 'Hard Problem Solving: Binary Tree Cameras (Greedy Tree Postorder)', be: 'CI Pipeline: Automated Maven Compile, Unit Tests & Checkstyle Lints' },
        { dsa: 'Hard Problem Solving: Cut Off Trees for Golf Event (BFS Grid)', be: 'CD Pipeline: Build Docker Image, Tag & Push to GitHub Container Registry' },
        { dsa: 'Hard Problem Solving: Maximum Profit in Job Scheduling (DP + Binary Search)', be: 'CD Pipeline: SSH Automated Deployment to AWS EC2 Host' },
        { dsa: 'Week 23 Review: Top-Tier Hard Problems & CI/CD Pipelines', be: 'Week 23 Consolidation: Zero-touch CI/CD Pipeline Fully Functional' },

        { dsa: 'FAANG Interview Mock Set 1: Array, String & Hash Set', be: 'Reverse Proxy: Nginx Configuration, SSL/TLS Certificates with Let\'s Encrypt' },
        { dsa: 'FAANG Interview Mock Set 2: Trees, Graphs & BFS', be: 'Zero-Downtime Deployment Strategies: Blue-Green vs Rolling Deployments' },
        { dsa: 'FAANG Interview Mock Set 3: Dynamic Programming & Backtracking', be: 'Container Security: Non-root User, Vulnerability Scanning with Trivy' },
        { dsa: 'FAANG Interview Mock Set 4: Interval & Matrix Problems', be: 'JVM Container Ergonomics: MaxRAMPercentage & CGroup Awareness' },
        { dsa: 'Weak-Topic Remediation: Dynamic Programming Edge Cases', be: 'Cloud Cost Optimization: Stop Instances, Reserved Instances & Budget Alerts' },
        { dsa: 'Weak-Topic Remediation: Graph Shortest Path Variations', be: 'Infrastructure Documentation: Deployment Runbook & Architecture Diagram' },
        { dsa: 'Month 6 Milestone Assessment: DevOps, Docker & Hard DSA Drills', be: 'Month 6 Retrospective & Live Cloud Deployment Verification' }
      ]
    },
    // Month 7 (Days 169 to 196)
    {
      m: 7,
      days: [
        { dsa: 'Intervals: Merge Intervals (Sort + Greedy Boundary Merge)', be: 'System Design Fundamentals: Vertical vs Horizontal Scaling, Throughput vs Latency' },
        { dsa: 'Intervals: Insert Interval & Non-Overlapping Intervals', be: 'High Availability (HA), Redundancy, Fault Tolerance & SLA/SLO/SLI Targets' },
        { dsa: 'Intervals: Meeting Rooms I & Meeting Rooms II (Chronological Min-Heap)', be: 'Load Balancing: Layer 4 vs Layer 7, Round Robin, Least Connections, IP Hash' },
        { dsa: 'Greedy: Jump Game I & Jump Game II (Minimum Jumps)', be: 'Reverse Proxies vs Forward Proxies, Keep-Alive Connections & HTTP/2' },
        { dsa: 'Greedy: Gas Station (Circular Tour Invariant)', be: 'Database Scaling: Read-Replicas, Primary-Replica Replication Lag' },
        { dsa: 'Greedy: Task Scheduler (Frequency Bucket Math + Heap)', be: 'Database Sharding: Range-based vs Hash-based Partitioning & Hotspot Keys' },
        { dsa: 'Week 25 Review: Intervals, Greedy & Database Scaling', be: 'Week 25 System Design: Scale a High-Read Relational Database' },

        { dsa: 'Math & Bitmask: Fast Exponentiation Pow(x, n)', be: 'CAP Theorem Deep-Dive: Consistency, Availability, Partition Tolerance trade-offs' },
        { dsa: 'Math: Divide Two Integers without Multiplication/Division', be: 'PACELC Theorem: Latency and Consistency trade-offs in normal operation' },
        { dsa: 'Tree: Lowest Common Ancestor with Parent Pointer', be: 'Consistent Hashing: Virtual Nodes, Hash Ring & Minimal Rebalancing' },
        { dsa: 'Tree: Count Complete Tree Nodes in O((log N)^2)', be: 'System Design: Design a URL Shortener (TinyURL) Architecture' },
        { dsa: 'Stack: Basic Calculator I (Parentheses + Unary Signs)', be: 'TinyURL Deep Dive: Base62 Encoding, Collision Handling & Redis Caching' },
        { dsa: 'Stack: Basic Calculator II (Multiplication/Division Precedence)', be: 'System Design: Design a Distributed Rate Limiter (Token Bucket vs Leaky Bucket)' },
        { dsa: 'Week 26 Review: Stacks & System Design (TinyURL & Rate Limiter)', be: 'Week 26 System Design Review: Rate Limiter Implementation in Redis' },

        { dsa: 'Stack: Largest Rectangle in Histogram (Monotonic Stack O(N))', be: 'System Design: Design a Scalable Notification System' },
        { dsa: 'Stack: Maximal Rectangle in Binary Matrix (Histogram Mapping)', be: 'Notification System Deep Dive: Priority Queues, Deduplication & Retries' },
        { dsa: 'Matrix: Spiral Matrix I & II (Layer-by-Layer Boundary)', be: 'System Design: Design a Distributed Chat System (WhatsApp / Messenger)' },
        { dsa: 'Matrix: Rotate Image 90 Degrees Clockwise In-Place', be: 'Chat App Deep Dive: WebSockets, Presence Service & Message Store' },
        { dsa: 'String: String to Integer (atoi) with Overflow Handling', be: 'System Design: Design an Object Storage System (Amazon S3)' },
        { dsa: 'String: Longest Palindromic Substring (Expand Around Center)', be: 'S3 Deep Dive: Chunking, Metadata DB, Multipart Uploads & Consistency' },
        { dsa: 'Week 27 Review: Matrix Algorithms & Chat App Design', be: 'Week 27 System Design Review: WebSocket Connection Scaling' },

        { dsa: 'Two Pointers: Sort Colors (Dutch National Flag Algorithm)', be: 'System Design: Design a Web Crawler' },
        { dsa: 'Binary Search: Search a 2D Matrix I & II', be: 'Web Crawler Deep Dive: URL Frontier, Politeness, Duplicate Page Detection' },
        { dsa: 'Graph: Reconstruct Itinerary (Eulerian Path Hierholzer Algorithm)', be: 'System Design: Design an E-Commerce Flash Sale System' },
        { dsa: 'Graph: Minimum Cost to Reach Destination in Time', be: 'Flash Sale Deep Dive: Redis Distributed Locks, Inventory Pre-allocation' },
        { dsa: 'DP: Minimum Insertion Steps to Make a String Palindrome', be: 'Distributed Locking: Redis Redlock Algorithm vs Database Row Advisory Locks' },
        { dsa: 'System Design Mock Interview Round 1: Peer / Mirror Practice', be: 'System Design Whiteboard Practice: High-Level Architecture Critique' },
        { dsa: 'Month 7 Milestone Assessment: System Design & Hard Interval DSA', be: 'Month 7 Retrospective & Flash Sale Architectural Blueprint Showcase' }
      ]
    },
    // Month 8 (Days 197 to 224)
    {
      m: 8,
      days: [
        { dsa: 'Algorithmic Financial Ledger Integrity & Float-to-Cent Math', be: 'Observability Pillars: Metrics, Logs & Distributed Tracing Principles' },
        { dsa: 'Bit Manipulation: Bitwise AND of Numbers Range in O(1)', be: 'Distributed Tracing: OpenTelemetry Standard, Trace ID, Span ID & Micrometer' },
        { dsa: 'Heaps: Find Median from Data Stream (Optimized Rebalance)', be: 'Centralized Logging: ELK Stack vs Loki & Structured JSON Logging' },
        { dsa: 'Graph: Evaluate Division (Weighted Directed Graph DFS)', be: 'Application Metrics: Prometheus Scraping & Micrometer Metrics Registry' },
        { dsa: 'Trie: Maximum XOR of Two Numbers in an Array', be: 'Visualizing System Health: Custom Grafana Dashboards for Latency & Error Rates' },
        { dsa: 'String: Minimum Window Subsequence (Two-Pointer DP)', be: 'Payment Architecture: Idempotency Keys, Deduplication Tables & SHA256 Payloads' },
        { dsa: 'Week 29 Review: Observability & Idempotency Patterns', be: 'Week 29 Capstone: Scaffold Distributed Payment Processing Service' },

        { dsa: 'DP: Maximum Subarray & Maximum Product Subarray (Kadane)', be: 'Transactional Outbox Pattern: Atomic DB Write and Kafka Event Emitting' },
        { dsa: 'DP: Best Time to Buy and Sell Stock (All 6 LeetCode Variants Review)', be: 'Implementing Outbox Event Poller with Spring Scheduled / Debezium CDC' },
        { dsa: 'DP: Longest Chunked Palindrome Decomposition', be: 'Distributed Locks in Payment Settlement: Redis Locks with Auto-Renewal' },
        { dsa: 'Tree: Distribute Coins in Binary Tree', be: 'Resilience4j Integration: Circuit Breaker for External Payment Gateway (Stripe/PayPal)' },
        { dsa: 'Tree: All Nodes Distance K in Binary Tree', be: 'Exponential Backoff and Jitter Implementation for Transient Network Faults' },
        { dsa: 'Graph: Find Eventual Safe States (Kahn vs DFS Cycle)', be: 'Database Index & Query Plan Optimization for High-Volume Ledger Tables' },
        { dsa: 'Week 30 Review: Outbox Pattern & Resilience4j Circuit Breakers', be: 'Week 30 Capstone: Idempotent Ledger and Payment State Engine' },

        { dsa: 'Timed Coding Sprint: 2 Mediums + 1 Hard under 60 minutes', be: 'High Concurrency Load Testing: Apache JMeter & Locust Benchmark Scripts' },
        { dsa: 'Timed Coding Sprint: Graph & Tree Hybrid Problem Set', be: 'Reconciliation Service Architecture: Batch Matching & Discrepancy Detection' },
        { dsa: 'Timed Coding Sprint: String & Sliding Window Hybrid Problem Set', be: 'Spring Batch Fundamentals: Job, Step, ItemReader, ItemProcessor, ItemWriter' },
        { dsa: 'Timed Coding Sprint: Complex Dynamic Programming Top-Down', be: 'PCI-DSS Compliance Principles: Tokenization & Protecting Cardholder Data' },
        { dsa: 'Timed Coding Sprint: Monotonic Queue & Deque Patterns', be: 'API Gateway Rate Limiting for Financial Transactions' },
        { dsa: 'Timed Coding Sprint: Bitmask Dynamic Programming Problems', be: 'Observability Drill: Injecting Latency and Tracing Payment Bottlenecks' },
        { dsa: 'Week 31 Review: Timed Algorithmic Sets & Spring Batch', be: 'Week 31 Capstone: Daily Settlement & Reconciliation Batch Job' },

        { dsa: 'Complex Backtracking: Word Break II & Expression Add Operators', be: 'Chaos Engineering: Simulating Network Failures & Database Dropouts' },
        { dsa: 'Hard Tree Problem: Binary Tree Cameras (Recursive State Machine)', be: 'Dockerizing the Complete Payment Gateway Suite (Postgres, Redis, Kafka, App)' },
        { dsa: 'Disjoint Set: Number of Operations to Make Network Connected', be: 'Automated Integration Testing for Capstone with Testcontainers' },
        { dsa: 'Graph: Shortest Path with Alternating Colors', be: 'Production Runbook & Disaster Recovery Failover Architecture' },
        { dsa: 'Mixed High-Frequency FAANG DSA Problem Solving', be: 'Capstone Documentation: Architecture Diagrams & Benchmark Metrics in README' },
        { dsa: 'Major Project Code Freeze, Linting & Refactoring', be: 'Live Demo Video Recording / Walkthrough Preparation' },
        { dsa: 'Month 8 Milestone Assessment: Major Capstone Complete', be: 'Month 8 Retrospective: Distributed Payment Processing System Showcase' }
      ]
    },
    // Month 9 (Days 225 to 252)
    {
      m: 9,
      days: [
        { dsa: 'Blind 75 Speed Run: Arrays & Hashing Top 10 Problems', be: 'Operating Systems: Processes vs Threads, Context Switching & Fork()' },
        { dsa: 'Blind 75 Speed Run: Two Pointers & Sliding Window Top 8 Problems', be: 'Operating Systems: CPU Scheduling Algorithms (SJF, Round Robin, Multi-level)' },
        { dsa: 'Blind 75 Speed Run: Binary Search & Intervals Top 8 Problems', be: 'Operating Systems: Deadlocks, Coffman Conditions & Banker Algorithm' },
        { dsa: 'Blind 75 Speed Run: Linked Lists & Stacks Top 8 Problems', be: 'Operating Systems: Virtual Memory, Paging, Page Faults, LRU Page Replacement' },
        { dsa: 'Blind 75 Speed Run: Trees & BST Top 10 Problems', be: 'Computer Networks: OSI 7-Layer vs TCP/IP 4-Layer Model & Encapsulation' },
        { dsa: 'Blind 75 Speed Run: Graphs & BFS/DFS Top 8 Problems', be: 'Computer Networks: TCP 3-Way Handshake, 4-Way Teardown, TCP vs UDP' },
        { dsa: 'Week 33 Review: Blind 75 Sprint & OS/Networks Deep-Dive', be: 'Week 33 Career: Polish Software Engineering Resume (Google XYZ / STAR Format)' },

        { dsa: 'Blind 75 Speed Run: Dynamic Programming Top 10 Problems', be: 'Computer Networks: TCP Congestion Control (Slow Start, Fast Retransmit)' },
        { dsa: 'Blind 75 Speed Run: Heaps & Priority Queues Top 6 Problems', be: 'Computer Networks: DNS Resolution Process, TLS 1.3 Handshake, HTTP/2 vs HTTP/3' },
        { dsa: 'FAANG Live Coding Mock 1: Arrays, HashMaps & Sliding Window', be: 'DBMS: Transactions, ACID Deep Dive, WAL & Checkpointing' },
        { dsa: 'FAANG Live Coding Mock 2: Trees & Graph Traversal Challenge', be: 'DBMS: B+ Tree Internals, Clustered vs Non-Clustered Indexes' },
        { dsa: 'FAANG Live Coding Mock 3: Dynamic Programming & Intervals', be: 'Java Deep-Dive: Memory Leaks, Classloaders & Garbage Collector Tuning' },
        { dsa: 'System Design Mock Round 1: Design YouTube / Netflix Video Streaming', be: 'System Design Revision: CDN Edge Caching, Transcoding & Adaptive Bitrate' },
        { dsa: 'Week 34 Review: Live Mocks Feedback Analysis', be: 'Week 34 Career: Overhaul LinkedIn Profile & GitHub Showcase Portfolio' },

        { dsa: 'System Design Mock Round 2: Design Uber / Ride Sharing Geo-Service', be: 'System Design Revision: QuadTrees, GeoHashing, Driver Dispatch & WebSockets' },
        { dsa: 'Behavioral Mock Round: Amazon 16 Leadership Principles & STAR Stories', be: 'Behavioral Stories Preparation: Conflicts, Disagreements, Deliverables under Pressure' },
        { dsa: 'Company-Specific Deep Dive: Google High-Frequency Coding Set', be: 'Top Java Backend Interview Questions: Spring Bean Scopes & Lifecycle' },
        { dsa: 'Company-Specific Deep Dive: Apple High-Frequency Coding Set', be: 'Top Java Backend Interview Questions: Spring Security & JWT Token Revocation' },
        { dsa: 'Company-Specific Deep Dive: Microsoft High-Frequency Coding Set', be: 'Top Java Backend Interview Questions: Database Indexing, Joins & Isolation' },
        { dsa: 'Company-Specific Deep Dive: Amazon High-Frequency Coding Set', be: 'Top Java Backend Interview Questions: Distributed Transactions & Outbox Pattern' },
        { dsa: 'Week 35 Review: Company-Specific Drills & Behavioral Review', be: 'Week 35 Career: Submit 30 Targeted Tier-1 Applications with Referrals' },

        { dsa: 'Company-Specific Deep Dive: Meta High-Frequency Coding Set', be: 'Top Java Backend Interview Questions: Caching Strategies & Message Queues' },
        { dsa: 'Speed Solving Drill: 2 Medium Problems under 40 minutes', be: 'System Design Revision: Design a Distributed Key-Value Store (DynamoDB)' },
        { dsa: 'Edge Cases Mastery: Dealing with Overflows, Nulls, Empty Inputs, Cycles', be: 'System Design Revision: Design a Distributed Web Cache (Memcached)' },
        { dsa: 'Mental Calmness Simulation: Thinking Out Loud under Time Pressure', be: 'Negotiation Tactics & Compensation Benchmark Review (Levels.fyi)' },
        { dsa: 'Final Algorithmic Review: Review of All 150 Core Patterns', be: 'Walkthrough of All 7 Finished Portfolio Projects' },
        { dsa: 'Roadmap Day 251: Ultimate Technical Retrospective & Self-Check', be: 'Confidence Assessment & Final Interview Checklist Validation' },
        { dsa: 'Roadmap Day 252: Ready for Apple, Google, Microsoft, Meta!', be: 'You are now an exceptional, interview-ready backend engineer. Execute!' }
      ]
    }
  ];

  let dayCounter = 1;

  rawCurriculum.forEach(monthItem => {
    monthItem.days.forEach(dayItem => {
      const weekNumber = Math.floor((dayCounter - 1) / 7) + 1;
      tasks.push({
        id: `day-${dayCounter}`,
        dayNumber: dayCounter,
        month: monthItem.m,
        week: weekNumber,
        title: `Day ${dayCounter}: ${dayItem.dsa.split(':')[0].trim()}`,
        dsa: {
          title: dayItem.dsa,
          description: `Algorithmic focus: ${dayItem.dsa}. Solve in Java with clean, idiomatic code and optimal time/space complexity.`,
          duration: 75,
          completed: false,
          resource: 'https://leetcode.com/problemset/all/'
        },
        backend: {
          title: dayItem.be,
          description: `Backend engineering drill: ${dayItem.be}. Write production-grade code adhering to clean architecture.`,
          duration: 90,
          completed: false,
          resource: 'https://docs.spring.io/spring-boot/docs/current/reference/html/'
        },
        revision: {
          title: 'Daily Consolidation, Anki / Markdown & Git Push',
          description: 'Document key architectural insights, review flashcards, commit your daily progress to GitHub.',
          duration: 15,
          completed: false,
          githubPushed: false
        },
        isCompleted: false
      });
      dayCounter++;
    });
  });

  return tasks;
};
