/* NutriVida - medidas caseiras e alimentos curados por refeição
   A TACO continua sendo a base nutricional; este arquivo orienta escolhas simples e realistas. */
window.NV_MEDIDAS_CASEIRAS = {
  'Café da manhã': [
    {slot:'Proteína', busca:['ovo de galinha cozido','ovo cozido','ovo','iogurte natural','iogurte','leite integral','leite'], permitidos:['ovo','iogurte','leite'], bloqueados:['macarrão','macarrao','arroz','feijão','feijao','baião','baiao','lasanha','molho','carne','frango','peixe'], grupos:['Ovos','Leite'], quantidade:1, unidade:'unidade/copo', gramas:50, emoji:'🥚'},
    {slot:'Carboidrato', busca:['pão francês','pao frances','pão de forma','pao de forma','aveia','tapioca'], permitidos:['pão','pao','aveia','tapioca'], bloqueados:['macarrão','macarrao','arroz','feijão','feijao','baião','baiao','lasanha','molho','carne','frango'], grupos:['Cereais'], quantidade:1, unidade:'fatia/unidade', gramas:50, emoji:'🍞'},
    {slot:'Fruta', busca:['banana prata','banana nanica','banana','maçã','maca','mamão','mamao','laranja','pera'], permitidos:['banana','maçã','maca','mamão','mamao','laranja','pera'], bloqueados:['macarrão','macarrao','arroz','feijão','feijao','baião','baiao','molho','torrada','pão','pao'], grupos:['Frutas'], quantidade:1, unidade:'unidade média', gramas:80, emoji:'🍌'}
  ],
  'Almoço': [
    {slot:'Proteína', busca:['peito de frango grelhado','frango peito grelhado','frango','carne bovina','patinho','ovo cozido'], permitidos:['frango','carne','patinho','ovo','peixe'], bloqueados:['macarrão','macarrao','baião','baiao','lasanha','molho'], grupos:['Carnes','Ovos'], quantidade:1, unidade:'filé médio', gramas:120, emoji:'🍗'},
    {slot:'Carboidrato', busca:['arroz branco cozido','arroz','batata cozida','batata doce cozida','mandioca cozida'], permitidos:['arroz','batata','mandioca'], bloqueados:['baião','baiao','macarrão','macarrao','lasanha','molho'], grupos:['Cereais','Tubérculos'], quantidade:4, unidade:'colheres de sopa', gramas:25, emoji:'🍚'},
    {slot:'Leguminosa', busca:['feijão carioca cozido','feijao carioca cozido','feijão preto cozido','feijao preto cozido','feijão','feijao'], permitidos:['feijão','feijao','lentilha','grão-de-bico','grao de bico'], bloqueados:['baião','baiao','tropeiro','feijoada','macarrão','macarrao'], grupos:['Leguminosas'], quantidade:1, unidade:'concha média', gramas:100, emoji:'🫘'},
    {slot:'Legume/verdura', busca:['brócolis cozido','brocolis cozido','couve','cenoura cozida','abóbora cozida','abobora cozida','alface','abobrinha'], permitidos:['brócolis','brocolis','couve','cenoura','abóbora','abobora','alface','abobrinha'], bloqueados:['macarrão','macarrao','baião','baiao','molho'], grupos:['Verduras','Hortaliças','Legumes'], quantidade:3, unidade:'colheres de sopa', gramas:25, emoji:'🥦'}
  ],
  'Lanche': [
    {slot:'Fruta', busca:['banana prata','banana','maçã','maca','mamão','mamao','laranja','pera'], permitidos:['banana','maçã','maca','mamão','mamao','laranja','pera'], bloqueados:['macarrão','macarrao','arroz','feijão','feijao','baião','baiao','molho'], grupos:['Frutas'], quantidade:1, unidade:'unidade média', gramas:80, emoji:'🍎'},
    {slot:'Proteína leve', busca:['iogurte natural','iogurte','leite integral','leite','queijo minas'], permitidos:['iogurte','leite','queijo'], bloqueados:['macarrão','macarrao','arroz','feijão','feijao','baião','baiao'], grupos:['Leite'], quantidade:1, unidade:'copo/porção', gramas:170, emoji:'🥛'},
    {slot:'Complemento', busca:['aveia','amendoim','castanha','granola'], permitidos:['aveia','amendoim','castanha','granola'], bloqueados:['macarrão','macarrao','arroz','feijão','feijao','baião','baiao'], grupos:['Cereais','Oleaginosas'], quantidade:2, unidade:'colheres de sopa', gramas:15, emoji:'🥄'}
  ],
  'Jantar': [
    {slot:'Proteína', busca:['peixe assado','tilápia','tilapia','frango','ovo cozido','ovo'], permitidos:['peixe','tilápia','tilapia','frango','ovo'], bloqueados:['macarrão','macarrao','baião','baiao','lasanha','molho'], grupos:['Carnes','Ovos'], quantidade:1, unidade:'porção média', gramas:100, emoji:'🍳'},
    {slot:'Carboidrato', busca:['batata doce cozida','batata cozida','arroz branco cozido','mandioca cozida'], permitidos:['batata','arroz','mandioca'], bloqueados:['baião','baiao','macarrão','macarrao','lasanha','molho'], grupos:['Cereais','Tubérculos'], quantidade:3, unidade:'colheres de sopa', gramas:30, emoji:'🍠'},
    {slot:'Legume/verdura', busca:['brócolis cozido','brocolis','couve','cenoura cozida','abobrinha','alface'], permitidos:['brócolis','brocolis','couve','cenoura','abobrinha','alface'], bloqueados:['macarrão','macarrao','baião','baiao','molho'], grupos:['Verduras','Hortaliças','Legumes'], quantidade:4, unidade:'colheres de sopa', gramas:25, emoji:'🥗'}
  ]
};
