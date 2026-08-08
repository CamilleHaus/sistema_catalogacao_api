# Checklist manual de segurança e permissionamento

Este checklist substitui testes unitários e e2e nesta fase inicial. Execute os
cenários em um banco local com dados descartáveis antes de publicar uma versão.

## Autenticação e sessões

- [ ] Login válido cria uma sessão e retorna access token sem expor hashes.
- [ ] Login inválido retorna a mesma mensagem para e-mail inexistente e senha incorreta.
- [ ] Após cinco tentativas de login em um minuto, a API retorna `429`.
- [ ] Refresh sem cookie, expirado ou revogado retorna `401` e remove o cookie.
- [ ] Refresh com `Origin` diferente da web retorna `403`.
- [ ] Reutilizar um refresh token rotacionado revoga a sessão correspondente.
- [ ] Logout revoga somente a sessão atual.
- [ ] Duas sessões do mesmo usuário permanecem independentes.
- [ ] Usuário inativo não autentica nem renova sessão.

## Troca e reset de senha

- [ ] Primeiro acesso permite apenas sessão, refresh, troca de senha e logout.
- [ ] Demais rotas retornam `PASSWORD_CHANGE_REQUIRED` antes da troca.
- [ ] Reset global define `deveAlterarSenha`, troca o hash e revoga todas as sessões.
- [ ] Senha e hashes nunca aparecem nas respostas da API.

## Isolamento por empresa

- [ ] Usuário da Empresa A não consulta projeto da Empresa B.
- [ ] Admin da Empresa A não consulta ou altera usuário da Empresa B.
- [ ] IDs de outra empresa retornam `404` sem revelar o recurso.
- [ ] Não é possível criar vínculo entre usuário e projeto de empresas diferentes.
- [ ] `ADMIN_GLOBAL` recebe `403` nas rotas internas de usuários e projetos.

## Papéis e status

- [ ] Admin da empresa não rebaixa a si mesmo.
- [ ] Promoção remove vínculos e revoga sessões.
- [ ] Rebaixamento exige projeto ativo e revoga sessões.
- [ ] Admin da empresa não ativa ou desativa outro admin.
- [ ] Somente o admin global altera o status de administradores empresariais.
- [ ] O admin global não pode ser criado pela API empresarial.

## Projetos e vínculos

- [ ] Usuário comum lista apenas projetos ativos vinculados.
- [ ] Projeto arquivado desaparece para usuário comum e permanece para o admin.
- [ ] Arquivamento preserva vínculos e não desativa usuários.
- [ ] Reativação exige revisão dos vínculos existentes.
- [ ] Remover o último vínculo exige confirmação explícita.
- [ ] A confirmação remove vínculos, desativa o usuário e revoga suas sessões.
- [ ] Nome repetido é recusado na mesma empresa e aceito em empresas diferentes.

## Produção

- [ ] `JWT_SECRET` foi substituído por segredo aleatório de ao menos 32 caracteres.
- [ ] `ADMIN_GLOBAL_PASSWORD` e `RESET_PASSWORD` vêm de secret manager.
- [ ] HTTPS está ativo e o cookie de refresh possui `Secure`.
- [ ] `WEB_ORIGIN` contém apenas a origem oficial da aplicação.
- [ ] O proxy reverso e a identificação do IP real foram configurados.
- [ ] Rate limit usa armazenamento compartilhado se houver múltiplas instâncias.
