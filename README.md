# Lab Inc. :hospital:

O Lab Inc. é uma aplicação construída com a versão 17.3.1 do Angular e tem como objetivo o gerenciamento hospitalar de pacientes, exames e consultas.

Com ele é possível registrar todas as informações do paciente de forma rápida e segura. 
Projetado para disponibilizar todas as informações de forma simples, vinculando o paciente às suas consultas e exames e tornando possível a edição de todas as informações, conforme necessidade do usuário.

## Recursos :clipboard:

**Tela de login e cadastro**: Permite o cadastro rápido de usuários e a autenticação no sistema. Os recursos a seguir só podem ser visualizados após a autenticação.

**Tela inicial (dashboard)**:
 Disponibilidade de acesso: perfil Médico(a) e Admin. Pacientes são direcionados para a tela de prontuário.
 Permite visualizar estatísticas de quantidade de pacientes, consultas e exames (Administradores também visualizam estatística de usuários). 
 Traz uma busca rápida de pacientes, onde é possível filtrar por nome, e-mail ou telefone.

 **Tela de prontuário**: 
 Disponibilidade de acesso: Médicos(as) e Administradores podem visualizar o prontuário de qualquer paciente. Pacientes visualizam somente o próprio prontuário e não conseguem editar ou excluir dados.
 Através da busca por pacientes na tela inicial, acesse o prontuário completo do paciente. Aqui é possível ver todos os dados do paciente, além de todas as consultas e exames cadastrados para ele.

**Cadastros**: 
Disponibilidade de acesso: perfil Médico(a) e Admin.
Há 3 formulários de cadastro no sistema. Um para cadastro de paciente, um para cadastro de consultas e outro para cadastro de exames. O cadastro de consultas e exames exige que seja selecionado um paciente da lista de pacientes cadastrados. Basta filtrar o paciente pelo nome e selecioná-lo na lista. Todo exame e consulta fica vinculado ao paciente e pode ser acessado através do prontuário.

**Lista de pacientes (lista de prontuários)**: 
Disponibilidade de acesso: perfil Médico(a) e Admin.
Na tela que lista os pacientes, é possível visualizar rapidamente todos os pacientes, incluindo nº do registro, nome do paciente, telefone e convênio de saúde. Também há um campo de busca para facilitar a busca pelo paciente, utilizando o nome ou nº do registro. Aqui também é possível acessar o cadastro do paciente para edição ou remoção (só é possível remover pacientes que não possuem exames ou consultas vinculados a ele). 

**Lista de usuários**:
Disponibilidade de acesso: perfil Admin.
Lista com todos os usuários do sistema, com nº do registro, login de acesso, perfil e a senha parcialmente protegida. Através da lista, é possível acessar a edição e exclusão de usuários.

**Administração de usuários**:
Disponibilidade de acesso: perfil Admin.
Tela que permite editar ou excluir usuários. Usuários com perfil paciente não podem ser excluídos através desta tela, pois estão vinculados a um paciente.

## Acesse a aplicação:
https://labinc.vercel.app/

O deploy da API (backend) foi feito na versão gratuita do Render.

Obs.: a versão gratuita do Render deixa a API inativa após algum tempo sem chamadas. Por isso, a aplicação pode ficar um pouco lenta ao iniciar e talvez precise de uma segunda chamada para reativar.

## Como rodar localmente :mag_right:

1. Faça o clone do projeto para sua máquina.
2. Certifique-se de ter o Node.js, npm e Angular CLI instalados na sua máquina. Se não tiver, você precisará instalá-los.
3. Navegue até o diretório do projeto e instale todas as dependências do projeto executando o comando `npm install`.
4. Acesse o repositório do Backend `https://github.com/FullStack-Health/M3P-BackEnd-Squad3` e siga as instruções para rodar a API que será consumida pela aplicação. 
5. Em um novo terminal, execute o comando `ng serve` para iniciar o servidor de desenvolvimento.
6. Abra o navegador e acesse `http://localhost:4200/`.

## Dependências do Projeto :books:

Este projeto foi construído usando as seguintes tecnologias e bibliotecas:

- Angular (versão 17.3.0)
- Angular Material
- PrimeNg
- Ngx-Mask
- Moment.js
- RxJS
