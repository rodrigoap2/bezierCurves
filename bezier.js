//Comando define se é pra remover(0), adicionar(1) ou Escolher(2) e 
var comando = -1;
var raioCirculo = 10;
var tr = 100;
var cor = 'blue';
var posicaoAtual = -1;
var p_curvas = [];
var arr_curvas = [];
var pontosAtuais = [];
var allPoints = [];
function colocarPontosAtuais(){
}
//primeiro faazer pros pontos atuais depois pra todos
function mostrarCurvas(){
	var index = -1;
	var arr = [];
	pontosAtuais.forEach(a => arr.push(a));
	guardarPontos();
	allPoints.forEach(function(conj){
		var l = true;
		for(let i = 0; i < conj.length; i++){
			if(conj[i] != pontosAtuais[i]){
				l = false;
			}
			arr.push(conj[i]);
		}
		//console.log(conj.length);
		if(l && conj.length > 0){
			console.log("entrou " + allPoints.length);
			if(allPoints.length > 1){
				var index = allPoints.indexOf(conj);
				console.log(allPoints);
				arr_curvas[index] = p_curvas;
				console.log(arr_curvas);
			}else{
				console.log(arr_curvas);
				arr_curvas[0] = p_curvas;
			}
		}else if(conj.length == 0 && arr_curvas.length == 0){
			//console.log("aaa");
			arr_curvas.push(p_curvas);
		}
	});
	arr_curvas.forEach(a => a.forEach(b => arr.push(b)));
	stage.children(arr);
}

function guardarPontos(){
	allPoints[posicaoAtual] = pontosAtuais;
}

function construirCurvas(){
	var coordenadas = [];
	var qtdePontos = 1/tr;
	var x = acharPonto(pontosAtuais,0,0);
	for(let k = 0; k <= tr; k++){
		t = k*qtdePontos;
		var op = acharPonto(pontosAtuais,t,0);
		coordenadas.push(op);
	}
	//
	desenharBezier(coordenadas);
}

function desenharBezier(coordenadas){
	var coord = coordenadas[0];
	var cord;
	p_curvas = [];
	for(let k = 1; k < coordenadas.length; k++){
		cord = coordenadas[k];
		var pontoCurva = new Path().moveTo(coord.x,coord.y).lineTo(cord.x,cord.y).stroke("red",2);
		p_curvas.push(pontoCurva);
		coord = cord;
	}
	mostrarCurvas();
}

function acharPonto(conj,t,qtdeRec){
	if(conj.length === 1){
		var p = 0;
		if(qtdeRec != 0){
			p = new Point(conj[0].x,conj[0].y);
		}else{
			p = new Point(conj[0].closePath()._attributes.x,conj[0].closePath()._attributes.y);
		}
		return p;
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
		return acharPonto(newPoints,t,1);
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
		posicaoAtual = posicaoAtual + 1;
		pontosAtuais = [];
		var opp = new Circle(0.000001, 0.000001, 0.000001).fill('white').addTo(stage);
		var p = new Circle(point.x, point.y, raioCirculo).fill(cor);
   		pontosAtuais.push(p);
   		comando = 3;
	}else if(comando === 0){
		guardarPontos();
		deletarPonto(point.x,point.y);
	}else if(comando === 3){
		var p = new Circle(point.x, point.y, raioCirculo).fill(cor);
   		pontosAtuais.push(p);
	}
	if(pontosAtuais.length > 0){
		construirCurvas();
	}	
})