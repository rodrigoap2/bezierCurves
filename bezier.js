//Comando define se é pra remover(0), adicionar(1) ou Escolher(2) e 
var comando = 0;
var cor = 'blue';
var pontosAtuais = [];
var allPoints = [];
function mostrarPontos(){
	allPoints.push(pontosAtuais);
	allPoints.forEach(conj => conj.forEach(circ => circ.addTo(stage)));
}

stage.on('message:adicionarCurva', function(){
    comando = 1;
});

stage.on('message:deletarCurva', function(){
    comando = 0;
});

stage.on('click', function(point){
	if(comando === 1){
		pontosAtuais = [];
   		comando = 3;
   		console.log("aaaaa");
	}else if(comando === 0){
		var p = new Circle(point.x, point.y, 10).fill(cor);
		console.log(p.points());
		console.log('aaaaa');
		//deletarPonto(point.x,point.y);
	}else if(comando === 3){
		var p = new Circle(point.x, point.y, 10).fill(cor);
   		pontosAtuais.push(p);
	}
	mostrarPontos();
})