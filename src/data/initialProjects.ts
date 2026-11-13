import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: '1. Java Console-based Banking Core Engine',
    description: 'Object-oriented core banking simulation handling multi-threaded transactions, ReentrantLock concurrency guards, and custom serialization/file persistence.',
    techStack: ['Java 21', 'Multithreading', 'ReentrantLock', 'OOP Principles', 'JUnit 5'],
    startDate: '',
    deadline: '',
    status: 'Planned',
    githubUrl: '',
    liveUrl: '',
    milestones: [
      { id: 'm1', title: 'Class hierarchy and account abstractions (Savings, Checking)', completed: false },
      { id: 'm2', title: 'Thread-safe deposit, withdrawal, and transfer with ReentrantLock', completed: false },
      { id: 'm3', title: 'File I/O audit log persistence and ledger serialization', completed: false },
      { id: 'm4', title: 'Unit test suite with 90%+ code coverage via JUnit 5', completed: false }
    ],
    notes: 'Focus on object-oriented design, race condition prevention, and Java memory model fundamentals.'
  },
  {
    id: 'proj-2',
    title: '2. Task & Workflow Management REST API',
    description: 'Enterprise REST service with layered architecture, Jakarta Validation, global exception handler (RFC 7807), MapStruct DTO mapping, and Swagger/OpenAPI documentation.',
    techStack: ['Spring Boot 3', 'Java 21', 'MapStruct', 'Swagger/OpenAPI', 'MockMvc'],
    startDate: '',
    deadline: '',
    status: 'Planned',
    githubUrl: '',
    liveUrl: '',
    milestones: [
      { id: 'm5', title: 'Domain controller, service, repository layering with DTO isolation', completed: false },
      { id: 'm6', title: 'Jakarta Bean Validation and RFC 7807 ProblemDetails handling', completed: false },
      { id: 'm7', title: 'Pagination, sorting (Pageable), and dynamic filter queries', completed: false },
      { id: 'm8', title: 'MockMvc controller slice and integration test suite', completed: false }
    ],
    notes: 'Enforces clean REST semantics, consistent HTTP status code usage, and robust input validation.'
  },
  {
    id: 'proj-3',
    title: '3. Production Database-Backed Inventory Service',
    description: 'High-performance PostgreSQL-backed engine utilizing Spring Data JPA, Flyway migration versioning, and complex composite indexing strategies.',
    techStack: ['Spring Boot 3', 'PostgreSQL', 'Spring Data JPA', 'Flyway', 'Testcontainers'],
    startDate: '',
    deadline: '',
    status: 'Planned',
    githubUrl: '',
    liveUrl: '',
    milestones: [
      { id: 'm9', title: 'Relational schema design with foreign key constraints & check constraints', completed: false },
      { id: 'm10', title: 'Flyway migration versioning scripts for reproducible schemas', completed: false },
      { id: 'm11', title: 'Query tuning with JOIN FETCH and EXPLAIN ANALYZE index proofs', completed: false },
      { id: 'm12', title: 'Testcontainers automated PostgreSQL integration tests', completed: false }
    ],
    notes: 'Deep focus on indexing, transaction isolation levels, and locking models.'
  },
  {
    id: 'proj-4',
    title: '4. Secure E-Commerce Backend (JWT & RBAC)',
    description: 'Stateless store backend featuring Spring Security 6 filter chains, JWT access/refresh token rotation, role hierarchy, and cart checkout boundaries.',
    techStack: ['Spring Boot 3', 'Spring Security 6', 'JWT', 'PostgreSQL', 'BCrypt'],
    startDate: '',
    deadline: '',
    status: 'Planned',
    githubUrl: '',
    liveUrl: '',
    milestones: [
      { id: 'm13', title: 'Custom SecurityFilterChain & JWT Filter implementation', completed: false },
      { id: 'm14', title: 'Rotating refresh token architecture with Redis revocation blacklist', completed: false },
      { id: 'm15', title: 'Role-Based Access Control (@PreAuthorize) for Admin vs Customer', completed: false },
      { id: 'm16', title: 'Security penetration tests & OWASP input sanitization verification', completed: false }
    ],
    notes: 'Directly mirrors FAANG-grade security and authentication requirements.'
  },
  {
    id: 'proj-5',
    title: '5. Event-Driven Asynchronous Pipeline with Kafka',
    description: 'Asynchronous event architecture decoupling payment events, user notifications, and inventory reservation via Apache Kafka and Redis caching.',
    techStack: ['Spring Boot 3', 'Apache Kafka', 'Redis Caching', 'Docker Compose'],
    startDate: '',
    deadline: '',
    status: 'Planned',
    githubUrl: '',
    liveUrl: '',
    milestones: [
      { id: 'm17', title: 'Kafka Producer & Consumer clusters setup with partition routing', completed: false },
      { id: 'm18', title: 'Dead-letter queues (DLQ) and exponential backoff retry handling', completed: false },
      { id: 'm19', title: 'Redis Cache-Aside implementation with TTL and stampede mitigation', completed: false },
      { id: 'm20', title: 'End-to-end integration test with embedded Kafka in Docker', completed: false }
    ],
    notes: 'Essential for high-scale backend distributed system discussions.'
  },
  {
    id: 'proj-6',
    title: '6. Dockerized Cloud-Deployed Infrastructure',
    description: 'Multi-container application automated via GitHub Actions CI/CD and deployed to an AWS cloud environment with Nginx reverse proxy and SSL.',
    techStack: ['Docker', 'Docker Compose', 'AWS EC2 / RDS', 'GitHub Actions', 'Nginx'],
    startDate: '',
    deadline: '',
    status: 'Planned',
    githubUrl: '',
    liveUrl: '',
    milestones: [
      { id: 'm21', title: 'Optimized multi-stage Docker builds with minimal Alpine base', completed: false },
      { id: 'm22', title: 'Docker Compose orchestration with PostgreSQL and Redis containers', completed: false },
      { id: 'm23', title: 'GitHub Actions workflow with build, test, and container registry push', completed: false },
      { id: 'm24', title: 'Nginx reverse proxy with SSL termination on AWS EC2', completed: false }
    ],
    notes: 'Proves complete developer ownership from local code to live cloud URL.'
  },
  {
    id: 'proj-7',
    title: '7. Distributed Payment Processing System (Capstone)',
    description: 'High-concurrency, fault-tolerant payment gateway featuring idempotent transactions, transactional outbox pattern, circuit breakers, and distributed tracing.',
    techStack: ['Spring Boot 3', 'PostgreSQL', 'Redis', 'Kafka', 'Resilience4j', 'OpenTelemetry', 'Prometheus'],
    startDate: '',
    deadline: '',
    status: 'Planned',
    githubUrl: '',
    liveUrl: '',
    milestones: [
      { id: 'm25', title: 'Idempotency key engine with distributed Redis locks & deduplication', completed: false },
      { id: 'm26', title: 'Transactional Outbox pattern for guaranteed at-least-once publishing', completed: false },
      { id: 'm27', title: 'Resilience4j circuit breakers, retries, and fallback payment routes', completed: false },
      { id: 'm28', title: 'Prometheus & Grafana distributed tracing with custom dashboards', completed: false },
      { id: 'm29', title: 'JMeter load test: 2,500+ requests/sec with zero duplicate charges', completed: false }
    ],
    notes: 'The centerpiece capstone project designed to dominate senior and FAANG-level engineering interviews.'
  }
];
