# Como publicar este estudo como site (MkDocs + GitHub Pages)

O repositório já está inicializado e com o primeiro commit feito. Falta limpar uns
arquivos temporários, criar o repositório no GitHub e dar `push`. O deploy do site
é automático via GitHub Actions.

---

## Passo 0 — Limpar locks do git (obrigatório, só uma vez)

A inicialização do git foi feita por uma ferramenta que não conseguiu remover alguns
arquivos `.lock` e temporários através do sistema de arquivos montado. Eles travariam
o git aqui na sua máquina. Rode, dentro de `~/Repositories/studies`:

```bash
cd ~/Repositories/studies
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock
find .git/objects -type f -name 'tmp_obj_*' -delete
git gc --prune=now            # opcional: arruma o repositório
git status                    # deve mostrar "working tree clean" na branch main
```

> Se preferir começar do zero (também funciona): `rm -rf .git && git init -b main && git add -A && git commit -m "Estudo de arquitetura + site MkDocs"`.

---

## Passo 1 — Criar o repositório no GitHub

Crie um repositório **vazio** (sem README, sem .gitignore, sem licença) em
<https://github.com/new>. Anote o nome, ex.: `studies` ou `arquitetura-de-software`.

---

## Passo 2 — Conectar e enviar (push)

Troque `SEU-USUARIO` e `SEU-REPO`:

```bash
# via SSH (recomendado se você já usa chave SSH no GitHub)
git remote add origin git@github.com:SEU-USUARIO/SEU-REPO.git

# OU via HTTPS
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git

git push -u origin main
```

---

## Passo 3 — O GitHub Actions faz o deploy sozinho

Ao receber o push na `main`, o workflow `.github/workflows/deploy.yml` roda
`mkdocs gh-deploy`, que **constrói o site e cria a branch `gh-pages`**.
Acompanhe em **Actions** no GitHub (leva ~1–2 min).

> Se o job falhar por permissão, vá em **Settings → Actions → General →
> Workflow permissions** e marque **Read and write permissions**.

---

## Passo 4 — Ligar o GitHub Pages

Em **Settings → Pages**:

- **Source:** *Deploy from a branch*
- **Branch:** `gh-pages` / `(root)` → **Save**

Em ~1 minuto o site fica disponível em:

```
https://SEU-USUARIO.github.io/SEU-REPO/
```

---

## Rodar localmente (preview antes de publicar)

```bash
cd ~/Repositories/studies
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve        # abre em http://127.0.0.1:8000
```

`mkdocs serve` recarrega ao salvar — ótimo para revisar os diagramas Mermaid e a navegação.

---

## Dicas

- **URL canônica:** opcionalmente adicione `site_url: https://SEU-USUARIO.github.io/SEU-REPO/` no topo do `mkdocs.yml` (melhora busca e links absolutos).
- **Domínio próprio:** dá para apontar um domínio em Settings → Pages → Custom domain.
- **Hardening do workflow:** as Actions estão fixadas em tags (`@v4`, `@v5`). Para máxima segurança, troque pelas SHAs dos commits correspondentes.
- **Atualizar o site:** basta commitar e dar `git push`; o Actions republica sozinho.
