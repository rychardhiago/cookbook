<p>Este projeto consiste em um sistema simples de livro de receitas com autenticação de
usuários, desenvolvido com backend em PHP e frontend em React. O projeto será
containerizado com Docker Compose e incluirá testes automatizados e integração
com SonarQube para análise de código. </p>

<p>Tecnologias usadas:</p>

<p>PHP, 
Laravel 12 with SAIL, 
PHPUnit, 
JWT, 
Docker, 
React, 
Vite, 
Tailwind CSS, 
Axios, 
Context API
</p>
<p>
<p>Comandos para executar o projeto:</p>
<p>git clone git@github.com:rychardhiago/cookbook.git</p>
<p>cd cookbook</p>
<p>cp .env.example .env</p>
<p>composer install</p>
<p>./vendor/bin/sail up -d</p>
<p>npm install</p>
<p>npm run dev</p>
<p></p>
<p>Em tests/Postman você encontra uma collection para importar no postman com os testes de todos os endpoints</p>
<p>Para executar os testes do PHPUnit ./vendor/bin/sail artisan test</p>

</p>
