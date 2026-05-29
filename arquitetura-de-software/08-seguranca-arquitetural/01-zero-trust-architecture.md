# Zero Trust Architecture

> **Bloco:** Segurança arquitetural · **Nível:** Intermediário/Avançado · **Tempo de leitura:** ~23 min

## TL;DR

Zero Trust Architecture (ZTA) é um paradigma de segurança que abandona a premissa do **perímetro confiável**: nenhuma requisição é considerada legítima apenas porque se origina da rede interna. Cada acesso a um recurso é avaliado dinamicamente, por requisição, combinando **identidade autenticada**, **postura do dispositivo**, **contexto** (hora, localização, comportamento) e **política**. A frase canônica é *"never trust, always verify"*. Na prática, ZTA não é um produto que se compra: é um conjunto de princípios (formalizados pelo NIST SP 800-207) implementado por uma malha de componentes — **Policy Engine (PE)**, **Policy Administrator (PA)** e **Policy Enforcement Point (PEP)** — apoiados por identidade forte (IdP/OIDC), micro-segmentação, mTLS entre serviços e telemetria contínua. Para o arquiteto, o ponto central é que ZTA desloca o controle de acesso do *nível de rede* para o *nível de recurso e identidade*, com decisões reavaliadas continuamente.

## O problema que resolve

O modelo de segurança tradicional é o **castelo e fosso** (*castle-and-moat*): firewalls de perímetro definem uma fronteira entre o "fora" (hostil) e o "dentro" (confiável). Uma vez dentro da rede corporativa — via VPN, conexão física no escritório, ou movimento lateral após o comprometimento de uma máquina — o atacante (ou o usuário legítimo) ganha acesso amplo, porque a confiança é **implícita e baseada em localização de rede**. Esse modelo falha em três frentes que se tornaram dominantes:

1. **Movimento lateral**: a maioria dos incidentes graves (Target 2013, várias campanhas de ransomware) não decorre de quebra do perímetro em si, mas da liberdade que o atacante tem *depois* de entrar. Uma credencial de fornecedor de HVAC levou ao roubo de dados de cartões porque a rede interna era plana e confiável.
2. **Dissolução do perímetro**: cloud pública, SaaS, trabalho remoto e dispositivos móveis significam que recursos e usuários já não vivem dentro de uma fronteira de rede própria. Não há mais "dentro" geográfico a defender.
3. **Microsserviços e tráfego leste-oeste**: em arquiteturas distribuídas, a maior parte do tráfego é *service-to-service* (leste-oeste), não *cliente-servidor* (norte-sul). O firewall de borda não vê nem controla esse tráfego.

A formalização conceitual vem de **John Kindervag**, então analista da **Forrester Research**, que cunhou o termo *Zero Trust* por volta de 2010, atacando a premissa de que existe uma rede "confiável" interna. O esforço maturou nas iniciativas **BeyondCorp** do Google (publicadas a partir de 2014), que reescreveram o acesso corporativo eliminando a VPN e movendo a confiança para identidade + dispositivo. A consolidação normativa veio com o **NIST Special Publication 800-207, "Zero Trust Architecture"** (final em agosto de 2020), que é a referência arquitetural canônica e define os componentes lógicos e os "tenets" (princípios fundamentais) da abordagem. Nos EUA, a **Executive Order 14028 (2021)** tornou ZTA mandatória para agências federais, acelerando sua adoção mainstream.

## O que é (definição aprofundada)

Zero Trust é, antes de tudo, um **conjunto de princípios de design**, não uma topologia fixa. O NIST SP 800-207 enumera sete *tenets* essenciais; em resumo arquitetural eles dizem:

- Todo **recurso** (dado, serviço, dispositivo) é tratado como sensível. Não há recurso "interno" implicitamente seguro.
- Toda **comunicação é protegida** independentemente da localização da rede (ou seja, criptografia e autenticação valem igualmente dentro do datacenter).
- Acesso é concedido **por sessão**, de forma **mínima** (least privilege) e **reavaliado** a cada requisição — confiança não é persistente.
- A decisão de acesso é **dinâmica e baseada em política**, considerando atributos de identidade, estado do dispositivo, comportamento e risco.
- A organização **monitora e mede continuamente** a integridade e a postura de segurança de todos os ativos.
- **Autenticação e autorização são estritas e dinâmicas**, aplicadas *antes* de cada acesso (não uma vez no login).
- A organização coleta o **máximo de telemetria** sobre o estado dos ativos, tráfego e requisições para alimentar e melhorar as políticas.

Os componentes lógicos centrais definidos pelo NIST são:

- **Policy Engine (PE)**: o cérebro. Decide *conceder, negar ou revogar* acesso a um recurso, aplicando um *trust algorithm* sobre fontes de input (feeds de CDM/inventário, threat intelligence, logs de atividade, sistemas SIEM, políticas de negócio, PKI, ID management).
- **Policy Administrator (PA)**: o executor da decisão. Estabelece ou encerra o canal de comunicação entre cliente e recurso, geralmente emitindo tokens, credenciais de sessão ou configurando o PEP.
- **Policy Enforcement Point (PEP)**: o ponto de aplicação no caminho do tráfego. Habilita, monitora e encerra a conexão. Pode ser um proxy de identidade, um gateway, ou um sidecar de service mesh.

Juntos, PE e PA formam o **Policy Decision Point (PDP)** — o **plano de controle** (control plane). O PEP vive no **plano de dados** (data plane). Essa separação plano de controle / plano de dados é o coração arquitetural de ZTA e é exatamente o que um service mesh implementa para tráfego leste-oeste.

Uma distinção importante: **ZTA não é "sem confiança"**, é **confiança explícita, mínima e contínua**. Você confia, mas só depois de verificar, e só pelo escopo e tempo estritamente necessários. O termo "trust" aqui significa o resultado de uma avaliação dinâmica, não um estado herdado da topologia de rede.

## Como funciona

O fluxo arquitetural fundamental de ZTA, para qualquer acesso a recurso, é:

1. **Subject + Asset** — Um sujeito (usuário ou serviço) em um dispositivo deseja acessar um recurso. O sujeito é autenticado por um IdP forte, idealmente com **MFA** e **OIDC** (ver arquivo sobre OAuth2/OIDC). Para serviços, a identidade é estabelecida via **mTLS** com identidades de workload (SPIFFE/SPIRE).
2. **Interceptação no PEP** — A requisição não vai direto ao recurso. Ela passa por um PEP (proxy de identidade, gateway, ou sidecar) que a intercepta antes de qualquer acesso.
3. **Consulta ao PDP** — O PEP consulta o PE (via PA). O PE roda o *trust algorithm* combinando: identidade verificada, *device posture* (o dispositivo está em compliance? patch level, EDR ativo?), contexto (geolocalização, horário incomum, padrão de comportamento anômalo), nível de risco e política de negócio aplicável àquele recurso.
4. **Decisão por sessão** — O PE devolve conceder/negar. Se conceder, o PA configura o PEP e emite uma credencial de sessão (ex.: token de curta duração, certificado X.509 SVID). O acesso é **escopado** ao recurso específico, não à rede inteira.
5. **Acesso e reavaliação contínua** — A sessão é monitorada. Mudanças de contexto (risco subiu, dispositivo perdeu compliance, token expirou) podem disparar **revogação ou reautenticação**. Confiança não é assumida pelo resto da sessão — ela é continuamente reavaliada (CARTA / Continuous Adaptive Risk and Trust Assessment).

Para o tráfego **leste-oeste** (entre microsserviços), o padrão dominante é o **service mesh** com **mTLS mútuo automático**: cada serviço recebe uma identidade criptográfica (SPIFFE ID), o sidecar (PEP) impõe autenticação mútua e políticas de autorização L7, e o control plane (PDP) distribui políticas. Assim, o serviço de pagamentos só aceita chamadas do serviço de pedidos com identidade verificada — micro-segmentação por identidade, não por sub-rede.

A **micro-segmentação** é o mecanismo que substitui a rede plana: em vez de uma grande zona confiável, você define *segmentos* mínimos (idealmente por workload), de modo que comprometer um serviço não dá acesso a tudo. ZTA leva a micro-segmentação ao limite da identidade individual de workload.

## Diagrama de fluxo

```mermaid
sequenceDiagram
    participant Subject as Sujeito (User/Service)
    participant PEP as PEP (Proxy/Sidecar)
    participant PDP as PDP (Policy Engine + Admin)
    participant IdP as IdP / Telemetria
    participant Resource as Recurso protegido

    Subject->>PEP: Requisicao de acesso ao recurso
    PEP->>PDP: Solicita decisao de acesso
    PDP->>IdP: Verifica identidade, device posture, risco
    IdP-->>PDP: Atributos + contexto + threat intel
    Note over PDP: Trust algorithm avalia<br/>identidade + contexto + politica
    PDP-->>PEP: Decisao (conceder escopo minimo / negar)
    alt Acesso concedido
        PEP->>PEP: Emite credencial de sessao de curta duracao
        PEP->>Resource: Encaminha requisicao autenticada
        Resource-->>PEP: Resposta
        PEP-->>Subject: Resposta
        Note over PEP,PDP: Monitoramento continuo;<br/>mudanca de risco -> reavaliacao/revogacao
    else Acesso negado
        PEP-->>Subject: 403 Forbidden
    end
```

## Exemplo prático / caso real

Considere um **marketplace brasileiro de e-commerce** migrando de um monólito on-premise para microsserviços em Kubernetes na nuvem, com times distribuídos e parceiros logísticos integrados via API. O modelo antigo: VPN corporativa dá acesso à rede interna; lá dentro, qualquer serviço fala com qualquer serviço sem autenticação; o banco de dados de pagamentos aceita conexões de qualquer IP da VPC.

Adoção incremental de ZTA:

1. **Identidade primeiro**. Implanta-se o **Keycloak** (open source) ou **Auth0/Okta** como IdP central, com OIDC e MFA obrigatório para acesso de funcionários e admins. O acesso a painéis administrativos passa por um **proxy de identidade** (PEP norte-sul) — nada de "estar na VPN" libera o painel; cada acesso valida identidade + device posture (ex.: dispositivo gerenciado, com EDR ativo).
2. **mTLS leste-oeste com service mesh**. Adota-se **Istio** com mTLS estrito (`PeerAuthentication: STRICT`). Cada workload recebe identidade emitida por **SPIFFE/SPIRE** integrado ao mesh. O serviço `pagamentos` aceita apenas chamadas com SPIFFE ID de `checkout` e `pedidos` — uma `AuthorizationPolicy` do Istio nega o resto. Se o serviço de catálogo (que não deveria falar com pagamentos) for comprometido, ele não consegue se mover lateralmente para o serviço de pagamentos: não tem identidade autorizada.
3. **Micro-segmentação por workload**. NetworkPolicies do Kubernetes + políticas L7 do mesh restringem o tráfego ao mínimo necessário, eliminando a rede plana interna.
4. **Telemetria contínua** alimenta o PDP. Logs de acesso, métricas e eventos de risco vão para um SIEM; políticas adaptativas (ex.: forçar reautenticação se o padrão de acesso de um admin destoa).

Pseudocódigo leve de uma política de autorização no mesh (conceitual):

```
política autorizacao "pagamentos":
  permitir requisicao SE
      origem.spiffe_id IN ["spiffe://prod/checkout", "spiffe://prod/pedidos"]
      E mtls.verificado == true
      E metodo IN ["POST /charge", "POST /refund"]
  caso contrario: negar
```

O ganho não é mágico: é a eliminação da confiança implícita. Um vazamento de credencial de um serviço periférico deixa de ser caminho livre para o coração financeiro do sistema.

## Quando usar / Quando evitar

**Usar (e priorizar) quando:**

- A organização tem ativos em múltiplos ambientes (cloud, on-prem, SaaS) e força de trabalho remota — o perímetro já não existe de fato.
- Arquitetura de microsserviços com muito tráfego leste-oeste e requisitos de compliance (PCI-DSS, LGPD) que exigem segmentação e auditoria de acesso.
- Risco alto de movimento lateral (dados financeiros, PII em escala). Marketplaces e fintechs são candidatos óbvios.
- Já existe (ou se planeja) IdP forte com OIDC/MFA e capacidade de telemetria — ZTA depende criticamente dessa base.

**Evitar / adiar (ou adotar gradualmente) quando:**

- Sistema pequeno, monolítico, com poucos usuários e baixo valor de ativos: o overhead operacional de PDP/PEP, mTLS e gestão de identidade de workload não se paga. Comece pelo básico (MFA, mínimo privilégio).
- Não há maturidade de **gestão de identidade**. ZTA sem IdP confiável e inventário de ativos vira teatro de segurança — você troca um perímetro por uma promessa de verificação que não consegue cumprir.
- Sistemas legados que não podem ser instrumentados (não falam OIDC, não suportam sidecar). Aqui ZTA é incremental: isole o legado atrás de um PEP/proxy e migre por etapas.

**Trade-offs explícitos**: ZTA aumenta **latência** (cada acesso consulta o PDP — mitigado com cache de decisão e tokens de curta duração), aumenta **complexidade operacional** (control plane crítico que vira ponto único de falha se mal projetado), e exige **investimento em identidade e telemetria**. O retorno é redução drástica de blast radius e de movimento lateral. Não é tudo-ou-nada: a recomendação prática é adoção por **maturidade incremental**, começando pelos ativos de maior valor.

## Anti-padrões e armadilhas comuns

- **"Compramos uma ferramenta Zero Trust"**: ZTA é arquitetura e princípio, não produto. Comprar um ZTNA (Zero Trust Network Access) e manter a rede interna plana atrás dele é teatro.
- **Perímetro como única defesa disfarçado de ZTA**: substituir VPN por proxy de identidade mas continuar com serviços que confiam cegamente em qualquer chamada interna. O tráfego leste-oeste continua sendo o calcanhar de Aquiles.
- **PDP como ponto único de falha**: o Policy Engine no caminho de toda requisição sem HA, cache ou degradação graciosa derruba o sistema inteiro. Projete *fail-safe* (negar com cache vs. fail-open).
- **Confiança implícita residual**: emitir um token de longa duração e nunca reavaliar — viola o princípio de reavaliação contínua e de menor privilégio por sessão.
- **Ignorar device posture**: autenticar a identidade mas não o dispositivo. Uma credencial válida em uma máquina comprometida ainda é um vetor.
- **mTLS habilitado em modo permissivo "para sempre"**: começar em `PERMISSIVE` para migração é correto, mas esquecer de promover para `STRICT` deixa o mesh aceitando tráfego não-mTLS indefinidamente.
- **Micro-segmentação por IP/sub-rede em vez de identidade**: IPs são efêmeros em Kubernetes; segmentar por IP recria a fragilidade da rede plana com mais passos.

## Relação com outros conceitos

- **ZTA ↔ mTLS e Service Mesh**: o service mesh (Istio, Linkerd) é a implementação canônica de ZTA para tráfego leste-oeste — o sidecar é o PEP, o control plane é o PDP, e o mTLS mútuo provê autenticação criptográfica entre workloads. Ver `03-mtls-entre-servicos.md`.
- **ZTA ↔ Least Privilege**: o princípio de acesso mínimo por sessão é o coração de ZTA; ZTA é, em parte, Least Privilege aplicado dinamicamente e por requisição. Ver `04-defense-in-depth-least-privilege-secure-by-default.md`.
- **ZTA ↔ OAuth2/OIDC**: a identidade forte com tokens de escopo e curta duração é o substrato de autenticação/autorização do sujeito. Ver `02-oauth2-oidc-saml-jwt.md`.
- **ZTA ↔ Defense in Depth**: ZTA não substitui camadas; ela é uma camada (e uma filosofia) que se soma a criptografia, hardening e segmentação.
- **ZTA ↔ Threat Modeling**: as *trust boundaries* de um DFD em STRIDE são exatamente onde ZTA insere PEPs e exige verificação. Ver `06-threat-modeling-stride-pasta.md`.
- **ZTA ↔ Observabilidade**: a reavaliação contínua depende de telemetria rica — ZTA e observabilidade são interdependentes.

## Referências

- [SP 800-207, Zero Trust Architecture | CSRC (NIST)](https://csrc.nist.gov/pubs/sp/800/207/final)
- [NIST Special Publication 800-207 Zero Trust Architecture (PDF)](https://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.SP.800-207.pdf)
- [Zero Trust Architecture: NIST Publishes SP 800-207 | NIST](https://www.nist.gov/news-events/news/2020/08/zero-trust-architecture-nist-publishes-sp-800-207)
- [SP 800-207A, A Zero Trust Architecture Model for Access Control in Cloud-Native Applications | CSRC (NIST)](https://csrc.nist.gov/pubs/sp/800/207/a/final)
- [SPIFFE – Secure Production Identity Framework for Everyone](https://spiffe.io/)
- [Istio / SPIRE integration](https://istio.io/latest/docs/ops/integrations/spire/)
- [SPIFFE | SPIRE Use Cases](https://spiffe.io/docs/latest/spire-about/use-cases/)
