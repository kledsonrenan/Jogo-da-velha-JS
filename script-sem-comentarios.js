window.onload = () => {
	new Game();
}
class Game {
	constructor() {
		this.iniciaEstados();
		this.iniciaElementos();
	}
	iniciaEstados() {
		this.turn = true;
		this.jogadas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.end = false;
		this.win = [448, 56, 7, 292, 146, 73, 273, 84];
	}
	iniciaElementos() {
		this.jogadorX = document.querySelector('#jogador-x');
		this.jogadorO = document.querySelector('#jogador-o');

		this.salvarLocal = document.querySelector('#salva-local');
		this.salvarLocal.addEventListener('click', this.salvaLocal.bind(this));

		this.carregarLocal = document.querySelector('#carrega-local');
		this.carregarLocal.addEventListener('click', this.carregaLocal.bind(this));

		this.limparLocal = document.querySelector('#limpar-local');
		this.limparLocal.addEventListener('click', this.limpaLocal.bind(this));
		this.velha = document.querySelector('#velha');

		this.velha.addEventListener('click', (event) => {
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
		const dados = {
			jogadorX: this.jogadorX.value,
			jogadorO: this.jogadorO.value,
			jogadas: this.jogadas
		}
		localStorage.setItem("Jogo", JSON.stringify(dados));
	}
	carregaLocal() {
		const dados = JSON.parse(localStorage.getItem('Jogo'));
		this.jogadorX.value = dados.jogadorX;
		this.jogadorO.value = dados.jogadorO;
		this.jogadas = dados.jogadas;
		this.render();
	}
	limpaLocal() {
		localStorage.removeItem('Jogo');
		this.jogadorX.value = "";
		this.jogadorO.value = "";
		this.iniciaEstados();
		this.render();
	}
	realizaJogada(event) {
		const id = event.target.dataset.id;
		if ( this.end ) {
			this.modal('Partida terminada!');
			return;
		}
		if ( !event.target.dataset.id ) {
			this.modal('VC nao clicou em uma casa corretamente!');
			return;
		}
		if ( this.jogadas[id] != 0 ) {
			this.modal('VC não pode escolher esta posição!')
			return;
		}
		this.jogadas[id] = this.turn ? "X" : "O";
		this.turn = !this.turn;
	}
	render() {
		const resultado = this.verificaWin();
		if ( resultado == 'X' || resultado == "O") {
			this.end = true;
			this.modal(`${resultado == 'X' ? this.jogadorX.value : this.jogadorO.value} venceu!`);
		}
		const gameElement = document.querySelectorAll('[data-id]');
		for (let i = 0; i < 9; i++) {
			gameElement[i].innerHTML = this.jogadas[i] == 0 ? "" : this.jogadas[i];
		}
	}
	verificaWin() {
		const valorX = parseInt(this.jogadas.map( value => value == "X" ? 1 : 0 ).join(""), 2);
		const valorO = parseInt(this.jogadas.map( value => value == "O" ? 1 : 0 ).join(""), 2);

		for ( const element of this.win ) {
			if ( (element & valorX) == element)
				return 'X';
			if ( (element & valorO) == element)
				return 'O';
		}
		return "";
	}
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