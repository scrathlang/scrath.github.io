
debug = false;



var Operators = ['[*', '*]', ',,', '||', '|', ';;', '===', '<=>', '<->', "//", "->", "<-", "=>", "==", "++", "^", "=", ",",
				 "/", "+", "-", ";", "(", ")", "\n", "[", '\\',
				 "]", "{", "}", "#"];
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
		this.tokenArray = tokenArray;
		if(variables[0] == "..."){
			this.isLong = true;
			this.hasBetween = false;}
		else if(variables[1] == "..."){
			this.isLong = true;
			this.hasBetween = true;}
		else this.isLong = false;}
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
new Function("3rows", ["m", "b", "t"], ["rows", "(", "t", ",", "m", ",", "b", ")"]);
		
function isUserFunction(string){
	for (var key in Functions) {
		if(!Functions.hasOwnProperty(key)) continue;	// Refactorable to only booleans
		if(key == string) return string;}
	return false;}
	
	
NativeMacros = {
	'alpha'    	: '\\alpha',
	'beta'     	: '\\beta', 
	'gamma'    	: '\\gamma',
	'delta'    	: '\\delta', 
	'epsilon'  	: '\\epsilon',
	'zeta'     	: '\\zeta', 
	'eta'      	: '\\eta',  
	'theta'    	: '\\theta',
	'kappa'    	: '\\kappa', 
	'lambda'   	: '\\lambda', 
	'mu'       	: '\\mu',
	'nu'       	: '\\nu',    
	'xi'       	: '\\xi',    
	'pi'       	: '\\pi',    
	'rho'      	: '\\rho',    
	'sigma'    	: '\\sigma',
	'tau'      	: '\\tau',    
	'phi'      	: '\\phi',    
	'chi'      	: '\\chi',    
	'psi'      	: '\\psi',    
	'omega'    	: '\\omega',
	'Alpha'    	: '\\Alpha',
	'Beta'     	: '\\Beta', 
	'Gamma'    	: '\\Gamma',
	'Delta'    	: '\\Delta', 
	'Epsilon'  	: '\\Epsilon',
	'Zeta'     	: '\\Zeta', 
	'Eta'      	: '\\Eta',  
	'Theta'    	: '\\Theta',
	'Kappa'    	: '\\Kappa', 
	'Lambda'   	: '\\Lambda', 
	'Mu'       	: '\\Mu',
	'Nu'       	: '\\Nu',    
	'Xi'       	: '\\Xi',    
	'Pi'       	: '\\Pi',    
	'Rho'      	: '\\Rho',    
	'Sigma'    	: '\\Sigma',
	'Tau'      	: '\\Tau',    
	'Phi'      	: '\\Phi',    
	'Chi'      	: '\\Chi',    
	'Psi'      	: '\\Psi',    
	'Omega'    	: '\\Omega',
	'->'	   	: '\\to',
	'<-'		: '\\leftarrow',
	'=>'		: '\\Rightarrow',
	'=<'		: '\\Leftarrow',
	'<=>'		: '\\Leftrightarrow',
	'<->'		: '\\leftrightarrow',
	'and'		: '\\cap', 'And' : '\\bigcap',
	'or'		: '\\cup', 'Or'	 : '\\bigcup',
	'In'		: '\\in',
	'subset'	: '\\subset',
	'subseteq'	: '\\subseteq',
	'E'			: '\\exists',
	'exists'	: '\\exists',
	'any'		: '\\forall',
	'Inf'		: '\\infty', 'inf' : '\\infty', 'Infinity' : '\\infty', 'infinity' : '\\infty',
	'not'		: '\\neg',
	'sum'		: '\\sum',	'Sum' : '\\Large{\\sum}\\normalsize',
	'prod'		: '\\prod', 'Product' : '\\prod',
	'integral'	: '\\int',
	'dif'		: '\\setminus',
	'\\'		: '\\setminus',
	'R'			: '\\R',
	'N'			: '\\N',
	'Z'			: '\\Z',
	'Q'			: '\\Q',
	';;'		: ' \\ \\ ',
	'|'			: ')',
	'||'		: '|',
	'[*'		: '\\{',
	'*]'		: '\\}',
	',,'		: ','

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
			else parStack--;}}
	return false;}

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
	let ret = [];
	if(func.isLong){	// func(...)
		if(func.hasBetween){	// func(between, ...)
			let between = parseTokensToNative(parameters[0]);
			let firstParameter = parseTokensToNative(parameters[1]);
			for(let j = 0; j<func.tokenArray.length; j++){
				let token = func.tokenArray[j];
				if(token == "..."){ ret = [...ret, ...firstParameter];}
				else{ ret = [...ret, ...token];}}
			for(let i = 2; i<parameters.length; i++){
				ret = [...ret, ...between];
				for(let j = 0; j<func.tokenArray.length; j++){
					let token = func.tokenArray[j];
					if(token == "..."){ ret = [...ret, ...parseTokensToNative(parameters[i])];}
					else{ ret = [...ret, token];}}}
			return ret;}
		else{
			for(let i = 0; i<parameters.length; i++){
				for(let j = 0; j<func.tokenArray.length; j++){
					let token = func.tokenArray[j];
					if(token == "..."){ ret = [...ret, ...parseTokensToNative(parameters[i])];}
					else{ ret = [...ret, token];}}}
			console.log(ret);
			return ret;}}
	else{			// func(x, y)
		for(let i = 0; i<func.tokenArray.length; i++){
			print("callFunction: i at " + func.tokenArray[i]);
			let token = func.tokenArray[i];
			let varIndex = func.variableIndex(token);
			if(varIndex == none){ ret.push(token); }
			else{
				print("  Found parameter: " + token + "    " + varIndex);
				let parsedParameters = parseTokensToNative(parameters[varIndex]);
				ret = ret.concat(parsedParameters);}}}
	print("  Returning " + ret);
	return ret;}

// Iterates through the given tokenArray (ta)
// When it finds a '/', does its magic and resets the for loop
// Then it looks for '/' again from the beginning
// OPTIMIZATION: Remember the last position of '/' and start from there with the next for loop.
function parseTokenArrayWithSpecialOperators(ta){
	let tokenArray = ta.slice();
	let ret = [];
	for(let i = 0; i<tokenArray.length; i++){
		let token = tokenArray[i];
		if(token == "/" || token == "^" || token == "#"){
			let blockBefore, blockAfter;
			let retPartEnd;
			let retNextStart;
			let isUFunction = false;																			
			let theMiddleFunction = token;
			if(tokenArray[i-1] == ")"){
				let parOpenPos = findOpeningParanthesisPosition(tokenArray, i-1);
				let par1start = parOpenPos;
				if(isUserFunction(tokenArray[par1start - 1])){
					isUFunction = true;
					par1start --;
					blockBefore = tokenArray.slice(par1start, i);}
				else{
					par1start ++;
					blockBefore = tokenArray.slice(par1start, i - 1);}
				if(isUFunction) retPartEnd = par1start;
				else retPartEnd = parOpenPos;}
			else{
				blockBefore = tokenArray[i-1];
				retPartEnd = i-1;}
			if(tokenArray[i+1] == "("){
				let par2end = findClosingParanthesisPosition(tokenArray, i+1);
				blockAfter = tokenArray.slice(i+2, par2end);
				retNextStart = par2end + 1;}
			else{
				if(isUserFunction(tokenArray[i+1])){
					let par2end = findClosingParanthesisPosition(tokenArray, i+2);
					blockAfter = tokenArray.slice(i+1, par2end + 1);
					retNextStart = par2end + 1;}
				else{
					blockAfter = tokenArray[i+1];
					retNextStart = i+2;}}
			ret = ret.concat(tokenArray.slice(0, retPartEnd));
			if(theMiddleFunction == "/"){
				ret = ret.concat(["over", "("], blockBefore, [","], blockAfter, [")"]);
				ret = ret.concat(tokenArray.slice(retNextStart, tokenArray.length));}
			else if(theMiddleFunction == "^"){
				console.log(blockAfter);
				ret = ret.concat(["{"], blockBefore, ["}^{"], blockAfter, ["}"]);
				ret = ret.concat(tokenArray.slice(retNextStart, tokenArray.length));}
			else if(theMiddleFunction == "#"){
				ret = ret.concat(["{"], blockBefore, ["}_{"], blockAfter, ["}"]);
				ret = ret.concat(tokenArray.slice(retNextStart, tokenArray.length));
			}
			tokenArray = ret;
			ret = [];
			i = -1;
		}
	}
	return tokenArray;
}
		
		
function rememberFunctionNames(tokenArray){		// Iterates and reads and remembers function names
	for(let i = 0; i<tokenArray.length; i++){
		if(tokenArray[i] == 'function' || tokenArray[i] == 'func' || tokenArray[i] == 'macro' || tokenArray[i] == 'def'){
			Functions[tokenArray[i+1]] = true;
		}
	}
}
		
// Takes in a tokenArray, and returns the perfectly native tokenArray.
// (Perfectly native means it only contains native functions, all user functions
//  that it finds are inline'd using their function definitions)
function parseTokensToNative(tokenArray){
	print("Called parseTokensToNative for " + tokenArray);
	let returnedTokenArray = new Array();
	for(let i = 0; i<tokenArray.length; i++){
		let currentToken = tokenArray[i];
		if(theFunction = isUserFunction(currentToken)){		// Refactorable with only booleans
			print("Called function: " + theFunction);
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
		else if(currentToken == 'function' || currentToken == 'macro' || currentToken == 'func' || currentToken == 'def'){	// function name ( x , y )
			console.log("Found function: " + tokenArray[i+1]);
			let functionName = tokenArray[i + 1];
			let endPos = i+1;
			let parameterList = [];
			if(tokenArray[i+2] == '('){
				endPos = findClosingParanthesisPosition(tokenArray, i + 2);
				parameterList = arrayArrayToArray(splitByComma(tokenArray.slice(i + 3, endPos)));
			}
			let j = endPos;
			while(tokenArray[j] != "\n" && j < tokenArray.length){
				j++;}
			let parsedFunctionBody = parseTokensToNative(tokenArray.slice(endPos + 1, j));
			new Function(functionName, parameterList, parsedFunctionBody);
			i = j;}
		else returnedTokenArray.push(currentToken);} // End for
	print("Done parsing " + returnedTokenArray);
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
const FUNCTION  = 1;
const ROWS		= 2;	// Special type of native function, creates rows
const MATRIX	= 3;	// Special type, creates a matrix
function NativeFunction(name, type, fopen, fbetween, fclose){
	NativeFunctions[name] = this;
	this.name = name;
	this.type = type;
	if(this.type >= FUNCTION){
		this.leftParamWrapper = fopen;
		this.between = fbetween;
		this.rightParamWrapper = fclose;}
	if(this.type == ROWS){
		// Handled in callNativeFunction
	}
		}
new NativeFunction("\\frac", FUNCTION, "{", "", "}");
new NativeFunction("\\sqrt", FUNCTION, "{", "", "}");
new NativeFunction("rows", ROWS);
new NativeFunction("matrix", MATRIX);	// matrix(nrows, ncols, p1, p2, p3, p4, ...)

function isNativeFunction(string){
	for (var key in NativeFunctions) {
		if(!NativeFunctions.hasOwnProperty(key)) continue;	// Refactorable to only booleans
		if(key == string) return string;}
	return false;}

function callNativeFunction(nf, pars){
	console.log("Calling " + nf.name);
	let ret = "";
	if(nf.type == FUNCTION){
		ret = nf.name;
		for(let i = 0;i<pars.length; i++){
			ret += nf.leftParamWrapper + formatMathBlock(pars[i]) + nf.rightParamWrapper;}}
	else if(nf.type == ROWS){
		ret = "\\begin{matrix} ";
		for(let i = 0; i<pars.length; i++){
			ret += formatMathBlock(pars[i]) + " ";
			if(i != pars.length - 1){
				ret += " \\\\ ";}}
		ret += "\\end{matrix} ";}
	else if(nf.type == MATRIX){
		console.log("  It's a MATRIX");
		ret = "\\begin{pmatrix}";
		let nrows = pars[0];
		let ncols = pars[1];
		let actualParameters = pars.slice(2, pars.length);
		let i = 0;
		for(let ro = 1; ro <= nrows; ro++){
			for(let co = 1; co <= ncols; co++){
				ret += actualParameters[i];
				if(co != ncols){
					ret += " & ";}
				i++;}
			if(ro != nrows){
				ret += " \\\\ ";
			}
		}
		ret += "\\end{pmatrix}";
		console.log("  Finished ret as: " + ret);
	}
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
		let wordIsEscaped = false;
		if(token[0] == '~'){
			token = token.substring(1, token.length) + ' ';
			wordIsEscaped = true;
		}
		if(!wordIsEscaped && isNativeFunction(token)){
			let start = i + 1;
			let end = findClosingParanthesisPosition(tokenArray, start);
			let parameters = splitByComma(tokenArray.slice(start + 1, end));
			ret += callNativeFunction(NativeFunctions[token], parameters);
			i = end;}
		else if(!wordIsEscaped && isNativeMacro(token)){
			ret += NativeMacros[token] + " ";}
		else if(!wordIsEscaped && isTokenNumber(token) || isTokenOperator(token) || token[0] == "\\" || token == "}^{" || token == '}_{'){
			ret += token + " ";}
		else if((i>0 && tokenArray[i-1][0] != '~' && isNativeMacro(tokenArray[i-1])) || isTokenNumber(tokenArray[i-1]) || isTokenOperator(tokenArray[i-1]) || tokenArray[i-1] == "}^{"){
			ret += token + " ";}
		else if(firstWord){
			ret += token + " ";}
		else{
			ret += " \\ \\ " + token + " ";
		}
		if(firstWord){
			firstWord = false;
		}
	}
	return ret;}

	
	






