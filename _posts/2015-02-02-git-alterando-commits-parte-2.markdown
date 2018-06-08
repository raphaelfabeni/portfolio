---
layout: post
title:  "Git: Alterando seus commits com rebase - parte 2/2"
description: "Com o rebase interativo, conseguimos editar nossos commits em um mesmo branch, seja mesclando-os, alterando a ordem e editando as mensagens."
type: Post
date: 2015-02-02
image: 'https://cloud.githubusercontent.com/assets/1345662/11458149/a4fe99da-96a1-11e5-8d30-0f4938603dcc.jpg'
alt: 'Dois senhores idosos jogando golf em um clube de campo'
lang: pt-br
url_en: /git-editing-commits-part-2/
url_br: /git-alterando-commits-parte-2/
category: 'git'
---

No [post anterior](/git-alterando-commits-parte-1/), vimos duas das coisas que são possíveis de se fazer com o *rebase* interativo:

* alterar a ordem dos _commits_;
* editar as mensagens.

Nesse post vamos ver como mesclar dois _commits_ em apenas um e, o processo inverso, de dividir um único _commit_ em dois.

## Relembrando

Voltando ao exemplo do [post anterior](/git-alterando-commits-parte-1) (recomendo que você leia, pra se atualizar com o fluxo), rodamos novamente o comando:

```bash
git rebase -i HEAD~3
```

Após isso, caímos na tela abaixo:

```bash
pick 9afe987 Ajustes de CSS e JS no slideshow.
pick 74e6f3e Mais ajustes de CSS e JS no slideshow.
pick 1ee9572 Atualiza informações sobre dependências JS no README.

# Rebase 5644bdd..1ee9572 onto 5644bdd
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
```

Até aqui nada de novo. Então vamos lá..

## Mesclando _commits_

Vamos mesclar os dois _commits_ relacionados aos ajustes de CSS e JS do slideshow, que provavelmente mexeram coisas semelhantes (senão as mesmas coisas) e talvez tivesse mais sentido se ficassem juntos em apenas um _commit_.

Para isso, digitamos `squash` em um _commit_. Fazendo isso o moço *git* entende que queremos mesclar esse _commit_ marcado com o anterior (no caso, o de cima).

```bash
pick 9afe987 Ajustes de CSS e JS no slideshow.
squash 74e6f3e Mais ajustes de CSS e JS no slideshow.
pick 1ee9572 Atualiza informações sobre dependências JS no README.
```

Feito isso, caíremos numa tela que mostra as mensagens dos dois _commits_:

```bash
# This is a combination of 2 commits.
# The first commit's message is:

Ajustes de CSS e JS no slideshow.

# This is the 2nd commit message:

Mais ajustes de CSS e JS no slideshow.

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Fri Dec 26 15:48:51 2014 -0200
#
# rebase in progress; onto 5644bdd
# You are currently editing a commit while rebasing branch 'develop' on '5644bdd'.
#
# Changes to be committed:
#       modified:   dev/js/slideshow.js
#       modified:   dev/css/style.css
```

Agora é só apagarmos ou comentarmos as duas linhas de mensagens dos _commits_ e inserirmos a nova mensagem:

```bash
Ajustes gerais de CSS e JS no slideshow.
```

E.. pronto! Agora se rodarmos um *log* dos commits, veremos algo similar a isso:

```bash
1ee9572 Atualiza informações sobre dependências JS no README.
f2feda9 Ajustes gerais de CSS e JS no slideshow.
```

## Dividindo um _commit_

Sabe-se lá Deus por que, mas agora queremos reverter o processo anterior e dividir o _commit_ que foi mesclado anteriormente (brincadeiras a parte, podemos fazer isso por exemplo, em _commit_ que englobou muita alteração e que talvez pudéssemos querer dividir melhor o caminho que percorremos). Rodamos o *rebase*:

```bash
git rebase -i HEAD~2
```

Iremos cair nessa tela que já estamos acostumados, eaí trocamos o *pick* por *edit* no _commit_ que quisermos editar.

```bash
edit f2feda9 Ajustes gerais de CSS e JS no slideshow.
pick 1ee9572 Atualiza informações sobre dependências JS no README.
...
```

Saindo do modo de edição e continuando iremos chegar aqui:

```bash
Stopped at f2feda9... Ajustes gerais de CSS e JS no slideshow.
You can amend the commit now, with
   git commit --amend
Once you are satisfied with your changes, run
   git rebase --continue
```

Essa parte é legal. O que aconteceu aqui foi que o *rebase* parou no _commit_ que especificamos. Temos agora três opções:

* `git commit --amend` => para editar o _commit_ editando/adicionando um arquivo.
* `git rebase --continue` => para seguir em frente com o *rebase* e não fazer nada (use esse comando também após o anterior para continuar com o *rebase*).
* `git reset HEAD^` => Volta o _commit_ em que estamos parados.

Nesse ponto se rodarmos um `git status` veremos os arquivos que foram modificados nesse _commit_ :

```bash
dev/js/slideshow.js
dev/js/main.js
dev/css/style.css
dev/css/slideshow.css
```

Agora podemos adicionar os arquivos e *commitar*. Aqui que teoricamente você faz a divisão dos _commits_. Para o nosso exemplo, poderíamos fazer algo assim:

```bash
git add dev/js/slideshow.js

git add dev/css/slideshow.css

git commit -m "Ajustes de CSS e JS no core do slideshow."

git add dev/css/style.css

git commit -m "Ajustes de CSS do slideshow para as páginas internas."

git add dev/js/main.js

git commit -m "Troca da chamada nos parâmetros da função do slideshow."
```

O que fizemos acima foi adicionar os arquivos por partes e fazer _commits_. Com tudo feito, é só continuarmos o *rebase*:

```bash
git rebase --continue

Successfully rebased and updated refs/heads/develop.
```

E... pronto! Se formos olhar o log, teríamos agora algo similar a isso:

```bash
1ee9572 Atualiza informações sobre dependências JS no README.
f74a46e Troca da chamada nos parâmetros da função do slideshow.
41ab775 Ajustes de CSS do slideshow para as páginas internas.
7ccdd4c Ajustes de CSS e JS no core do slideshow.
```

## Forçando o push

[Como bem lembrado](https://github.com/raphaelfabeni/raphaelfabeni.github.io/issues/9) pelo [Cícero Pablo](https://github.com/ciceropablo), quando utilizamos o *rebase interativo*, caso você já tenha um repositório com uma *história de commits*, será preciso fazer `push` com a flag `--force`.

**Obs**.

* Os nomes/estrutura dos arquivos e mensagens de _commit_ são a títulos de exemplo.
* Usei a palavra tela para referenciar cada retorno do terminal.
* Uso por padrão como editor o *vim*, o que facilita a edição das *telas* que comentei no tópico anterior.

Gostou? Escrevi alguma groselha? Quer melhorar? Abra uma [issue](https://github.com/raphaelfabeni/raphaelfabeni.github.io/issues) com a hashtag *1postperweek* e vamos conversar.









