# Teste Prático - Autoflex

> Teste realizado para aplicação de vaga de emprego como Desenvolvedor Junior

### Problema

Uma indústria que produz produtos diversos, necessita controlar o estoque dos insumos (matérias-primas) necessárias para a produção dos itens que fabrica. Para isso será necessário o desenvolvimento de um sistema que permita manter o controle dos produtos e das matérias-primas que são utilizadas para a produção de cada produto.

Para o produto devem ser armazenados, além do código, o nome e o valor.

Para as matérias-primas, além do código, também devem armazenados o nome e quantidade em estoque. Obviamente, deverá ser feito a associação dos produtos e das matérias primas que o compõem, com as respectivas quantidades necessárias de cada matéria prima para produzir o produto.

Além da manutenção dos cadastros, deseja-se saber quais produtos (e quais quantidades) podem ser produzidos com as matérias-primas em estoque, e o valor total que será obtido com a produção sugerida pelo sistema.

A priorização de quais produtos devem ser sugeridos pelo sistema, deve ser pelos produtos de maior valor, uma vez que uma determinada matéria-prima pode ser utilizada em mais de um produto.

# Como inicializar

> ⚠ É necessário ter [Node.js](https://nodejs.org/pt-br) instalado

1. Clonar o repositório com o comando abaixo:
	```powershell
	https://github.com/swshadows/practical-test-autoflex
	```
2. Preencher os arquivos `.env` de cada pasta.
3. Inicializar `backend` com o comando abaixo:
	```powershell
	cd backend
	npm install
	npx prisma generate
	npx prisma migrate dev
	npm run dev
	```
4. Inicializar `frontend` com o comando abaixo:
	```powershell
	cd frontend
	npm install
	npm run dev
	```