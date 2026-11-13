import { BackendModule } from '../types';

export const BACKEND_MODULES: BackendModule[] = [
  {
    id: 'mod-1',
    title: '1. Core & Modern Java 21',
    description: 'Master JVM memory architecture, Garbage Collection, Java 21 Virtual Threads, Records, and Streams.',
    lessons: [
      { id: 'l1', title: 'JVM Memory Internals: Stack, Heap, Metaspace & GC Roots', duration: '2.5 hrs', completed: false, documentationUrl: 'https://dev.java/' },
      { id: 'l2', title: 'Generics: Type Erasure, Invariance, Covariance & PECS', duration: '2.0 hrs', completed: false, documentationUrl: 'https://dev.java/' },
      { id: 'l3', title: 'Java Concurrency: ExecutorService, Virtual Threads & Locks', duration: '3.0 hrs', completed: false, documentationUrl: 'https://dev.java/' },
      { id: 'l4', title: 'Stream API & Functional Interfaces: map, filter, flatMap', duration: '2.0 hrs', completed: false, documentationUrl: 'https://dev.java/' }
    ]
  },
  {
    id: 'mod-2',
    title: '2. Spring Boot 3 & REST API Architecture',
    description: 'Production Spring Boot application engineering with clean domain boundaries, DTOs, and RFC 7807.',
    lessons: [
      { id: 'l5', title: 'IoC Container, Bean Scopes (@Scope) & Lifecycle Callbacks', duration: '2.5 hrs', completed: false, documentationUrl: 'https://spring.io/projects/spring-boot' },
      { id: 'l6', title: 'RESTful API Standards, DTOs & Custom Jakarta Validation', duration: '3.0 hrs', completed: false, documentationUrl: 'https://spring.io/projects/spring-boot' },
      { id: 'l7', title: 'Global Exception Handling with @ControllerAdvice & ProblemDetails', duration: '1.5 hrs', completed: false, documentationUrl: 'https://spring.io/projects/spring-boot' },
      { id: 'l8', title: 'Spring Actuator, Custom Health Probes & Micrometer Metrics', duration: '2.0 hrs', completed: false, documentationUrl: 'https://spring.io/projects/spring-boot' }
    ]
  },
  {
    id: 'mod-3',
    title: '3. PostgreSQL & Spring Data JPA',
    description: 'Schema modeling, B-Tree indexing, transaction isolation, and high-performance ORM query tuning.',
    lessons: [
      { id: 'l9', title: 'Relational Modeling, Normalization (1NF-BCNF) & Foreign Keys', duration: '3.0 hrs', completed: false, documentationUrl: 'https://www.postgresql.org/docs/' },
      { id: 'l10', title: 'B-Tree Indexing, EXPLAIN ANALYZE & Query Execution Plans', duration: '2.5 hrs', completed: false, documentationUrl: 'https://www.postgresql.org/docs/' },
      { id: 'l11', title: 'JPA Entity Graphs, Fetch Strategies & Preventing N+1 Queries', duration: '3.0 hrs', completed: false, documentationUrl: 'https://spring.io/projects/spring-data-jpa' },
      { id: 'l12', title: 'Database Migrations with Flyway & Testcontainers Testing', duration: '2.0 hrs', completed: false, documentationUrl: 'https://flywaydb.org/' }
    ]
  },
  {
    id: 'mod-4',
    title: '4. Spring Security 6 & JWT Authentication',
    description: 'Stateless auth, RBAC, OAuth2, and defense against OWASP vulnerabilities.',
    lessons: [
      { id: 'l13', title: 'SecurityFilterChain, DelegatingFilterProxy & Providers', duration: '3.0 hrs', completed: false, documentationUrl: 'https://spring.io/projects/spring-security' },
      { id: 'l14', title: 'JWT Token Issuance, Verification & OncePerRequestFilter', duration: '3.0 hrs', completed: false, documentationUrl: 'https://jwt.io/' },
      { id: 'l15', title: 'Role-Based Access Control (@PreAuthorize) & Method Security', duration: '2.0 hrs', completed: false, documentationUrl: 'https://spring.io/projects/spring-security' },
      { id: 'l16', title: 'Refresh Token Rotation with Secure Storage & Revocation', duration: '2.5 hrs', completed: false, documentationUrl: 'https://spring.io/projects/spring-security' }
    ]
  },
  {
    id: 'mod-5',
    title: '5. Redis & Apache Kafka (Distributed Systems)',
    description: 'Sub-millisecond in-memory caching and resilient asynchronous event streaming at scale.',
    lessons: [
      { id: 'l17', title: 'Redis Cache-Aside Pattern, TTL Expiration & Stampede Defense', duration: '2.5 hrs', completed: false, documentationUrl: 'https://redis.io/docs/' },
      { id: 'l18', title: 'Kafka Topics, Partitions, Consumer Groups & Offset Management', duration: '3.0 hrs', completed: false, documentationUrl: 'https://kafka.apache.org/documentation/' },
      { id: 'l19', title: 'Idempotent Producers & Exactly-Once Semantics (EOS)', duration: '3.0 hrs', completed: false, documentationUrl: 'https://kafka.apache.org/' },
      { id: 'l20', title: 'Transactional Outbox Pattern with Kafka and Postgres CDC', duration: '3.5 hrs', completed: false, documentationUrl: 'https://microservices.io/' }
    ]
  },
  {
    id: 'mod-6',
    title: '6. Docker, AWS Cloud & Automated CI/CD',
    description: 'Containerization, automated testing pipelines, and live production cloud deployment on AWS.',
    lessons: [
      { id: 'l21', title: 'Multi-stage Production Dockerfiles for Optimized JVM Images', duration: '2.0 hrs', completed: false, documentationUrl: 'https://docs.docker.com/' },
      { id: 'l22', title: 'Docker Compose Orchestration (Java, Postgres, Redis, Kafka)', duration: '2.0 hrs', completed: false, documentationUrl: 'https://docs.docker.com/compose/' },
      { id: 'l23', title: 'AWS EC2, VPC, Security Groups, IAM & RDS PostgreSQL Provisioning', duration: '3.0 hrs', completed: false, documentationUrl: 'https://aws.amazon.com/' },
      { id: 'l24', title: 'GitHub Actions Automated CI/CD: Test, Build & SSH Auto-Deploy', duration: '2.5 hrs', completed: false, documentationUrl: 'https://docs.github.com/actions' }
    ]
  },
  {
    id: 'mod-7',
    title: '7. System Design & Architectural Patterns',
    description: 'High-availability, load balancing, database sharding, CAP theorem, and FAANG whiteboard scenarios.',
    lessons: [
      { id: 'l25', title: 'Load Balancers (L4 vs L7), Reverse Proxies & CDN Edge Caching', duration: '2.5 hrs', completed: false, documentationUrl: 'https://github.com/donnemartin/system-design-primer' },
      { id: 'l26', title: 'Database Sharding, Partitioning Keys & Consistent Hashing', duration: '3.0 hrs', completed: false, documentationUrl: 'https://github.com/donnemartin/system-design-primer' },
      { id: 'l27', title: 'Distributed Rate Limiting with Redis Token Bucket & Lua Scripts', duration: '2.5 hrs', completed: false, documentationUrl: 'https://redis.io/' },
      { id: 'l28', title: 'Designing High-Scale Distributed Systems (WhatsApp & Flash Sale)', duration: '3.5 hrs', completed: false, documentationUrl: 'https://github.com/donnemartin/system-design-primer' }
    ]
  },
  {
    id: 'mod-8',
    title: '8. Testing, Observability & Resilience',
    description: 'Unit testing, integration testing, circuit breakers, Prometheus, and distributed tracing.',
    lessons: [
      { id: 'l29', title: 'JUnit 5, Mockito & MockMvc Slice Testing in Spring Boot', duration: '2.5 hrs', completed: false, documentationUrl: 'https://junit.org/junit5/' },
      { id: 'l30', title: 'Resilience4j: Circuit Breakers, Retries, RateLimiter & Fallbacks', duration: '2.5 hrs', completed: false, documentationUrl: 'https://resilience4j.readme.io/' },
      { id: 'l31', title: 'Prometheus Metrics Scraping & Grafana Real-Time Dashboards', duration: '2.5 hrs', completed: false, documentationUrl: 'https://prometheus.io/' },
      { id: 'l32', title: 'Distributed Tracing with OpenTelemetry, TraceID & SpanID', duration: '2.5 hrs', completed: false, documentationUrl: 'https://opentelemetry.io/' }
    ]
  }
];
