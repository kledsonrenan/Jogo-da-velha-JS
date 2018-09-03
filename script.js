window.onload = () => {
	// Ao carregar iniciamos a classe Game
	new Game();
}
class Game {
	// Apos a classe Game possuir uma instancia, ela chama os seguintes metodos
	constructor() {
		this.iniciaEstados();
		this.iniciaElementos();
	}
	// Apos ser chamado, este metodo inicia os turnos e jogadas padrao
	iniciaEstados() {
		this.turn = true;
		// Turnos limpos	
		this.jogadas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		// Define se o jogo acaba ou continua
		this.end = false;
		// Sequencias que definem a vitoria - convercao de binarios
		this.win = [448, 56, 7, 292, 146, 73, 273, 84];
	}
	// Inicializa os Elementos
	iniciaElementos() {
		// Nomes dos Jogadores
		this.jogadorX = document.querySelector('#jogador-x');
		this.jogadorO = document.querySelector('#jogador-o');
		// Metodos para cada item de menu - salvar, carregar, limpar-tabuleiro - limpar-dados
		this.carregarLocal = document.querySelector('#carrega-local');
		this.carregarLocal.addEventListener('click', this.carregaLocal.bind(this));

		this.limparTabuleiro = document.querySelector('#limpar-tabuleiro');
		this.limparTabuleiro.addEventListener('click', this.limpaTabuleiro.bind(this));

		this.limparLocal = document.querySelector('#limpar-local');
		this.limparLocal.addEventListener('click', this.limpaLocal.bind(this));
		
		// Tabuleiro
		this.velha = document.querySelector('#velha');
		this.velha.addEventListener('click', (event) => {
			// Verifica se todos os jogadores foram definidos
			if (this.jogadorX.value == '' && this.jogadorO.value == '') {
				this.modal("Antes de iniciar é necessario informar os jogadores");
			} else if ((this.jogadorX.value == '' && this.jogadorO.value != '') || (this.jogadorX.value != '' && this.jogadorO.value == '')) {
				this.modal("Para iniciar o jogo é necessario que todos os jogadores sejam inseridos");
			} else {
				this.realizaJogada(event);
				this.render();
			}
		});
	}
	salvaLocal() {
		// Objeto dados
		const dados = {
			// Pega o nome dos jogadores e atribui a cada jogador
			jogadorX: this.jogadorX.value,
			jogadorO: this.jogadorO.value,
			// Pega as jogadas e atribui a jogadas
			jogadas: this.jogadas
		}
		// Adiciona ao LocalStorage um dado com chave/valor
		localStorage.setItem(
			"Jogo",
			// Transforma um objeto do JS para string antes de salvar no localStorage
			JSON.stringify(dados)
		);
	}
	carregaLocal() {
		// Passa o item do tipo string para um objeto JS
		const dados = JSON.parse(localStorage.getItem('Jogo'));
		// Os valores dos campos inputs recebem os jogadores da ultima partida
		this.jogadorX.value = dados.jogadorX;
		this.jogadorO.value = dados.jogadorO;
		// O array jogadas recebe as jogadas salvas pela ultima vez
		this.jogadas = dados.jogadas;
		this.render();
	}
	limpaTabuleiro() {
		this.iniciaEstados();
		this.render();
	}
	limpaLocal() {
		// Limpa os dados do LocalStorage
		localStorage.removeItem('Jogo');
		// Limpa os campos de Input
		this.jogadorX.value = "";
		this.jogadorO.value = "";
		// Zera os turnos e as jogadas
		this.iniciaEstados();
		// Renderiza para o usuario
		this.render();
	}
	// Define quem ira jogar e altera o turno para o proximo jogador
	realizaJogada(event) {
		// Pega o elemento na posição igual a posicao do quadro clicado
		const id = event.target.dataset.id;
		if ( this.end ) {
			this.modal('Partida terminada!');
			return;
		}
		// Verifica se o alvo foi clicado
		if ( !event.target.dataset.id ) {
			this.modal('VC nao clicou em uma casa corretamente!');
			return;
		}
		// Verifica se a posicao escolhida ja foi selecionada
		if ( this.jogadas[id] != 0 ) {
			this.modal('VC não pode escolher esta posição!')
			return;
		}
		/*	Verifica qual a situacao do turno, caso seja verdadeiro quem
		inicia é o jogador X caso contrario o Jogador O */
		this.jogadas[id] = this.turn ? "X" : "O";
		// Troca de turno de X para O e vice versa
		this.turn = !this.turn;
		this.salvaLocal();
	}
	render() {
		const resultado = this.verificaWin();
		if ( resultado == 'X' || resultado == "O") {
			this.end = true;
			this.modal(`${resultado == 'X' ? this.jogadorX.value : this.jogadorO.value} venceu!`);
		}
		// Renderiza para o usuario
		const gameElement = document.querySelectorAll('[data-id]');
		for (let i = 0; i < 9; i++) {
			gameElement[i].innerHTML = this.jogadas[i] == 0 ? "" : this.jogadas[i];
		}
	}
	verificaWin() {
		// Decimal da sequencia de quem jogou X
		/*
		.map = Retorna um array;
		.join = passamos o array para uma string
		parseInt = passamos o valor da string para Inteiro
		2 = segundo parametro do parseInt -> informa que queremos guardar em um valor decimal
		*/
		const valorX = parseInt(this.jogadas.map( value => value == "X" ? 1 : 0 ).join(""), 2);
		// Decimal da sequencia de quem jogou Y
		const valorO = parseInt(this.jogadas.map( value => value == "O" ? 1 : 0 ).join(""), 2);
		// Percorrer array WIN perguntando se alguem ganhou
		for ( const element of this.win ) {
			if ( (element & valorX) == element)
				return 'X';
			if ( (element & valorO) == element)
				return 'O';
		}
		return "";
	}
	// Exibir mensagens
	modal ( mensagem ) {
		const modais = document.querySelector('#modais');
		const modal = document.createElement('span');
		modal.innerHTML = mensagem;
		modal.classList.add('modal-class');
		modais.appendChild(modal);

		setTimeout(() => {
			modal.classList.add('out');
			setTimeout( () => {
				modais.removeChild(modal);
			}, 3000);
		}, 2000);
	}
}