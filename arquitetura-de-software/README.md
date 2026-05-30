# Arquitetura de Software — Estudo de Conceitos Intermediários e Avançados

Material de estudo aprofundado, em português, cobrindo **137 conceitos** de arquitetura de software e fundamentos de ciência da computação, organizados em 17 blocos temáticos. Cada conceito tem seu próprio arquivo com: definição aprofundada, mecânica de funcionamento, **diagrama de fluxo (Mermaid)**, exemplo prático em cenário brasileiro (e-commerce/marketplace/fintech), trade-offs de quando usar e evitar, anti-padrões e **referências reais** (blogs, papers, docs oficiais e livros).

O material tem duas partes complementares: **Parte I — Arquitetura (blocos 01–10)**, voltada ao papel de arquiteto; e **Parte II — Fundamentos de CS e entrevistas (blocos 11–17)**, cobrindo complexidade, estruturas de dados, algoritmos, concorrência, banco de dados a fundo, redes e System Design.

> Público-alvo: dev sênior em transição para arquiteto e preparação para entrevistas de senioridade. Nível: intermediário/avançado.

---

## Como usar este material

Cada arquivo é autocontido e segue a mesma estrutura: `TL;DR → O problema que resolve → O que é → Como funciona → Diagrama de fluxo → Exemplo prático → Quando usar/evitar → Anti-padrões → Relação com outros conceitos → Referências`.

Os diagramas Mermaid renderizam automaticamente no GitHub, GitLab, Obsidian, VS Code (com extensão) e na maioria dos visualizadores de Markdown. Os blocos `## Relação com outros conceitos` conectam os arquivos entre si — siga esses fios para construir o mapa mental.

Sugestão: leia na ordem do **roteiro** abaixo, não na ordem das pastas. A numeração das pastas é organizacional; o roteiro otimiza a curva de aprendizado.

---

## Roteiro de estudo sugerido

Estimativas para ~1h de estudo focado por dia (leitura + anotações + um diagrama desenhado à mão). Ajuste ao seu ritmo. O total gira em torno de **8 a 10 semanas** em ritmo confortável.

### Fase 0 — Base mental (semana 1)

Antes de qualquer estilo ou padrão, entenda como se *pensa* arquitetura: em atributos de qualidade e trade-offs, não em tecnologias.

| Ordem | Conceito | Por quê primeiro |
|---|---|---|
| 1 | [Atributos de qualidade](01-fundamentos-arquiteturais/01-atributos-de-qualidade.md) | É o vocabulário de todo o resto. Trade-off entre eles é o cerne do trabalho de arquiteto. |
| 2 | [C4 Model](01-fundamentos-arquiteturais/05-c4-model.md) | Você vai querer diagramar tudo daqui pra frente. |
| 3 | [ADRs](01-fundamentos-arquiteturais/02-architecture-decision-records-adr.md) | Aprenda a registrar decisões desde já. |
| 4 | [Conway's Law e Inverse Conway](01-fundamentos-arquiteturais/04-conway-law-e-inverse-conway-maneuver.md) | Arquitetura é também organização. |
| 5 | [Fitness Functions](01-fundamentos-arquiteturais/03-fitness-functions.md) | Como garantir que a arquitetura não se degrade. |

### Fase 1 — Estilos de organização de código (semana 2)

Do clássico ao moderno, entendendo cada estilo como reação aos problemas do anterior.

| Ordem | Conceito |
|---|---|
| 6 | [Layered / N-Tier](02-estilos-e-padroes/01-layered-n-tier-architecture.md) |
| 7 | [Hexagonal (Ports & Adapters)](02-estilos-e-padroes/02-hexagonal-ports-and-adapters.md) |
| 8 | [Clean Architecture](02-estilos-e-padroes/03-clean-architecture.md) |
| 9 | [Onion Architecture](02-estilos-e-padroes/04-onion-architecture.md) |
| 10 | [Vertical Slice Architecture](02-estilos-e-padroes/05-vertical-slice-architecture.md) |

### Fase 2 — Estilos de sistema e distribuição (semana 3)

| Ordem | Conceito |
|---|---|
| 11 | [Modular Monolith](02-estilos-e-padroes/06-modular-monolith.md) |
| 12 | [Microservices](02-estilos-e-padroes/07-microservices.md) |
| 13 | [SOA](02-estilos-e-padroes/08-service-oriented-architecture-soa.md) |
| 14 | [Event-Driven Architecture (EDA)](02-estilos-e-padroes/09-event-driven-architecture-eda.md) |
| 15 | [Pipes and Filters](02-estilos-e-padroes/11-pipes-and-filters.md) |
| 16 | [Serverless / FaaS](02-estilos-e-padroes/12-serverless-faas.md) |
| 17 | [Space-Based Architecture](02-estilos-e-padroes/10-space-based-architecture.md) |

### Fase 3 — Design tático e padrões de domínio (semanas 4–5)

| Ordem | Conceito |
|---|---|
| 18 | [DDD: Bounded Contexts, Context Mapping, Ubiquitous Language](03-design-tatico-ddd/01-ddd-bounded-contexts-context-mapping-ubiquitous-language.md) |
| 19 | [DDD: Aggregates, Entities, Value Objects, Domain Events](03-design-tatico-ddd/02-ddd-aggregates-entities-value-objects-domain-events.md) |
| 20 | [DDD: ACL, Shared Kernel, Customer-Supplier](03-design-tatico-ddd/03-ddd-context-mapping-patterns-acl-shared-kernel-customer-supplier.md) |
| 21 | [CQRS](03-design-tatico-ddd/04-cqrs.md) |
| 22 | [Event Sourcing](03-design-tatico-ddd/05-event-sourcing.md) |
| 23 | [Saga Pattern](03-design-tatico-ddd/06-saga-pattern.md) |
| 24 | [Outbox e Inbox Pattern](03-design-tatico-ddd/07-outbox-e-inbox-pattern.md) |

### Fase 4 — Fundamentos de sistemas distribuídos (semanas 5–6)

O coração teórico. Não pule — sustenta tudo de mensageria e dados.

| Ordem | Conceito |
|---|---|
| 25 | [Teorema CAP e PACELC](04-sistemas-distribuidos/01-teorema-cap-e-pacelc.md) |
| 26 | [Modelos de consistência](04-sistemas-distribuidos/02-modelos-de-consistencia.md) |
| 27 | [ACID vs BASE](05-dados-e-persistencia/09-acid-vs-base.md) |
| 28 | [Consenso distribuído (Paxos, Raft, 2PC, 3PC)](04-sistemas-distribuidos/03-consenso-distribuido-paxos-raft-2pc-3pc.md) |
| 29 | [Idempotência e semânticas de entrega](04-sistemas-distribuidos/04-idempotencia-e-semanticas-de-entrega.md) |
| 30 | [Vector Clocks e Lamport Timestamps](04-sistemas-distribuidos/05-vector-clocks-e-lamport-timestamps.md) |
| 31 | [CRDTs](04-sistemas-distribuidos/06-crdts.md) |

### Fase 5 — Infraestrutura de comunicação e resiliência (semana 6–7)

| Ordem | Conceito |
|---|---|
| 32 | [Service Discovery e Load Balancing](04-sistemas-distribuidos/07-service-discovery-e-load-balancing.md) |
| 33 | [API Gateway vs BFF](04-sistemas-distribuidos/08-api-gateway-vs-bff.md) |
| 34 | [Service Mesh (sidecar)](04-sistemas-distribuidos/09-service-mesh-sidecar.md) |
| 35 | [Padrões de resiliência (Circuit Breaker, Bulkhead, Retry...)](04-sistemas-distribuidos/10-padroes-de-resiliencia.md) |
| 36 | [Leader Election, Sharding, Consistent Hashing](04-sistemas-distribuidos/11-leader-election-sharding-consistent-hashing.md) |

### Fase 6 — Mensageria e streaming (semana 7)

| Ordem | Conceito |
|---|---|
| 37 | [Message brokers vs log-based streaming](06-mensageria-e-streaming/01-message-brokers-vs-log-based-streaming.md) |
| 38 | [Pub/Sub, Queue, Topic, Partition, Consumer Groups](06-mensageria-e-streaming/02-pubsub-queue-topic-partition-consumer-groups.md) |
| 39 | [Event-carried State Transfer vs Event Notification](06-mensageria-e-streaming/06-event-carried-state-transfer-vs-event-notification.md) |
| 40 | [Backpressure](06-mensageria-e-streaming/03-backpressure.md) |
| 41 | [Dead Letter Queue e Poison Messages](06-mensageria-e-streaming/04-dead-letter-queue-e-poison-messages.md) |
| 42 | [Stream Processing (Kafka Streams, Flink, janelas)](06-mensageria-e-streaming/05-stream-processing-kafka-streams-flink-janelas.md) |

### Fase 7 — Dados e persistência (semana 8)

| Ordem | Conceito |
|---|---|
| 43 | [Polyglot Persistence](05-dados-e-persistencia/01-polyglot-persistence.md) |
| 44 | [Database per Service](05-dados-e-persistencia/02-database-per-service.md) |
| 45 | [Read Replicas, Sharding, Particionamento](05-dados-e-persistencia/03-read-replicas-sharding-particionamento.md) |
| 46 | [Materialized Views e projeções](05-dados-e-persistencia/04-materialized-views-e-projecoes.md) |
| 47 | [CDC (Change Data Capture) com Debezium](05-dados-e-persistencia/05-cdc-change-data-capture-debezium.md) |
| 48 | [Cache patterns](05-dados-e-persistencia/08-cache-patterns.md) |
| 49 | [OLTP vs OLAP (Lambda, Kappa)](05-dados-e-persistencia/07-oltp-vs-olap-lambda-kappa.md) |
| 50 | [Data Lake, Warehouse, Mesh, Lakehouse](05-dados-e-persistencia/06-data-lake-warehouse-mesh-lakehouse.md) |

### Fase 8 — Performance, escalabilidade e observabilidade (semana 9)

| Ordem | Conceito |
|---|---|
| 51 | [Escalabilidade horizontal vs vertical](07-performance-e-escalabilidade/01-escalabilidade-horizontal-vs-vertical.md) |
| 52 | [Latência vs Throughput (percentis p50/p95/p99/p999)](07-performance-e-escalabilidade/02-latencia-vs-throughput-percentis.md) |
| 53 | [Leis: Little, Amdahl, Universal Scalability Law](07-performance-e-escalabilidade/06-leis-little-amdahl-universal-scalability-law.md) |
| 54 | [Caching em múltiplas camadas](07-performance-e-escalabilidade/04-caching-em-multiplas-camadas.md) |
| 55 | [Connection/thread pooling, async I/O, reactive](07-performance-e-escalabilidade/05-connection-pooling-thread-pooling-async-io-reactive.md) |
| 56 | [USE, RED, Four Golden Signals](07-performance-e-escalabilidade/03-use-red-four-golden-signals.md) |
| 57 | [Três pilares da observabilidade (+ eventos)](09-observabilidade/01-tres-pilares-logs-metricas-traces-eventos.md) |
| 58 | [Distributed Tracing (OpenTelemetry, Jaeger, Zipkin)](09-observabilidade/02-distributed-tracing-opentelemetry-jaeger-zipkin.md) |
| 59 | [Correlation IDs e propagação de contexto](09-observabilidade/03-correlation-ids-e-propagacao-de-contexto.md) |
| 60 | [SLI, SLO, SLA e Error Budgets](09-observabilidade/04-sli-slo-sla-error-budgets.md) |

### Fase 9 — Segurança e evolução (semana 10)

| Ordem | Conceito |
|---|---|
| 61 | [Zero Trust Architecture](08-seguranca-arquitetural/01-zero-trust-architecture.md) |
| 62 | [OAuth 2.0, OIDC, SAML, JWT](08-seguranca-arquitetural/02-oauth2-oidc-saml-jwt.md) |
| 63 | [mTLS entre serviços](08-seguranca-arquitetural/03-mtls-entre-servicos.md) |
| 64 | [Defense in Depth, Least Privilege, Secure by Default](08-seguranca-arquitetural/04-defense-in-depth-least-privilege-secure-by-default.md) |
| 65 | [Secrets Management (Vault, KMS)](08-seguranca-arquitetural/05-secrets-management-vault-kms.md) |
| 66 | [Threat Modeling (STRIDE, PASTA)](08-seguranca-arquitetural/06-threat-modeling-stride-pasta.md) |
| 67 | [Strangler Fig Pattern](10-evolucao-e-praticas/01-strangler-fig-pattern.md) |
| 68 | [Branch by Abstraction, Parallel Run, Feature Toggles](10-evolucao-e-praticas/02-branch-by-abstraction-parallel-run-feature-toggles.md) |
| 69 | [Anti-Corruption Layer em migrações](10-evolucao-e-praticas/03-anti-corruption-layer-em-migracoes.md) |
| 70 | [Trunk-Based Development](10-evolucao-e-praticas/04-trunk-based-development.md) |
| 71 | [GitOps, IaC, Immutable Infrastructure](10-evolucao-e-praticas/05-gitops-iac-immutable-infrastructure.md) |
| 72 | [Platform Engineering e IDPs](10-evolucao-e-praticas/06-platform-engineering-e-idps.md) |

---

## Índice completo por bloco

### 01 — Fundamentos arquiteturais

- [Atributos de qualidade (Quality Attributes)](01-fundamentos-arquiteturais/01-atributos-de-qualidade.md)
- [Architecture Decision Records (ADRs)](01-fundamentos-arquiteturais/02-architecture-decision-records-adr.md)
- [Fitness Functions](01-fundamentos-arquiteturais/03-fitness-functions.md)
- [Conway's Law e Inverse Conway Maneuver](01-fundamentos-arquiteturais/04-conway-law-e-inverse-conway-maneuver.md)
- [C4 Model](01-fundamentos-arquiteturais/05-c4-model.md)

### 02 — Estilos e padrões arquiteturais

- [Layered / N-Tier Architecture](02-estilos-e-padroes/01-layered-n-tier-architecture.md)
- [Hexagonal Architecture (Ports and Adapters)](02-estilos-e-padroes/02-hexagonal-ports-and-adapters.md)
- [Clean Architecture](02-estilos-e-padroes/03-clean-architecture.md)
- [Onion Architecture](02-estilos-e-padroes/04-onion-architecture.md)
- [Vertical Slice Architecture](02-estilos-e-padroes/05-vertical-slice-architecture.md)
- [Modular Monolith](02-estilos-e-padroes/06-modular-monolith.md)
- [Microservices](02-estilos-e-padroes/07-microservices.md)
- [Service-Oriented Architecture (SOA)](02-estilos-e-padroes/08-service-oriented-architecture-soa.md)
- [Event-Driven Architecture (EDA)](02-estilos-e-padroes/09-event-driven-architecture-eda.md)
- [Space-Based Architecture](02-estilos-e-padroes/10-space-based-architecture.md)
- [Pipes and Filters](02-estilos-e-padroes/11-pipes-and-filters.md)
- [Serverless / FaaS Architecture](02-estilos-e-padroes/12-serverless-faas.md)

### 03 — Design tático (DDD e correlatos)

- [Bounded Contexts, Context Mapping, Ubiquitous Language](03-design-tatico-ddd/01-ddd-bounded-contexts-context-mapping-ubiquitous-language.md)
- [Aggregates, Entities, Value Objects, Domain Events](03-design-tatico-ddd/02-ddd-aggregates-entities-value-objects-domain-events.md)
- [Padrões de Context Mapping (ACL, Shared Kernel, Customer-Supplier)](03-design-tatico-ddd/03-ddd-context-mapping-patterns-acl-shared-kernel-customer-supplier.md)
- [CQRS](03-design-tatico-ddd/04-cqrs.md)
- [Event Sourcing](03-design-tatico-ddd/05-event-sourcing.md)
- [Saga Pattern](03-design-tatico-ddd/06-saga-pattern.md)
- [Outbox e Inbox Pattern](03-design-tatico-ddd/07-outbox-e-inbox-pattern.md)

### 04 — Sistemas distribuídos

- [Teorema CAP e PACELC](04-sistemas-distribuidos/01-teorema-cap-e-pacelc.md)
- [Modelos de consistência](04-sistemas-distribuidos/02-modelos-de-consistencia.md)
- [Consenso distribuído (Paxos, Raft, 2PC, 3PC)](04-sistemas-distribuidos/03-consenso-distribuido-paxos-raft-2pc-3pc.md)
- [Idempotência e semânticas de entrega](04-sistemas-distribuidos/04-idempotencia-e-semanticas-de-entrega.md)
- [Vector Clocks e Lamport Timestamps](04-sistemas-distribuidos/05-vector-clocks-e-lamport-timestamps.md)
- [CRDTs](04-sistemas-distribuidos/06-crdts.md)
- [Service Discovery e Load Balancing](04-sistemas-distribuidos/07-service-discovery-e-load-balancing.md)
- [API Gateway vs BFF](04-sistemas-distribuidos/08-api-gateway-vs-bff.md)
- [Service Mesh (sidecar)](04-sistemas-distribuidos/09-service-mesh-sidecar.md)
- [Padrões de resiliência](04-sistemas-distribuidos/10-padroes-de-resiliencia.md)
- [Leader Election, Sharding, Consistent Hashing](04-sistemas-distribuidos/11-leader-election-sharding-consistent-hashing.md)
- [Quórum reads/writes (N, R, W)](04-sistemas-distribuidos/12-quorum-reads-writes-n-r-w.md)
- [Relógios físicos: clock skew, NTP, TrueTime](04-sistemas-distribuidos/13-relogios-fisicos-clock-skew-ntp-truetime.md)

### 05 — Dados e persistência

- [Polyglot Persistence](05-dados-e-persistencia/01-polyglot-persistence.md)
- [Database per Service](05-dados-e-persistencia/02-database-per-service.md)
- [Read Replicas, Sharding, Particionamento](05-dados-e-persistencia/03-read-replicas-sharding-particionamento.md)
- [Materialized Views e projeções](05-dados-e-persistencia/04-materialized-views-e-projecoes.md)
- [CDC (Change Data Capture) com Debezium](05-dados-e-persistencia/05-cdc-change-data-capture-debezium.md)
- [Data Lake, Warehouse, Mesh, Lakehouse](05-dados-e-persistencia/06-data-lake-warehouse-mesh-lakehouse.md)
- [OLTP vs OLAP (Lambda, Kappa)](05-dados-e-persistencia/07-oltp-vs-olap-lambda-kappa.md)
- [Cache patterns](05-dados-e-persistencia/08-cache-patterns.md)
- [ACID vs BASE](05-dados-e-persistencia/09-acid-vs-base.md)

### 06 — Mensageria e streaming

- [Message brokers vs log-based streaming](06-mensageria-e-streaming/01-message-brokers-vs-log-based-streaming.md)
- [Pub/Sub, Queue, Topic, Partition, Consumer Groups](06-mensageria-e-streaming/02-pubsub-queue-topic-partition-consumer-groups.md)
- [Backpressure](06-mensageria-e-streaming/03-backpressure.md)
- [Dead Letter Queue e Poison Messages](06-mensageria-e-streaming/04-dead-letter-queue-e-poison-messages.md)
- [Stream Processing (Kafka Streams, Flink, janelas)](06-mensageria-e-streaming/05-stream-processing-kafka-streams-flink-janelas.md)
- [Event-carried State Transfer vs Event Notification](06-mensageria-e-streaming/06-event-carried-state-transfer-vs-event-notification.md)

### 07 — Performance e escalabilidade

- [Escalabilidade horizontal vs vertical](07-performance-e-escalabilidade/01-escalabilidade-horizontal-vs-vertical.md)
- [Latência vs Throughput (percentis)](07-performance-e-escalabilidade/02-latencia-vs-throughput-percentis.md)
- [USE, RED, Four Golden Signals](07-performance-e-escalabilidade/03-use-red-four-golden-signals.md)
- [Caching em múltiplas camadas](07-performance-e-escalabilidade/04-caching-em-multiplas-camadas.md)
- [Connection pooling, thread pooling, async I/O, reactive](07-performance-e-escalabilidade/05-connection-pooling-thread-pooling-async-io-reactive.md)
- [Leis de Little, Amdahl e Universal Scalability Law](07-performance-e-escalabilidade/06-leis-little-amdahl-universal-scalability-law.md)

### 08 — Segurança arquitetural

- [Zero Trust Architecture](08-seguranca-arquitetural/01-zero-trust-architecture.md)
- [OAuth 2.0, OIDC, SAML, JWT](08-seguranca-arquitetural/02-oauth2-oidc-saml-jwt.md)
- [mTLS entre serviços](08-seguranca-arquitetural/03-mtls-entre-servicos.md)
- [Defense in Depth, Least Privilege, Secure by Default](08-seguranca-arquitetural/04-defense-in-depth-least-privilege-secure-by-default.md)
- [Secrets Management (Vault, KMS)](08-seguranca-arquitetural/05-secrets-management-vault-kms.md)
- [Threat Modeling (STRIDE, PASTA)](08-seguranca-arquitetural/06-threat-modeling-stride-pasta.md)

### 09 — Observabilidade

- [Três pilares: logs, métricas, traces (+ eventos)](09-observabilidade/01-tres-pilares-logs-metricas-traces-eventos.md)
- [Distributed Tracing (OpenTelemetry, Jaeger, Zipkin)](09-observabilidade/02-distributed-tracing-opentelemetry-jaeger-zipkin.md)
- [Correlation IDs e propagação de contexto](09-observabilidade/03-correlation-ids-e-propagacao-de-contexto.md)
- [SLI, SLO, SLA e Error Budgets](09-observabilidade/04-sli-slo-sla-error-budgets.md)

### 10 — Evolução e práticas

- [Strangler Fig Pattern](10-evolucao-e-praticas/01-strangler-fig-pattern.md)
- [Branch by Abstraction, Parallel Run, Feature Toggles](10-evolucao-e-praticas/02-branch-by-abstraction-parallel-run-feature-toggles.md)
- [Anti-Corruption Layer em migrações](10-evolucao-e-praticas/03-anti-corruption-layer-em-migracoes.md)
- [Trunk-Based Development](10-evolucao-e-praticas/04-trunk-based-development.md)
- [GitOps, IaC, Immutable Infrastructure](10-evolucao-e-praticas/05-gitops-iac-immutable-infrastructure.md)
- [Platform Engineering e Internal Developer Platforms](10-evolucao-e-praticas/06-platform-engineering-e-idps.md)

### 11 — Complexidade e análise algorítmica

- [Notação assintótica (Big O, Θ, Ω)](11-complexidade-algoritmica/01-notacao-assintotica-big-o-theta-omega.md)
- [Pior, melhor e caso médio](11-complexidade-algoritmica/02-pior-melhor-e-caso-medio.md)
- [Complexidade amortizada](11-complexidade-algoritmica/03-complexidade-amortizada.md)
- [Time vs space complexity e trade-offs](11-complexidade-algoritmica/04-time-vs-space-complexity-tradeoffs.md)
- [Análise de recursão: árvore e Master Theorem](11-complexidade-algoritmica/05-analise-de-recursao-arvore-e-master-theorem.md)

### 12 — Estruturas de dados

- [Arrays e Linked Lists](12-estruturas-de-dados/01-arrays-e-linked-lists.md)
- [Stacks, Queues, Deque, Priority Queue](12-estruturas-de-dados/02-stacks-queues-deque-priority-queue.md)
- [Hash Tables](12-estruturas-de-dados/03-hash-tables.md)
- [Árvores de busca: BST, AVL, Red-Black](12-estruturas-de-dados/04-arvores-de-busca-bst-avl-red-black.md)
- [B-Tree e B+Tree](12-estruturas-de-dados/05-b-tree-e-b-plus-tree.md)
- [Heaps](12-estruturas-de-dados/06-heaps.md)
- [Tries](12-estruturas-de-dados/07-tries.md)
- [Graphs (representação)](12-estruturas-de-dados/08-graphs-representacao.md)
- [Skip List, Bloom Filter, LRU/LFU](12-estruturas-de-dados/09-skip-list-bloom-filter-lru-lfu.md)
- [Union-Find (Disjoint Set)](12-estruturas-de-dados/10-union-find-disjoint-set.md)
- [Segment Tree e Fenwick Tree](12-estruturas-de-dados/11-segment-tree-e-fenwick-tree.md)

### 13 — Algoritmos essenciais

- [Sorting (quicksort, mergesort, heapsort, radix, counting)](13-algoritmos-essenciais/01-sorting-quicksort-mergesort-heapsort-radix-counting.md)
- [Searching: busca binária e variações](13-algoritmos-essenciais/02-searching-busca-binaria-e-variacoes.md)
- [Two Pointers, Sliding Window, Fast & Slow](13-algoritmos-essenciais/03-two-pointers-sliding-window-fast-slow.md)
- [Recursão e Backtracking](13-algoritmos-essenciais/04-recursao-e-backtracking.md)
- [Divide and Conquer](13-algoritmos-essenciais/05-divide-and-conquer.md)
- [Greedy Algorithms](13-algoritmos-essenciais/06-greedy-algorithms.md)
- [Dynamic Programming](13-algoritmos-essenciais/07-dynamic-programming.md)
- [Graph Algorithms (BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, A*, topological sort, Kruskal, Prim)](13-algoritmos-essenciais/08-graph-algorithms.md)
- [String Algorithms (KMP, Rabin-Karp, Z)](13-algoritmos-essenciais/09-string-algorithms-kmp-rabin-karp-z.md)

### 14 — Concorrência e paralelismo

- [Concorrência vs Paralelismo e context switching](14-concorrencia-e-paralelismo/01-concorrencia-vs-paralelismo-e-context-switching.md)
- [Race Condition e Critical Section](14-concorrencia-e-paralelismo/02-race-condition-e-critical-section.md)
- [Deadlock, Livelock, Starvation](14-concorrencia-e-paralelismo/03-deadlock-livelock-starvation.md)
- [Primitivas: Mutex, Semaphore, Monitor, Spinlock](14-concorrencia-e-paralelismo/04-primitivas-de-sincronizacao-mutex-semaphore-monitor-spinlock.md)
- [Atomic, CAS, lock-free e wait-free](14-concorrencia-e-paralelismo/05-atomic-cas-lock-free-wait-free.md)
- [Memory model e false sharing](14-concorrencia-e-paralelismo/06-memory-model-happens-before-volatile-barriers-false-sharing.md)
- [Problemas clássicos (Producer-Consumer, Readers-Writers, Dining Philosophers)](14-concorrencia-e-paralelismo/07-problemas-classicos-producer-consumer-readers-writers-dining-philosophers.md)
- [Thread pools e tuning](14-concorrencia-e-paralelismo/08-thread-pools-e-tuning.md)
- [Async/await, Futures/Promises, Reactive Streams](14-concorrencia-e-paralelismo/09-async-await-futures-promises-reactive-streams.md)

### 15 — Banco de dados (a fundo)

- [Níveis de isolamento e anomalias](15-banco-de-dados/01-niveis-de-isolamento-e-anomalias.md)
- [Locking: pessimista vs otimista](15-banco-de-dados/02-locking-pessimista-vs-otimista.md)
- [Índices: B-Tree, Hash, composite, covering](15-banco-de-dados/03-indices-de-banco-btree-hash-composite-covering.md)
- [Query optimization: EXPLAIN e N+1](15-banco-de-dados/04-query-optimization-explain-e-n-mais-1.md)
- [Normalização vs desnormalização](15-banco-de-dados/05-normalizacao-vs-desnormalizacao.md)
- [SQL vs NoSQL](15-banco-de-dados/06-sql-vs-nosql.md)

### 16 — Redes e protocolos

- [Modelo OSI e TCP/IP](16-redes-e-protocolos/01-modelo-osi-e-tcp-ip.md)
- [TCP vs UDP](16-redes-e-protocolos/02-tcp-vs-udp.md)
- [HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)](16-redes-e-protocolos/03-http1-http2-http3-quic.md)
- [HTTPS, TLS handshake e certificados](16-redes-e-protocolos/04-https-tls-handshake-e-certificados.md)
- [DNS resolution](16-redes-e-protocolos/05-dns-resolution.md)
- [REST vs GraphQL vs gRPC vs WebSockets](16-redes-e-protocolos/06-rest-graphql-grpc-websockets.md)
- [Semântica HTTP: idempotência e status codes](16-redes-e-protocolos/07-semantica-http-idempotencia-e-status-codes.md)
- [CORS, CSRF, XSS](16-redes-e-protocolos/08-cors-csrf-xss.md)
- [Long polling, SSE, WebSockets](16-redes-e-protocolos/09-long-polling-sse-websockets.md)

### 17 — System Design (estudos de caso)

- [Encurtador de URL](17-system-design/01-encurtador-de-url.md)
- [Timeline de rede social](17-system-design/02-timeline-rede-social.md)
- [Sistema de chat](17-system-design/03-sistema-de-chat.md)
- [Notificações em escala](17-system-design/04-sistema-de-notificacoes-em-escala.md)
- [Rate limiter](17-system-design/05-rate-limiter.md)
- [Web crawler distribuído](17-system-design/06-web-crawler-distribuido.md)
- [Sistema de busca](17-system-design/07-sistema-de-busca.md)
- [Upload de arquivos](17-system-design/08-upload-de-arquivos.md)
- [Streaming de vídeo](17-system-design/09-streaming-de-video.md)
- [Sistema de reservas](17-system-design/10-sistema-de-reservas.md)
- [Sistema de pagamentos](17-system-design/11-sistema-de-pagamentos.md)
- [Newsfeed ranking e recomendação](17-system-design/12-newsfeed-ranking-e-recomendacao.md)
- [Sistema de logs distribuído](17-system-design/13-sistema-de-logs-distribuido.md)
- [Top K trending (count-min sketch)](17-system-design/14-top-k-trending-count-min-sketch.md)

---

## Bibliografia essencial

Veja [BIBLIOGRAFIA.md](BIBLIOGRAFIA.md) para a lista comentada de livros, com o que cada um cobre na lista de conceitos e em que ordem ler.
