---
sourceRevision: 2074bf1539a1ccce992f345ac59af5d409306f0d3c45567bedcd4069f59c570e
title: "Compreender as [ Camadas 2 ]"
draft: false
---

Alice compreende o respaldo dos 500 USDC de [Compreender as \[ Stablecoins \]](/pt/learn/stablecoins-101). Levanta 200 da posição de empréstimo para usar noutra aplicação.

A aplicação oferece várias redes: Ethereum, Arbitrum One, Base e OP Mainnet. Algumas mostram taxas inferiores. Alice liga a wallet habitual, escolhe Arbitrum One e não vê USDC.

O dinheiro não desapareceu. Está a olhar para outra rede. Para perceber onde estão os ativos e como os usar lá, precisamos de conhecer as **redes de camada 2** de Ethereum, normalmente chamadas **L2**.

## Porquê usar outra rede

A rede principal de Ethereum é a sua **camada 1**, ou **L1**. Tem capacidade limitada para executar transações e registar os seus dados. Quando muitas pessoas querem usá-la, competem por essa capacidade através das taxas.

Uma camada 2 trata da execução numa rede separada, usando Ethereum para ajudar a estabelecer e fazer cumprir os resultados aceites. A ideia é processar mais atividade sem exigir que a rede principal execute cada ação individualmente.

**Arbitrum One, Base e OP Mainnet** são exemplos de L2 de Ethereum. São redes distintas com atividade e aplicações próprias, não três nomes para o mesmo saldo de Ethereum.

Transferir trabalho para outra rede seria fácil se os utilizadores confiassem simplesmente no operador. A pergunta importante é como pode Ethereum ajudar a proteger o resultado. Uma resposta comum é o **rollup**.

## Os rollups e a ligação a Ethereum

Um rollup executa transações na sua rede e publica em Ethereum dados sobre lotes de atividade e compromissos relativos ao **estado** resultante: os saldos e dados dos contratos após essas transações. Um compromisso é uma referência compacta ao estado, como um hash.

Um **sequenciador** recebe e ordena normalmente os pedidos e dá aos utilizadores uma visão rápida do resultado. Outros nós podem verificar a execução. Os contratos em Ethereum e o mecanismo de verificação do rollup determinam que resultados podem ser aceites para liquidação.

Muitas ações partilham o custo de publicar um lote em Ethereum. Combinado com outro ambiente de execução e dados comprimidos, isto ajuda a tornar as transações L2 mais baratas. As taxas continuam a depender da rede e da procura; não são fixas nem sempre inferiores.

Duas abordagens principais tratam da validade dos resultados. Os **rollups otimistas** permitem contestar resultados propostos durante um período definido. Uma contestação bem-sucedida impede a aceitação de um resultado inválido. Dependem de o sistema de contestação funcionar e de os participantes o poderem usar.

Os **rollups de validade**, frequentemente chamados **ZK-rollups**, apresentam provas criptográficas de que a alteração de estado cumpre as regras. Ethereum verifica a prova em vez de voltar a executar cada ação. A segurança continua a depender de sistemas de prova e contratos corretos e do acesso aos dados necessários.

Estes mecanismos explicam o que uma L2 acrescenta a uma blockchain independente barata: uma ligação entre a execução e as regras de liquidação de Ethereum. A proteção efetiva depende de como o sistema é construído e operado.

## Uma wallet com saldos separados

Alice pode usar o mesmo endereço em Ethereum e Arbitrum One. Isso não cria um único saldo partilhado entre redes.

Os seus 200 USDC estão registados pelo contrato USDC em Ethereum. Selecionar Arbitrum One pede à wallet que leia os registos dessa rede, onde Alice pode ainda não ter USDC. Voltar a Ethereum mostra o saldo original.

Uma aplicação também pode ter implementações diferentes em redes diferentes. Uma pool de empréstimos em Ethereum e outra em Arbitrum One não partilham automaticamente depósitos, liquidez ou taxas só por terem o mesmo nome.

Identificar um ativo exige agora **a rede e o contrato do token**. Um símbolo familiar não chega. Para disponibilizar ativos noutra rede, Alice precisa de um processo de transferência entre ambas.

## Pontes e transferências entre redes

Uma **ponte** coordena a transferência de um ativo ou de uma mensagem entre redes. Não retira fisicamente um token da base de dados de uma blockchain para o colocar noutra.

Num modelo comum, um contrato bloqueia tokens na rede de origem. Depois de o destino aceitar uma prova desse depósito, emite aí uma representação correspondente. O regresso pela mesma ponte inverte o processo: a representação é destruída e os ativos bloqueados podem ser libertados segundo as regras da ponte.

Outra abordagem passa pelo emitente do ativo. Para USDC, o **Cross-Chain Transfer Protocol** da Circle, ou **CCTP**, queima unidades na origem e emite USDC nativo num destino suportado depois de a Circle atestar a queima. Evita criar um token que represente USDC bloqueado numa ponte tradicional, mas mantém a dependência da infraestrutura e autorização da Circle.

Alice escolhe uma rota suportada para o USDC nativo que a aplicação de destino aceita. Concluído o processo, o valor fica disponível em Arbitrum One, não pode ser gasto simultaneamente nas duas redes.

A rota importa. A ponte do rollup, uma ponte de terceiros e o protocolo de um emitente podem ter verificações, prazos e poderes administrativos diferentes. Escolher a rede de destino não determina, por si só, a segurança da transferência.

## Tokens nativos e versões de pontes

Em Arbitrum One, **USDC nativo** e **USDC.e** mostram porque importa o ativo exato. O USDC nativo é emitido diretamente pela Circle nessa rede. USDC.e é uma representação de USDC vindo de Ethereum, respaldada através da ponte correspondente.

Procuram o mesmo valor em dólares, mas têm contratos e dependências diferentes. Um serviço pode aceitar um e não o outro. Os preços e a liquidez para os trocar também podem diferir.

Aqui, «USDC nativo» significa emitido diretamente pela Circle nessa rede. Não significa que USDC seja a moeda nativa da rede no sentido em que ETH é a moeda nativa de Ethereum.

Alice verifica, por isso, que versão a aplicação usa. Se receber uma versão de ponte quando a aplicação espera USDC nativo, mudar o nome apresentado não os torna intercambiáveis; precisa de uma conversão suportada ou de outra rota.

Tem de perceber tanto o respaldo do valor em dólares como a ligação desse token específico a esse respaldo.

## Confirmações rápidas e liquidação final

Depois de receber o USDC adequado, Alice pode usar a aplicação em Arbitrum One. O sequenciador pode mostrar rapidamente o resultado, enquanto a publicação e a liquidação em Ethereum acontecem mais tarde.

Ver esse resultado rápido não é o mesmo que concluir um levantamento para Ethereum. Um levantamento normal pela ponte de um rollup otimista pode implicar esperar vários dias pelo processo de contestação. Um serviço mais rápido pode adiantar ativos no destino, introduzindo as suas próprias dependências de liquidez e confiança. Uma transferência pelo emitente pode seguir outro processo.

As L2 também diferem em quem opera o sequenciador, quem pode atualizar os contratos e o que os utilizadores podem fazer se o operador deixar de responder. Apoiar-se em Ethereum não elimina esses detalhes. Uma rede também pode ser compatível com aplicações Ethereum sem ser um rollup de Ethereum.

O endereço de Alice ficou igual, mas a transferência mudou onde os seus 200 USDC estão registados. A ponte ou o processo do emitente liga os registos dos ativos; a verificação do rollup liga a execução a Ethereum.

Taxas mais baixas tornam mais atividade viável, mas são apenas uma parte do sistema. Importa onde os ativos estão registados, que versão Alice tem e que regras permitem usá-los ou sair da rede.

[Compreender os \[ Oráculos \]](/pt/learn/oracles-101) regressa ao empréstimo de Bob para explicar como os contratos obtêm preços e outras informações externas.
