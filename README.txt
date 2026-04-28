NutriVida - pacote inicial simplificado

Arquivos principais:
- index.html: tela inicial com Hoje, Refeições, Resumo do dia, Falta no seu dia e Necessidades diárias.
- alimentos.html: busca de alimentos, favoritos e botão para adicionar ao diário.
- receitas.html: receitas escondidas no menu Mais, já com estrutura para adicionar ingredientes ao diário.
- favoritos.html: lista de alimentos favoritos.
- perfil.html: edição simples das metas diárias.
- app.css: visual único do app.
- app.js: funções compartilhadas, localStorage, diário, favoritos e carregamento da base.

Base de alimentos:
O app tenta carregar automaticamente, na mesma pasta, um destes arquivos JSON:
- taco.json
- alimentos.json
- dados_taco.json
- base_taco.json

Caso não encontre, usa uma base pequena de exemplo para não quebrar a tela.
