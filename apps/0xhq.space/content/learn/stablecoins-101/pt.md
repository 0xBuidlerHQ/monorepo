---
sourceRevision: bec98a83b468fac8210476f13b9c9b777a44f986c09a84a43193f44c75dc059d
title: "Compreender as [ Stablecoins ]"
draft: false
---

Em [Compreender a \[ DeFi \]](/pt/learn/defi-101), Alice trocou parte do ETH da venda do bilhete por 500 USDC. Depois tratámos essas unidades como valendo 500 dólares. Voltemos a esses tokens antes de os fornecer ao protocolo de empréstimos.

A wallet confirma que tem 500 tokens. Mas o que os faz valer 500 dólares? Bastaria escrever «um dólar» num contrato para dar esse valor a qualquer token?

O saldo de um token e o seu preço são coisas diferentes. Para perceber o dinheiro de Alice, precisamos de acompanhar a ligação entre os tokens que tem e os dólares que pretendem acompanhar.

## Um valor de referência

Uma **[stablecoin](/pt/glossary#stablecoin)** é um token concebido para acompanhar um valor de referência. Numa stablecoin ligada ao dólar, o objetivo habitual é um dólar dos EUA por unidade. Outras acompanham moedas como o euro. O valor que o token procura manter chama-se **paridade**, ou **peg**.

Isto permite definir o preço de um bilhete, fazer um pagamento ou expressar uma dívida sem escolher uma moeda cujo preço oscile como ETH. Pretende-se que 500 unidades continuem próximas de 500 dólares.

O objetivo não fixa automaticamente o preço. Se Alice vender os tokens, recebe o que os compradores estiverem dispostos a pagar. Manter esse preço próximo do alvo exige um mecanismo que dê razões para trocar o token perto de um dólar.

«Estável» também é relativo à moeda de referência. Um token ligado ao dólar pode mudar de valor em euros quando as taxas de câmbio variam, e o poder de compra do dólar pode mudar ao longo do tempo.

## Reservas e resgate

Um modelo comum usa um emitente que guarda ativos fora da blockchain para respaldar os tokens que cria. São as suas **reservas**. Podem incluir depósitos bancários e dívida pública de curto prazo, em vez de apenas dinheiro numa conta.

Num exemplo simplificado, um cliente elegível envia 500 dólares ao emitente. Este acrescenta o valor às reservas e cria 500 tokens. Criar unidades chama-se **emissão**, ou **minting**. Os tokens podem depois circular entre wallets e aplicações sem uma nova transferência bancária sempre que mudam de mãos.

Quando um titular elegível devolve 500 tokens por 500 dólares, acontece um **resgate**. Os tokens são retirados de circulação, ou **queimados**, à medida que se efetua o pagamento. A emissão e o resgate ligam a quantidade de tokens aos ativos que os respaldam.

Alice adquiriu os tokens num swap, pelo que a compra não criou necessariamente novas unidades nem acrescentou dólares às reservas. Transferiu tokens existentes da pool para o seu endereço. Fornecê-los a um protocolo de empréstimos também disponibiliza tokens existentes aos mutuários; não cria outra reserva de dólares por trás deles.

O resgate direto depende das condições do emitente e da elegibilidade do titular. Alice pode, em alternativa, vender numa plataforma ou noutro serviço. Ter um token não lhe diz, por si só, que caminho para dólares está disponível.

## Como o preço se mantém perto de um dólar

Suponhamos que o token respaldado por reservas é negociado a **0,98 dólares**, mas participantes elegíveis ainda o podem resgatar por um dólar. Um deles pode comprar 500 unidades por 490 dólares e resgatá-las por 500. A diferença de dez dólares é um ganho potencial antes de custos.

Comprar tokens com desconto gera procura, enquanto o resgate retira unidades de circulação. Ambos podem ajudar a aproximar o preço de mercado de um dólar.

A oportunidade oposta surge se o token for negociado a **1,02 dólares**. Um participante capaz de criar 500 unidades por 500 dólares pode vendê-las por 510. Emitir e vender acrescenta oferta, ajudando a baixar o preço.

Negociar para aproveitar uma diferença destas chama-se **arbitragem**. Alice não precisa de a fazer para beneficiar do contributo de outros participantes para a paridade.

A condição importante é que a oportunidade possa realmente ser usada. Se o resgate estiver bloqueado, for demasiado lento ou deixar de inspirar confiança, um preço baixo pode não atrair compradores suficientes. A paridade depende do acesso funcional às reservas, não apenas de um objetivo anunciado pelo emitente.

## Formas diferentes de respaldar o mesmo objetivo

Nem todas as stablecoins ligadas ao dólar usam uma empresa com ativos em contas bancárias e de investimento.

Outro modelo permite bloquear criptoativos aceites em contratos e criar stablecoins contra essa garantia. Ao contrário do depósito de Alice na Aave, que empresta USDC existentes, esta operação emite unidades novas.

O sistema exige normalmente mais valor em garantia do que o valor das stablecoins emitidas, com dados de preços e regras de liquidação para ajudar a manter o respaldo. Pagar a dívida emitida retira as unidades correspondentes de circulação e liberta a garantia segundo as regras do protocolo.

Alguns modelos também usam stablecoins respaldadas por reservas como garantia, transportando para o novo token a dependência dos seus emitentes.

Outros, frequentemente chamados **stablecoins algorítmicas**, procuram sustentar o objetivo sobretudo ajustando a oferta ou permitindo a conversão noutro token, em vez de disporem de reservas independentes suficientes. Se esse outro token perder valor quando a confiança cai, o mecanismo pode enfraquecer precisamente quando os titulares tentam sair. Código que ajusta a oferta não cria ativos para pagar a todos.

Os sistemas reais podem combinar estas abordagens. Alguns exemplos mostram como objetivos semelhantes podem depender de respaldos diferentes:

- **USDC**, o token de Alice, é emitido pela **Circle** e procura valer um dólar. O respaldo inclui depósitos bancários e dívida pública dos EUA de curto prazo: segue o modelo de emitente e reservas descrito acima.
- **USDT**, emitido pela **Tether**, também procura valer um dólar. Usa reservas detidas pelo emitente, mas com outro emitente, outra composição e outras condições de resgate. USDT e USDC não representam o mesmo respaldo só por terem o mesmo alvo.
- **DAI e USDS** pertencem ao ecossistema **Sky**, anteriormente MakerDAO. Procuram acompanhar o dólar através de um protocolo respaldado por garantias; DAI pode ser convertido em USDS numa proporção de um para um. O respaldo não se limita a ETH e pode incluir outras stablecoins e exposição a ativos fora da blockchain.
- **USDe**, da **Ethena**, é um dólar sintético. Combina ativos de respaldo com posições financeiras concebidas para compensar variações de preços dos criptoativos. A estabilidade depende também dessas posições e das plataformas de negociação utilizadas, não apenas de uma reserva de dólares.
- **EURC**, também emitido pela **Circle**, procura valer **um euro** e usa reservas em euros. A principal diferença face a USDC é a moeda de referência: um EURC não pretende equivaler a um dólar.

## Quando a paridade se perde

Imaginemos que os titulares duvidam de que as reservas sejam suficientes ou de que os resgates sejam processados. Mais pessoas tentam vender e menos querem comprar perto de um dólar. O preço pode cair abaixo do objetivo. Um desvio significativo chama-se **perda de paridade**, ou **depeg**.

Se Alice continuar com 500 unidades e o preço cair para **0,90 dólares**, passam a valer cerca de **450 dólares** a esse preço. A blockchain pode continuar a registar exatamente 500 unidades. Não falhou a contagem; mudou o valor de troca.

A perda de paridade pode ser temporária, por exemplo quando o acesso bancário ou ao resgate é interrompido, ou refletir uma insuficiência duradoura do respaldo. A recuperação não é automática. Mesmo ativos suficientes no papel podem ser difíceis de converter rapidamente em pagamentos numa corrida aos resgates.

A mesma distinção importa para o empréstimo de Bob. Dever 400 unidades significa dever essas unidades segundo as regras do protocolo, não automaticamente um valor permanentemente fixo de 400 dólares. Uma perda de paridade altera o seu valor de mercado e pode afetar mutuários e fornecedores.

## O que Alice tem realmente

Os 500 tokens dão-lhe um ativo transferível que procura acompanhar o dólar. Não são simplesmente 500 dólares deslocados de uma conta bancária para uma wallet.

Num token respaldado por reservas, a confiança depende dos ativos do emitente e das vias através das quais os titulares podem obter dólares. Os relatórios de reservas ajudam a descrever o respaldo, mas o saldo na blockchain não prova, por si só, que esses ativos existem ou estão acessíveis. Alguns emitentes também podem congelar transferências de certos endereços através de poderes administrativos no contrato do token.

O valor de referência, o respaldo e o preço de mercado são três peças diferentes que têm de continuar a funcionar em conjunto.

Era isso que estava escondido na expressão «500 unidades de stablecoin». A blockchain regista quantas Alice tem. O desenho da stablecoin dá razões para valorizar cada unidade perto de um dólar. A força dessa ligação determina até que ponto podem servir como 500 dólares no próximo pagamento, troca ou empréstimo.

[Compreender as \[ Camadas 2 \]](/pt/learn/layer-2-101) acompanha os USDC de Alice entre redes para explicar rollups e pontes.
