# Bibliografia essencial — comentada

Lista de leituras-base para os 72 conceitos deste estudo. Para cada livro: o que cobre, quais blocos deste material ele sustenta, e uma nota sobre quando lê-lo. A ordem abaixo é a recomendada de leitura.

---

## 1. Designing Data-Intensive Applications — Martin Kleppmann

O mais importante da lista. Cobre, com profundidade rara, quase todo o bloco de **Sistemas distribuídos** (CAP/PACELC, consistência, consenso, relógios lógicos, replicação, particionamento) e boa parte de **Dados e persistência** e **Mensageria e streaming** (logs, stream processing, CDC, Lambda vs Kappa). É denso, mas é o livro que mais "fecha a conta" entre teoria e prática.

- **Sustenta os blocos:** 04 (Sistemas distribuídos), 05 (Dados), 06 (Mensageria).
- **Quando ler:** em paralelo às Fases 4–7 do roteiro. Releia o capítulo de consistência/consenso depois de ver os conceitos isolados.
- Página oficial: <https://dataintensive.net/>

## 2. Fundamentals of Software Architecture — Mark Richards & Neal Ford

A melhor porta de entrada para o *papel* de arquiteto. Define atributos de qualidade ("-ilities"), apresenta os principais estilos arquiteturais lado a lado (layered, microkernel, microservices, event-driven, space-based, pipeline) e discute soft skills e trade-offs. É o livro-mapa.

- **Sustenta os blocos:** 01 (Fundamentos), 02 (Estilos e padrões).
- **Quando ler:** primeiro de todos, junto à Fase 0 e Fases 1–2.
- Página oficial: <https://www.developertoarchitect.com/books/>

## 3. Software Architecture: The Hard Parts — Ford, Richards, Sadalage & Dehghani

A continuação de Fundamentals, focada exatamente nas decisões difíceis: granularidade de serviços, decomposição de monolitos, dados distribuídos, transações distribuídas (sagas), contratos e acoplamento. Cheio de trade-offs sem resposta única.

- **Sustenta os blocos:** 02 (Microservices, decomposição), 03 (Saga, CQRS), 05 (Database per Service, dados distribuídos).
- **Quando ler:** depois de Fundamentals e do bloco de DDD, nas Fases 2–4.
- Página oficial: <https://www.developertoarchitect.com/books/>

## 4. Building Microservices (2ª ed.) — Sam Newman

Referência prática de microsserviços: decomposição, comunicação, segurança, deploy, resiliência, observabilidade e migração de monolitos. A 2ª edição amadureceu muito em relação à primeira.

- **Sustenta os blocos:** 02 (Microservices, SOA), 04 (resiliência, service discovery, BFF), 10 (Strangler Fig).
- **Quando ler:** Fases 2 e 5.
- Páginas do autor: <https://samnewman.io/books/building_microservices_2nd_edition/>

## 5. Implementing Domain-Driven Design — Vaughn Vernon

O "DDD na prática" (o *red book*). Mais acessível que o livro do Evans para implementar Bounded Contexts, Aggregates, Domain Events, Context Mapping e integração entre contextos. Complementa, não substitui, o livro azul do Evans (*Domain-Driven Design: Tackling Complexity in the Heart of Software*).

- **Sustenta o bloco:** 03 (todo o DDD tático e estratégico).
- **Quando ler:** Fase 3. Tenha o livro do Evans por perto como referência conceitual.
- Editora: <https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/>

## 6. Release It! (2ª ed.) — Michael Nygard

A bíblia dos padrões de resiliência e estabilidade em produção. Origem prática de Circuit Breaker, Bulkhead, Timeout, e dos anti-padrões de falha em cascata. Leitura obrigatória para quem opera sistemas distribuídos.

- **Sustenta os blocos:** 04 (padrões de resiliência), 07 (capacidade), 09 (observabilidade).
- **Quando ler:** Fase 5.
- Editora: <https://pragprog.com/titles/mnee2/release-it-second-edition/>

## 7. Building Evolutionary Architectures (2ª ed.) — Neal Ford, Rebecca Parsons & Patrick Kua

Apresenta as **fitness functions** e a ideia de arquitetura como algo que evolui de forma guiada e mensurável, em vez de "big design up front". Conecta arquitetura, testes e governança.

- **Sustenta os blocos:** 01 (Fitness Functions), 10 (evolução).
- **Quando ler:** Fase 0 (capítulo de fitness functions) e revisita na Fase 9.
- Site: <https://evolutionaryarchitecture.com/>

## 8. Patterns of Enterprise Application Architecture (PoEAA) — Martin Fowler

O catálogo clássico de padrões de aplicação corporativa: camadas, mapeamento objeto-relacional, padrões de domínio (Domain Model vs Transaction Script), concorrência, sessão. Muitos conceitos dos blocos 02 e 05 têm raiz aqui.

- **Sustenta os blocos:** 02 (Layered, organização de domínio), 05 (padrões de persistência).
- **Quando ler:** referência de consulta ao longo das Fases 1 e 7.
- Catálogo online: <https://martinfowler.com/eaaCatalog/> · Livro: <https://martinfowler.com/books/eaa.html>

---

## Leituras complementares citadas ao longo dos arquivos

Não são "obrigatórias", mas aparecem com frequência nas referências dos conceitos:

- **Team Topologies** — Matthew Skelton & Manuel Pais (Conway's Law, Platform Engineering, IDPs). <https://teamtopologies.com/book>
- **Accelerate** — Forsgren, Humble & Kim (Trunk-Based, GitOps, métricas DORA). <https://itrevolution.com/product/accelerate/>
- **Site Reliability Engineering (Google SRE Book)** — gratuito online (SLI/SLO/SLA, error budgets, Four Golden Signals). <https://sre.google/books/>
- **Domain-Driven Design** — Eric Evans (o "livro azul", fundação do bloco 03). <https://www.domainlanguage.com/ddd/>
- **Enterprise Integration Patterns** — Hohpe & Woolf (mensageria, Pipes and Filters, DLQ). <https://www.enterpriseintegrationpatterns.com/>

---

## Parte II — Fundamentos de CS e entrevistas (blocos 11–17)

Referências-base para complexidade, estruturas de dados, algoritmos, concorrência, banco de dados, redes e System Design.

- **Introduction to Algorithms (CLRS)** — Cormen, Leiserson, Rivest & Stein (complexidade, estruturas de dados e algoritmos — blocos 11/12/13). <https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/>
- **Operating Systems: Three Easy Pieces (OSTEP)** — Arpaci-Dusseau (concorrência, threads, locks — bloco 14; gratuito). <https://pages.cs.wisc.edu/~remzi/OSTEP/>
- **Java Concurrency in Practice** — Brian Goetz et al. (memory model, sincronização — bloco 14). <https://jcip.net/>
- **Database Internals** — Alex Petrov (B-Trees, isolamento, replicação — blocos 12/15). <https://www.databass.dev/>
- **SQL Performance Explained / use-the-index-luke.com** — Markus Winand (índices, EXPLAIN — bloco 15). <https://use-the-index-luke.com/>
- **High Performance Browser Networking** — Ilya Grigorik (TCP, TLS, HTTP/2, HTTP/3 — bloco 16; gratuito). <https://hpbn.co/>
- **System Design Interview, Vol. 1 & 2** — Alex Xu / ByteByteGo (bloco 17). <https://bytebytego.com/>
- **The System Design Primer** — Donne Martin (guia aberto no GitHub — bloco 17). <https://github.com/donnemartin/system-design-primer>
- **Designing Data-Intensive Applications** — Kleppmann (já citado na Parte I; também sustenta quórum, relógios, isolamento — blocos 04/15/17).

---

## Ordem de leitura sugerida (visão rápida)

1. *Fundamentals of Software Architecture* (mapa geral)
2. *Building Evolutionary Architectures* — cap. de fitness functions
3. *Implementing Domain-Driven Design* + Evans como apoio
4. *Designing Data-Intensive Applications* (o coração — leitura longa, em paralelo)
5. *Building Microservices* + *Release It!*
6. *Software Architecture: The Hard Parts* (decisões difíceis, ao final)
7. *PoEAA* — consulta pontual ao longo do caminho
