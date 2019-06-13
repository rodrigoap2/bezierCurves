//Comando define se é pra remover(0), adicionar(1) ou Escolher(2) e 
var comando = -1;
var raioCirculo = 10;
var tr = 0.5;
var cor = 'blue';
var p_curvas = [];
var arr_curvas = [];
var pontosAtuais = [];
var allPoints = [];
function guardarPontos(){
	allPoints.push(pontosAtuais);
}

function construirCurvas(){
	var x = acharPonto(pontosAtuais,tr,0);
	
}

function desenharBezier(p){
	console.log(p + "oi");
	p.addTo(stage);
}

function acharPonto(conj,t,qtdeRec){
	if(conj.length === 1){
		var p = new Point(conj[0].x,conj[0].y);
		desenharBezier(p);
	}else{
		var newPoints = [];
		for(let i=0; i<conj.length-1; i++){
			var pointTempx;
			var pointTempy;
			if(qtdeRec == 0){
				pointTempx = ((1-t) * conj[i].closePath()._attributes.x) + (t * conj[i+1].closePath()._attributes.x);
				pointTempy = ((1-t) * conj[i].closePath()._attributes.y) + (t * conj[i+1].closePath()._attributes.y);
			}else{
				pointTempx = ((1-t) * conj[i].x) + (t * conj[i+1].x);
				pointTempy = ((1-t) * conj[i].y) + (t * conj[i+1].y);
			}
			var ponto = new Point(pointTempx,pointTempy);
			newPoints.push(ponto);
		}
		acharPonto(newPoints,t,1);
	}
}

function deletarPonto(pointx,pointy){
	allPoints.forEach(conj => conj.forEach(function (circ){
		if(verificarPonto(circ,pointx,pointy)){
			pontosAtuais = conj;
			var index = conj.indexOf(circ);
			conj.splice(index, 1);
			circ.clear();
			if(conj.length === 0){
				index = allPoints.indexOf(conj);
				allPoints.splice(index,1);
			}
		}
	}));
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
		guardarPontos();
		pontosAtuais = [];
		var p = new Circle(point.x, point.y, raioCirculo).fill(cor).addTo(stage);
   		pontosAtuais.push(p);
   		comando = 3;
	}else if(comando === 0){
		guardarPontos();
		deletarPonto(point.x,point.y);
	}else if(comando === 3){
		var p = new Circle(point.x, point.y, raioCirculo).fill(cor).addTo(stage);
   		pontosAtuais.push(p);
	}
	if(pontosAtuais.length > 0){
		construirCurvas();
	}	
})