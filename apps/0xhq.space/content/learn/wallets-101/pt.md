---
description: "Compreende as wallets, as contas, as chaves privadas, as assinaturas, as permissões e a recuperação, acompanhando a Alice enquanto usa o seu ETH."
sourceRevision: 4a993e40954aadd3133fb373b787443f0925a96faa33cb459aaf4347c7acc246
title: "Compreender as [ Wallets ]"
draft: false
---

Alice recebeu 0,6 ETH pela venda do bilhete 42. Em [Compreender o \[ Ethereum \]](/pt/learn/ethereum-101), acompanhámos o que fizeram a rede e o contrato. Agora abre uma aplicação para usar o dinheiro que recebeu.

O site pede-lhe para ligar uma wallet. Pouco depois, a wallet mostra um pedido de assinatura. A ligação dá ao site controlo sobre o seu dinheiro? Todas as assinaturas movimentam ativos? E se perder o telemóvel?

Estas perguntas dizem respeito à fronteira entre a conta de Alice, a sua wallet e as aplicações que pedem autorização para agir.

## A wallet e a conta

Os artigos anteriores estabeleceram que os ativos estão registados na blockchain e que as chaves autorizam ações. Uma **[wallet](/pt/glossary#wallet)** torna essa relação utilizável: mostra os ativos de uma conta, prepara pedidos e permite obter assinaturas autorizadas.

A conta de Alice é a identidade que a rede usa para registar o seu ETH. A wallet é a ferramenta com que lhe acede. Desinstalá-la não elimina a conta nem remove o saldo de Ethereum.

Isto também explica porque é que duas aplicações compatíveis podem mostrar a mesma conta. Leem o mesmo registo e usam a mesma autoridade para assinar, em vez de criarem duas cópias do dinheiro.

No resto do exemplo, Alice controla as próprias chaves. É a **autocustódia**. Dá-lhe autoridade para agir sem uma plataforma aprovar cada levantamento, mas também a torna responsável por proteger e recuperar esse controlo.

## Ligar a uma aplicação

Alice escolhe «Ligar wallet». A wallet pergunta que conta quer partilhar com o site. Uma ligação normal permite à aplicação conhecer esse endereço e pedir interações através da wallet.

A ligação, por si só, não autoriza uma transferência, não revela a chave privada nem concede permissão para gastar tokens. Um site pode ler os dados públicos de um endereço quando o conhece; desligar a wallet não torna esse registo público novamente privado.

Se a aplicação quiser depois que Alice assine uma mensagem, envie uma transação ou conceda outro acesso, isso é um pedido adicional. Algumas interfaces agrupam vários passos, pelo que o pedido na wallet importa mais do que o texto do botão do site.

## Assinar uma mensagem ou enviar uma transação

Uma aplicação pode pedir a Alice que assine uma mensagem para iniciar sessão. Uma mensagem de autenticação bem delimitada identifica o serviço e a finalidade, incluindo dados que limitam a reutilização, como um prazo e um valor de utilização única. A assinatura permite ao serviço verificar o controlo da conta.

Uma **transação**, por sua vez, pede à rede que processe uma operação. A oferta de venda do bilhete era uma dessas operações. A wallet prepara o destino, o ETH incluído e as instruções para o contrato, e pede autorização.

Esta distinção não torna todas as assinaturas de mensagens inofensivas. Algumas mensagens autorizam uma ordem ou uma permissão de despesa que outro participante pode apresentar mais tarde a um contrato. Alice pode estar a conceder autoridade sem a wallet estar, naquele momento, a enviar uma transação.

Precisa, por isso, de perceber a finalidade, o destinatário, o valor e o alcance do que assina. «Iniciar sessão», «autorizar despesas» e «transferir ativos» podem todos abrir um pedido na wallet, mas autorizar coisas muito diferentes.

## Autorizações para gastar tokens

Suponhamos que uma aplicação precisa de cobrar tokens da conta de Alice numa operação. Em vez de lhe dar a chave, Alice pode conceder a um contrato específico uma **[autorização](/pt/glossary#approval)** para gastar determinado token ERC-20 até certo valor.

Uma autorização de **100 unidades** permite a esse contrato transferir até essa quantidade segundo as regras do token. Numa autorização ERC-20 convencional, gastar 60 deixa 40. A autorização não deposita os tokens na aplicação; estabelece um acesso que pode ser usado mais tarde.

Algumas interfaces pedem uma autorização muito elevada para evitar novos pedidos em operações futuras. Isso também deixa o contrato com poderes mais amplos. Alice precisa de distinguir o valor que quer usar agora daquele que o contrato está autorizado a retirar.

O destinatário da autorização é um endereço de contrato, não apenas o nome de um site. Um contrato malicioso ou vulnerável com acesso a despesas pode pôr em risco os tokens autorizados. Alguns tokens permitem conceder estes poderes através de mensagens assinadas, pelo que também podem surgir num pedido de assinatura.

Desligar o site não cancela uma autorização na blockchain. Alice tem de a **revogar** ou reduzir através do mecanismo de permissões do token. As autorizações para bilhetes e outros NFT seguem regras próprias e podem abranger uma coleção inteira em vez de um saldo numérico.

## Frases de recuperação e dispositivos perdidos

Muitas wallets de autocustódia geram uma **[frase de recuperação](/pt/glossary#recovery-phrase)**, frequentemente de 12 ou 24 palavras, a partir da qual se podem reconstruir chaves e contas. É uma cópia de segurança do controlo sobre as contas, não uma lista de tokens guardados na aplicação.

Se Alice perder o telemóvel mas tiver os dados necessários, pode restaurar o acesso com uma wallet compatível. Restaurar as mesmas chaves não desativa o dispositivo perdido: se ainda conseguir assinar, conserva essa autoridade.

A palavra-passe da aplicação ou o PIN do dispositivo protege normalmente o acesso local, em vez de substituir os dados de recuperação noutro dispositivo. Quem tiver a frase e qualquer segredo adicional exigido pode recuperar o poder de assinar sem essa palavra-passe; alterá-la não invalida a frase.

Por isso, Alice guarda a recuperação separada do dispositivo que permite recuperar e não a introduz numa aplicação só para se ligar ou iniciar sessão. Um site que a receba pode obter controlo sobre as contas, não apenas autorização para uma operação.

Se o único acesso para assinar e a respetiva cópia de segurança se perderem, pode não haver maneira de recuperar a conta. Outras wallets usam mecanismos como vários signatários ou contactos de recuperação. Nem todas dependem de uma frase; as regras concretas de recuperação importam.

## Software, hardware e contas em plataformas

Uma **wallet de software** funciona num telemóvel ou computador. Com as chaves guardadas no dispositivo, pode preparar e assinar pedidos de forma prática, mas depende da segurança do equipamento e da aplicação.

Uma **wallet de hardware** separa a assinatura num dispositivo dedicado. Uma aplicação compatível prepara o pedido, enquanto o dispositivo guarda as chaves e assina após a confirmação de Alice. Em funcionamento normal, a aplicação recebe a assinatura, não a chave privada.

Isto reduz a exposição a um computador comprometido, mas não torna seguro qualquer pedido autorizado. O dispositivo pode assinar uma transferência prejudicial ou uma autorização de despesa perigosa. Alice tem de rever o que o equipamento consegue mostrar, e os dados de recuperação continuam a ser sensíveis.

Uma conta numa **plataforma com custódia** funciona de outra maneira. A plataforma controla as chaves dos ativos que guarda e regista o que deve a Alice. A palavra-passe permite pedir à plataforma que atue; não lhe dá necessariamente controlo direto de assinatura sobre uma conta Ethereum. A recuperação e os levantamentos dependem das regras e da disponibilidade do serviço.

## O que Alice autoriza

Alice consegue agora distinguir os passos de uma interação. Ligar a wallet partilha uma conta com o site. Uma assinatura de autenticação pode demonstrar o controlo dessa conta. Uma autorização de tokens dá acesso de despesa a um destinatário específico. Uma transação pede à rede que execute uma operação.

Essas autorizações podem durar mais do que a página que as pediu, enquanto o mecanismo de recuperação determina quem pode recuperar o controlo geral da conta. A wallet ajuda a analisar e autorizar pedidos; não garante que as promessas do site correspondam ao que os contratos vão fazer.

Com estas distinções, Alice pode explorar aplicações financeiras sem tratar todas as confirmações da wallet como a mesma ação. [Compreender a \[ DeFi \]](/pt/learn/defi-101) acompanha a divisão do dinheiro do bilhete entre staking, empréstimos e um token de projeto.
