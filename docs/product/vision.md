# Visão de produto — App de cuidados digitais

Lista completa de funcionalidades organizada por área e por perfil de usuário.

Este documento é a visão de produto completa — cobre mobile e backoffice.
Cada item aqui vira sua própria spec/plano quando entra em construção (ver
"Sugestão de ordem de construção" no final); não assuma que algo listado
aqui já está implementado sem checar o código.

---

## 1. Contas e perfis

### Comum a todos os perfis
- Cadastro por e-mail/telefone + login social — **um único login dá acesso à
  conta inteira**, não a um perfil específico (ver "Múltiplos perfis" abaixo)
- Após o cadastro, o usuário vai direto para a Home — a escolha/ativação de
  um perfil (Cuidador, por exemplo) é um fluxo separado, iniciado a partir
  da Home quando o usuário decidir, não uma etapa obrigatória do onboarding
- A Home se adapta ao perfil ativo no momento: quem está com o perfil
  Cuidador ativo vê o painel de atendimento; Responsável e Pessoa cuidada
  veem remédios, sinais vitais e agenda
- Edição de dados pessoais, foto de perfil
- Recuperação de senha, verificação de telefone (SMS/OTP)
- Exclusão de conta e portabilidade de dados (exigência LGPD)
- Múltiplos perfis na mesma conta (ex: sou Responsável e também Cuidador) —
  cada perfil é ativado por um fluxo próprio (ex: a verificação de
  identidade para virar Cuidador), não escolhido de uma vez no cadastro

### Cuidador
- Cadastro profissional: experiência, especialidades (idoso, pós-cirúrgico, criança especial, etc.), cursos/certificações
- Upload de documento + selfie para verificação de identidade
- Consulta de antecedentes criminais via API (ex: certidão negativa)
- Definição de região/raio de atendimento
- Definição de disponibilidade (dias/horários)
- Definição de valor por hora/diária/mensal (apenas informativo — o pagamento em si acontece fora do app)
- Upload de certificados adicionais (curso de cuidador, técnico de enfermagem, primeiros socorros)
- Selo de "verificado" visível no perfil público
- Selo de destaque por avaliação alta / tempo de plataforma

### Pessoa cuidada
- Cadastro com dados de saúde básicos (condições, restrições, alergias)
- Pode ter conta própria (login independente) ou ser cadastrada só pelo Responsável
- Aceite/recusa de vínculo quando cadastrada por um Responsável (consentimento)
- Endereço e região onde mora
- Contato de emergência

### Responsável
- Cadastro de uma ou mais pessoas cuidadas vinculadas
- Definição de nível de permissão por pessoa vinculada (ver tudo / só resumo / só emergências)
- Convite de outro responsável para a mesma pessoa cuidada (ex: irmãos dividindo o cuidado)

---

## 2. Busca e descoberta

A busca acontece em uma única direção: quem procura cuidado (Responsável ou Pessoa cuidada) pesquisa e escolhe o Cuidador. O Cuidador não pesquisa por pessoas cuidadas — ele constrói seu perfil público e é encontrado pelas famílias.

- Busca de cuidador por região, especialidade, disponibilidade, preço
- Mapa com geolocalização mostrando cuidadores próximos
- Filtros avançados (idioma, gênero, experiência com condição específica)
- Perfil público do cuidador com fotos, avaliações, comentários, região de atendimento
- Favoritar/salvar perfis de cuidadores

---

## 3. Confiança, avaliações e segurança

- Avaliação com nota e comentário após cada atendimento
- Avaliação em via dupla: cuidador avalia a família/paciente também
- Denúncia de perfil/comportamento inadequado
- Moderação de conteúdo (comentários, fotos)
- Verificação de identidade obrigatória para cuidadores antes de aparecer nas buscas
- Contrato digital simples gerado na plataforma (termos do atendimento)
- Seguro/cobertura em caso de acidente durante o atendimento

---

## 4. Comunicação

- Chat individual entre cuidador e paciente/responsável
- Notificação de nova mensagem
- Envio de foto/documento no chat (ex: foto da receita)
- Botão de emergência/SOS que notifica o responsável
- Ligação de emergência integrada (192/SAMU)
- Videochamada rápida
- Chat em grupo (cuidador + múltiplos responsáveis da mesma pessoa)

---

## 5. Saúde — remédios

- Cadastro de remédio: nome, dosagem, via, horário, estoque
- Foto da caixa/receita anexada ao remédio
- Lembrete push no horário certo
- Confirmação de "remédio administrado" com registro de quem confirmou
- Alerta de estoque baixo
- Histórico/relatório de adesão (visível para o responsável)
- Alerta de possível interação medicamentosa
- Integração com farmácia para reposição automática

---

## 6. Saúde — agenda e cuidados

- Agenda de compromissos (consultas, exames)
- Tarefas recorrentes (banho, fisioterapia, alimentação, troca de curativo)
- Marcação de tarefa concluída, com anotação do cuidador
- Sincronização com calendário externo (Google Calendar)
- Registro de sinais vitais (pressão, glicemia, peso)
- Relatório de saúde consolidado (PDF) para levar ao médico
- Check-in/check-out do cuidador na casa do paciente (georreferenciado)

---

## 7. Contratação (pagamento fora do app)

O pagamento não é processado dentro da plataforma — é combinado e realizado diretamente entre cuidador e família.

- Registro de horas/diárias trabalhadas, para controle e conferência
- Emissão de recibo simples dentro do app (documento gerado, sem processar pagamento)
- Planos de assinatura do próprio app para a família (acesso a relatórios, múltiplos cuidadores vinculados)

---

## 8. Administração (backoffice)

- Painel para moderar denúncias e perfis
- Aprovação manual de verificação de identidade
- Métricas de uso (cuidadores ativos, contratações, avaliação média)
- Suporte via chat/ticket dentro do app

---

## 9. Configurações e privacidade

- Consentimento explícito para uso de dados de saúde (LGPD)
- Controle de quem vê quais dados (granularidade por campo)
- Notificações configuráveis (o que recebe e quando)
- Exportação de dados do paciente

---

## Sugestão de ordem de construção

1. Cadastro dos 3 perfis + verificação básica de identidade do cuidador
2. Busca por região + perfil público com avaliações
3. Chat
4. Cadastro de remédio + lembrete + confirmação
5. Agenda simples
6. Mapa com geolocalização
7. Avaliação dupla pós-atendimento
