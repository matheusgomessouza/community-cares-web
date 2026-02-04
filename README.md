![](./assets/readme/community-cares-web-cover.png)

**👨‍💻 Tecnologias / Technologies**

Esse projeto foi desenvolvido com as seguintes tecnologias / This project was developed with the following technologies:
- [Typescript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com)
- [Next.js](https://nextjs.org/)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**✨ Funcionalidades / Features**

- Mapa e lista de pontos de doação de alimentos gratuitos / Map and list of free giveaway food locations
- Busca e filtros por endereço, categoria e horário / Search and filters by address, category, and hours
- Formulários com validação (Zod + React Hook Form) / Forms with validation (Zod + React Hook Form)
- UI responsiva com Tailwind CSS / Responsive UI with Tailwind CSS
- Integração com API usando Axios / API integration with Axios
- Testes de unidade e componentes (Vitest + Testing Library) / Unit and component tests (Vitest + Testing Library)
- Boas práticas de acessibilidade / Accessibility best practices

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**💻 Projeto / Project**

Community Cares é um app que conecta pessoas a pontos de doação de alimentos gratuitos, com mapa interativo, filtros por endereço/categoria/horário e foco em acessibilidade. Encontre ajuda perto de você ou divulgue um ponto para ampliar o impacto. 🧡

Community Cares is an app that connects people to free food giveaway locations with an interactive map, filters by address/category/hours, and an accessibility-first experience. Find help nearby or share a location to amplify the impact. 🧡

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**🚀 Como executar / How to run**

Pré-requisitos / Prerequisites:
- Node.js LTS + npm, ou Docker (Desktop/Engine) / Node.js LTS + npm, or Docker (Desktop/Engine)
- VS Code (opcional) + extensão Dev Containers / VS Code (optional) + Dev Containers extension

Ambiente local (Node) / Local environment (Node):
- Clone o repositório / Clone the repository
- Instale as dependências com `npm i` / Install dependencies with `npm i`
- (Opcional) Crie um `.env.local` com suas variáveis de ambiente / (Optional) Create `.env.local` with your environment variables
- Inicie o servidor com `npm run dev` / Start the server with `npm run dev`
- Abra http://localhost:3000 / Open http://localhost:3000

Docker (sem Dev Containers) / Docker (without Dev Containers):
- Gere um arquivo `.env.local` se necessário / Create `.env.local` if needed
- Construa a imagem: `docker build -t community-cares-web .`
- Rode o container: `docker run --rm -p 3000:3000 --env-file .env.local community-cares-web`
- Abra http://localhost:3000 / Open http://localhost:3000

VS Code Dev Containers:
- Instale Docker e a extensão “Dev Containers” no VS Code / Install Docker and the “Dev Containers” extension in VS Code
- Abra a pasta no VS Code e escolha “Reopen in Container” / Open the folder in VS Code and choose “Reopen in Container”
- O VS Code irá construir e iniciar o container de desenvolvimento / VS Code will build and start the dev container
- Guia detalhado / Detailed guide: https://matheus-docs.notion.site/Leveraging-Docker-VS-Code-Dev-Containers-during-local-development-8b43483454574dceb23f0b0dba0505fc

Scripts úteis / Useful scripts:
- Testes / Tests: `npm test` ou `npm run test`
- Lint: `npm run lint`
- Build de produção / Production build: `npm run build` e `npm start`

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**🧑🏾‍💻 Autor / Author**

**Matheus Gomes de Souza**

LinkedIn: https://www.linkedin.com/in/matheus-gomes-de-souza/ <br/>
E-mail: matheusg_souza@outlook.com
