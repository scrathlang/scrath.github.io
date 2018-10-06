	let debug = true;
	var print = function(x){
		if(debug) console.log(x);
	}
	var NULL = 0;
	var KEY_ENTER = 13;
	var linkLocation = window.location.href;
	var url = new URL(window.location.href);
	var Parameters = {};
	
	function gotoLink(str){
		window.location = str;
	}
	
	function isDigit(string){
		if(stringContains("1234567890", string)) return true;
		return false;}
	
	function isTokenNumber(string){
		if(string == undefined) return false;
		if(isDigit(string[0])){
			return true;}
		return false;}

	
	
	function substringEqualsString(substr, index, str){
		for(let i = 0; i<str.length; i++){if(str[i] != substr[index + i]) return false;}
		return true;}	// Works
	
	function substringEqualsAnyString(substr, index, strarray){
		for(let i = 0; i<strarray.length; i++){if(substringEqualsString(substr, index, strarray[i])){return strarray[i];}}
		return false;}	// Works
	
	function isWhitespace(character){
		if(character == ' ' || character == '\t') return true;
		return false;
	}
	
	function splitBySpacesAndTabs(string){
		console.log(string);
		let returnedArray = new Array();
		let startPosition = 0;
		let i = 0;
		while(i < string.length){
			if(isWhitespace(string[i])){
				returnedArray.push(string.substring(startPosition, i));
				while(isWhitespace(string[i])){i++;}
				startPosition = i;}
			else i++;}
		if(!isWhitespace(string[string.length - 1])){
			returnedArray.push(string.substring(startPosition, string.length));}
		return returnedArray;}

	function arrayArrayToString(arrayArray){
		let ret1 = "";
		for(let index1 in arrayArray){
			let ret2 = "[";
			for(let index2 in arrayArray[index1]){
				ret2 += arrayArray[index1][index2] + " ";}
			ret2 += "] ";
			ret1 += ret2;}
		return ret1;}
		

	
	function mathArrayToString(tokenArray){
		let ret = "";
		for(let i = 0; i<tokenArray.length; i++){
			ret += tokenArray[i];
			if(tokenArray[i] != "(" && tokenArray[i+1] != ")"){
				ret += " ";
			}
		}
		return ret;
	}
		

	function arrayArrayToArray(arrayArray){
		let returnedArray = [];
		for(let i = 0; i<arrayArray.length; i++){
			returnedArray = returnedArray.concat(arrayArray[i]);}
		return returnedArray;}
		
	function splitByOperators(code, operators){
		let tokenArray = [];
		let start = 0;
		for(let i = 0; i<code.length; i++){
			let foundOperator = substringEqualsAnyString(code, i, operators);
			if(foundOperator){
				if(start < i) tokenArray.push(code.substring(start, i));
				tokenArray.push(code.substring(i, i + foundOperator.length));
				i += foundOperator.length - 1;
				start = i + 1;}}
		if(start < code.length)
			tokenArray.push(code.substring(start, code.length));
		return tokenArray;}
	
	
	
	function loadJSON(filePath, callback) {   

		var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
		xobj.open('GET', filePath, true); // Replace 'my_data' with the path to your file
		xobj.onreadystatechange = function () {
			console.log("State changed...");
			  if (xobj.readyState == 4 && xobj.status == "200") {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				callback(xobj.responseText);}};
		xobj.send(null);  
	}
	
	function drawTextOnCanvas(t, x, y, canvas, font){
		if(font != null) canvas.getContext("2d").font = font;
		canvas.getContext("2d").fillText(t, x, y);
	}
	
	function drawImageOnCanvas(imgpath, x, y, canvas, w, h){
		var img = createImage(imgpath);
		img.onload = function(){canvas.getContext("2d").drawImage(img, x, y, w, h);}
	}

	function getCanvasTextWidth(Text, Canvas){return Canvas.getContext("2d").measureText(Text).width;}
	function getCanvasTextHeight(Text, Canvas){return Canvas.getContext("2d").measureText(Text).height;}
		
	function TextBox(X, Y, MaxWidth, Font, Canvas, LineHeight){
		this.canvas = Canvas;
		this.context = Canvas.getContext("2d");
		this.context.font = Font;
		
		this.lines = new Array();
		this.nLines = 0;
		this.w = MaxWidth;
		this.h = 0;
		this.x = X;
		this.y = Y;
		this.lineSpacing = 20; if(LineHeight) this.lineSpacing = LineHeight;
		this.font = Font;
		this.text = "";
		
		
		this.setText = function(t){
			var wordList = t.split(" ");
			var currentLine = 0;
			var currentWord = 0;
			this.nLines = 0;
			this.text = t;
			while(currentWord < wordList.length - 1){
				this.nLines++;
				this.lines[currentLine] = "";
				var isFirstWordOfLine = true;
				while(getCanvasTextWidth(this.lines[currentLine] + " " + wordList[currentWord], this.canvas) < this.w && wordList[currentWord] != "NL" && currentWord < wordList.length){
					if(isFirstWordOfLine){
						isFirstWordOfLine = false;}
					else{
						this.lines[currentLine] += " ";}
					this.lines[currentLine] += wordList[currentWord];
					currentWord++;}
				currentLine++;
				if(wordList[currentWord] == "NL"){
					currentWord++;}}
			this.h = this.lineSpacing * (1 + this.nLines);}
		
		this.draw = function(){
			for(var i = 0; i<this.nLines; i++){
				this.context.fillText(this.lines[i], this.x, this.y + i * this.lineSpacing);}}
	}
	

	function drawRoundRect(canvas, x, y, width, height, radius, fill, stroke) {
		var ctx = canvas.getContext("2d");
		if (typeof stroke == 'undefined') {
		stroke = true;
		}
		if (typeof radius === 'undefined') {
		radius = 5;
		}
		if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
		} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
		}
		ctx.beginPath();
		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		ctx.closePath();
		if (fill != null) {
			ctx.fillStyle = fill;
			ctx.fill();
		}
		if (stroke != null) {
			ctx.strokeStyle = stroke;
			ctx.stroke();
		}

	}

	
	

	function submitForm() {
		var parameters = document.getElementById("in").value;
		alert("Submitting");
		var http = new XMLHttpRequest();
		http.open("POST", "http://5.12.112.34:8080/XServer/XServer?" + parameters, true);
		http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		var params = "search=" + "HELLOIMAPARAMETEUR"; // probably use document.getElementById(...).value
		http.send(params);
		http.onload = function() {
			alert(http.responseText);
		}
	}
	
	function createMatrix(nRows, nCols){
		var array = new Array(nRows);
		for(var i = 0; i<nRows; i++){
			array[i] = new Array(nCols);
		}
		return array;
	}
	
	function matrixRows(matrix){
		return matrix.length;
	}
	
	function matrixCols(matrix){
		return matrix[0].length;
	}
	
	function removeFirst2Words(str){
		var words = str.split(" ");
		var ret = "";
		for(var i = 2; i<words.length - 1; i++){
			ret += words[i] + " ";}
		ret += words[words.length - 1];
		return ret;}
	
	function arrayToString(array){
		let ret = "";
		for(var index in array){
			ret += array[index] + " ";
		}
		return ret;
	}
	
	function removeFirstWord(str){
		var words = str.split(" ");
		var ret = "";
		for(var i = 1; i<words.length - 1; i++){
			ret += words[i] + " ";}
		ret += words[words.length - 1];
		return ret;}
		
	function forEachElementInObject(object, func){
		for (var key in object) {
			if (!object.hasOwnProperty(key)) continue;
			func(object, key);}}
	
	function inRedSpan(str){
		return "<span style='color:#FF3333'>"+ str + "</span>"
	}
	
	function inGreenSpan(str){
		return "<span style='color:#99EE99'>" + str + "</span>";
	}
	
	function inGraySpan(str){
		return  "<span style='color:#999999'>" + str + "</span>";
	}
	
	function inBlueSpan(str){
		return  "<span style='color:#777799'>" + str + "</span>";
	}
	
	function loadParameters() {
		if(! linkLocation.includes("?")){
			console.log("Link does not have parameters");
			return;
		}
		var parser = document.createElement('a');
		parser.href = linkLocation;
		var query = parser.search.substring(1);
		var vars = query.split('&');
		console.log("Found " + vars.length + " parameters");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			Parameters[pair[0]] = decodeURIComponent(pair[1]);}
	};
	
	function setParameter(param, value){
		Parameters[param] = value;
	}
	
	function parseParameters(){
		var ret = "";
		for (var key in Parameters) {	// for each property/ability in the Races object...
			if (!Parameters.hasOwnProperty(key)) continue;
			var thisParam = Parameters[key];
			ret += urlify(key + "=" + Parameters[key]) + "&";
		}
		return substringTo(ret, ret.length - 2);
	}
	
	function printParameters(){
		console.log("  > Printing parameters:");
		for (var key in Parameters) {	// for each property/ability in the Races object...
			if (!Parameters.hasOwnProperty(key)) continue;
			console.log(Parameters[key]);
		}
		console.log("  > Done");
	}
	
	function urlify(str){
		return replaceAll(str, " ", "%20");
	}
	
	function replaceAll(str, word, replacer){
		var strings = str.split(word);
		var ret = strings[0];
		for(var i = 1; i<strings.length; i++){
			ret += replacer + strings[i];
		}
		return ret;
	}
	
	function removeSpaces(str){
		return replaceAll(str, " ", "");
	}
	
	function toAbilitiesArray(str){
		var ret = "[Abilities['";
		ret += replaceAll(str, " ", "'], Abilities['")
		ret += "']]";
		return ret;
	}
	
	function getURLTail(str){
		str = str.split("?");
		var ret = "";
		for(var i = 1; i<str.length; i++){
			ret += str[i];
		}
		return ret;
	}
	
	function getParameter(param){
		var value = url.searchParams.get(param)
		if(value != null) return val;
		return "";
	}
	
	function getParameterNumber(param){
		return parseInt(url.searchParams.get(param));
	}
	
	function fitImageInContainer(image, containerWidth, containerHeight){
		var imgHeight = image.naturalHeight;
		var imgWidth = image.naturalWidth;
		if(imgHeight >= imgWidth){
			image.style.width = "100%";
			image.style.height = "auto";}
		else{
			image.style.width = "auto";
			image.style.height = "100%";}
		imgHeight = image.clientHeight;
		imgWidth = image.clientWidth;
		print(imgHeight);
		print(imgWidth);
		image.style.marginLeft = (containerWidth - imgWidth)/2 + "px";
		image.style.marginTop = (containerHeight - imgHeight)/2 + "px";}
	
	function getRandomProperty(obj) {
		var result;
		var count = 0;
		for (var prop in obj)
			if (Math.random() < 1/++count)
			   result = prop;
		return result;
	}

	function roundUp(nr, by){
		return (nr - nr%by + by);
	}
	
	function roundUp25(nr){
		return (nr - nr%25 + 25);
	}
	
	function roundUp50(nr){
		return (nr - nr%50 + 50);
	}
	
	function roundDown25(nr){
		return (nr - nr%25);
	}
	
	function roundDown50(nr){
		return (nr - nr%50);
	}
	
	function round50(nr){
		var roundness = nr%50;
		var complement  = 50 - roundness;
		if(roundness <= complement){
			return nr - roundness;}
		else return nr + complement;
	}
	
	function To(str, index){
		return str.substring(0, index + 1);
	}
	
	function substringFrom(str, index){
		return str.substring(index, str.length);
	}
	
	function quotify(str){
		return "\"" + str + "\"";
	}
	
	function queryStringArguments(...args){
		var ret = ""; 
		if(args.length > 0){
			ret+= quotify(args[0]);
			for(var i = 1; i<args.length; i++){
				ret += ", " + quotify(args[i]);
			}
		}
		return ret;
	}
	
	function stringToFunctionName(str){
		var words = str.split(" ");
		var returnedString = "";
		if(isUpperCase(words[0][0])){
			var i = 0;
			while(i < words[0].length){
				if(isUpperCase(words[0][i])){
					returnedString += words[0][i].toLowerCase();
				} else {
					break;
				}
				i++;
			}
			if(i < words[0].length){
				returnedString += words[0].substring(i, words[0].length);
			}
		} else {
			returnedString += words[0];
		}
		for(var i = 1; i<words.length; i++){
			print(words[i]);
			if(!isUpperCase(words[i][0])){
				var aux = words[i].toLowerCase();
				returnedString += aux[0].toUpperCase() + words[i].substring(1, aux.length);
			} else {
				returnedString += words[i];
			}	
		}
		return returnedString;
	}
	
	function isUpperCase(str){
		if(str == str.toUpperCase()){
			return true;
		}
		return false;
	}
	
	function playSound(path){
		new Audio(path).play();
	}
	
	function roundDown25(nr){
		return (nr - nr%25);
	}
	
	function talentNameToImagePath(t){
		var lowerCaseT = t.toLowerCase();
		var returnedPath = "";
		for(var i = 0; i<t.length; i++){
			if(lowerCaseT[i] == " "){
				returnedPath += "_";}
			else if(lowerCaseT[i] == ":"){
				returnedPath = returnedPath.substring(0, i-1);
				return returnedPath;
			}
			else{
				returnedPath += lowerCaseT[i];
			}
		}
		return returnedPath;
	}
	
	function distanceBetween(t1, t2){
		return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y));}
		
	function angleBetween(t1, t2){
		return Math.atan2(t2.y - t1.y, t2.x - t1.x) * 180 / Math.PI;}
		
	function min(a, b){
		if(a < b) return a;
		return b;}
	
	function SequenceNode(_Object){
		this.previous	= NULL;
		this.next		= NULL;
		this.data		= _Object;
	}
	
	function Sequence(){
		this.first	= NULL;
		this.last	= NULL;
		this.length = 0;
		
		this.pushBack = function(_Object){
			var s = new SequenceNode(_Object);
			if(this.length == 0){
				this.last = s;
				this.first = s;}
			else{
				this.last.next = s;
				s.previous = this.last;
				this.last = s;}
			this.length++;}
			
		this.pushFront = function(_Object){
			var s = new SequenceNode(_Object);
			if(this.length == 0){
				this.first = s;
				this.last = s;}
			else{
				s.next = this.first;
				this.first.previous = s;
				this.first = s;}
			this.length++;}
	}//endSequence
	
	function Match(){
		this.pieces = new Array();
		this.push = function(_Object){
			this.pieces.push(_Object);
		}
	}
	
	function addElement(dom_e){
		document.getElementById("MAP").appendChild(dom_e);
	}
	function removeElement(dom_e){
		document.getElementById("MAP").removeChild(dom_e);
	}
	function percentChance(chance){	/* Ex: percentChance(20) = 20% chance to return true; */
		var c = randomInt(1, 100);
		if(c <= chance) return true;
		return false;
	}
	function detectCollision(Object_a, Object_b){
		var aCenterX = Object_a.x + Object_a.width/2;
		var aCenterY = Object_a.y + Object_a.height/2;
		var bCenterX = Object_b.x + Object_b.width/2;
		var bCenterY = Object_b.y + Object_b.height/2;
		var distance = Math.sqrt( (bCenterX - aCenterX)*(bCenterX - aCenterX) + (bCenterY - aCenterY)*(bCenterY - aCenterY) );
		if(distance < Object_a.width/2 + Object_b.width/2){
			return true;}
		return false;
	}
	
	function getTextInputValueAsNumber(id){
		var theInput = document.getElementById(id);
		return parseInt(theInput.value);
	}
	
	function getSelectedOption(id){
		var theInput = document.getElementById(id);
		return theInput.options[theInput.selectedIndex];
	}
	
	var WORLDSEED = 0;
	
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	
	function initSeed(seed){
		WORLDSEED = seed % 2147483647;
		if(WORLDSEED <= 0)
			WORLDSEED += 2147483646;
	}

	function next(){
	  return WORLDSEED = WORLDSEED * 16807 % 2147483647;
	}

	function DEPRECATEDrandomInt(low, high){
		return next() % (high - low + 1) + low;
	}
	
	function randomInt(low, high){
		return Math.floor(Math.random() * (high - low + 1) + low);
	}
	
	function randomOf(...args){
		return args[randomInt(0, args.length - 1)];
	}
	
	/*
	function randomInt(l, h){
		//var r = randomFromSeed();
		//console.log(r);
		//return Math.floor(r * (h - l + 1) + l);
		return Math.floor(Math.random() * (h - l + 1) + l);
	}
	*/
	
	var floor = Math.floor;
	
	function get(theElement){
		return document.getElementById(theElement);
	}
	
	function normalizeConsole(theElement){
		theElement.style.width = "300px";
		theElement.style.height = "150px";
		theElement.style.position = "relative";
	}
	
	function add(theElement){
		document.getElementById("Window").appendChild(theElement);
	}
	
	function randomIntControlled(l, h){
		var a = randomInt(1, 2);
		if(a == 1){
			return randomInt(l, l/2);}
		else{
			return randomInt(h/2, h);}
	}
	
	function createElement(type){
		if(type == "scrollbox"){
			var scrollableDiv = createElement("div");
			scrollableDiv.style.width = "300px";
			scrollableDiv.style.height = "300px";
			scrollableDiv.style.overflowY = "scroll";
			return scrollableDiv;
		} else return document.createElement(type);
	}
	
	function createElementWithClass(type, cls){
		var elem = document.createElement(type);
		setClass(elem, cls);
		return elem;}
		
	function createElementWithID(type, id){
		var elem = document.createElement(type);
		setID(elem, id);
		return elem;
	}
	
	function getParent(node){
		return node.parentElement;
	}
	
	function getElement(id){
		return document.getElementById(id);
	}
	
	function getElementByClass(className){
		return document.getElementsByClassName(className)[0];
	}

	function getByClass(className){
		return document.getElementsByClassName(className)[0];
	}
	
	function getElements(className){
		return document.getElementsByClassName(className);
	}
	
	function removeAllChildren(node){
		while (node.firstChild) {
			console.log("Removing " + node.firstChild);
			node.removeChild(node.firstChild);}
	}

	function removeChildWithClass(node, cls){
		var removedElement = node.getElementsByClassName(cls)[0];
		node.removeChild(removedElement);
	}
		
	function setClass(object, c){
		object.setAttribute("class", c);}
	
	function setID(object, id){
		object.setAttribute("id", id);}
		
	function addClass(object, c){
		object.setAttribute("class", object.getAttribute("class") + " " + c);}
	
	function createImage(src){
		var img = createElement("img");
		img.setAttribute("src", src);
		return img;
	}

	function randomizeArray(array_a){
		var iRandomize;
		for(iRandomize = 0; iRandomize < array_a.length; iRandomize++){
			var randomizeArrayIndex = randomInt(0, array_a.length - 1);
			var auxRandomize = array_a[iRandomize];
			array_a[iRandomize] = array_a[randomizeArrayIndex];
			array_a[randomizeArrayIndex] = auxRandomize;
		}
	}


	function setImageXY(var_img_i, x, y){
		var_img_i.style.top = y + "px";
		var_img_i.style.left = x + "px";}
		
	function stringContains(string_a, substring_b){
		if(string_a.indexOf(substring_b) >= 0){
			return true;
		}
		return false;
	}



