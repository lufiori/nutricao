/* NutriVida - medidas caseiras e alimentos curados para refeição automática
   A TACO continua sendo a base nutricional; este arquivo só orienta escolhas mais simples. */
window.NV_MEDIDAS_CASEIRAS = {
  'Café da manhã': [
    {slot:'Proteína', busca:['ovo de galinha cozido','ovo cozido','ovo'], quantidade:1, unidade:'unidade', gramas:50, emoji:'🥚'},
    {slot:'Carboidrato', busca:['pão francês','pao frances','pão de forma','aveia'], quantidade:1, unidade:'fatia/unidade', gramas:50, emoji:'🍞'},
    {slot:'Fruta', busca:['banana prata','banana nanica','maçã','maca','mamão','mamao','laranja'], quantidade:1, unidade:'unidade média', gramas:80, emoji:'🍌'}
  ],
  'Almoço': [
    {slot:'Proteína', busca:['peito de frango grelhado','frango peito grelhado','frango'], quantidade:1, unidade:'filé médio', gramas:120, emoji:'🍗'},
    {slot:'Carboidrato', busca:['arroz branco cozido','arroz'], quantidade:4, unidade:'colheres de sopa', gramas:25, emoji:'🍚'},
    {slot:'Leguminosa', busca:['feijão carioca cozido','feijao carioca cozido','feijão'], quantidade:1, unidade:'concha média', gramas:100, emoji:'🫘'},
    {slot:'Legume/verdura', busca:['brócolis cozido','brocolis cozido','couve','cenoura cozida','abóbora cozida','alface'], quantidade:3, unidade:'colheres de sopa', gramas:25, emoji:'🥦'}
  ],
  'Lanche': [
    {slot:'Fruta', busca:['banana prata','banana','maçã','maca','mamão','mamao','laranja'], quantidade:1, unidade:'unidade média', gramas:80, emoji:'🍎'},
    {slot:'Proteína leve', busca:['iogurte natural','iogurte','leite integral','leite'], quantidade:1, unidade:'copo', gramas:170, emoji:'🥛'},
    {slot:'Complemento', busca:['aveia','amendoim','castanha','granola'], quantidade:2, unidade:'colheres de sopa', gramas:15, emoji:'🥄'}
  ],
  'Jantar': [
    {slot:'Proteína', busca:['peixe assado','tilápia','tilapia','frango','ovo cozido','ovo'], quantidade:1, unidade:'porção média', gramas:100, emoji:'🍳'},
    {slot:'Carboidrato', busca:['batata doce cozida','batata cozida','arroz branco cozido','mandioca cozida'], quantidade:3, unidade:'colheres de sopa', gramas:30, emoji:'🍠'},
    {slot:'Legume/verdura', busca:['brócolis cozido','brocolis','couve','cenoura cozida','abobrinha','alface'], quantidade:4, unidade:'colheres de sopa', gramas:25, emoji:'🥗'}
  ]
};
