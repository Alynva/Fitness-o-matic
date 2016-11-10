console.clear();

/* Open/Close menu lateral */ var buttons = document.querySelectorAll('.openCloseMenu');for (var i = 0; i < buttons.length; i++) {buttons[i].addEventListener("click", function(){var x = document.querySelector("body > nav");x.hasAttribute('checked') ? x.removeAttribute("checked") : x.setAttribute("checked", true);});};

/* Abas */ $('.nav.nav-tabs a').click(function (e) {e.preventDefault();$(this).tab('show');});

/* Recarregar resultados */ for (var i = 0, iItens = $("#input-text, #input-text ~ span > button, #tab-style > li, #select-groups, #select-equipments"); i < iItens.length; i++) {iItens[i].addEventListener("change", loadResults);iItens[i].addEventListener("click", loadResults);iItens[i].addEventListener("keyup", loadResults);}

/* Função adicionar exercício */
function addExe(i) {
	var col = document.createElement("div");
	col.classList.add("col-xs-4");
	var thumbnail = document.createElement("div");
	thumbnail.classList.add("thumbnail");
	thumbnail.id = "exe"+document.querySelectorAll("section > div > div").length;
	thumbnail.setAttribute("data-bd-id", i);
	
	scanInfo(thumbnail.id, i);
	
	var configs = document.createElement("div");
	configs.classList.add("configs");
	
	var resize = document.createElement("div");
	resize.classList.add("btn-group");
	var resizeB = document.createElement("buttom");
	resizeB.setAttribute("type", "buttom");
	resizeB.classList.add("btn");
	resizeB.classList.add("btn-default");
	resizeB.classList.add("dropdown-toggle");
	resizeB.classList.add("btn-xs");
	resizeB.setAttribute("data-toggle", "dropdown");
	resizeB.setAttribute("aria-haspopup", "true");
	resizeB.setAttribute("aria-expanded", "false");
	resizeB.innerHTML = "<i class='fa fa-th' aria-hidden='true'></i>";
	resize.appendChild(resizeB);
	var resizeU = document.createElement("ul");
	resizeU.classList.add("dropdown-menu");
	var resizeL = document.createElement("li");
	resizeL.classList.add("dropdown-header");
	resizeL.appendChild(document.createTextNode("Tamanho"));
	resizeU.appendChild(resizeL);
	
	for (var j = 2; j <= 12; j++) {
		resizeL = document.createElement("li");
		resizeL.setAttribute("onclick", "reSize('columns', "+j+", '"+thumbnail.id+"')");
		var resizeLA = document.createElement("a");
		resizeLA.href = "#";
		resizeLA.appendChild(document.createTextNode(j));
		resizeL.appendChild(resizeLA);
		resizeU.appendChild(resizeL);
	}
	resize.appendChild(resizeU);
	configs.appendChild(resize);
	
	var change = document.createElement("buttom");
	change.setAttribute("type", "buttom");
	change.classList.add("btn");
	change.classList.add("btn-warning");
	change.classList.add("btn-xs");
	change.setAttribute("onclick", "scanInfo('"+thumbnail.id+"')");
	change.innerHTML = "<i class='fa fa-wrench' aria-hidden='true'></i>";
	configs.appendChild(change);
	
	var del = document.createElement("buttom");
	del.setAttribute("type", "buttom");
	del.classList.add("btn");
	del.classList.add("btn-danger");
	del.classList.add("btn-xs");
	del.setAttribute("onclick", "remove('"+thumbnail.id+"')");
	del.innerHTML = "<i class='fa fa-trash' aria-hidden='true'></i>";
	configs.appendChild(del);
	
	thumbnail.appendChild(configs);

	var img = document.createElement("img");
	img.src = bd[i].img;
	img.setAttribute("alt", bd[i].name);
	thumbnail.appendChild(img);

	var caption = document.createElement("div");
	caption.classList.add("caption");

	var title = document.createElement("h4");
	title.innerHTML = bd[i].name;
	caption.appendChild(title);
	
	var p = document.createElement("p");
	caption.appendChild(p);

	thumbnail.appendChild(caption);
	col.appendChild(thumbnail);
	
	document.querySelector("section:last-of-type > div").appendChild(col);
	
	checkHeight();
}
/* Receber informações de séries, repetições, tempo e etc */
function scanInfo(id, bdIndex = false) {
	bdIndex = typeof bdIndex !== 'undefined' ? bdIndex : false;
	$('#stepsAndReps').on('shown.bs.modal', function (e) {
		$("#stepsAndReps input")[0].focus();
		$("#stepsAndReps input")[0].select();
	});
	document.querySelector("#stepsAndReps").setAttribute("to", id);
	var index = bdIndex || $("#"+id).attr("data-bd-id");
	
	if (bd[index].style == "Treino") {
		document.querySelector("#stepsAndReps").setAttribute("data-connector", "com");
		$("label[for='inputInfo1']").text("Séries");
		document.querySelector("#inputInfo1").setAttribute("data-name", " série");
		document.querySelector("#inputInfo1").setAttribute("data-names", " séries");
		$("label[for='inputInfo2']").text("Repetições");
		document.querySelector("#inputInfo2").setAttribute("data-name", "repetição");
		document.querySelector("#inputInfo2").setAttribute("data-names", "repetições");
	} else if (bd[index].style == "Cardio") {
		document.querySelector("#stepsAndReps").setAttribute("data-connector", "em");
		$("label[for='inputInfo1']").text("Potência");
		document.querySelector("#inputInfo1").setAttribute("data-name", "%");
		document.querySelector("#inputInfo1").setAttribute("data-names", "%");
		$("label[for='inputInfo2']").text("Tempo (min)");
		document.querySelector("#inputInfo2").setAttribute("data-name", "minuto");
		document.querySelector("#inputInfo2").setAttribute("data-names", "minutos");
	}
	$('#stepsAndReps').modal('show');
}
$("#stepsAndReps form.form-inline").submit(function(event){
	event.preventDefault();
	saveInfo();
});
/* Substitui a submissão do formulário */
function saveInfo() {
	$('#stepsAndReps').modal('hide');
	var to = document.querySelector("#stepsAndReps").getAttribute("to");
	var text = "";
	var info1 = $("#inputInfo1").val(), info2 = $("#inputInfo2").val();
	if (Number(info1) && info2) {
		text += Number(info1);
		if (Number(info1) == 1)
			text += $("#inputInfo1").attr("data-name");
		else
			text += $("#inputInfo1").attr("data-names");
		text += " "+$("#stepsAndReps").attr("data-connector")+" "+info2+" ";
		if (Number(info2) == 1)
			text += $("#inputInfo2").attr("data-name");
		else
			text += $("#inputInfo2").attr("data-names");
		text += ".";
	}
	$("#"+to).find("p").text(text);
	$('#stepsAndReps').on('hidden.bs.modal', function (e) {
		$("#stepsAndReps").find("#inputInfo1").val(0);
		$("#stepsAndReps").find("#inputInfo2").val("");
	});
	
	checkHeight();
}

/* Altera o tamanho que determinado exercício ocupa na folha */
function reSize(a, b, id) {
	var classes = document.querySelector("#"+id).parentElement.className;
	var search = /col-(\w{2})-(\d+)/g;
	// Inicialmente implementei a alternância do prefixo, mas depois vi que no grid não altera praticamente nada, por esse motivo a função só está sendo chamada com a == "columns"
	if (a == "prefix") {
		var toReplace = "col-"+b+"-$2";
	} else if (a == "columns") {
		var toReplace = "col-$1-"+b;
	}
	document.querySelector("#"+id).parentElement.className = classes.replace(search, toReplace);
	setTimeout(function(){document.querySelector("#"+id).scrollIntoView()},500);
	
	checkHeight();
}

/* Exclui determinado exercício do preview */
function remove(id) {
	$("#"+id).parent().remove();
	
	checkHeight();
}

/* Função dedicada a organizar os itens em diversas folhas, passando itens para uma folha a diante, precente e excluindo folhas vazias */
var myIndex = Number($("#loading").css('z-index')); // Existe um delay de 401ms pois as transições de CSS duram 400ms por padrão, com isso achei mais agradável ativar uma tela de loading nesse período
function checkHeight(l = true) {
	myIndex += 100;
	$("#loading").css('z-index', myIndex);
	setTimeout(function() {
		for (var i = 0, iItens = $("section"); i < iItens.length; i++) {
			var maxHeight = $(iItens[i]).height();
			var theHeight = 0;
			for (var j = 0, jItens = $(iItens[i]).children(); j < jItens.length; j++) {
				theHeight += $(jItens[j]).outerHeight();
			}
			if (theHeight > maxHeight) {
				var last = jItens[j-1].lastChild;
				if (!iItens[i+1]) {
					var section = document.createElement("section");
					var div = document.createElement("div");
					section.appendChild(div);
					iItens[i].after(section);
				}
				var next = (function(){
					if (iItens[i+1])
						return iItens[i+1].childNodes[0];
					else
						return div;
				})();
				$(next).prepend($(last));
			} else if (theHeight < maxHeight && iItens[i+1]) {
				var first = iItens[i+1].firstChild.firstChild;
				if ($(first).height() + theHeight < maxHeight) {
					$(jItens[j-1]).append($(first));

					checkHeight(false);
				}
			} else if (i && theHeight == 0) {
				iItens[i].remove();
			}
		}
		myIndex -= 100;
		$("#loading").css('z-index', myIndex);
	}, 401);
}

/* Função que recarrega os resultados */
function loadResults() {
	
	while (document.querySelector("#results").hasChildNodes()) {
		document.querySelector("#results").removeChild(document.querySelector("#results").firstChild);
	}
	
	var cond = {
		text: undefined,
		style: undefined,
		group: undefined,
		equipment: undefined
	};
	
	if (document.querySelector("#input-text").value != "" && document.querySelector("#input-text").value.length >= 3) {
		$("#tab-style > li, #treino, #cardio").removeClass("active");
		$('.selectpicker').selectpicker('deselectAll');
		cond.text = document.querySelector("#input-text").value;
	} else {
		if (!$("#tab-style > li.active").length) document.querySelector("#tab-style > li > a").click();
		
		for (var i = 0, iChilds = $("#tab-style").children(); i < iChilds.length; i++)
			if ($(iChilds[i]).hasClass("active"))
				cond.style = iChilds[i].textContent;

		if (cond.style == "Treino") {
			for (var i = 0, iItens = $("#select-groups").children(); i < iItens.length; i++)
				if (iItens[i].selected) {
					if (cond.group == undefined)
						cond.group = [];
					cond.group.push(iItens[i].text);
				}
			for (var i = 0, iItens = $("#select-equipments").children(); i < iItens.length; i++)
				if (iItens[i].selected) {
					if (cond.equipment == undefined)
						cond.equipment = [];
					cond.equipment.push(iItens[i].text);
				}
		}
	}
	
	function compareArrayString(myArray, myString) {
		for (var i = 0; i < myArray.length; i++) {
			if (myArray[i] == myString) {
				return true;
			}
		}
		return false;
	}
	for (var i = 0; i < bd.length; i++) {
		if ((cond.text == undefined || bd[i].name.search(new RegExp(cond.text, "ig")) != -1) && (cond.style == undefined || cond.style == bd[i].style) && (cond.group == undefined || compareArrayString(cond.group, bd[i].group)) && (cond.equipment == undefined || compareArrayString(cond.equipment, bd[i].equipment))) {
			
			var thumbnail = document.createElement("div");
			thumbnail.classList.add("thumbnail");

			var img = document.createElement("img");
			img.src = bd[i].img;
			img.setAttribute("alt", bd[i].name);
			thumbnail.appendChild(img);

			var caption = document.createElement("div");
			caption.classList.add("caption");

			var add = document.createElement("button");
			add.innerHTML = "<i class='fa fa-plus' aria-hidden='true'></i>";
			add.style.float = "right";
			add.setAttribute("type", "button");
			add.classList.add("btn");
			add.classList.add("btn-sm");
			add.classList.add("btn-success");
			add.setAttribute("onclick", "addExe('"+i+"')");
			caption.appendChild(add);

			var title = document.createElement("h4");
			title.innerHTML = (function (){if (bd[i].name.search(new RegExp(cond.text, "ig")) != -1) return bd[i].name.replace(new RegExp("(^|)("+cond.text+")(|$)", "ig"), "$1<b>$2</b>$3"); else return bd[i].name;})();
			caption.appendChild(title);

			thumbnail.appendChild(caption);
			document.querySelector("#results").appendChild(thumbnail);
		}
	}
}

/* Faz download (abre uma nova aba com o conteúdo e manda imprimir) */
var newWindow;
$(".downloadPages").click(function() {
	/*var doc = new jsPDF();
	
	var specialElementHandlers = {
		'#editor': function (element, renderer) {
			return true;
		}
	};
	doc.fromHTML($('section > div').get(0), 0, 0, {
        'width': 200,
            'elementHandlers': specialElementHandlers
    }, function(a){console.log(a)});
    doc.save();
	// doc.output("save");*/
	var source = "";
	source += '<html><head><meta name="viewport" content="width=device-width, initial-scale=1">';
	for (var i = 0, iItens = $("link[rel~='stylesheet']"); i < iItens.length; i++) {
		source += "<link rel='stylesheet' type='text/css' href='"+iItens[i].href+"'>";
	}
	source += "<link rel='stylesheet' type='text/css' href='http://codepen.io/Alynva/pen/LRobKb.css'>";
	source += "</head><body p><h1>"+$("#theTitle").val()+"</h1><section>";
	for (var i = 0, iItens = $("section"); i < iItens.length; i++)
		source += $(iItens[i]).html();
	source += "</section></body></html>";
	if (!newWindow || newWindow.closed)
		newWindow = window.open('','printwindow');
	else
		newWindow.focus()
	newWindow.document.body.innerHTML = "";
	newWindow.document.write(source);
	$(newWindow.document).ready(function(){newWindow.print()});
});


/* Objetos que são recebidos do PHP */
function Exercicio() {
	this.name;
	this.img;
	this.style;
	this.group;
	this.equipment;
	this.steps;
	this.reps;
}
var bd = bd || [];
console.log("sem");
console.log(bd);

loadResults();

