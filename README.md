# Inovagil Eletivas

## 📃 O que é?

O objetivo do Projeto Desafio de Programação é promover a inovação e o desenvolvimento tecnológico
por meio de desafios de programação. Este projeto reúne equipes, que receberão um problema
comum para desenvolver uma solução tecnológica inovadora.

Criado com objetivo de desafiar os estudantes da área de programação, do ensino técnico subsequente.

Tem como os Requisitos:

- O sistema deverá funcionar online via navegador.
- O aluno deverá inserir sua matrícula e data de nascimento como validação de usuário.
- O sistema deverá exibir e controlar a quantidade de vagas atuais em cada disciplina eletiva.
- Enquanto possuir vagas, o aluno poderá trocar de disciplina. No momento de escolha, deverá aparecer o nome da disciplina e nome do professor
- Quantidade de disciplinas e eletivas serão disponibilizados pela escola.
- Precisa estar hospedado de forma gratuita.

## 🎬 Para quê foi feito?

Foi desenvolvido com o intuito de facilitar a organização da escolha das eletivas da grade curricular do ensino médio, inicialmente na Escola Técnica Estadual Advogado Jóse Gil Rodrigues, com o objetivo de levar adiante o projeto para outras instituições futuramente.

## 🔩 Como usar?

O sistema permitirá que os alunos façam o login utilizando suas informações pessoais cadastradas na escola, para a ter acesso as opções de escolhas disponiveis no sistema, se diferenciando pelo ano que está inserido, e com a quantidade de vagas disponiveis.

---

### Área aluno

![login_page](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/login_screen.png)

Ao fazer login, o aluno terá acesso as disciplinas disponíveis para matrícula, indicando quantas vagas ainda restam.

![homepage_unregistered](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/homepage_unregistered.png)

Ao clicar em uma das turmas, um modal será aberto solicitando a confirmação do usuário para que então a matrícula seja realizada.

![modal_register](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/modal_register.png)

Selecionando a opção **sim**, se a turma tiver vagas disponíveis e o aluno estiver apto a matricula, o aluno será matriculado na disciplina correspondente, atualizando a página e demonstrando agora que ele está matriculado naquela turma, e as vagas da disciplina serão atualizadas.
Caso a disciplina não tenha vagas disponíveis, um erro é disparado alertando ao usuário que não há vagas para aquela disciplina, ele deve então, selecionar uma outra disciplina.

![homepage_registered](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/homepage_registered.png)

---

### Área secretaria

A homepage da área administrativa apresentará um formulário inicial, para exportação dos dados das turmas baseados nos anos.

![admin_screen](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/admin_screen.png)

Selecionando o ano e digitando o código de administrador, você sera redirecionado a uma outra página, contanto com uma tabela com todas as informações das turmas do ano selecionado, demonstrando quantos alunos se matricularam, e quais são esse alunos.

![export_data](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/export_data.png)

Contamos também com um botão para copiar as informações, ao seleciona-lo, será copiado para sua área de transferência as informações da turma selecionada, podendo ser colada em um arquivo tipo xlsx (Excel, LibreOffice Calc ou Google Planilhas)

![excel_example](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/excel_example.png)

Ao seleciona o botão **Cadastrar eletiva**, um modal será habilitado, com um formulário, para o cadastro da eletiva.

![class_register](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/class_register.png)

Ao seleciona o botão **Cadastrar base de alunos**, um modal será habilitado, com um formulário, para a importação da base de dados dos alunos.

> [!IMPORTANT]
> A base de dados deve ser um arquivo tipo .csv, delimitado por vírgulas (","), e a primeira linha desse arquivo deve conter os campos necessários, estritamente na ordem correta, para um correto mapeamento no banco de dados :

```text
-   matricula
-   nome
-   data de nascimento
-   serie
-   curso
```

![csv_example](https://github.com/Maycomwill/inovagil-eletivas/assets/74081416/9cae0904-ce78-4acb-a9aa-143d8778a347)

![students_register](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/students_register.png)

Também é possível cadastrar uma base de eletivas via arquivo csv, assim como a base de dados dos alunos. O seguinte padrão deve ser seguido para cadastramento.

```text
-   nome
-   professor
-   serie
-   diaDaSemana
-   vagas
```

Ao seleciona o botão **Zerar banco de dados**, um modal será habilitado, para a confirmação da ação.

> [!CAUTION]
> Lembrando que essa ação é irreversível e deletará toda e qualquer informação presente no banco de dados.

![truncate_database](https://raw.githubusercontent.com/Maycomwill/inovagil-eletivas/main/public/screenshots/truncate_databse.png)

> [!NOTE]
> Todas as ações executadas na área da secretaria é necessário digitar o código de admin.

## 📝 Requisitos

- [Node](https://nodejs.org/en) v18.18.0 ou superior
- [NPM](https://nodejs.org/en) v10.2.4 ou superior
- [PostgreSQL](https://www.postgresql.org/download) 16 ou superior
- [Docker](https://www.docker.com/products/docker-desktop/) v4.32 ou superior

## 🔨 Instalação

Para instalar o sistema, clone o repositório com o comando:

```shell
git clone https://github.com/Maycomwill/inovagil-eletivas.git
```

A estrutura do projeto contem duas pastas, **server** e **web**.

---

### Server

Acesse a pasta server e instale as dependências necessárias com o comando:

```shell
npm install
```

Crie um arquivo na raiz da pastar **server** chamando **.env**, nele crie quatro variáveis ambientes que serão utilizadas pelo sistema:

- DATABASE_URL="postgresql://postgres:1234@postgres:5432/eletivas?schema=public"

- JWTSECRET="ELETIVAS_ETE_GIL_RODRIGUES_JWT_SECRET"
- PORT="3333"
- SECRET="Admin-ETE-Gil-Rodrigues-CdT"

Todos os campos em negrito podem ser substituidos pelos valores que você desejar.

Baixe e instale o PostgreSQL seguindo os passos descritos no [site](https://www.postgresql.org/download/) da tecnologia, de acordo com o seu sistema operacional.

---

### WEB

Acesse a pasta **web** e instale as dependências necessárias utilizando o comando:

```shell
npm install
```

Se estiver utilizando um serviço online para hospedar tanto o servidor quanto o front-end, lembre-se de alterar o arquivo **axios.ts** localizado em "web/src/lib/axios.ts"

```javascript
baseURL: "http://localhost:3333",
```

Altere a URL indicada pela URL do seu serviço onde está hospedado o back-end.

Ex:

```javascript
baseURL: "https://inovagil-eletivas.onrender.com";
```

Pronto, ambos os serviços estão devidamente configurados

### Docker

Entre no diretório raiz do projeto, e execute o comando:

```shell
docker-compose up --build
```

Todos os sevidos devem ligar corretamente disponíveis nas portas:

- **3000**: Servidor web
- **3333**: Servidor backend
- **5432**: Banco de dados

---

## ✔ Conclusão

Os facilitadores e futuros programadores, após demonstrarem suas habilidades e criatividade no decorrer do desenvolvimento do projeto, possibilitou a funcionalidade aos estudantes integrados a se encaixarem nas suas devidas eletivas de escolha, obtendo sucesso e aprovação pelos usuários.

## &copy; Créditos

[Maycom Willams](https://github.com/Maycomwill)💚
[Lucas Gomes](https://github.com/lucasgm18)💎
[Nathália Sousa](https://github.com/Nathaliaraphaella)💜
[Eduarda Albuquerque](https://github.com/duda-http)🌙
[Edilson Bernardo](https://github.com/ebernardo98)😉

## 💻 Tecnologias

<center>

![React](https://img.shields.io/badge/React-%2361DAFB?style=flat&logo=react&logoColor=%23333333) ![Prisma](https://img.shields.io/badge/Prisma-%232D3748?style=flat&logo=prisma&logoColor=%23ffffff) ![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6?style=flat&logo=typescript&logoColor=%23ffffff) ![TaiwindCSS](https://img.shields.io/badge/TailwindCSS-%2306B6D4?style=flat&logo=tailwindcss&logoColor=%23ffffff) ![Axios](https://img.shields.io/badge/Axios-%235A29E4?style=flat&logo=axios&logoColor=%23ffffff)
![Fastify](https://img.shields.io/badge/Fastify-%23000000?style=flat&logo=fastify&logoColor=%23ffffff) ![Postgresql](https://img.shields.io/badge/Postgresql-%234169E1?style=flat&logo=postgresql&logoColor=%23ffffff) ![Zod](https://img.shields.io/badge/Zod-%233E67B1?style=flat&logo=zod&logoColor=%23ffffff)

</center>
