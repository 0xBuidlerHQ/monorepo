---
sourceRevision: 19c60042c624acbb06c9fe0e770f9bdaba82ce2d3f7ccc38165b24c5ccc89449
title: "Compreender a [ Blockchain ]"
draft: false
---

Alice tem o bilhete 42 para um concerto. Como não pode ir, quer oferecê-lo a Bob. Se lhe enviar uma fotografia, continua a ter a imagem original. Pode até enviar outra cópia a Charlie.

Quem deve a sala deixar entrar?

A imagem não resolve a questão. Um ficheiro digital pode ser copiado sem deixar de estar na posse de quem o tinha. Para transferir um bilhete, precisamos de um registo de propriedade e de uma forma de acordar as suas alterações.

Vamos acompanhar este bilhete para perceber como uma blockchain pode fornecer esse registo.

## Um registo de propriedade partilhado

Uma empresa de bilhetes pode manter uma base de dados onde consta que «o bilhete 42 pertence a Alice». Quando ela o oferece a Bob, a empresa atualiza o registo. Alice pode conservar uma imagem, mas a empresa passa a reconhecer Bob como proprietário.

Este sistema pode funcionar bem. Também dá a uma organização autoridade sobre o registo. Os clientes e as outras aplicações dependem dela para comunicar corretamente a propriedade e aceitar transferências legítimas.

Suponhamos que várias aplicações independentes querem usar o mesmo registo sem dar a nenhuma controlo exclusivo. Cada uma pode guardar uma cópia, mas as cópias não determinam que alterações aceitar. Uma aplicação pode registar uma transferência para Bob e outra uma transferência para Charlie.

Os participantes precisam de regras comuns para verificar pedidos e acordar um histórico. Uma **[blockchain](/pt/glossary#blockchain)** combina um registo partilhado com regras para o manter numa rede de computadores. O nosso exemplo usa uma blockchain que permite executar programas; as funcionalidades e as regras de participação variam entre redes.

## Transações e assinaturas digitais

O registo identifica a **[conta](/pt/glossary#account)** de Alice como proprietária do bilhete. As contas usam identificadores chamados **[endereços](/pt/glossary#address)**. Bob partilha o seu endereço para que Alice indique o destinatário. Os nomes tornam o exemplo mais legível; um endereço não revela, por si só, a identidade de alguém.

Alice pede: «Transfere o bilhete 42 para o endereço de Bob». Esta instrução é uma **[transação](/pt/glossary#transaction)**. Enviá-la pede à rede que processe uma alteração. Não torna Bob imediatamente proprietário.

Qualquer pessoa pode escrever essa instrução. Para demonstrar a autorização, a conta de Alice usa duas chaves relacionadas matematicamente. A **[chave privada](/pt/glossary#private-key)** é secreta e cria assinaturas. A **[chave pública](/pt/glossary#public-key)** correspondente permite verificá-las.

A **[wallet](/pt/glossary#wallet)** ajuda-a a rever o pedido e a usar a chave para criar uma **[assinatura digital](/pt/glossary#digital-signature)** sobre os seus detalhes. A rede verifica a assinatura e se a chave está autorizada para a conta. A chave privada não precisa de acompanhar a transação.

A assinatura está ligada ao que foi assinado. Substituir o endereço de Bob pelo de Charlie altera o pedido, pelo que a assinatura deixa de ser válida. Conhecer a chave pública de Alice não torna viável assinar novos pedidos em seu nome.

A wallet dá acesso ao bilhete; a propriedade está registada no sistema partilhado. Se alguém roubar a chave privada de Alice, pode assinar como a sua conta. A rede verifica a autorização através da chave, não se a pessoa que a usa é realmente Alice.

## Smart contracts e nós

Um pedido corretamente assinado também tem de respeitar as regras do bilhete. Alice tem de ser a proprietária do bilhete 42 quando a transferência for processada. Assinar um pedido não lhe dá autorização para transferir o bilhete de outra pessoa.

Algumas blockchains permitem aos programadores escrever programas que definem as regras de uma aplicação. Um programa destes chama-se **[smart contract](/pt/glossary#smart-contract)**. O código e os dados guardados fazem parte do sistema partilhado. O nosso programa verifica o proprietário atual antes de registar o destinatário como novo proprietário.

Os computadores que participam na rede chamam-se **[nós](/pt/glossary#node)**. Os que verificam integralmente as regras conferem as alterações propostas, incluindo a autorização e a execução do programa. Com o mesmo registo inicial e os mesmos pedidos ordenados, devem obter o mesmo resultado. Rejeitam uma atualização que ignore uma verificação obrigatória ou invente uma transferência não autorizada.

A verificação independente contribui para a **[descentralização](/pt/glossary#decentralization)**: distribuir responsabilidade e controlo pelos participantes. A independência real desses participantes importa. Muitos computadores geridos por uma única organização podem continuar a dar-lhe um controlo considerável.

## Blocos e hashes

Os participantes precisam de propor uma sequência precisa de acontecimentos. Agrupam as transações em lotes ordenados chamados **[blocos](/pt/glossary#block)**. Cada bloco proposto identifica o bloco anterior sobre o qual assenta. As suas transações são processadas a partir do registo produzido por esse histórico.

A transferência de Alice pode aparecer num desses blocos. Se for bem-sucedida, o registo atual mostra Bob como proprietário. O histórico continua a mostrar como o bilhete chegou até ele; alterar o proprietário atual não apaga as transferências anteriores.

Para ligar os blocos, o sistema usa um **[hash](/pt/glossary#hash)**: uma impressão digital calculada a partir de dados. Dados iguais produzem o mesmo hash. Alterá-los muda quase certamente essa impressão. Um hash criptográfico adequado torna impraticável encontrar deliberadamente dados diferentes com a mesma impressão.

A impressão de um bloco depende do conteúdo, incluindo a referência ao bloco anterior. Alterar uma transação antiga muda as impressões que a ligam ao histórico seguinte. As referências originais deixam de coincidir, tornando a alteração detetável.

Alguém pode recalcular as impressões afetadas para criar outro histórico internamente coerente. Os hashes mostram que é diferente do original, mas não decidem qual deve ser aceite por todos. A rede precisa de outro mecanismo para essa decisão.

## Consenso e finalidade

Suponhamos que Alice assina um pedido para dar o bilhete 42 a Bob e outro para o dar a Charlie. Ambas as assinaturas são genuínas. Qualquer pedido pode ser bem-sucedido se for considerado primeiro, enquanto Alice ainda tem o bilhete.

Depois de uma transferência ser concluída, Alice deixa de ser proprietária. O outro pedido já não pode transferir o bilhete. As regras impedem que ambas as transferências sejam bem-sucedidas no mesmo histórico, mas não dizem aos diferentes computadores qual vem primeiro.

Porquê não usar a hora de chegada? As mensagens demoram a circular. Um nó pode receber primeiro a transferência para Bob e outro a transferência para Charlie. Ambos podem cumprir a regra de propriedade e chegar a conclusões diferentes.

A rede precisa, por isso, de regras para escolher entre propostas concorrentes e estabelecer um histórico comum. É o **[consenso](/pt/glossary#consensus)**. Os participantes podem propor blocos diferentes a partir do mesmo histórico anterior; o consenso determina que ramo válido continuar.

A verificação e o consenso respondem a perguntas diferentes. A verificação confirma que o histórico cumpre as regras. O consenso estabelece qual dos históricos válidos é aceite pelos participantes. Escolher um bloco não torna uma assinatura falsificada válida para os nós que a verificam.

As redes usam métodos diferentes para selecionar os produtores de blocos e resistir à manipulação. Algumas associam a participação a trabalho computacional ou a ativos comprometidos; outras limitam-na a participantes aprovados. A segurança depende dessas regras e da distribuição do controlo. O acordo não está garantido perante qualquer ataque ou falha de rede.

Bob também precisa de distinguir entre ver uma transferência recente e considerá-la definitiva. Um bloco recente pode ser substituído se a rede escolher outro ramo. A **[finalidade](/pt/glossary#finality)** descreve a garantia de que uma atualização ficou assente; as condições e a força dessa garantia dependem da rede. A aplicação de Bob pode mostrar o progresso até lá.

## O percurso de uma transação

Suponhamos que o programa permite a transferência. A rede do exemplo cobra taxas de transação, que pagam o processamento e tornam dispendioso inundá-la de pedidos.

1. **Preparar.** Alice seleciona o bilhete 42 e o endereço de Bob. A aplicação constrói uma transação que pede ao programa para o transferir.
2. **Assinar.** A wallet mostra o pedido e permite assiná-lo com a sua chave. A propriedade ainda não mudou.
3. **Enviar.** A transação assinada chega a um nó e pode propagar-se pela rede. O envio não garante a inclusão.
4. **Processar e verificar.** Um participante inclui-a num bloco proposto. Os nós verificadores conferem o bloco e a execução. Se Alice ainda for proprietária e a transferência for bem-sucedida, o registo resultante identifica Bob como proprietário.
5. **Estabelecer o resultado.** O consenso determina se o bloco pertence ao histórico aceite. Bob espera pela garantia de liquidação disponibilizada pela rede.

A aplicação de Bob pode agora mostrar o proprietário registado e se a transferência atingiu essa garantia.

## Aplicações, confiança e limites

As aplicações podem ler o mesmo registo e interagir com o mesmo programa de bilhetes. Podem ter interfaces diferentes sem criar bilhetes diferentes. As regras partilhadas continuam a aplicar-se independentemente da aplicação que prepara o pedido.

Isto torna o registo útil para lá de um único site. Mas uma interface pode mostrar informação desatualizada ou representar mal o que uma assinatura autoriza. Uma rede partilhada não torna todas as aplicações fiáveis.

O bilhete também ilustra uma fronteira. O registo pode estabelecer a propriedade segundo as suas regras, mas não pode provar que o concerto existe nem obrigar a sala a deixar Bob entrar. O organizador tem de reconhecer o que o registo digital representa.

Existem outros limites. Registos públicos podem expor atividade ligada a um endereço. Os programas podem conter erros ou dar poderes especiais aos administradores. Uma assinatura genuína pode autorizar um engano, como enviar o bilhete para o endereço errado. Distribuir a verificação também consome recursos de processamento, armazenamento e comunicação.

Uma blockchain é uma forma de organizar um registo partilhado, não uma exigência para qualquer sistema de bilhetes. Se todos aceitarem a autoridade de uma organização, uma base de dados convencional pode ser mais simples. A vantagem aqui é permitir a participantes independentes manter e verificar um histórico comum sem dar a uma aplicação autoridade exclusiva.

## A blockchain como um todo

Copiar a imagem de Alice nunca permitiria estabelecer quem devia ter o bilhete depois. O registo partilhado dá essa resposta através de várias peças: as assinaturas estabelecem a autorização, o programa define as transferências permitidas, os nós verificam o processamento e os blocos ligados organizam o histórico. O consenso e as regras de liquidação determinam em que histórico Bob pode confiar.

Bob pode agora consultar um registo de propriedade acordado, em vez de depender apenas da palavra de Alice ou de uma imagem.

O próximo artigo, [Compreender o \[ Ethereum \]](/pt/learn/ethereum-101), explora como uma rede concreta põe estas ideias em prática.
