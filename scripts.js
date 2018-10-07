
debug = false;



var Operators = ["//", "->", "<-", "==", "++", "^", "=", ",",
				 "/", "+", "-", ";", "(", ")", "\n", "[",
				 "]", "{", "}"];
function splitCodeIntoTokens(code, operators){
		var codeParts = splitBySpacesAndTabs(code);
		var tokenArray = [];
		for(let i = 0; i<codeParts.length; i++){
			let partTokens = splitByOperators(codeParts[i], operators);
			tokenArray = tokenArray.concat(partTokens);}
		return tokenArray;}
	

const none = -1;
var Functions = {};		
class Function{
	constructor(name, variables, tokenArray){
		Functions[name] = this;
		this.name = name;
		this.variables = variables;
		this.tokenArray = tokenArray;}
	variableIndex(variableName){
		for(let i = 0; i<this.variables.length; i++){
			let token = this.variables[i];
			if(variableName == token){
				return i;}}
		return none;}}
new Function("utest", ["x", "y"], ["x", "+", "y"]);
new Function("over", ["x", "y"], ["\\frac", "(", "x", ",", "y", ")"]);
new Function("power", ["x", "y"], ["\\frac", "(", "x", ",", "y", ")"]);
new Function("sqrt", ["x"], ["\\sqrt", "(", "x", ")"]);
		
function isUserFunction(string){
	for (var key in Functions) {
		if(!Functions.hasOwnProperty(key)) continue;	// Refactorable to only booleans
		if(key == string) return string;}
	return false;}
	
	
NativeMacros = {
	'alpha'    : '\\alpha',
	'beta'     : '\\beta', 
	'gamma'    : '\\gamma',
	'delta'    : '\\delta', 
	'epsilon'  : '\\epsilon',
	'zeta'     : '\\zeta', 
	'eta'      : '\\eta',  
	'theta'    : '\\theta',
	'kappa'    : '\\kappa', 
	'lambda'   : '\\lambda', 
	'mu'       : '\\mu',
	'nu'       : '\\nu',    
	'xi'       : '\\xi',    
	'pi'       : '\\pi',    
	'rho'      : '\\rho',    
	'sigma'    : '\\sigma',
	'tau'      : '\\tau',    
	'phi'      : '\\phi',    
	'chi'      : '\\chi',    
	'psi'      : '\\psi',    
	'omega'    : '\\omega'  
}
function isNativeMacro(string){
	for (var key in NativeMacros) {
		if(!NativeMacros.hasOwnProperty(key)) continue;
		if(key == string) return string;}
	return false;}


// takes the position of '(' and returns the position of ')'
function findClosingParanthesisPosition(tokenArray, parPos){
	let parStack = 0;
	for(let i = parPos + 1; i < tokenArray.length; i++){
		print("i at " + i + "(" + tokenArray[i] + ")");
		if(tokenArray[i] == "("){
			parStack++;}
		else if(tokenArray[i] == ")"){
			if(parStack == 0) return i;
			else parStack--;}}}

function findOpeningParanthesisPosition(tokenArray, parPos){
	let parStack = 0;
	for(let i = parPos-1; i>=0; i--){
		if(tokenArray[i] == "("){
			if(parStack == 0){
				return i;}
			else{
				parStack--;
			}
		}
		if(tokenArray[i] == ")"){
			parStack++;
		}
	}
}
			

	
// Returns an array of tokenArray. tokenArray is split at all ','
function splitByComma(tokenArray){
	print(" Splitting by comma: " + tokenArray);
	let returnedParameters = new Array();
	let paranthesisStack = 0;
	let startPos = 0;
	for(let i = 0; i<tokenArray.length; i++){
		let token = tokenArray[i];
		if(token == "("){ paranthesisStack++; }
		if(token == ")"){ paranthesisStack--; }
		if(token == "," && paranthesisStack == 0){
			returnedParameters.push(tokenArray.slice(startPos, i));
			startPos = i + 1;}}
	returnedParameters.push(tokenArray.slice(startPos, tokenArray.length));
	print(" Split! Here you go: " + arrayArrayToString(returnedParameters));
	return returnedParameters;}	// Works
	


// Returns a completely native tokenArray
function callFunction(func, parameters){	// each parameter is a tokenArray
	print("Called callFunction for function: " + func.name + "(" + parameters + ") " + func.tokenArray);
	let returnedTokenArray = new Array();
	for(let i = 0; i<func.tokenArray.length; i++){
		print("callFunction: i at " + func.tokenArray[i]);
		let token = func.tokenArray[i];
		let varIndex = func.variableIndex(token);
		if(varIndex == none){ returnedTokenArray.push(token); }
		else{
			print("  Found parameter: " + token + "    " + varIndex);
			let parsedParameters = parseTokensToNative(parameters[varIndex]);
			returnedTokenArray = returnedTokenArray.concat(parsedParameters);}}
	print("  Returning " + returnedTokenArray);
	return returnedTokenArray;}

function parseTokenArrayWithSpecialOperators(tokenArray){
	let ret = [];
	let start = 0;
	for(let i = 0; i<tokenArray.length; i++){
		let token = tokenArray[i];
		if(token == "/" || token == "^"){
			let blockBefore, blockAfter;
			let retPartEnd;
			let retNextStart;
			let isUFunction = false;
			let theMiddleFunction = token;
			if(tokenArray[i-1] == ")"){
				let parOpenPos = findOpeningParanthesisPosition(tokenArray, i-1);
				let par1start = parOpenPos;
				if(isUserFunction(tokenArray[par1start - 1])){
					//console.log("  It's a user function.");
					isUFunction = true;
					par1start --;
					blockBefore = tokenArray.slice(par1start, i);}
				else{
					par1start ++;
					blockBefore = tokenArray.slice(par1start, i - 1);}
				blockBefore = parseTokenArrayWithSpecialOperators(blockBefore);
					// blockBefore e bun
				if(isUFunction) retPartEnd = par1start;
				else retPartEnd = parOpenPos;
				//console.log({retPartEnd})
				}
			else{
				blockBefore = tokenArray[i-1];
				retPartEnd = i-1;}
			if(tokenArray[i+1] == "("){
				let par2end = findClosingParanthesisPosition(tokenArray, i+1);
				blockAfter = tokenArray.slice(i+2, par2end);
				blockAfter = parseTokenArrayWithSpecialOperators(blockAfter);
				retNextStart = par2end + 1;}
			else{
				if(isUserFunction(tokenArray[i+1])){
					//console.log("Found user function: " + tokenArray[i+1]);
					let par2end = findClosingParanthesisPosition(tokenArray, i+2);
					blockAfter = tokenArray.slice(i+1, par2end + 1);
					blockAfter = parseTokenArrayWithSpecialOperators(blockAfter);
					//console.log({blockAfter});
					retNextStart = par2end + 1;}
				else{
					//console.log(tokenArray[i+1]);
					blockAfter = tokenArray[i+1];
					retNextStart = i+2;}}
			ret = ret.concat(tokenArray.slice(start, retPartEnd));
			if(theMiddleFunction == "/"){
				ret = ret.concat(["\\frac", "("], blockBefore, [","], blockAfter, [")"]);}
			else if(theMiddleFunction == "^"){
				//console.log("HEY!!");
				ret = ret.concat(["{", blockBefore, "}^{", blockAfter, "}"]);
				//console.log({rettt : ret});
			}
			i = retNextStart;
			start = retNextStart;
		}
	}
	if(start < tokenArray.length){
		ret = ret.concat(tokenArray.slice(start, tokenArray.length));}
	return ret;
}
		
		
function rememberFunctionNames(tokenArray){		// Iterates and reads and remembers function names
	for(let i = 0; i<tokenArray.length; i++){
		if(tokenArray[i] == "function"){
			Functions[tokenArray[i+1]] = "not set";
		}
	}
}
		
// Takes in a tokenArray, and returns the perfectly native tokenArray.
// (Perfectly native means it only contains native functions, all user function
//  that it finds are inline'd using their function definitions)
function parseTokensToNative(tokenArray){
	print("Called parseTokensToNative for " + tokenArray);
	let returnedTokenArray = new Array();
	for(let i = 0; i<tokenArray.length; i++){
		let currentToken = tokenArray[i];
		if(theFunction = isUserFunction(currentToken)){		// Refactorable with only booleans
			console.log("Called function: " + theFunction);
			if(tokenArray[i+1] == "("){
				let startPos = i + 2;		// func ( p1 ...
				let endPos = findClosingParanthesisPosition(tokenArray, i + 1);	// same as paranthesis
				let parameterList = splitByComma(tokenArray.slice(startPos, endPos));
				print("Parsing " + theFunction + " with " + arrayArrayToString(parameterList));
				let parsedFunction = callFunction(Functions[theFunction], parameterList);
				returnedTokenArray = returnedTokenArray.concat(parsedFunction);
				i = endPos;}
			else{
				let parsedFunction = callFunction(Functions[theFunction], []);
				returnedTokenArray = returnedTokenArray.concat(parsedFunction);}}
		// If finds 'function', parses the line to native and remembers the function
		// It will not be put into the output
		else if(currentToken == "function"){	// function name ( x , y )
			console.log("Found function: " + tokenArray[i+1]);
			let functionName = tokenArray[i + 1];
			let endPos = findClosingParanthesisPosition(tokenArray, i + 2);
			let parameterList = arrayArrayToArray(splitByComma(tokenArray.slice(i + 3, endPos)));
			let j = i;	// can optimize by making it equal to endPos or sth
			print("Started j at " + j);
			//while(tokenArray[j] != "\n" && j < tokenArray.length) j++;
			/* TEST */
			let parStack = 0;
			while(tokenArray[j] != "\n" && j < tokenArray.length){
				console.log("  Reached " + tokenArray[j]);
				if(tokenArray[j] == "(") parStack++;
				if(tokenArray[j] == ")") parStack--;
				if(parStack < 0) break;
				j++;}
			/* TEST */
			print("Ended j at " + j);
			let parsedFunctionBody = parseTokensToNative(tokenArray.slice(endPos + 1, j));
			new Function(functionName, parameterList, parsedFunctionBody);
			print("Added new function: " + functionName + " " + parameterList + " : " + parsedFunctionBody);
			i = j;}
		else if(theNativeMacro = isNativeMacro(currentToken)){
			//console.log({theNativeMacro});
			 returnedTokenArray.push(NativeMacros[theNativeMacro]);}
		else returnedTokenArray.push(currentToken);} // End for
	console.log("   Done parsing " + tokenArray);
	return returnedTokenArray;}

// Returns an array of tokenArray WITH NO new lines
// Refactorable: this could be done from the start
function splitTokenArrayByTwoOrMoreNewLines(tokenArray){	// Splits by 2 or more \n
	let arrayArray = [];
	arrayArray[0] = [];
	let start = 0;
	while(tokenArray[start] == "\n") start++;		// So we don't have empty arrays
	for(let i = start; i<tokenArray.length; i++){
		if(tokenArray[i] == '\n' && tokenArray[i+1] == '\n'){
			arrayArray.push([]);
			while(tokenArray[i] == "\n") i++;
			i--;}
		else if(tokenArray[i] != '\n'){
			arrayArray[arrayArray.length - 1].push(tokenArray[i]);}}
	return arrayArray;}

NativeFunctions = {};
const FUNCTION = 1;
const OPERATOR = 2;
function NativeFunction(name, type, fopen, fbetween, fclose){
	NativeFunctions[name] = this;
	this.name = name;
	this.type = type;
	if(this.type == OPERATOR){
		this.open = fopen;
		this.between = "\\over";
		this.close = fclose;}
	if(this.type == FUNCTION){
		this.leftParamWrapper = fopen;
		this.between = fbetween;
		this.rightParamWrapper = fclose;}}
new NativeFunction("over", OPERATOR, "{{", "} \\over {", "}}");
new NativeFunction("\\frac", FUNCTION, "{", "", "}");
new NativeFunction("\\sqrt", FUNCTION, "{", "", "}");

function isNativeFunction(string){
	for (var key in NativeFunctions) {
		if(!NativeFunctions.hasOwnProperty(key)) continue;	// Refactorable to only booleans
		if(key == string) return string;}
	return false;}

function callNativeFunction(nf, pars){
	let ret = "";
	if(nf.type == OPERATOR){
		ret = nf.open + formatMathBlock(pars[0]);
		for(let i = 1; i<pars.length; i++){
			ret += nf.between + formatMathBlock(pars[i]);}
		ret += nf.close;}
	if(nf.type == FUNCTION){
		ret = nf.name;
		for(let i = 0;i<pars.length; i++){
			ret += nf.leftParamWrapper + formatMathBlock(pars[i]) + nf.rightParamWrapper;}}
	return ret;}

function isTokenOperator(string){
	if(Operators.includes(string)) return true;
	return false;
}

// Parses a perfectly native tokenArray, returns a string
// It's recursive af
function formatMathBlock(tokenArray){
	let ret = "";
	let firstWord = true;
	for(let i = 0; i<tokenArray.length; i++){
		let token = tokenArray[i];
		if(isNativeFunction(token)){
			let start = i + 1;
			let end = findClosingParanthesisPosition(tokenArray, start);
			let parameters = splitByComma(tokenArray.slice(start + 1, end));
			ret += callNativeFunction(NativeFunctions[token], parameters);
			i = end;}
		else if(isTokenNumber(token) || isTokenOperator(token) || token[0] == "\\" || token == "}^{"){
			ret += token + " ";}
		else if(isTokenNumber(tokenArray[i-1]) || isTokenOperator(tokenArray[i-1]) || tokenArray[i-1] == "}^{"){
			ret += token + " ";}
		else if(firstWord){
			firstWord = false;
			ret += token + " ";}
		else{
			ret += " \\ \\ " + token + " ";
		}
	}
	return ret;}

	
	
var hasMathJax = false;
	
function runMathJax(){
	let mathJaxScript = createElement("script");
	mathJaxScript.setAttribute("id", "MathJaxScript");
	mathJaxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML";
	mathJaxScript.type = "text/javascript";
	document.head.appendChild(mathJaxScript);
	hasMathJax = true;}
	
function go(){
	//stopMathJax();
	let out = get("Output");
	out.innerHTML = "";
	let code = codeArea.getValue();
	let codeAsTokens = splitCodeIntoTokens(code, Operators);
	rememberFunctionNames(codeAsTokens);
	let codeAsTokensReformatted = parseTokenArrayWithSpecialOperators(codeAsTokens);
	Functions = {};
	//out.innerHTML += "Code as tokens reformatted: " + mathArrayToString(codeAsTokensReformatted);
	let parsedTokens = parseTokensToNative(codeAsTokensReformatted);
	//out.innerHTML += "<br><br>Parsed tokens (to native): " + mathArrayToString(parsedTokens);
	let nativeLines = splitTokenArrayByTwoOrMoreNewLines(parsedTokens);
	for(let i = 0; i<nativeLines.length; i++){
		//console.log(mathArrayToString(nativeLines[i]));
		out.innerHTML += "$${" + formatMathBlock(nativeLines[i]) + "}$$<br>";
		console.log(formatMathBlock(nativeLines[i]));
		//console.log(formatMathBlock(nativeLines[i]));
	}
	if(hasMathJax) MathJax.Hub.Typeset();
	else runMathJax();
}





