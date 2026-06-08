#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Constrói o grafo de dependências entre conceitos a partir das seções
'Relação com outros conceitos' (menções em **negrito**) de cada arquivo .md."""
import os, re, glob, unicodedata, json, sys

import pathlib
ROOT = str(pathlib.Path(__file__).resolve().parent.parent / "arquitetura-de-software")

BLOCK_LABELS = {
    "01": "Fundamentos", "02": "Estilos e padrões", "03": "Design tático (DDD)",
    "04": "Sistemas distribuídos", "05": "Dados e persistência",
    "06": "Mensageria e streaming", "07": "Performance e escalabilidade",
    "08": "Segurança arquitetural", "09": "Observabilidade",
    "10": "Evolução e práticas", "11": "Complexidade algorítmica",
    "12": "Estruturas de dados", "13": "Algoritmos essenciais",
    "14": "Concorrência e paralelismo", "15": "Redes e protocolos",
    "16": "System Design",
}

STOP = set("de da do dos das e vs com a o os as em entre para no na the of and por "
           "seu sua cada um uma quando usar como suas seus ou ao aos à às que se "
           "tipo nas nos".split())


def deaccent(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                    if unicodedata.category(c) != "Mn")


def norm(s):
    s = deaccent(s).lower()
    s = re.sub(r"[^a-z0-9+]+", " ", s)  # mantém '+' (ex.: 'r + w')
    return re.sub(r"\s+", " ", s).strip()


def tokens(s):
    return [t for t in norm(s).split() if t and t not in STOP]


def short_title(t):
    """Versão curta do título para rótulo do nó."""
    t = re.split(r"[:—–\-]\s|\(", t, 1)[0].strip()
    return t if t else t


# ---- catálogo ----------------------------------------------------------
catalog = {}  # key -> dict
for f in sorted(glob.glob(os.path.join(ROOT, "[0-9]*/*.md"))):
    rel = os.path.relpath(f, ROOT)
    key = rel[:-3]
    block = key[:2]
    with open(f, encoding="utf-8") as fh:
        txt = fh.read()
    m = re.search(r"^#\s+(.+)$", txt, re.M)
    title = m.group(1).strip() if m else key
    catalog[key] = {
        "key": key, "block": block, "title": title,
        "label": short_title(title), "text": txt,
        "tok": set(tokens(title)),
    }

# ---- aliases curados (frase normalizada -> key) ------------------------
A = {}
def alias(phrase, key):
    A[norm(phrase)] = key

curated = {
    "atributos de qualidade": "01-fundamentos-arquiteturais/01-atributos-de-qualidade",
    "quality attributes": "01-fundamentos-arquiteturais/01-atributos-de-qualidade",
    "adr": "01-fundamentos-arquiteturais/02-architecture-decision-records-adr",
    "adrs": "01-fundamentos-arquiteturais/02-architecture-decision-records-adr",
    "architecture decision records": "01-fundamentos-arquiteturais/02-architecture-decision-records-adr",
    "fitness functions": "01-fundamentos-arquiteturais/03-fitness-functions",
    "conway s law": "01-fundamentos-arquiteturais/04-conway-law-e-inverse-conway-maneuver",
    "conway law": "01-fundamentos-arquiteturais/04-conway-law-e-inverse-conway-maneuver",
    "lei de conway": "01-fundamentos-arquiteturais/04-conway-law-e-inverse-conway-maneuver",
    "c4 model": "01-fundamentos-arquiteturais/05-c4-model",
    "layered": "02-estilos-e-padroes/01-layered-n-tier-architecture",
    "n tier": "02-estilos-e-padroes/01-layered-n-tier-architecture",
    "layered n tier": "02-estilos-e-padroes/01-layered-n-tier-architecture",
    "hexagonal": "02-estilos-e-padroes/02-hexagonal-ports-and-adapters",
    "ports and adapters": "02-estilos-e-padroes/02-hexagonal-ports-and-adapters",
    "ports adapters": "02-estilos-e-padroes/02-hexagonal-ports-and-adapters",
    "clean architecture": "02-estilos-e-padroes/03-clean-architecture",
    "onion": "02-estilos-e-padroes/04-onion-architecture",
    "onion architecture": "02-estilos-e-padroes/04-onion-architecture",
    "vertical slice": "02-estilos-e-padroes/05-vertical-slice-architecture",
    "modular monolith": "02-estilos-e-padroes/06-modular-monolith",
    "monolito modular": "02-estilos-e-padroes/06-modular-monolith",
    "microservices": "02-estilos-e-padroes/07-microservices",
    "microsservicos": "02-estilos-e-padroes/07-microservices",
    "microservicos": "02-estilos-e-padroes/07-microservices",
    "soa": "02-estilos-e-padroes/08-service-oriented-architecture-soa",
    "service oriented architecture": "02-estilos-e-padroes/08-service-oriented-architecture-soa",
    "eda": "02-estilos-e-padroes/09-event-driven-architecture-eda",
    "event driven architecture": "02-estilos-e-padroes/09-event-driven-architecture-eda",
    "arquitetura orientada a eventos": "02-estilos-e-padroes/09-event-driven-architecture-eda",
    "space based architecture": "02-estilos-e-padroes/10-space-based-architecture",
    "pipes and filters": "02-estilos-e-padroes/11-pipes-and-filters",
    "serverless": "02-estilos-e-padroes/12-serverless-faas",
    "faas": "02-estilos-e-padroes/12-serverless-faas",
    "bounded contexts": "03-design-tatico-ddd/01-ddd-bounded-contexts-context-mapping-ubiquitous-language",
    "bounded context": "03-design-tatico-ddd/01-ddd-bounded-contexts-context-mapping-ubiquitous-language",
    "ddd estrategico": "03-design-tatico-ddd/01-ddd-bounded-contexts-context-mapping-ubiquitous-language",
    "ubiquitous language": "03-design-tatico-ddd/01-ddd-bounded-contexts-context-mapping-ubiquitous-language",
    "context mapping": "03-design-tatico-ddd/01-ddd-bounded-contexts-context-mapping-ubiquitous-language",
    "aggregates": "03-design-tatico-ddd/02-ddd-aggregates-entities-value-objects-domain-events",
    "ddd tatico": "03-design-tatico-ddd/02-ddd-aggregates-entities-value-objects-domain-events",
    "value objects": "03-design-tatico-ddd/02-ddd-aggregates-entities-value-objects-domain-events",
    "domain events": "03-design-tatico-ddd/02-ddd-aggregates-entities-value-objects-domain-events",
    "acl": "03-design-tatico-ddd/03-ddd-context-mapping-patterns-acl-shared-kernel-customer-supplier",
    "anti corruption layer": "10-evolucao-e-praticas/03-anti-corruption-layer-em-migracoes",
    "shared kernel": "03-design-tatico-ddd/03-ddd-context-mapping-patterns-acl-shared-kernel-customer-supplier",
    "cqrs": "03-design-tatico-ddd/04-cqrs",
    "event sourcing": "03-design-tatico-ddd/05-event-sourcing",
    "saga": "03-design-tatico-ddd/06-saga-pattern",
    "saga pattern": "03-design-tatico-ddd/06-saga-pattern",
    "outbox": "03-design-tatico-ddd/07-outbox-e-inbox-pattern",
    "inbox": "03-design-tatico-ddd/07-outbox-e-inbox-pattern",
    "outbox pattern": "03-design-tatico-ddd/07-outbox-e-inbox-pattern",
    "teorema cap": "04-sistemas-distribuidos/01-teorema-cap-e-pacelc",
    "cap": "04-sistemas-distribuidos/01-teorema-cap-e-pacelc",
    "pacelc": "04-sistemas-distribuidos/01-teorema-cap-e-pacelc",
    "teorema cap pacelc": "04-sistemas-distribuidos/01-teorema-cap-e-pacelc",
    "modelos de consistencia": "04-sistemas-distribuidos/02-modelos-de-consistencia",
    "consistencia": "04-sistemas-distribuidos/02-modelos-de-consistencia",
    "consenso distribuido": "04-sistemas-distribuidos/03-consenso-distribuido-paxos-raft-2pc-3pc",
    "consenso": "04-sistemas-distribuidos/03-consenso-distribuido-paxos-raft-2pc-3pc",
    "paxos": "04-sistemas-distribuidos/03-consenso-distribuido-paxos-raft-2pc-3pc",
    "raft": "04-sistemas-distribuidos/03-consenso-distribuido-paxos-raft-2pc-3pc",
    "idempotencia": "04-sistemas-distribuidos/04-idempotencia-e-semanticas-de-entrega",
    "vector clocks": "04-sistemas-distribuidos/05-vector-clocks-e-lamport-timestamps",
    "lamport timestamps": "04-sistemas-distribuidos/05-vector-clocks-e-lamport-timestamps",
    "lamport": "04-sistemas-distribuidos/05-vector-clocks-e-lamport-timestamps",
    "crdts": "04-sistemas-distribuidos/06-crdts",
    "crdt": "04-sistemas-distribuidos/06-crdts",
    "service discovery": "04-sistemas-distribuidos/07-service-discovery-e-load-balancing",
    "load balancing": "04-sistemas-distribuidos/07-service-discovery-e-load-balancing",
    "service discovery load balancing": "04-sistemas-distribuidos/07-service-discovery-e-load-balancing",
    "api gateway": "04-sistemas-distribuidos/08-api-gateway-vs-bff",
    "bff": "04-sistemas-distribuidos/08-api-gateway-vs-bff",
    "backend for frontend": "04-sistemas-distribuidos/08-api-gateway-vs-bff",
    "service mesh": "04-sistemas-distribuidos/09-service-mesh-sidecar",
    "sidecar": "04-sistemas-distribuidos/09-service-mesh-sidecar",
    "padroes de resiliencia": "04-sistemas-distribuidos/10-padroes-de-resiliencia",
    "resiliencia": "04-sistemas-distribuidos/10-padroes-de-resiliencia",
    "circuit breaker": "04-sistemas-distribuidos/10-padroes-de-resiliencia",
    "bulkhead": "04-sistemas-distribuidos/10-padroes-de-resiliencia",
    "leader election": "04-sistemas-distribuidos/11-leader-election-sharding-consistent-hashing",
    "consistent hashing": "04-sistemas-distribuidos/11-leader-election-sharding-consistent-hashing",
    "quorum": "04-sistemas-distribuidos/12-quorum-reads-writes-n-r-w",
    "quorum reads writes": "04-sistemas-distribuidos/12-quorum-reads-writes-n-r-w",
    "relogios fisicos": "04-sistemas-distribuidos/13-relogios-fisicos-clock-skew-ntp-truetime",
    "clock skew": "04-sistemas-distribuidos/13-relogios-fisicos-clock-skew-ntp-truetime",
    "truetime": "04-sistemas-distribuidos/13-relogios-fisicos-clock-skew-ntp-truetime",
    "polyglot persistence": "05-dados-e-persistencia/01-polyglot-persistence",
    "database per service": "05-dados-e-persistencia/02-database-per-service",
    "read replicas": "05-dados-e-persistencia/03-read-replicas-sharding-particionamento",
    "sharding": "05-dados-e-persistencia/03-read-replicas-sharding-particionamento",
    "particionamento": "05-dados-e-persistencia/03-read-replicas-sharding-particionamento",
    "materialized views": "05-dados-e-persistencia/04-materialized-views-e-projecoes",
    "projecoes": "05-dados-e-persistencia/04-materialized-views-e-projecoes",
    "cdc": "05-dados-e-persistencia/05-cdc-change-data-capture-debezium",
    "change data capture": "05-dados-e-persistencia/05-cdc-change-data-capture-debezium",
    "debezium": "05-dados-e-persistencia/05-cdc-change-data-capture-debezium",
    "data lake": "05-dados-e-persistencia/06-data-lake-warehouse-mesh-lakehouse",
    "data warehouse": "05-dados-e-persistencia/06-data-lake-warehouse-mesh-lakehouse",
    "data mesh": "05-dados-e-persistencia/06-data-lake-warehouse-mesh-lakehouse",
    "lakehouse": "05-dados-e-persistencia/06-data-lake-warehouse-mesh-lakehouse",
    "oltp": "05-dados-e-persistencia/07-oltp-vs-olap-lambda-kappa",
    "olap": "05-dados-e-persistencia/07-oltp-vs-olap-lambda-kappa",
    "oltp vs olap": "05-dados-e-persistencia/07-oltp-vs-olap-lambda-kappa",
    "lambda kappa": "05-dados-e-persistencia/07-oltp-vs-olap-lambda-kappa",
    "cache patterns": "05-dados-e-persistencia/08-cache-patterns",
    "cache": "05-dados-e-persistencia/08-cache-patterns",
    "cache aside": "05-dados-e-persistencia/08-cache-patterns",
    "acid": "05-dados-e-persistencia/09-acid-vs-base",
    "base": "05-dados-e-persistencia/09-acid-vs-base",
    "acid vs base": "05-dados-e-persistencia/09-acid-vs-base",
    "niveis de isolamento": "05-dados-e-persistencia/10-niveis-de-isolamento-e-anomalias",
    "isolamento": "05-dados-e-persistencia/10-niveis-de-isolamento-e-anomalias",
    "mvcc": "05-dados-e-persistencia/10-niveis-de-isolamento-e-anomalias",
    "locking": "05-dados-e-persistencia/11-locking-pessimista-vs-otimista",
    "locking pessimista otimista": "05-dados-e-persistencia/11-locking-pessimista-vs-otimista",
    "indices": "05-dados-e-persistencia/12-indices-de-banco-btree-hash-composite-covering",
    "indices de banco": "05-dados-e-persistencia/12-indices-de-banco-btree-hash-composite-covering",
    "query optimization": "05-dados-e-persistencia/13-query-optimization-explain-e-n-mais-1",
    "n + 1": "05-dados-e-persistencia/13-query-optimization-explain-e-n-mais-1",
    "normalizacao": "05-dados-e-persistencia/14-normalizacao-vs-desnormalizacao",
    "desnormalizacao": "05-dados-e-persistencia/14-normalizacao-vs-desnormalizacao",
    "sql vs nosql": "05-dados-e-persistencia/15-sql-vs-nosql",
    "nosql": "05-dados-e-persistencia/15-sql-vs-nosql",
    "message brokers": "06-mensageria-e-streaming/01-message-brokers-vs-log-based-streaming",
    "log based streaming": "06-mensageria-e-streaming/01-message-brokers-vs-log-based-streaming",
    "pub sub": "06-mensageria-e-streaming/02-pubsub-queue-topic-partition-consumer-groups",
    "pubsub": "06-mensageria-e-streaming/02-pubsub-queue-topic-partition-consumer-groups",
    "consumer groups": "06-mensageria-e-streaming/02-pubsub-queue-topic-partition-consumer-groups",
    "backpressure": "06-mensageria-e-streaming/03-backpressure",
    "dead letter queue": "06-mensageria-e-streaming/04-dead-letter-queue-e-poison-messages",
    "dlq": "06-mensageria-e-streaming/04-dead-letter-queue-e-poison-messages",
    "poison messages": "06-mensageria-e-streaming/04-dead-letter-queue-e-poison-messages",
    "stream processing": "06-mensageria-e-streaming/05-stream-processing-kafka-streams-flink-janelas",
    "kafka streams": "06-mensageria-e-streaming/05-stream-processing-kafka-streams-flink-janelas",
    "flink": "06-mensageria-e-streaming/05-stream-processing-kafka-streams-flink-janelas",
    "event carried state transfer": "06-mensageria-e-streaming/06-event-carried-state-transfer-vs-event-notification",
    "event notification": "06-mensageria-e-streaming/06-event-carried-state-transfer-vs-event-notification",
    "escalabilidade horizontal vs vertical": "07-performance-e-escalabilidade/01-escalabilidade-horizontal-vs-vertical",
    "escalabilidade horizontal": "07-performance-e-escalabilidade/01-escalabilidade-horizontal-vs-vertical",
    "latencia vs throughput": "07-performance-e-escalabilidade/02-latencia-vs-throughput-percentis",
    "percentis": "07-performance-e-escalabilidade/02-latencia-vs-throughput-percentis",
    "connection pooling": "07-performance-e-escalabilidade/03-connection-pooling-thread-pooling-async-io-reactive",
    "thread pooling": "07-performance-e-escalabilidade/03-connection-pooling-thread-pooling-async-io-reactive",
    "async i o": "07-performance-e-escalabilidade/03-connection-pooling-thread-pooling-async-io-reactive",
    "lei de little": "07-performance-e-escalabilidade/04-leis-little-amdahl-universal-scalability-law",
    "lei de amdahl": "07-performance-e-escalabilidade/04-leis-little-amdahl-universal-scalability-law",
    "universal scalability law": "07-performance-e-escalabilidade/04-leis-little-amdahl-universal-scalability-law",
    "zero trust": "08-seguranca-arquitetural/01-zero-trust-architecture",
    "oauth": "08-seguranca-arquitetural/02-oauth2-oidc-saml-jwt",
    "oauth 2 0": "08-seguranca-arquitetural/02-oauth2-oidc-saml-jwt",
    "oidc": "08-seguranca-arquitetural/02-oauth2-oidc-saml-jwt",
    "openid connect": "08-seguranca-arquitetural/02-oauth2-oidc-saml-jwt",
    "saml": "08-seguranca-arquitetural/02-oauth2-oidc-saml-jwt",
    "jwt": "08-seguranca-arquitetural/02-oauth2-oidc-saml-jwt",
    "mtls": "08-seguranca-arquitetural/03-mtls-entre-servicos",
    "defense in depth": "08-seguranca-arquitetural/04-defense-in-depth-least-privilege-secure-by-default",
    "least privilege": "08-seguranca-arquitetural/04-defense-in-depth-least-privilege-secure-by-default",
    "secure by default": "08-seguranca-arquitetural/04-defense-in-depth-least-privilege-secure-by-default",
    "secrets management": "08-seguranca-arquitetural/05-secrets-management-vault-kms",
    "vault": "08-seguranca-arquitetural/05-secrets-management-vault-kms",
    "threat modeling": "08-seguranca-arquitetural/06-threat-modeling-stride-pasta",
    "stride": "08-seguranca-arquitetural/06-threat-modeling-stride-pasta",
    "tres pilares": "09-observabilidade/01-tres-pilares-logs-metricas-traces-eventos",
    "observabilidade": "09-observabilidade/01-tres-pilares-logs-metricas-traces-eventos",
    "logs metricas traces": "09-observabilidade/01-tres-pilares-logs-metricas-traces-eventos",
    "distributed tracing": "09-observabilidade/02-distributed-tracing-opentelemetry-jaeger-zipkin",
    "opentelemetry": "09-observabilidade/02-distributed-tracing-opentelemetry-jaeger-zipkin",
    "tracing": "09-observabilidade/02-distributed-tracing-opentelemetry-jaeger-zipkin",
    "correlation ids": "09-observabilidade/03-correlation-ids-e-propagacao-de-contexto",
    "sli slo sla": "09-observabilidade/04-sli-slo-sla-error-budgets",
    "slo": "09-observabilidade/04-sli-slo-sla-error-budgets",
    "error budgets": "09-observabilidade/04-sli-slo-sla-error-budgets",
    "use red four golden signals": "09-observabilidade/05-use-red-four-golden-signals",
    "four golden signals": "09-observabilidade/05-use-red-four-golden-signals",
    "red method": "09-observabilidade/05-use-red-four-golden-signals",
    "strangler fig": "10-evolucao-e-praticas/01-strangler-fig-pattern",
    "branch by abstraction": "10-evolucao-e-praticas/02-branch-by-abstraction-parallel-run-feature-toggles",
    "parallel run": "10-evolucao-e-praticas/02-branch-by-abstraction-parallel-run-feature-toggles",
    "feature toggles": "10-evolucao-e-praticas/02-branch-by-abstraction-parallel-run-feature-toggles",
    "feature flags": "10-evolucao-e-praticas/02-branch-by-abstraction-parallel-run-feature-toggles",
    "trunk based development": "10-evolucao-e-praticas/04-trunk-based-development",
    "gitops": "10-evolucao-e-praticas/05-gitops-iac-immutable-infrastructure",
    "iac": "10-evolucao-e-praticas/05-gitops-iac-immutable-infrastructure",
    "infrastructure as code": "10-evolucao-e-praticas/05-gitops-iac-immutable-infrastructure",
    "immutable infrastructure": "10-evolucao-e-praticas/05-gitops-iac-immutable-infrastructure",
    "platform engineering": "10-evolucao-e-praticas/06-platform-engineering-e-idps",
    "idps": "10-evolucao-e-praticas/06-platform-engineering-e-idps",
    "notacao assintotica": "11-complexidade-algoritmica/01-notacao-assintotica-big-o-theta-omega",
    "big o": "11-complexidade-algoritmica/01-notacao-assintotica-big-o-theta-omega",
    "complexidade algoritmica": "11-complexidade-algoritmica/01-notacao-assintotica-big-o-theta-omega",
    "complexidade": "11-complexidade-algoritmica/01-notacao-assintotica-big-o-theta-omega",
    "pior caso melhor caso": "11-complexidade-algoritmica/02-pior-melhor-e-caso-medio",
    "caso medio": "11-complexidade-algoritmica/02-pior-melhor-e-caso-medio",
    "complexidade amortizada": "11-complexidade-algoritmica/03-complexidade-amortizada",
    "amortizada": "11-complexidade-algoritmica/03-complexidade-amortizada",
    "time vs space": "11-complexidade-algoritmica/04-time-vs-space-complexity-tradeoffs",
    "tempo vs espaco": "11-complexidade-algoritmica/04-time-vs-space-complexity-tradeoffs",
    "master theorem": "11-complexidade-algoritmica/05-analise-de-recursao-arvore-e-master-theorem",
    "analise de recursao": "11-complexidade-algoritmica/05-analise-de-recursao-arvore-e-master-theorem",
    "arrays": "12-estruturas-de-dados/01-arrays-e-linked-lists",
    "linked lists": "12-estruturas-de-dados/01-arrays-e-linked-lists",
    "arrays e linked lists": "12-estruturas-de-dados/01-arrays-e-linked-lists",
    "stacks queues": "12-estruturas-de-dados/02-stacks-queues-deque-priority-queue",
    "priority queue": "12-estruturas-de-dados/02-stacks-queues-deque-priority-queue",
    "deque": "12-estruturas-de-dados/02-stacks-queues-deque-priority-queue",
    "hash tables": "12-estruturas-de-dados/03-hash-tables",
    "tabelas hash": "12-estruturas-de-dados/03-hash-tables",
    "hash table": "12-estruturas-de-dados/03-hash-tables",
    "arvores de busca": "12-estruturas-de-dados/04-arvores-de-busca-bst-avl-red-black",
    "bst": "12-estruturas-de-dados/04-arvores-de-busca-bst-avl-red-black",
    "avl": "12-estruturas-de-dados/04-arvores-de-busca-bst-avl-red-black",
    "red black": "12-estruturas-de-dados/04-arvores-de-busca-bst-avl-red-black",
    "b tree": "12-estruturas-de-dados/05-b-tree-e-b-plus-tree",
    "b+tree": "12-estruturas-de-dados/05-b-tree-e-b-plus-tree",
    "b plus tree": "12-estruturas-de-dados/05-b-tree-e-b-plus-tree",
    "heaps": "12-estruturas-de-dados/06-heaps",
    "heap": "12-estruturas-de-dados/06-heaps",
    "tries": "12-estruturas-de-dados/07-tries",
    "trie": "12-estruturas-de-dados/07-tries",
    "prefix tree": "12-estruturas-de-dados/07-tries",
    "grafos": "12-estruturas-de-dados/08-graphs-representacao",
    "graphs": "12-estruturas-de-dados/08-graphs-representacao",
    "lista de adjacencia": "12-estruturas-de-dados/08-graphs-representacao",
    "skip list": "12-estruturas-de-dados/09-skip-list-bloom-filter-lru-lfu",
    "skip lists": "12-estruturas-de-dados/09-skip-list-bloom-filter-lru-lfu",
    "bloom filter": "12-estruturas-de-dados/09-skip-list-bloom-filter-lru-lfu",
    "bloom filters": "12-estruturas-de-dados/09-skip-list-bloom-filter-lru-lfu",
    "lru": "12-estruturas-de-dados/09-skip-list-bloom-filter-lru-lfu",
    "lfu": "12-estruturas-de-dados/09-skip-list-bloom-filter-lru-lfu",
    "union find": "12-estruturas-de-dados/10-union-find-disjoint-set",
    "disjoint set": "12-estruturas-de-dados/10-union-find-disjoint-set",
    "segment tree": "12-estruturas-de-dados/11-segment-tree-e-fenwick-tree",
    "fenwick tree": "12-estruturas-de-dados/11-segment-tree-e-fenwick-tree",
    "sorting": "13-algoritmos-essenciais/01-sorting-quicksort-mergesort-heapsort-radix-counting",
    "quicksort": "13-algoritmos-essenciais/01-sorting-quicksort-mergesort-heapsort-radix-counting",
    "mergesort": "13-algoritmos-essenciais/01-sorting-quicksort-mergesort-heapsort-radix-counting",
    "searching": "13-algoritmos-essenciais/02-searching-busca-binaria-e-variacoes",
    "busca binaria": "13-algoritmos-essenciais/02-searching-busca-binaria-e-variacoes",
    "two pointers": "13-algoritmos-essenciais/03-two-pointers-sliding-window-fast-slow",
    "sliding window": "13-algoritmos-essenciais/03-two-pointers-sliding-window-fast-slow",
    "fast slow pointers": "13-algoritmos-essenciais/03-two-pointers-sliding-window-fast-slow",
    "recursao e backtracking": "13-algoritmos-essenciais/04-recursao-e-backtracking",
    "backtracking": "13-algoritmos-essenciais/04-recursao-e-backtracking",
    "divide and conquer": "13-algoritmos-essenciais/05-divide-and-conquer",
    "divisao e conquista": "13-algoritmos-essenciais/05-divide-and-conquer",
    "greedy": "13-algoritmos-essenciais/06-greedy-algorithms",
    "greedy algorithms": "13-algoritmos-essenciais/06-greedy-algorithms",
    "dynamic programming": "13-algoritmos-essenciais/07-dynamic-programming",
    "programacao dinamica": "13-algoritmos-essenciais/07-dynamic-programming",
    "graph algorithms": "13-algoritmos-essenciais/08-graph-algorithms",
    "algoritmos de grafos": "13-algoritmos-essenciais/08-graph-algorithms",
    "dijkstra": "13-algoritmos-essenciais/08-graph-algorithms",
    "bfs": "13-algoritmos-essenciais/08-graph-algorithms",
    "dfs": "13-algoritmos-essenciais/08-graph-algorithms",
    "string algorithms": "13-algoritmos-essenciais/09-string-algorithms-kmp-rabin-karp-z",
    "algoritmos de strings": "13-algoritmos-essenciais/09-string-algorithms-kmp-rabin-karp-z",
    "kmp": "13-algoritmos-essenciais/09-string-algorithms-kmp-rabin-karp-z",
    "rabin karp": "13-algoritmos-essenciais/09-string-algorithms-kmp-rabin-karp-z",
    "concorrencia vs paralelismo": "14-concorrencia-e-paralelismo/01-concorrencia-vs-paralelismo-e-context-switching",
    "context switching": "14-concorrencia-e-paralelismo/01-concorrencia-vs-paralelismo-e-context-switching",
    "race condition": "14-concorrencia-e-paralelismo/02-race-condition-e-critical-section",
    "critical section": "14-concorrencia-e-paralelismo/02-race-condition-e-critical-section",
    "deadlock": "14-concorrencia-e-paralelismo/03-deadlock-livelock-starvation",
    "livelock": "14-concorrencia-e-paralelismo/03-deadlock-livelock-starvation",
    "starvation": "14-concorrencia-e-paralelismo/03-deadlock-livelock-starvation",
    "primitivas de sincronizacao": "14-concorrencia-e-paralelismo/04-primitivas-de-sincronizacao-mutex-semaphore-monitor-spinlock",
    "mutex": "14-concorrencia-e-paralelismo/04-primitivas-de-sincronizacao-mutex-semaphore-monitor-spinlock",
    "semaphore": "14-concorrencia-e-paralelismo/04-primitivas-de-sincronizacao-mutex-semaphore-monitor-spinlock",
    "spinlock": "14-concorrencia-e-paralelismo/04-primitivas-de-sincronizacao-mutex-semaphore-monitor-spinlock",
    "atomic": "14-concorrencia-e-paralelismo/05-atomic-cas-lock-free-wait-free",
    "cas": "14-concorrencia-e-paralelismo/05-atomic-cas-lock-free-wait-free",
    "lock free": "14-concorrencia-e-paralelismo/05-atomic-cas-lock-free-wait-free",
    "wait free": "14-concorrencia-e-paralelismo/05-atomic-cas-lock-free-wait-free",
    "memory model": "14-concorrencia-e-paralelismo/06-memory-model-happens-before-volatile-barriers-false-sharing",
    "false sharing": "14-concorrencia-e-paralelismo/06-memory-model-happens-before-volatile-barriers-false-sharing",
    "happens before": "14-concorrencia-e-paralelismo/06-memory-model-happens-before-volatile-barriers-false-sharing",
    "producer consumer": "14-concorrencia-e-paralelismo/07-problemas-classicos-producer-consumer-readers-writers-dining-philosophers",
    "readers writers": "14-concorrencia-e-paralelismo/07-problemas-classicos-producer-consumer-readers-writers-dining-philosophers",
    "dining philosophers": "14-concorrencia-e-paralelismo/07-problemas-classicos-producer-consumer-readers-writers-dining-philosophers",
    "thread pools": "14-concorrencia-e-paralelismo/08-thread-pools-e-tuning",
    "async await": "14-concorrencia-e-paralelismo/09-async-await-futures-promises-reactive-streams",
    "futures": "14-concorrencia-e-paralelismo/09-async-await-futures-promises-reactive-streams",
    "promises": "14-concorrencia-e-paralelismo/09-async-await-futures-promises-reactive-streams",
    "reactive streams": "14-concorrencia-e-paralelismo/09-async-await-futures-promises-reactive-streams",
    "modelo osi": "15-redes-e-protocolos/01-modelo-osi-e-tcp-ip",
    "osi": "15-redes-e-protocolos/01-modelo-osi-e-tcp-ip",
    "tcp ip": "15-redes-e-protocolos/01-modelo-osi-e-tcp-ip",
    "modelo osi e tcp ip": "15-redes-e-protocolos/01-modelo-osi-e-tcp-ip",
    "tcp vs udp": "15-redes-e-protocolos/02-tcp-vs-udp",
    "udp": "15-redes-e-protocolos/02-tcp-vs-udp",
    "http 2": "15-redes-e-protocolos/03-http1-http2-http3-quic",
    "http 3": "15-redes-e-protocolos/03-http1-http2-http3-quic",
    "quic": "15-redes-e-protocolos/03-http1-http2-http3-quic",
    "https": "15-redes-e-protocolos/04-https-tls-handshake-e-certificados",
    "tls": "15-redes-e-protocolos/04-https-tls-handshake-e-certificados",
    "tls handshake": "15-redes-e-protocolos/04-https-tls-handshake-e-certificados",
    "dns": "15-redes-e-protocolos/05-dns-resolution",
    "dns resolution": "15-redes-e-protocolos/05-dns-resolution",
    "rest": "15-redes-e-protocolos/06-rest-graphql-grpc-websockets",
    "graphql": "15-redes-e-protocolos/06-rest-graphql-grpc-websockets",
    "grpc": "15-redes-e-protocolos/06-rest-graphql-grpc-websockets",
    "websockets": "15-redes-e-protocolos/06-rest-graphql-grpc-websockets",
    "semantica http": "15-redes-e-protocolos/07-semantica-http-idempotencia-e-status-codes",
    "status codes": "15-redes-e-protocolos/07-semantica-http-idempotencia-e-status-codes",
    "cors": "15-redes-e-protocolos/08-cors-csrf-xss",
    "csrf": "15-redes-e-protocolos/08-cors-csrf-xss",
    "xss": "15-redes-e-protocolos/08-cors-csrf-xss",
    "long polling": "15-redes-e-protocolos/09-long-polling-sse-websockets",
    "server sent events": "15-redes-e-protocolos/09-long-polling-sse-websockets",
    "sse": "15-redes-e-protocolos/09-long-polling-sse-websockets",
    "encurtador de url": "16-system-design/01-encurtador-de-url",
    "rate limiter": "16-system-design/05-rate-limiter",
    "timeline": "16-system-design/02-timeline-rede-social",
    "newsfeed": "16-system-design/12-newsfeed-ranking-e-recomendacao",
    "web crawler": "16-system-design/06-web-crawler-distribuido",
    "count min sketch": "16-system-design/14-top-k-trending-count-min-sketch",
    "top k": "16-system-design/14-top-k-trending-count-min-sketch",
}
for k, v in curated.items():
    assert v in catalog, "alias aponta para key inexistente: " + v
    alias(k, v)

# índice de aliases por número de tokens (para casar o alias mais longo)
alias_items = sorted(A.items(), key=lambda kv: -len(kv[0].split()))


def match_phrase(phrase, src_key):
    """Retorna a key do conceito mencionado ou None."""
    p = norm(re.sub(r":+\s*$", "", phrase)).strip()
    if not p:
        return None
    if p in A and A[p] != src_key:
        return A[p]
    ptoks = [t for t in p.split() if t not in STOP]
    if not ptoks:
        return None
    pset = set(ptoks)
    # alias contido na frase (alias multi-palavra é forte sinal)
    for atext, akey in alias_items:
        if akey == src_key:
            continue
        atoks = atext.split()
        if len(atoks) >= 2 and all(t in pset for t in atoks):
            return akey
    # fallback: alias de uma palavra distintiva (>=4 chars) presente
    for atext, akey in alias_items:
        if akey == src_key:
            continue
        if len(atext) >= 4 and atext in pset:
            return akey
    return None


# ---- extrai relações ---------------------------------------------------
edges = {}
unmatched = {}
for key, c in catalog.items():
    txt = c["text"]
    m = re.search(r"^##\s+Relação com outros conceitos\s*$(.*?)(^##\s+|\Z)",
                  txt, re.M | re.S)
    if not m:
        continue
    section = m.group(1)
    bolds = re.findall(r"\*\*([^*]+)\*\*", section)
    seen_targets = set()
    for b in bolds:
        tgt = match_phrase(b, key)
        if tgt and tgt != key and tgt not in seen_targets:
            seen_targets.add(tgt)
            edges[(key, tgt)] = edges.get((key, tgt), 0) + 1
        elif not tgt:
            nb = norm(re.sub(r":+\s*$", "", b))
            if nb:
                unmatched[nb] = unmatched.get(nb, 0) + 1

# ---- saída -------------------------------------------------------------
nodes = []
for key, c in catalog.items():
    nodes.append({"id": key, "label": c["label"], "block": c["block"],
                  "blockLabel": BLOCK_LABELS[c["block"]], "title": c["title"]})
edge_list = [{"from": s, "to": t, "w": w} for (s, t), w in edges.items()]

out = {"nodes": nodes, "edges": edge_list}

# stats
indeg = {n["id"]: 0 for n in nodes}
outdeg = {n["id"]: 0 for n in nodes}
for e in edge_list:
    outdeg[e["from"]] += 1
    indeg[e["to"]] += 1

print("NÓS:", len(nodes), "ARESTAS:", len(edge_list))
iso = [n["id"] for n in nodes if indeg[n["id"]] == 0 and outdeg[n["id"]] == 0]
print("Nós isolados (sem nenhuma aresta):", len(iso))
for k in iso:
    print("   isolado:", k)
print("\nTop 10 mais referenciados (in-degree):")
for k, v in sorted(indeg.items(), key=lambda kv: -kv[1])[:10]:
    print("  %3d  %s" % (v, k))
print("\nTop 15 menções não casadas (para revisar):")
for k, v in sorted(unmatched.items(), key=lambda kv: -kv[1])[:15]:
    print("  %3d  %r" % (v, k))
print("\nAmostra de 12 arestas:")
for e in edge_list[:12]:
    print("  %s  ->  %s" % (e["from"], e["to"]))

_outjs = pathlib.Path(__file__).resolve().parent.parent / "arquitetura-de-software" / "javascripts" / "graph-data.js"
with open(_outjs, "w", encoding="utf-8") as fh:
    fh.write("/* Grafo de dependencias entre conceitos.\n")
    fh.write("   GERADO AUTOMATICAMENTE por scripts/build_graph.py a partir das secoes\n")
    fh.write("   'Relacao com outros conceitos' de cada arquivo. Nao editar a mao. */\n")
    fh.write("window.CONCEPT_GRAPH = ")
    fh.write(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
    fh.write(";\n")
print("\ngraph-data.js salvo em", _outjs)
