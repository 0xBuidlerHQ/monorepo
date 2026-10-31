---
sourceRevision: 423d54ae78f2b72b950e0d7c5b8fbcd05ed0fbb795f336625edc3912d2154cd8
title: "Compreender os [ Oráculos ]"
draft: false
---

Em [Compreender a \[ DeFi \]](/pt/learn/defi-101), Bob pediu 400 USDC contra ativos avaliados em 1 000 dólares. A posição podia ser liquidada se esse respaldo perdesse demasiado valor.

Mas o contrato regista tokens, não etiquetas de preços em dólares. Como sabe quanto vale o ETH de Bob? Que preço deve usar se mercados diferentes mostram números diferentes?

É este o papel de um **oráculo**: fornecer informação de que um contrato precisa, mas que não consegue estabelecer apenas a partir dos seus registos. Vamos acompanhar um preço desde o mercado até ao empréstimo de Bob. Todos os preços e parâmetros de risco do exemplo são ilustrativos.

## O que o contrato pode saber

O contrato de empréstimo consegue ler quantos tokens Bob forneceu e quanto deve. Essas quantidades fazem parte dos registos da blockchain. Os valores atuais em dólares são outro dado de entrada.

Não pode simplesmente pedir a cada nó que abra um site e use o preço apresentado. Os sites podem mudar entre pedidos, ficar indisponíveis ou devolver respostas diferentes. Os nós que processam a mesma transação precisam de dados acordados para obter o mesmo resultado.

Um **[oráculo](/pt/glossary#oracle)** liga uma fonte de informação à aplicação que a usa. Num oráculo de preços, isso pode incluir recolher observações de mercado, combiná-las e entregar um relatório que o contrato consiga verificar e utilizar.

## Das observações ao preço de referência

Suponhamos que a garantia de Bob é **0,4 ETH**. A um preço de referência de **2 500 dólares por ETH**, o protocolo avalia-a em **1 000 dólares**.

Não há um preço universal de ETH escrito algures no mundo. As plataformas de negociação podem mostrar preços ligeiramente diferentes e ter liquidez e atividade distintas. Uma fonte de preços precisa de um método para escolher as observações e combiná-las.

Num exemplo simples, três observações aceites são **2 490, 2 500 e 2 510 dólares**. Um sistema que use o valor do meio, a **mediana**, comunicaria 2 500. Isto reduz a influência de uma observação anormalmente alta ou baixa face a aceitar uma fonte única. Não torna fiável qualquer grupo de fontes.

Redes de oráculos como a **Chainlink** podem combinar informação em várias etapas, incluindo fornecedores de dados e nós que comunicam observações. O método exato depende da fonte. Outros modelos usam preços já registados em mercados na blockchain, por vezes calculando uma média ao longo de um período.

O que importa é a independência e a qualidade dos dados. Dez participantes a copiar uma fonte pouco fiável não fornecem dez perspetivas independentes. Um preço de um mercado pequeno, fácil de manipular, também pode ser inadequado para avaliar um empréstimo muito maior.

## Publicar um preço utilizável

Numa configuração comum, os participantes enviam atualizações de preços para um contrato de oráculo. O sistema verifica se o relatório cumpre as regras de autorização e aceitação. Um contrato disponibiliza depois a resposta aceite a outros contratos.

Quando Bob pede emprestado, paga dívida ou enfrenta uma liquidação, o protocolo lê a fonte configurada e usa essa resposta para avaliar os ativos. O preço no ecrã de Bob não é necessariamente o que o contrato utiliza.

A Aave, por exemplo, usa infraestrutura de oráculos para obter valores dos ativos nos seus mercados. As fontes escolhidas e qualquer lógica adicional fazem parte da configuração. Nem todos os ativos têm de usar o mesmo tipo de preço ou taxa de conversão.

Outros modelos entregam um relatório assinado com a transação que dele precisa, em vez de dependerem apenas de uma resposta publicada anteriormente. Em ambos os casos, a aplicação precisa de saber que relatórios aceita e como os interpretar.

Uma assinatura válida identifica um participante autorizado a comunicar dados. Não prova, por si só, que o preço de mercado comunicado está correto.

## Um preço também tem uma data

Suponhamos que o último preço aceite de ETH foi 2 500 dólares, mas o mercado caiu bastante entretanto. Um relatório antigo corretamente assinado pode continuar a ser uma má base para um novo empréstimo.

Uma fonte precisa, por isso, de mais do que um número. Saber quando foi atualizada ajuda a aplicação a decidir se é suficientemente recente. Algumas fontes, incluindo muitas da Chainlink, atualizam quando o preço varia o suficiente ou decorre um intervalo configurado. Isso não significa que cada movimento do mercado apareça instantaneamente na blockchain.

A aplicação precisa de regras para relatórios ausentes ou demasiado antigos. Pode rejeitar uma operação ou suspender parte do serviço, em vez de continuar com um preço fora das condições aceites. Os limites adequados dependem do ativo e da aplicação.

Uma interrupção da rede também pode importar. Numa L2, uma falha do sequenciador pode impedir os utilizadores de agir enquanto os mercados noutros locais continuam a mudar. As aplicações podem verificar o estado da rede e permitir um período de recuperação antes de retomar operações sensíveis. Importam o preço e as condições em que os utilizadores lhe podem reagir.

## O efeito do preço no empréstimo de Bob

Voltemos aos **0,4 ETH** e à **dívida de 400 USDC**. Para o cálculo, assumimos que USDC vale um dólar e que a posição tem um **limiar de liquidação de 80%**. Este limiar ilustrativo determina quando a liquidação é permitida; não é o limite para contrair um novo empréstimo nem uma indicação dos parâmetros atuais da Aave.

A 2 500 dólares por ETH, a garantia vale 1 000 dólares. Oitenta por cento são 800 dólares, pelo que a dívida de 400 está abaixo do limiar.

Se o preço aceite cair para **1 200 dólares por ETH**, o contrato avalia a garantia em **480 dólares**. Oitenta por cento são **384 dólares**, menos do que a dívida de 400. Segundo a nossa regra, a posição pode agora ser liquidada.

O oráculo forneceu o preço. O contrato de empréstimo aplicou a regra. Um participante pode depois enviar uma transação de liquidação; a atualização do preço não significa que o próprio oráculo retire o ETH de Bob.

Um preço incorretamente baixo pode fazer uma posição bem respaldada parecer liquidável. Um preço demasiado alto pode permitir empréstimos excessivos ou atrasar liquidações enquanto as perdas aumentam. O protocolo também precisa de avaliar o ativo emprestado: assumir que cada USDC vale sempre um dólar pode estar errado durante uma perda de paridade.

A seleção de fontes, os momentos de atualização e a configuração afetam ativos reais. Mesmo um preço correto na moeda errada ou para outro token pode produzir um resultado incorreto se a aplicação o interpretar mal.

## Onde está a confiança

Um contrato pode aplicar exatamente as suas regras e ainda assim produzir resultados prejudiciais a partir de dados errados. Distribuir a execução por muitos computadores não elimina a necessidade de analisar a origem dos dados.

Várias fontes independentes, uma agregação robusta, verificações de atualidade e limites para valores invulgares podem reduzir riscos específicos. Nada transforma o oráculo numa garantia universal de verdade. Alguns sistemas também dão a administradores poder para substituir uma fonte ou suspender a sua utilização, acrescentando outra dependência.

O mesmo princípio vai além dos preços. Um programa de bilhetes pode usar um relatório sobre o cancelamento de um concerto para aplicar uma regra de reembolso. Continua a depender de quem está autorizado a comunicar o cancelamento e do que o contrato faz com o relatório.

O empréstimo de Bob torna a distinção concreta: a blockchain regista a garantia e a dívida, o oráculo fornece o dado de avaliação e o contrato decide o que isso significa para a posição. Compreender um oráculo é acompanhar esse percurso completo, em vez de tratar um número num contrato como um facto que a blockchain descobriu sozinha.
