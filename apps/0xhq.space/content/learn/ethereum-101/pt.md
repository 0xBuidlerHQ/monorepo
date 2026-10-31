---
description: "Descobre como o Ethereum executa contratos inteligentes, transfere ETH e tokens e cobra gas, acompanhando a venda de um bilhete de concerto."
sourceRevision: 5fb7f25acf045283bb1bc08825af5b626bda6ae8a85042cae09c8bb9b30748e5
title: "Compreender o [ Ethereum ]"
draft: false
---

Em [Compreender a \[ Blockchain \]](/pt/learn/blockchain-101), Alice queria oferecer o bilhete 42 a Bob. Agora imaginemos que prefere vendê-lo.

Enviar o bilhete e o dinheiro separadamente cria um problema. Se Alice transferir primeiro, Bob pode nunca pagar. Se Bob pagar primeiro, Alice pode ficar com o bilhete. Querem uma troca em que as duas coisas aconteçam em conjunto.

Vamos colocar o sistema de bilhetes em Ethereum e acompanhar a venda. O registo partilhado, as assinaturas e os blocos funcionam como vimos antes. As novas perguntas são o que Ethereum permite ao programa fazer, o que podem usar como dinheiro e porque é que usar a rede tem um custo.

## Ethereum e os programas partilhados

O organizador precisa de publicar o programa num local onde Alice, Bob e as suas aplicações possam usar as mesmas regras. Ethereum disponibiliza uma blockchain pública onde os programadores podem implementar smart contracts. Implementar significa publicar o código e os dados iniciais de um contrato através de uma transação. O contrato passa a ter um endereço com o qual as aplicações podem interagir.

O nosso contrato regista a propriedade. O organizador acrescenta uma função de venda: o proprietário define um preço e um comprador pode adquirir o bilhete por esse valor. São regras escritas pelo programador; Ethereum não inclui um serviço de bilhetes para concertos.

Ethereum define o ambiente que executa essas regras: a **Ethereum Virtual Machine**, ou **EVM**. Podemos vê-la como um conjunto comum de instruções para executar contratos, em vez de um computador gerido pelo organizador. Os nós que verificam a execução aplicam essas mesmas instruções para obter o mesmo resultado.

## Ether, a criptomoeda nativa

Alice e Bob precisam de um ativo que o programa possa transferir como pagamento.

Ethereum tem uma moeda integrada chamada **ether**, abreviada **ETH**. As próprias regras da rede registam saldos de ETH e permitem transferi-lo através de transações. ETH é, por isso, a **criptomoeda nativa** de Ethereum: pertence ao protocolo de base, em vez de ser criada pela aplicação de bilhetes.

Também se ouve «moeda nativa» ou «token nativo». Aqui, essas expressões referem-se a ETH. Ethereum é a rede; ether é a moeda. Ter ETH não significa ter ações de uma empresa chamada Ethereum.

Alice coloca o bilhete 42 à venda por **0,6 ETH**, um preço inventado para o exemplo. Bob precisa de ETH suficiente para a compra e para a taxa da rede, que vamos calcular adiante.

ETH pode servir de pagamento quando o vendedor o aceita, mas o poder de compra não é fixo. Os 0,6 ETH de Alice não garantem um valor específico em euros ou dólares. ETH também paga as taxas de transação de Ethereum, e os participantes comprometem ETH através de [staking](/pt/glossary#staking) para ajudar a proteger a rede.

## Os tokens e o bilhete

A rede regista ETH, mas não sabe o que significa um bilhete de concerto. Esse significado vem do contrato de bilhetes.

Um **[token](/pt/glossary#token)** é um ativo representado e gerido por regras numa blockchain. Num token emitido por um contrato, este regista saldos ou propriedade e define como podem mudar. Uma wallet mostra essa informação; não contém um objeto separado que seja fisicamente deslocado.

O bilhete 42 tem identidade própria. Pode representar um lugar específico; substituí-lo pelo bilhete 43 pode dar a Bob outro lugar. Um token cuja identidade individual importa é **não fungível**. Um **NFT** é um token não fungível. O sistema pode usar **ERC-721**, uma interface normalizada para consultar a propriedade e transferir tokens identificados individualmente.

O endereço do contrato e o identificador do bilhete identificam, em conjunto, o nosso bilhete. Outro contrato pode emitir um token número 42 sem criar o mesmo bilhete.

Os tokens usados como dinheiro funcionam de outra forma. Se Bob pagar 1 500 unidades do mesmo token de pagamento, Alice interessa-se normalmente pela quantidade, não pelas unidades específicas. São **fungíveis**: intercambiáveis dentro desse ativo. **ERC-20** dá-lhes uma interface comum para saldos e transferências. As normas permitem às wallets e aplicações suportar muitos ativos sem terem de aprender uma interface diferente para cada um.

O organizador pode aceitar uma **[stablecoin](/pt/glossary#stablecoin)**, um token concebido para acompanhar um valor de referência, como o dólar dos EUA. Alice pode então fixar o preço em 1 500 unidades.

Nesta venda, Alice escolhe ETH. **ETH é nativo de Ethereum; o bilhete e um token de pagamento ERC-20 são geridos por contratos executados em Ethereum.** Um token não precisa da sua própria blockchain.

## Trocar o bilhete e o pagamento em conjunto

Alice usa o contrato para colocar o bilhete 42 à venda por 0,6 ETH. Partimos do princípio de que este contrato específico inclui as regras de venda e permite a revenda.

A aplicação de Bob prepara uma transação de compra dirigida ao contrato. Pede para comprar o bilhete 42 e inclui 0,6 ETH como pagamento. O contrato verifica se Alice continua a ser proprietária, se a oferta está ativa e se Bob forneceu o valor necessário. Se as verificações passarem, o código transfere a propriedade para Bob e paga a Alice.

Estas operações fazem parte de uma única execução. Se um passo obrigatório falhar, as alterações à propriedade e ao pagamento são revertidas. Bob não acaba a pagar a Alice enquanto a mesma compra a deixa com o bilhete. Esta propriedade chama-se **atomicidade**: as alterações da troca produzem efeito em conjunto ou não produzem efeito.

Os contratos também podem chamar outros contratos, permitindo que um mercado combine o pagamento e a transferência de bilhetes. Esta composição permite criar serviços em torno de ativos existentes. O mercado precisa das autorizações necessárias; conhecer o endereço do token não lhe permite tirar o bilhete a Alice.

A atomicidade aplica-se à troca programada. A venda continua a precisar de código correto e de uma sala que aceite o bilhete, como explicado anteriormente.

## O gas como medida de execução

A compra obriga a rede a executar verificações e atualizar dados guardados. Uma compra mais complexa pode exigir mais trabalho. Ethereum precisa de medir esse trabalho e impedir que um pedido corra sem limite. Cobrar pela execução também torna dispendioso consumir a capacidade limitada da rede, incluindo para quem tenta inundá-la de pedidos.

O **[gas](/pt/glossary#gas)** é a unidade que contabiliza a execução. Operações diferentes têm custos de gas diferentes. A compra consome gas à medida que as instruções são executadas; o gas não é o preço do bilhete nem uma segunda moeda que Bob tenha de comprar.

A transação especifica um **limite de gas**, o número máximo de unidades que pode consumir. Se a execução precisar de mais, para e as alterações da compra são revertidas. A wallet estima um limite adequado antes do envio. O limite é um teto, não uma previsão de que todas as unidades serão usadas.

Consultar o proprietário atual através de uma aplicação normalmente não exige que Bob pague uma taxa de transação, porque não envia uma alteração para Ethereum. Comprar o bilhete exige.

## As taxas de gas e o preço do bilhete

O gas mede a execução; o **preço do gas** determina quanto ETH custa cada unidade. Para a transação de compra normal deste exemplo:

**Taxa de transação = gas utilizado × preço efetivo por unidade de gas.**

O preço é frequentemente expresso em **gwei**. Um gwei é um milésimo de milionésimo de ETH. Suponhamos que a compra usa **100 000 unidades de gas** a **20 gwei por unidade**:

**100 000 × 20 gwei = 2 000 000 gwei = 0,002 ETH.**

São valores ilustrativos, não uma cotação atual nem um custo fixo de compra de bilhetes. Bob gasta **0,6 ETH no bilhete e 0,002 ETH em taxas da rede**. Se tinha 1,1 ETH, fica com 0,498 ETH.

Na rede principal de Ethereum, a taxa é paga em ETH mesmo quando o ativo transferido é um token. Pagar um bilhete com uma stablecoin não elimina essa taxa. Um serviço pode cobri-la por Bob, mas alguém continua a pagar o custo de base.

O preço efetivo inclui uma **taxa base**, definida pelo protocolo e ajustada à procura, e uma **taxa de prioridade** para o validador que propõe o bloco. Um validador participa na proposta de blocos e no processo de acordo de Ethereum. A parcela da taxa base é destruída, ou **queimada**, em vez de ser paga ao validador. Bob pode definir tetos de taxas; se não cobrirem a taxa base exigida, a transação pode ficar à espera. São estas regras que a wallet usa para preparar a estimativa.

Duas coisas podem aumentar a taxa: um programa pode consumir mais gas, ou cada unidade pode ficar mais cara quando há mais procura de capacidade de execução. Um bilhete mais caro não exige automaticamente mais gas.

## A venda concluída

Alice regista primeiro a oferta através de uma transação. Bob revê depois a compra: o contrato certo, o bilhete 42, o preço de 0,6 ETH e a taxa estimada.

Quando a compra é bem-sucedida, Bob é proprietário do bilhete e Alice recebeu 0,6 ETH. Bob espera pela garantia de liquidação discutida no artigo sobre blockchain. A wallet pode mostrar o saldo de ETH e o bilhete, embora as regras nativas de Ethereum registem o primeiro e o contrato de bilhetes registe o segundo.

Usaram um programa para ligar o pagamento à propriedade. Ethereum fornece o ambiente de execução partilhado; os contratos definem os ativos e a venda; ETH permite o pagamento nativo e paga as taxas da rede; o gas mede a execução que essas taxas pagam.

O próximo artigo, [Compreender as \[ Wallets \]](/pt/learn/wallets-101), explica como Alice se liga a aplicações e o que autoriza através da wallet.
