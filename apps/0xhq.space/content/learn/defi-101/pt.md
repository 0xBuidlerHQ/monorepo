---
description: "Explora as finanças descentralizadas: trocas, pools de liquidez, staking, empréstimos, garantias e liquidação, com exemplos da Alice e do Bob."
sourceRevision: cc21c923a58498c316f53c9c7c18800e69d55e9523a7cb0084f28d34ac8c8637
title: "Compreender a [ DeFi ]"
draft: false
---

Alice vendeu o bilhete 42 a Bob por **0,6 ETH**. Em [Compreender o \[ Ethereum \]](/pt/learn/ethereum-101), o programa fez com que o pagamento e a transferência do bilhete acontecessem em conjunto.

Agora quer pôr esse dinheiro a render. Em vez de o aplicar todo num ativo ou serviço, decide dividi-lo: uma parte para staking através da Lido, outra para empréstimos através da Aave e outra para o token de um projeto de que gosta.

Estas escolhas levam-nos às **finanças descentralizadas**, ou **DeFi**: serviços financeiros construídos em torno de smart contracts. Vamos acompanhar o que Alice faz, o que pode gerar rendimento e o que pode correr mal. Os valores e as taxas de câmbio são ilustrativos.

## Três utilizações para o dinheiro recebido

Alice divide os **0,6 ETH em três parcelas de 0,2 ETH**. A primeira mantém a exposição a ETH através de staking; a segunda é trocada por uma stablecoin ligada ao dólar para emprestar; a terceira compra o token do projeto.

Cada serviço é regido por um **[protocolo](/pt/glossary#protocol)**: as regras e os contratos que o implementam. A aplicação ajuda a preparar os pedidos; os contratos registam a posição e determinam o que pode acontecer aos ativos.

Esta divisão distingue possíveis recompensas de staking, juros de empréstimos e alterações no preço do token. Vamos seguir cada parcela.

## Swaps e pools de liquidez

Para a parcela destinada a empréstimos, Alice troca primeiro **0,2 ETH por 500 USDC**. USDC é uma **[stablecoin](/pt/glossary#stablecoin)** concebida para acompanhar o dólar dos EUA. Trocar um ativo por outro é um **[swap](/pt/glossary#swap)**.

Os USDC têm de vir de algum lado. Numa troca baseada em pools, outros participantes depositam ativos num contrato que os disponibiliza para trocas. Esses depósitos formam uma **[pool de liquidez](/pt/glossary#liquidity-pool)**; os depositantes são **fornecedores de liquidez**. Aqui, tornam possível trocar ETH por USDC.

Quando o swap é concluído, a pool recebe o ativo de Alice e envia USDC para o seu endereço. Parte da comissão de negociação vai para os fornecedores, porque os seus ativos permitiram a troca. Serviços como a Uniswap usam pools desta forma.

Fornecer liquidez é, assim, outra forma de procurar rendimento: receber comissões das trocas que usam os ativos disponibilizados. Mas as trocas também alteram a composição da posição do fornecedor. As comissões podem não compensar as perdas face a manter os ativos originais. Alice usa a pool para trocar dinheiro; neste exemplo, não fornece liquidez.

## Fazer staking de ETH com a Lido

Alice aplica os primeiros **0,2 ETH** através da Lido. Para perceber o possível rendimento, precisamos de ver o que esses ETH ajudam a fazer.

Ethereum usa **[staking](/pt/glossary#staking)** para proteger a rede. Os validadores comprometem ETH e participam na proposta e verificação de blocos. A participação correta pode dar recompensas; falhas e certas infrações podem levar a penalizações. As recompensas remuneram a participação na segurança da rede, não são juros pagos por um mutuário.

A Lido reúne ETH de utilizadores e encaminha-os para validadores geridos por operadores participantes. Alice pode participar sem gerir um validador. Através deste serviço recebe **stETH**, um token que representa a sua parte dos ETH em staking e dos respetivos resultados. O saldo de stETH ajusta-se para refletir as recompensas ou penalizações atribuídas, depois da comissão do protocolo.

Como a posição é representada por um token transferível, chama-se **staking líquido**. Alice pode manter stETH, transferi-lo ou usá-lo em aplicações compatíveis enquanto o ETH subjacente participa em staking.

O token não torna o ETH imediatamente levantável. O processo de levantamento da Lido pode implicar espera. Vender stETH num mercado é outra via, ao preço que os compradores aceitarem pagar. Alice continua exposta ao preço de ETH e aos riscos dos validadores e dos smart contracts.

## Emprestar USDC através da Aave

Alice fornece os **500 USDC** do swap à **Aave**, um protocolo de empréstimos. O depósito é em USDC; a Aave disponibiliza esses ativos a mutuários e regista o direito de Alice sobre a pool.

Os mutuários pagam juros, dos quais uma parte chega a fornecedores como Alice. A taxa varia com a procura de empréstimos e os ativos disponíveis. O rendimento vem do crédito, ao contrário das recompensas de rede associadas ao stETH.

Suponhamos que Bob quer pedir **400 USDC** sem vender o ETH restante. Fornece **0,4 ETH**, avaliados em **1 000 dólares** no exemplo, como **[garantia](/pt/glossary#collateral)**. É semelhante a um crédito lombardo nas finanças tradicionais: pedir emprestado contra ativos, em vez de os vender. As regras do protocolo determinam se a garantia suporta o empréstimo pedido.

Bob recebe USDC da pool e fica a dever essa quantia mais juros. Se a garantia perder demasiado valor face à dívida, a posição pode ser **[liquidada](/pt/glossary#liquidation)**: outro participante paga dívida e recebe parte da garantia segundo as regras do protocolo. Isto protege a pool ao fazer cumprir o respaldo dos empréstimos, embora não elimine todas as perdas possíveis.

Alice não escolhe Bob pessoalmente nem negoceia a taxa com ele. Fornece ativos a um mercado partilhado. Pode pedir um levantamento, mas receber os ativos depende de haver liquidez disponível suficiente. A posição também depende dos contratos da Aave e de USDC manter o valor pretendido.

## Comprar o token de um projeto

Com os últimos **0,2 ETH**, Alice compra o token de um projeto que acompanha. O mesmo tipo de swap permite trocar ETH por esse token.

Suponhamos que o token permite votar em certas decisões ou aceder a um serviço. Esses usos podem interessar a Alice, mas não o tornam automaticamente uma ação de uma empresa nem um direito a receber lucros. Os direitos dependem das regras reais do projeto.

A expectativa principal é que o preço suba. Se o vender por mais do que pagou, realiza um ganho. Mantê-lo não gera automaticamente juros ou recompensas de staking, e o preço pode cair mesmo que o projeto continue a funcionar.

## Compreender o rendimento

Alice pode agora perguntar de onde vem cada possível ganho. Da atividade dos validadores de Ethereum no staking, dos mutuários nos empréstimos e da disposição de futuros compradores para pagar pelo token. Os fornecedores de liquidez recebem comissões de negociação.

Uma **[APR ou APY](/pt/glossary#apr-and-apy)** expressa uma taxa anual; a APY inclui o reinvestimento dos ganhos. Uma taxa variável não promete o mesmo rendimento durante um ano inteiro.

Há uma segunda pergunta: rendimento medido em quê? O saldo de stETH pode aumentar enquanto ETH desce em dólares. Os USDC podem render juros enquanto cada unidade é negociada abaixo do dólar pretendido. Mais unidades e mais valor total não são necessariamente o mesmo resultado.

## Diversificar sem perder o fio à meada

Alice transformou um pagamento em três posições: ETH em staking representado por stETH, uma posição de empréstimo em USDC e um token de projeto. Consegue identificar o que cada uma representa, o que pode gerar ganhos e como pode sair.

Dividir o dinheiro reduz a dependência de uma posição, mas não torna as posições independentes. Continuam a depender de Ethereum e de smart contracts, e os preços dos criptoativos podem cair em conjunto. A Lido e a Aave também têm regras e mecanismos de administração próprios; usar uma rede aberta não dispensa compreender os serviços que nela funcionam.

A DeFi permite combinar estes serviços com ativos e programas numa rede partilhada. O hábito útil é acompanhar o que o dinheiro está a fazer: proteger uma rede, financiar mutuários, disponibilizar trocas ou comprar um ativo na expectativa de valorização. Cada atividade tem a sua fonte de rendimento e a sua forma de perder dinheiro.

[Compreender as \[ Stablecoins \]](/pt/learn/stablecoins-101) analisa o que liga os 500 USDC de Alice aos 500 dólares que pretendem representar.
