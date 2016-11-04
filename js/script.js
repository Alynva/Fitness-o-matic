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
var bd = [];
var myExercicio;

myExercicio = new Exercicio();
myExercicio.name = "Crunches na polia alta";
myExercicio.img = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QBoRXhpZgAASUkqAAgAAAAEABoBBQABAAAAPgAAABsBBQABAAAARgAAACgBAwABAAAAAgALWDEBAgASAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAAAUGFpbnQuTkVUIHYzLjUuMTEA/9sAQwAKBwcIBwYKCAgICwoKCw4YEA4NDQ4dFRYRGCMfJSQiHyIhJis3LyYpNCkhIjBBMTQ5Oz4+PiUuRElDPEg3PT47/9sAQwEKCwsODQ4cEBAcOygiKDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7/8AAEQgCOgQEAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A9mooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApKWkoAjleOJDJLJsUdSzYFeNeNPG+sa1r/APY/hq6uowmVY2zHJZXYHlDnpit34o+Nf7Otv7HsJM3M6sjbWIKEbSOox39aT4XeCfsEH9taiu66uGLrvUZ2uqnqCe9AHdaBYXOm6TFbXl1JdTKTulkkZyeeOW5rUpKWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopKACuQ8d+N7XwvpzBJle8dTsRWUkEFc5Un0NWvGPi2z8MaVJLK6+c4KRryPmKkjkA+leU+GtA1P4jeIG1bVN32JXDBHw4wwI9Qf4aANT4c6Jq+s6/L4hvl8uM70AeNlJztYHpj+KvZ6q2FjBp1oltbRqkaKBheOgx/SrdABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUlABXM+NfFEHhrRXmZt0smY1HXkqxHcelbWp6lb6VZPd3MipGmM7mx1IFeFvJqXxM8XhdrG0g2sfkBHyuAfmUDs9AF7wD4au/F2vv4h1XmNHSRV3HHIYHhgf7vrXt0MaQwpEi4VFCgewqrpGlwaPp8VlbLiOJcD5ie5Pf61foAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKSmu4RdzNgDqaAHVzfiLxrpnh2NvtEjGQdlUHvj1FYvjT4mafoVu8FjcR3F1tIHlSKShwCDg/WvLPD2kX3xF8TyXN42+J5XLEpgDILY+XFAGjpNhq3xL8SLdXnyWse1yAzKMKwB4O4Zwa9y0rS7XR7CKztU2pGuM7Rk49cCmaNotlodktrYxeXGMnG5jyevUmtKgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEpruEjLv0AyadXm/xO8applg+kWTebdXCtEwTDfeTjvnvQBzHxG8W3Ov6s3hvSmY/M0cmGKco27vgfw16N4H8JW/hrS1URr9ofJaTau7BwcZH0rmPhX4Na0i/tzUBunnxLGDngMpByCPevUKAFooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiikoAWkpGYKMk4FcV4t+I+leH4Hiik+03LDankMjgMVJGfmB60AdTqeqWmkWj3d5J5cSck7Se+O31rx3xP8TNQ8QXn9l+HmZVP/AC0jkaM9SMc49RWSln4n+JerM7r9nt9xw8sbxjBGeoBH8Net+FvBem+EbBnVd0oUs7Ftw6DOMgelAHi/ibwZeaBo0V/q0kj3V1uB3sr4K9PmBPbFel/B3Qzp3h5rqWNQ11sljbgnBQVjPM/j/wCIGxF3abYSxyL2JBVQ3zDIPIr1q2t47W2it41xHCgVfoBigCeiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKSiq1/fQ6dZS3czYjjGTQBkeLvE9r4Y0priZl3nAClsdcjPQ+leUeBPD174z18a/qm54kKSAuud5RgCMgj+7VbU7i/+JXi9rWFtttFuUBWKghHJBIORnDV7ho2j2miWCWdoiqiZ6KAeST2HvQBbhgjt4UhiXbHGoCj0AqaiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKSgAqnqWq2ek2zXN5MsMaqTlvasPxZ420/wvalp2zKeFG3cMkHGcH2ryGbUPEfxN1jy4W8m33DckUzIuCMdCSP4aANfxZ8Vb/Urp9O8Pxsm0kCWKUNvwx5wV7ip/CPwouLq5TUNfZshgfJli9GHcN3Fdl4R+HOmeH7dJJoVuLkgFzMqPtYrhgDj1rtVAXgUAVbDTrTTLZbezhWKNFAAXPauI+J/i59Js00uzb/AEy4ZejYOxtw6EH0rstb1SLRtJnv5vuQgE9+pA6fjXkfg6xuPHXi6bWNR+e2g3xIN2fusGXhs/3qAO5+G3hceHvD0TzL/pcoYSkrg8OxHc9jXZ0iqFXAGB6U6gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKSgBrusaF3baoGST2FeL/EvxRP4g1JPDukN5wLNHL5SiTdkKRjGT2NdR8TvGi6Jp/9n2b7rydhGVVipCsrDOcY6+9ZHwt8Fvg69qo8yabbJEXwx/iB5BzQB1fw98KReGtCRSv7+fErdeCUUEc/SuvpqqFGBTqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApKKw/EXizS/Ddt5l9ceWeMDax6nHYGgDUuru3s4GmuZo4Y1BJZ2CjA68mvMPGnxVEUjad4f/fXByBJFslGQR2Ge2a5jUfFHiX4hagtlpSyRQOwDrFOMbT8p4bFdx4N+Fdjo+y81NVu7k8sk0anYSpBGQT60Ach4X+G2p+Jbz+09fRokOf3csbRseQc8Aepr2bTNKtdGs1tbONljTou4nuT3+tXURI1CIu0DoBTqAAUjMFBYnAHU0tc3448QR+H/DtxO7YklieOLr9/YxHQGgDzz4ma1P4k1uHwzprb/meObYofptYdMkfdr0zwnocWg6JFaRrgtiR+v3ioB6/SvPfhZ4fk1LUJ/E2oLukkdZYi+G6qwPOc1670oAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi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igAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkpaazBRknAoA4r4n+JE0LwzIiN+8ut0ON2PvI3tXIfBLRxPLf6ncfPIjQshK88hwa5n4k+IX8T+Jksrb5oMoFHI+bkepHevXPhtoJ0TwzCJP8AWzIu/wCoLe3vQB19LUM1zDB/rZFT/ebFP3pt3blx60AOrwL4teJW1rWYtJtm3QqyMMN/F8y9CP8Aar2HX/E9hothLNJMpKY4XB7getfPXhqFdd8ZRG4aRwJQ4/CRfXPrQB7X8LdC/sfwtDK67ZbhBv8Al54Zsdz6121RwQx28SwxLtVegqSgDyz426vNa6Pb2sXAllKPz2KGqHwT8Oxqk+rzcyIymL5ezKwPOfetb40aXHdeH4rn5t8Ls/GMcIfaovgtq4u9JntGVVaHYq4XGcKetAHqNLSUtACV89fFC+f/AIWIk0kfliMwPndnoBX0LXzV8Vbh5/GM+5VX5Ivu/wC7QB7z4Pvob/wxYSxyb8wgn8a3a+efhv8AEGTQLlbC9O60kwM7SSgCt05A6mvfrS7ivIEmhbcrgEfiM0AWKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApKWkoARmA614r8UvGz6jOmhaZIHDuuSm192QykdM966/4k+NV8O6abe3b/S5MFcbgeGAPIFcJ8MfBsut6gNZ1NfMiXlN+1vmV1I6nNAHXfCrwYNG07+0LqFhcTqrANuBQjcOhOO9elVHGiRxhEVVUdAOlSUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUlABXmHxP8fx6bbnS7CRXuH6ujK2wq+CCD9K2fiD46g8Mae8Ebf6ZKrKo+YYOARgge9cP4O8B3fiu/bX9cLNDcMZVV2WQMHG4dTnqaALPwv+Hr+eus6nGwZW+RGVlIYMpB6j0r2Wo4YI7eMRQxqijsq4FSUAcZ8QvCE3iazD21zHbyxbTudSeFJPb615Pf8AxB8SfZhocN550hymUhQ79/YcZ716j8VPEsmheH9ltIyXEjr91iDtO4HkfSuA+E/hIazqH9r36+bHHtkj37WyVbHc57UAZVx8PNdvNBfXb2RkbariN7cqx3ken1qT4OJEPGcwmXOLU4+bHPmJXveqacl7pL2CDYjbQAvYAg/0r558K3f/AAiPjk/bvkEv7v14Min+HP8AdoA+laKhtriG6gSeFt0b9D0qegDO1vS4tZ0m6sJek8Lxg88blI7fWvEok1D4VeJ9zpI9hK7nKx4DAAqvzMD/AHq99rJ1zw7p3iC28m+tYpD0DvGGI5B4z9KAEsvE+jXltHImpWpLgcecDye1aqMHXcrZB6GvFPHvgm98MW0WpaPfXBhEqgxKwRRwxJ4P+zXXfDzxzZ6podrb3lw32xQd4KsxyWbHOPSgDv6+fPivYtb+OBLKrfZ2MILcgdOea+gVZXUMOh5Fea/GnS45/D0N0kCmVJSWfjOAjd6AOb1T4d2es+DrHVNBjzcCHdJGjPI0hLADAyQMDNYOg+MPEvgy6FteRzR2+7mN4VXqQM5Iz/DXbfBPXJLuxurCVsiDy0TLE9mP9K77VPCeiawp+16bavJ/z0aFSe/qPegClp3xA8OX9ily2qWsDvn90867hgketWH8ceGo5ER9aslLrkfv1/xrlLn4L6ZNOzwalNbIf+WcUKgDioLj4J2UkWP7YuGkHCkxrnH50Aej2WoWeoxebZ3UVxH6xsGH6VbrxT+xPGngQ+dZtNeWS9UkulUerHaD/s10HhX4s22o3LWWsRrZzjAUJvfcSCTyAemKAPSqWo4nWWNJUOVdQQfY81JQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFJQAVxPxA8dR+FrRBAyvcSbhjaG2kAEZGR60eNPiHp/hyBoY5FmuSPuCTaRnI9D6V4ZLqF/4x8SQLdyNI1xKq4bBxwF7Y9KANjStP1P4ieJvOuV2xOzknaygZBbtmvofTrCDTrRbe3Xao/nWP4P8NWegaNapDCqSvEhlIzy23B6k10dABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFACVieKfEFt4d0d7qduvyKBjOSDjgkelbdeJ/EbVJfE/iu30KzfzbZESR1Xkbg7A9ge/rQBR8H+Hb7x14kbXdR+WAOkmPmXcB8p28Efw+te6WltFZ20VtCu2OFAi/QDFUtA0a30LS4rG2TYkeeme7E9z71qUAJRRUdw5jgd16igDwD4q6rPrfi2KyiVlSOIRkFe4kcZ4z617F4I0U6F4ZtrN1XzE352+7sfQeteKadPHq3xIuW1Cby0iaUAvzwJCR0xXsuseO/D+nafcSrqcLTxxkxx7iC5AyB0pdQNTVvEGnaNDvu7hFP93eobrjoSK8y8Z2OjeOI3udH3Lewr5hLMApRQ3A27ucsK4W5m1b4ieKmhSSR45HfyvlDbF5bHGM9K908NeB9I8PWqpDbKZiPnkG4dccYyfSmB5H4H8e6h4W1BNI1JWFvkK37v5gBuPViP71e82N5Df2kVzAyukiBxtYHqM84ryv4qfD77QkuuaeuJE3STIqEluFA5J/pWD8PfiRcaJL/AGVqe54QxwzyBQmAAFwFPpQB73RUcMsc0YeJt6nuKloAguLeO6haGZcoykH8eK+e/idolv4d8Qq9g0iCR+nmeir6fWvoqvFvjpYiKbT7sNu813JH0VBQB6b4Nl83wlpTbtx+xwZP/bNam8SaTHrGhXdo/V4XC/7xUgfzqj4BuIJ/B+m+Tt+S1hRsHuI1rpD92gD5v8K30ngvx+1nM2II5mEp+iNjk49a+ibS6ivLdJ4ZFdXUHKsD1Ge1fOfxWsZLbxfcSGPas8rlT6gYr23wBD5HheBfO83ODnbjGUXigDp6SlooAayq64Zcj0Ncd468E23iHS3e2VY7yMHyirbRklc5wCegrs6SgDyLwJ47n0m8fw7rkciPGzeW/lgAquEHLEHqrdq9dFeV/FrwsPLi16yjxcRskZ2rzjczE5Jx39K7XwXrg8QeGra+8ze8m/Pfo7D0HpQB0FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFJRUNxdW9nH5tzcRwxjq0jBR+ZoAldgilj0HNeZ/EL4mJo8b6fprbrk5BLKw2kEHggisLx38T5L9m0rRPnEnykoqyB8gjAxk55qn4A+G0+qXP8AaesxtHGGDeW6vGxyGzjge1AGR4c8Iar40mm1K9mkMQ38tNk5GGx82ePmpPAmliXx9Asaq0cE0Lnp0ODXr/jLWbfwn4Z2QN8zssSpuBOCCM8/Ssr4UeGP7O0VNVuVxdXakPnIPyuwHB9qAPQ1AUADtxTqSigBaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApKWkoAwfGesnQvC95fo2JIVUjr3dR2+teXfCOwTWNfutXumaVyZAN/wAwHKnvz3rV+OGriCytbBefPR89OzIa3vhNYJa+F/MHV5j690WgDvKWkpaAEprqGQhulOqpql7HYadNdSfcjXJ5A7+9AHhGneEk8SePL+2S4mtl3zMXhYK2Q/8A9euk/wCFLGXUj5+pXklqGGHeZSx9cgim/C+2uLzxjqGsCNltvPnjyynqSCOenQ17BQBz3h3wbpPhuNfskKvKFH714139MfeAHWuhrA8Vx662ms+iXEcUi4+Vod5Y7h2we1cF8P8A4jXbX50fxB8kxyVZ1WMEllCgZwfWgD1eaKKeIxyxq8bdVdcg/WvnH4i6LbWXiOWTSt2wsxf5QuHLtkDAFe/67aXt/pM9tYTRxyyJgM65GeKy/C3g6HQ9NuLe4ZZZbqczSlGONxAB6/SgDiPhV4+kuY00XUH3Ff8AVyHczEs/Qkn3r15SGXI6GvAPHPw0vNBu/t+jW8k1urAhI43kKYXJJODxkVteBPil9ijj0fXFaMxqI1d9kaoADndnHpQB7NXmnxqtkm0C3kK8xLKR+S12i+K/DzReYNc07pnH2uPP868k+KHiufW4zbWVrM9lBu/0kRho3BC9GHHBoA7v4Uf8imnzZ4j/APRa129cN8JlVfCaY77M/wDfta7mgDxr45aWgawvU3bgshbp3KCmeDfinpui+G/s14zeesvAEbMNu1QOfwr03xZoMfiLQbiwfrIoAPPZge30r5+0ayttA8Xm11u3kEXIUFjH/HhWycccUAey6L8UtC1VoYd0wnlbaAIWxknFdpFIJY1kX7rqCPxrM07SNLhiSSy+eP8AhdZNw6+ua1QMDHYUAOpKKp/2pZ/bPsbXMKz7sCMyDcT7LnNADdXsYdR06WCZdy7Se3UD3rzD4PXk9pqN7okrZW3iUqNxP3mz9O9eszf6l/8AdNeTeA12fEvWl/6ZQfyWgD12lpKWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopKKAFpKbvX+FlJ/3qwPFHi2w8M2BnuGy54VUwTk5xxkelAF3XNesdAsHur6bygqkjKk5x9Aa8K8W/EHU/FN9LZaa0iW+4hQkxw4DZBwQO1Z2qatrXxB13EXypIygBdyqMgLzyfSvWfAnw2tNCtYrq8Xzbp1BI3BlBK4PUA9aAOa8K/Cq6tbJr28h3XW0+XGyqcMDlWDA1qQ+FfHC6gjjWL2C23f6pZEKgY/3q9QUBflFYfjLW10Lw7c3m7EiKCo/4EB6+9AHl3jG7l8U+LrLQ7eRpFgt0Mx/20dg3Bx612viq+17w/a20Oh6b9pgjcliJ1j4Iz39zXP8Awk0N7q7u/ENyu55J5FXd6EKw4I9/WvV2RXHzKrfVc0AeZW3xXubNQmuaStmBwZPtBf2/hB712lv4t0K4sxeJfL5XI3+W3Ude1Y3izwEviQlP3ccZ/uttPXPoax9O+DllAy/adQv9obO1LkY6+m2gDrofG/hy5k8qPUlZvTyn/wAK24Zo54w8bblPINcJqPwj0W6VTDdX8bpnG2cL1x1wtZK/D7xJo7edpGoLLt6C5uWYY+gA9KAPVaK8o/4TXxf4flRNYs7WSAMNxtoXY46nqR2rs/D/AI20rXo08ppIZdoysyhOcZPGTQB0tFNBDDI5p1ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFNZsLmnVXvZfJsbiX+5EzfkM0AeA/Ea+/tfxz9hf547eWRcH3AP9K9q8J2MdhoMMUS7VOHwPUqK8H1HzNT8fXbW21pZbhj83Tp7Zr6F0eGSHS7dJNu8RrnH+6KnqBepaSiqAKwfGskUfhO+85tqFBz/wACFb1cD8QILvW73T9CtlYQ3XmJO/IxjaRyM+npQBseBdOgsNC/cqoE0vm5C46ov+FdNVHTLOPS9Lt7bdgRRKpLN3Cgf0rzv4j/ABI/sxm0zS2SSc/Kx27hyoIwQfegDqNf8TS6fr9lp1nH50s6OfL3Fen4Yrzb4l+Hv7A1+x16BdkRlhUgYA3fMx75/hrovhd4eup3bxDqcjPNKfNiDMSAHU54I9/Wtr4raWdT8I7U25gm838BG/8AjQB0PhnVF1jQLS+X/lspJ6+pHf6VrVwnwjuBL4Oto/m3RoM592au8oAimhjniaORFdHGCD3Fcbrnwu0HV3MkcMNrI2SWSLJOTn1rt6gubiO1gaaThUxn8TigDibP4VaVbPue4WZNuNjQjH86zviZpNjo/hDyLK3jhTypB8i49D/Wu60bXbLXInls2YqjlDux1GM9CfWuQ+MX/Isf8Ak/9loAd8HLkT+FXX/nm6p+SLXoNee/ByKNPCrlOrOpP12LXoVACV5v8TfAKa1bf2np0apeRYzsUA7RuJOSR3NekUjKrqVPIPBoA8m+EvjKWdW0bUpmMseBHvYkkszHsMd69aryv4ieDfsTJ4g0bck0DGWZVbAIVQBgKPauw8D64ut+HLZirCWCKOObeuPm2DPegDpK8X8e6jd6d8QLGWzkZH82T7rYz8q17RXhPxHlF18QLa3T78csgP4qtAHtMEzyaJFNJ997cMfqVzXlfwjhlvfEWpalKzMZIk5Pscf0rvdWeSDwZCUb5vIQf+OVxPwPZDZTjd8/lc/99tUgetUtJS1QBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUlLSUAFFFcz4z8X2vhTTDNK376RW8ldpIZgAcZHTrQBf1zxLpnh+28y9u4YjxhXkwTk4rzeX4o6t4kvVsfD1jNCWYBnTbIADwTyPU1xKLr3xI1+VFmkeJ3crG052qMlgAGPaus1TVND+HenvYaXHHNqLqQZnt9rgMCVIYAdDigDX1TxUfCWls9/fLdalIuTGuEYMCAeMEdGrzm3s9f+Ims+Y6yPF08zygQoBzt+XH96pdG0DUvGd8+p6rcTfYw2ZJDJvKBgegJJ5Ir1DQ/E/gbw3bLaW02yQfecWhUk4AOSB7UAbvhPwVp3heyRIY1a4/ilVm5+YkcEn1rpqz9K1qx1q3FxYyNJGehKle5Hf6Vn+JfF2meGbffeTMr8EDy2PGcdhQBr3N5b2aq1xMseTgbmxk15B8TNXk8Sa5Y6DZPkFpFcLhuyke/aqtr4l1TxVeXepzSNFY2luZkjSViu9P9kn0q18NtLPiLxXd69cLvjhlV0BwRhlYd+e1AHqXhvS00nRLe2RdvyKW6/e2gHr9K16aBtGBTqACiiigApKKoavq9potp9qvJNke4LnaTyenSgC3NDHPG0ci7kYYIrgvFfw2s7wPf6Kq2d/18z5pNxJ+Y4Jx0zXc2V3He2iTxcq+cduhxVigDyfwl8Q7/AE+/Gi+KFaKX+GWbbGDllAG0Ae9eqQzRzwrJFIro3Rh0Ncv4t8Daf4itmlSFbe9T5kmijUOSAdoyRnqa4DSPF+seAtW/snxBI01qWCCSWVpWQAEnABP94UAe2UVnaPrFnrVkt1ZuzocdVI5IB7/WtGgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKwvGF8tl4W1GTzNhNrKFPvsat2vPfi5dTw6Ha26fLFcT+VK4Y5CFWBoA4v4U6Kms6/LqtzCz+W4JPI+8rDtivc1UKoVeg4Fc18P9IsdN8LWT2ar+/gUtJ5YVnPPJx9a6epsAUh9qWiqAyNU8UaNo3F9qFvC3o8gHbNc/qHxR8NWcPnQ3lvdN/dScZ7Vd8V+BrDxPGvnN5ThgdyRrnABHf61z9r8E9EhkV3vJpcfwvGhB/SgDltV+IHinxZKbbw/a3EcO7B2RpKOCfVfQitHwl8In+2JqOuN5hVg3lOjIeD7EdhXpmleHdK0eIJZ6faxkfxpCqk8Adh7VV8UeLbDwxYPNcyfvdp8tdpIZgM9qALOo6npvhfSFMskcMECqqIz44yAOTXi3ir4o6vrm+20zzIbXb8yhUcEYIPO3PeqV/q2vfEfWmt7eSRbYuwESzkLjlh8rHHau91bwNpvhvwXKIbeOa4+YtM8K7+UY4yB7UAa/wAJreNPBtrOq/PKnzH1wzV3VeZfBXVDd6FLZMeLREA692c16ZQAVzPxBvI7LwZfTSMoA8vrx/y0UV01Z+saTa63p0theRq8UuMhlDdCD0P0oA474QacLfw1LcPGySSXUmM5+6Qpp/xdjkfwrIyKzBIn3Edvu12en2EGm2q21tGqRrzhVAH5CsvxtZ/b/COowhVLtAwGcf1oA474H3Eknh67R5M4uMAcdkWvUa8M+D2oGw8R3GkPIwzLISvOOFx9O1e5UALRRRQBHLEk0TRSLlXGCPaqun6TY6WJfscPl+e++T5idzevJq9SUAI5AQk9MV89a8kl58X51t/3h+1HG3n+CvavF2rro3h66uf4jE6r1+9sYjp9K8v+Eth/b+vahrl8qvLG8bgvhuocHrz2oA9WubL7V4bSCXqLcZz6ha8o+C0v2fW7+13cCJMD6tmvZ7gf6JKo/uEfpXhfw+L6V4/ntW6yNAh/Eg1IHvVLSUtUAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFJQBHNJ5ULydkUn8q8D8QWl/468a3Df6uwjdD5sqlVwUUE7hkdVr3LVbm3tdOle6mWGPaQWbnsa8I17xV58jaJ4Yh+V/3bTRSf64EAj5SOMEnvQBc1bxZa+FdPGg+HlaS4VVE0vyyKXThipBzg7awdL8PrZn+1NdbaI/nSDcUlZlOfunGc44qexttJ8NL9u1ny7y8k+f7LKpQ88H5hnoa6bwv4V1LxtqSarrW6O0jIZInUOGZWAxkEdRQBj/AGfXfHlzFYWNrJa6dHkRNcQsvynnllB/u16Do3wk0Oytgt4sjzH7xSY4zgZ7V29hptpplusFnCsMagDC+1WqAMTRvCumaC7vYrIpfGd8melY3i/4eWniu9iuZmwY1I/1hXqc9ga7J3WOMu7YA6msKXxloyXb20d5HJKhIZOQQR1HSgDgfiK1to2l2XhjSvleW6VWDfMdrqw+vf0rt/AWhronhm1h27ZGiHmdeoJ9frXmugCXx98Qm1KWP/R7dEkA+8Mo6j2r25EVFCLwB0oAfRRRQAUlLUbyLFGXc4VQST7CgDP1zXrLw/pz3l5IAqDITcAzcgcZPvXkV6da+J+uKsMMkGnR8B5oSoJViR8wBHIatzWLef4g+LPsCSMum6e5SU7dyuHUEcfKRylejaTpVppFklrZwrEiqM47kADPX2oAdpenxaXYRWcP+rjzjLZ6kn+tWpX2RlqdSMoYYNAHK+FfHeneJpJbeLdFcR7spLtBwCB0BJ71s6xodlrto1reozIVwdrYPOO/4V4taIPCXxSWH/VidEX0zvkU+/pXvStlc0AeCanp2r/DnxG01nG0tlJlgVjZwoZiACSAM4Wva9I1mz1myS5tZldWzwGBPBx2Jp+p6XaataNbXkKzRns3qK8p067l+HHi/wDsyRt2nTvHFG/3FGcMxxye9AHslFQ21zHdW6XELb45FDKfY1NQAtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFeY/GmKd9GsGSN3iW7Bk2KTtUI2T7V6dVHVNLtdXsJbO7jWSORCvPuMUAYvgG9sZ/CGmxW1xG7RwKGXzAWHXqAa6evK9R+H+veH99x4V1aZAefs0MAHTgDcWPTJqvZ+PvF2iP8AZtW8OzXLjnc90q8dOgU+lAHrlGa81f4rX7x/6N4ZaV/QXgH/ALJWTcfEvxS0uU8NzRj0+1qf/ZaAPXpHSNdzsqj1NZOoeKdG02NmuNQt8j+FZkz27E+9eO3viT4ga2y21tb3UO9sYWRG4PHoPWrWm/CjXdckWfXNQkhzyQ8AbrnPRh6CgDe1/wCMVlHm20m3uZZ/74jR17jsxrl/DvgjWvG2pDVNbXy4CylkdXjLAHaQOMdFr0bRvhf4f0va0trDcyL/ABGMr2HufSuwhhjgjEcS7EHQCgCjomh2ehWCWtpHtRFAyzZPAx1qzqNst5p9xbn/AJaRMv5girVJQB8/6DdN4K+Jb2Mm5LeSZAxPTAQnqcf3q97t50uLeOaM5SRAy/QiuB+IXw7XxAf7S09/KvY9zELHuMpO0DkkYxiuV0P4jat4Uvl0jX7eRo4lKq0swHC/KOAp/u+tAHttVL/U7PTYDNeXEcKDu8gXqcdyK4m91TxJqAN/oDTXlq/3PLZVGRwevvWDqPhfxj4yZIdWkuLK253RuquD3HQjoRQB6lp2pW+qW32m2bdHuK5yD0+lT3lsl3aSW7/dkXBqpoekQaJpqWcCqqLydq4ycAE9far7ukaF3bAHU0AfN2uR3/gfxzcXkS7fMlmaIlSRtLMB1xX0Bomu2eu2C3dpIrKWIxuBPBx2JrG8VeD9M8aWn+sVJkwom8ssVAOcYyK8j0DW9X+Hmvpp940i2+5d0bMFGCwLdA3agD6IpaztG1e21rT47y2ZWDqCQDnGa0aACkormfG3iqHwxoz3O7dP8u2PdjILAHnBoA87+LfiJtT1O38O2fz/AL1HyFBHzBl6g5/ir0H4faD/AGF4XtonXbO6DzevUFvX615x8N9AOsaz/bWtzb5P+WSyrn5g6kcg17eoCjA6UAJL/qn/AN014/4WtRL8VtTb/nktu36LXr0x2wOx7KTXl/w+jGo+N9W1WKT93JBDgfTA/pQB6pS0lLQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUlMlljiXfJIqL6s2BQA+obm5itYGmmbai9fzrMuPFmgQRuW1iyJRSdv2hcnH41438SfHl3rEj2FruSzORnapEgBUghse1AFf4k+PJdc1D7HYzSR2yYDY3KSwLA98d6t/D/RDeWzCyt1eV1AaS4XBT5mwVOKzPhv4FPia++03cZ+yR56qwBYFT1GPWvoPT7C30y1S1tU2RJnC7iepz3+tAHJad8NNKgk+1X7TXNw/wAzJLsdUJ6hcr0zXZQwQ28flwQxxL6IoA/IVNSUAFIzAdahubq3sbdp7maOGJOru2APxryfxV8RtQ1e+/sfwxHJI2PnkiVZRgFgegPqKAPQPEWp6Z9keyubySEzKV3W7DIyPWvOdWvPDHhTSrg2N1eXV9O4k33Kq/U4PIANYkfwi1/UrvzLu5WMuw3M8DD27CuY8VeDdS8LXbR3MbPFziYRsFxnA5PrQB7B8HtEfT9B+1zLiWRnQ/TcDXpFeR/D/wCKNiLJNP1WRYZASfNkkRF5IAHaum1j4n6Bpm0Q3lvdl88w3CHGMdfzoA7WivDNS+M+pyb1sY5IhuwGaNGH8q9E+HOr3+ueGLe/v5N7ybudoHR2HYD0oA6+q15b/aoGh3MofIJXjgjFWqKAM/TtJtNMj228fJA3OQNz9epA561fpaKACkpaSgDxr4raSbXxVp2tJ/HcW8X5bj6e1er6NMbjSbeVurr/AFNch8XLH7T4ctp16214s3/fKPWx4B1BdS8HafPuy7RZI4yPmPpQB0tcH8T/AAm+v6P9qtfluLTdKCGC8heOcZrvKKAPMvhj4vRol8PX7Mt5b4hT5TzsUk5JPtXpteN/EnwxcaLq3/CU6bG3BZ5sKW+Z229+B96u+8HeK7XxLpqvEy+amQybgTgbQTgfWpA6alpKWqAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooASq8tjaTtumtoZD6vGDVmigCoNM09fu2NsPpCv+FL/AGdY/wDPnb/9+1/wq1RQBXSxtI23JawqfVYwKnpaKACiiigAooooASvEvjhYiO/t7mKGNE8hQzBcHJdq9trkfiL4fGv+HHhDbXDqcnPQHPagDN+D2P8AhDrf99I/zScM2f4zXXa9q0eiaPNqEuNsW3g89WA/rXz94F8fTeE45YWhkmR0KoE28MTnvWpqN94w+Ikv2VLe4Sxk6F7bgD7w+ZR/s0Adn4o+JN/p+ix6rpVvbvA06wnzo2zkhieAw9K3vCHiA+NfDPmXP7mSRD5nk5XHzMOMk/3azNX8Iyj4ef2bJ++kifz/AJVPaMiuV+C+uyWt5caTcrjdsSMHAwSWP1oAuanc6r8ONee4E0l3p1wzyn7RI0jAsSFAAIGK0PFtponjrQp7vT/kubdHlBZVQnapABOCetejX1jb6hbGC5j3xtgkbiOn0rxnXvhVqWiTm/0GTKoAfKSNpG4Ge+e4oArfCvxTcaNrraJeyZSZwnzZOzarHjnAr3RZo2UMJFwefvV88aV4C8ReIr2aW5hms7iNh89xbsAxIOTjAHauutvAnjeSNYpNct0jHy4a07flQB3/AIj8V2Hh+wlnlk3uFJVUXdyBnsa8r02x1L4oeInur9mh0yN3QCNihZTll+Vtw9K7DSfhTpdlP9s1FVu5kwwZJHXke2cdK5nXvHuuT6xN4d8NW8yNau0IVYVlJ2EjjgnoKAGat41tNF8cQ21pDGliohztjwc5GeAQK9X0zX9P1WATW0nyn+/gdfxryO0+DeoXk32zVdQhC9XDxsnAOT0x2qz4y0HRdA8J/wDEmkjeaKI+ZJFMX53Ljgk46mgD1u/uY4tPmk3bhsI+XntXD/CWyjXSP7RRmzcKQRx2dhTPh451T4f3QeZZXE7fd9o19KPg7cD+wVs93+qDHH1djUgej0tJS1QBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFJS0lAEbzRxffbFeI/EXx1qGo6ydJ0O5kiEW5ZPLkZPmVznrj0pnxh1mdvEKWFtJIjwuc7cjOUQ9jXYfDrwPYWel2+qzrI93cIsp3tkZdAT1HvQBk2/wAHZVkinu9aunEbhnRlUgqDnB5rz3xpHCviVtLtVXZaO8Y2rjNfSl9IYtPuJFXJSJiB9BXiPh7RP+Ek+Jd7cXCskUdw28H5Tyjex9KkD1XwVokWiaBDEkagyYkJCgdVX0+ldHUUUYiiSNeigAfhUtUAUlFFAHkfxq8QT2tva6fbXDIJlcShGI6FSK0vhR4TtrPSTqc8avcyOcOyjO0qp6j3rz74sag+oeL3tuotZXUY99v+Fe5eFIfI8PWi7cZiU/8Ajq0AbNZms6Dp2t25hv7WGYccyxhsYOe9alJQB84/EnwQPCl4s9sc2shVFO1V+bBPQHParnwu8LaZ4n+2jUGVpI2j2ho93Xdnr9K9n8VeH7bxFos1pOuSFZoyvHz7WA7e9eB6TNceBfHSxScRQykP15wp9cf3qAPTvGXw30xvDjLptrDbzxkEvFGqkgA5qP4K6g0+gfYmbP2dCcfWRjXoNtNHqelxyjlJ4gfzH/168exL4C+IsrGOT+zp3iTKqTwFUnk4HU0Ae3UVlaT4h03WYw1ncKxP8BZd3TPQE1qUALRRRQAUlLRQBj+J7FNR8O3sLxq5EEhUH+9sYD+dedfB7V5LWe+0O8ZleExxxKzE9d5OMcCvW3QOhRuhGDXiHigP4M+JcGsFcW1zMzkLzwqKPYfxUAe40lVNNvo9R0+C7jbKyxq/buAcVboAqX9jb6jZva3UayxPjcrrkcEHoa8QQ3/w08YrH832S42r80mAN7gnhSeyV7yRmuc8ZeGoNf0SWJl/eR5kQ9DkKwHOD60AbOn3sV/ZR3MLZjk5HUd/erdeH/DnxJfaBrr6BftuUOsf3SSOGPUkete2o4kjV16MMj8am4ElFJS1QBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAlZfiGKWXSZUh+9WpSMoYEHvQB89fCnTdI1LVnt9Tt4ZnRVKrJHu5LjFe92Om2WnRLFZ2scKAYwigfyrw/4h+Gbzwt4hXVtJjkMO9NuMtgqoPOAOMio4/i/rX9lNYvCv2jaoU+Sexyc/NmgD2jV9f0jTo3h1G68oOuD+7ZuCD6A14B4k1Gx0Txa2p+G9QkeMyA7UjaIcKvqB3zXR6H8NNZ8TN9v1e6VI3zhRM6t2PQqfWq/jj4UvoWn/bbCTzIowzyh5CzYGOny0AeseCNdl1/w/DdTJtkCIGO4kklASTmud1/XPGOk3KeTpKz2+8ZZrtRkYyRjNXvhSU/4RNFVvmGwMPQ+WtdoyI/31U/VaAPJbj4uXmkyot5odvBvzkiYnOPoD6103hXxRf+J7/7XBD/AKCEKErJxvGD904PQ+ldBrnhuw12we1nhUK4xlMA9QeuPavE9W0zW/hlrX2q2ZXtn/3mGGY+wGcJQB7f4gmvItHuPsEPnXBQ7F3BecccmuT8C+CptO1G41zU4dl7cytMAdrbN45AYE+tbvg3xRB4q0aO8RWEhBLBlA6MQOAT6Vpa5qI0nSZbz/nmVH5kCgDjviD47g0y2bSdPk8zULn91s+ZNodWAbdjHXHeuai8NXtn8MdXvdYkkea4hjKrKwfYQ+DggmpfhRoaavdy69f7pZCrIuemVdSOCK9L8S6aup+HLuwVcecgGF47g1IHn/wXmRvCeowbvn+1S4Ht5aVF8Ibn7PrGoafLxJHEvH1bPbiqfwjlFrruoaUeHEs+AfQbR/So7O4l0T4wz2z7V+0PbRn05C+uKoD2ylpqnIzTqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKSlprNtUn0oA8I8a2y3XxfihdtwkukBH/bNa9u06IQabawr0jhRB+AArxHxDcef8arf2u0/9FrXuVt/x6wf7i/yoAdccW0p/wBg/wAq8x8D3G/4g66n3v8ASxg/8BavTp13QSr6oR+leWeC18j4m62jcb7v5fwRqAPWKKKKAEqrqc32fS7ucf8ALKB3/JSat1XvIRPZTwkZEkbKQfcYoA+cba3fxP8AE1kf5lnnbPf+Antj0r6Os4RbWcEI/wCWcar+QxXm/hDwU9p421DVZFVY4pgYgpXGCrA8Y4r0+gBaKKKAErwD412SW+u286tzO0hP4bf8a9/rz34teGV1bQGv4o1860QkdB95lHce1AGj8MdROo+E1kLf6qXyvyRK2PEnhuz8SabJaXSrkqwRzn5CRjPBFeZ/BjxLHbLNoM/+sMrzZ5PQIvXp2r2WgDxJPh94n8J6o91odxJMu9iEjtx0PHcnsa9C0vxihVIdZh/s6d22KJZOWY9BwO9dXXz541199W8fWUELeXAJoPuZXndg0AfQKOkih0bIPQ0+qOkp5WlwJuZ8L1bqeavUAFJS0UAJXmfxr0wXmhW935e42iSnPpkp/hXplc944sF1HwlqEG1SzRYHT1HrQBy3wa137foD2czfvY5yqA4ztCL6CvSq8E+EN4bHxjNp38I844+mB/Sve6AEYheTQcMuOxowDS4oA8V+KGhvoevwa9ZrsE7s0pVemAoGST716T4N1qPW/D1vMjZMaLG3zZ5CKT296f4u0aPW/D91atGryFCELKOMkdCfpXlvw11afR/Etxo7TSNGksmVZjjIwvTp2qetwPcKWkpaoAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKSlooAqXtjbX8DQXUXmRspBG4jgjB6V4z8R/CVn4b1O31ayjVLfa7SRrnuQByT/tV7hXO+NPDq+JPDlzYhV851UI3GRh1JwSPagCa08RaZFoFvfS3UaQhVjLluNwXOKz77xV4e17Rrmzt9Ut3adNgVWyea8X8P3Fy2qP4d1O+uPsjMcKshb5iwQcHjp7V2t38GZ7aRn0rUr4en75V/kBQBz2h+Mb/AMB67d288LS2Mk8kipuChx0U5wT2r02/8cR3HhttT0ZBeMm8skT9AoPOSPWvO/E3g+Tw/wCE7ibWJpJrnzU2O7CQ7SQPvdetL8FY7q51O6gk/eWf2c5idsry65+U8UAdR4b+L1lfTfZdVjWzkHBaSYHsSeiipPizL/angtJ7CZZYvtCcpyPusf61b8VfC3StXDz2Uf2S47LBGiDJI74rhtS8N+JdB8Nzx6lcSSWfnnaHud/O3A+XPoKAOp+Clo0WgfaTNuEyHEe37uJGHWtj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ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAaRmuM1r4YeH9Zm86aGTfkZPnMOmfT612tFAHlOpfBHTZVH9nMsJ5z5krn/Gs/wD4UU/e8t/++n/wr2aigDw5/gbf/aMLe2vl8f3/APCtOz+BsCf8fk0Mv+5I4/pXrtLQBwWm/CPw5YybzbyFtuOJ2rrtM0q00m3EFqrKg/vMT3z3+tX6KAEpaKKACiiigAooooAKKKKACiiigAooooAKKKKACisbX5bmOWz+zSujAu5VWID7V3YPr0pdavHbTYxaSsjToZA6nBCKu4nP5D8aANiiqNleF3gtWBLG1WUuT17Ux9XVYmZYSz/aTbou4Dcw9+1AGjRVOK+byZ3u7drYwDLZO5SMZyD3qKDUppJYRNYvDFP/AKuTeG7ZG4DpxQBo0VQGqr/ZA1Hyjg4+Td/tbetRrdPDfakzeZKkQjKxrknlegHvQBp0VRh1CQ3SW11am3aRSyHeGBA65x0PNRJq8kgSZbJzaO+1Ztwz1xnb6ZoA06KzrjU5ofOdbGR4IM75CwXOBzgHrT5tRbzkhtIDcSvH5hBcKFXsSaAL1FVrK8W8iZtjRujlJEbqrDqKiudQeK+FnDatNK0fmDDBRjOOSelAF6is4aun2PzmgcS+b5HkggkyZ6Z6fjUkF/I8z28tsYrhU8xU3ghx04P1oAu0Vl6VeXtxYiSSDe29xu3gZwxHp26fhRQBqUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUlLRQAlFFAoAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKSlooASig/dooAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooApXdvLLqVjKqbo4mfecjjKkD9az4dLu1ivY3QFUgeC1G4fMrZP4fwj8K3aKAMlYLu0ura4S2Mw+yiF1V1BVgc9z0qKO0u1sZVuLKOfzLppJISQSVPdTnqPetuigDFg06aW2voAktvbzIFhjlfcVODk9TgdOM1ZtpdRd4IntfISMfvnZgQ2B0XB9a0aKAOfa01H+yP7MS05R/9b5i4ZQ+eOc5+tWbqzvi+ovb5RpvK8tg4BYAfMAexrXooAwo7B/7Qgmj09oItro5aQM/zDqeTwPrmprQalbW0FitsFMRCtOWBQoD1AznOK16KAOfudPupxdxzWjTzSM/lTPKNiKemBngj6de9WIY7u0uI7oWjyLJbrHJGrLuRl+pwR+NbFFAGdZxXVrbXNw0Ae4nkMohDgY6ALnp0FSLBMdYFy0eIzbBCcjht2cVdooAwptLuJIZWMO8rfNMI9+PMQjHXsas6fabbxp1sfsyBNq733OTnnuQBWpRQBm6ctzZ2pt3tHYrI5DKy4YFiQevvRWlRQB//9k=";
myExercicio.style = "Treino";
myExercicio.group = "Abdominais";
myExercicio.equipment = "Polia";
bd.push(myExercicio);

myExercicio = new Exercicio();
myExercicio.name = "Crossover com polia alta";
myExercicio.img = "http://www.musculacao.net/workoutplanner/noaccimages-exercises/Exercicios/Exercicios/Peitoral/Polia/Crossover%20com%20polia%20alta%20999.jpg";
myExercicio.style = "Treino";
myExercicio.group = "Peitoral";
myExercicio.equipment = "Polia";
bd.push(myExercicio);

myExercicio = new Exercicio();
myExercicio.name = "Levantamento terra";
myExercicio.img = "http://www.musculacao.net/workoutplanner/noaccimages-exercises/Exercicios/Exercicios/Costas/Barra/Levantamento%20terra%20999.jpg";
myExercicio.style = "Treino";
myExercicio.group = "Costas";
myExercicio.equipment = "Barra";
bd.push(myExercicio);

myExercicio = new Exercicio();
myExercicio.name = "Aeróbica";
myExercicio.img = "http://www.musculacao.net/workoutplanner/noaccimages-exercises/Cardio/Cardio/Aerobica%20999.jpg";
myExercicio.style = "Cardio";
bd.push(myExercicio);

myExercicio = new Exercicio();
myExercicio.name = "Bicicleta";
myExercicio.img = "http://www.musculacao.net/workoutplanner/noaccimages-exercises/Cardio/Cardio/Bicicleta%20999.jpg";
myExercicio.style = "Cardio";
bd.push(myExercicio);

loadResults();

