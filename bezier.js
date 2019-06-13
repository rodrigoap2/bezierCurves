//Comando define se é pra remover(0), adicionar(1) ou Escolher(2) e 
var comando = 0;
var raioCirculo = 10;
var cor = 'blue';
var pontosAtuais = [];
var allPoints = [];
function mostrarPontos(){
	allPoints.push(pontosAtuais);
	allPoints.forEach(conj => conj.forEach(circ => circ.addTo(stage)));
}

function deletarPonto(pointx,pointy){
	allPoints.forEach(conj => conj.forEach(function (circ){
		if(verificarPonto(circ,pointx,pointy)){
			var index = conj.indexOf(circ);
			conj.splice(index, 1);
			circ.clear();
		}
	}));
	mostrarPontos();
}

function verificarPonto(circ,pointx,pointy){
	if((circ.closePath()._attributes.x <= pointx+raioCirculo) && (circ.closePath()._attributes.x >= pointx-raioCirculo) && (circ.closePath()._attributes.y <= pointy+raioCirculo) && (circ.closePath()._attributes.y >= pointy-raioCirculo)){
		return true;
	}else{
		return false;
	}
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
	}else if(comando === 0){
		var p = new Circle(point.x, point.y, 10).fill(cor);
		deletarPonto(point.x,point.y);
	}else if(comando === 3){
		var p = new Circle(point.x, point.y, 10).fill(cor);
   		pontosAtuais.push(p);
	}
	mostrarPontos();
})