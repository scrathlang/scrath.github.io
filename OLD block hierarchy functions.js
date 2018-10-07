
// Blocks down, unused, with canvas
/*
const VerticalHierarchy = 1;
const HorizontalHierarchy = 2;
const Static = 3;
const Base = 4;

/*class Block{
	constructor(t, b, _w, _h){
		this.data = "#";
		this.type = t;
		this.blocks = b;
		if(t == Static && _w && _h){
			this.size = new Size(_w, _h);}
		else this.size = new Size(0, 0);
		this.position = new Position(0, 0);}}

function getTextSize(string){	// This is a temporary solution
	return new Size(5 * string.length + 10, 10);
}*/
/*
class Block{
	constructor(t, a){
		this.type = t;
		if(t == Static){
			this.data = a;
			this.size = getTextSize(a);}
		else{
			this.size = new Size(0, 0);
			this.tokenArray = a;
			this.blocks = [];}
		this.position = new Position(0, 0);}
	addChildBlock(b){
		this.blocks.push(b);
	}
	
}
class Size{
	constructor(_w, _h){
		this.w = _w;
		this.h = _h;}
}
class Position{
	constructor(_x, _y){
		this.x = _x;
		this.y = _y;}
}

function getBlockSize(block){
	print(block.type);
	switch(block.type){
		case Static: return block.size;
		case VerticalHierarchy: return getVerticalHierarchySize(block);
		case HorizontalHierarchy: return getHorizontalHierarchySize(block);}}
function getVerticalHierarchySize(block){
	print("  Getting vertical size for block:");
	for(let i = 0; i<block.blocks.length; i++){
		let currentBlock = block.blocks[i];
		print("    Getting size for inner block:");
		let currentSize = getBlockSize(currentBlock);
		print("    Found it : " + currentSize.w + "," + currentSize.h);
		block.size.h += currentSize.h;
		block.size.w = max(block.size.w, currentSize.w);}
	print("  Returning vertical it");
	return block.size;}
function getHorizontalHierarchySize(block){
	print("      Getting horizontal size for block:");
	for(let i = 0; i<block.blocks.length; i++){
		let currentBlock = block.blocks[i];
		let currentSize = getBlockSize(currentBlock);
		block.size.w += currentSize.w;
		block.size.h = max(block.size.h, currentSize.h);}
	print("      Returning horizontal it");
	return block.size;}
function setBlockPositions(block, currentX, currentY, parentBlock){
	block.position.x = currentX;
	block.position.y = currentY;
	switch(block.type){
		case Static: break;
		case VerticalHierarchy: setVerticalHierarchyPositions(block, currentX, currentY); break;
		case HorizontalHierarchy: setHorizontalHierarchyPositions(block, currentX, currentY); break;
	}
	
}
function setVerticalHierarchyPositions(block, currentX, currentY){
	let currentPosition = new Position(currentX, currentY);
	for(let i = 0; i<block.blocks.length; i++){
		let currentBlock = block.blocks[i];
		setBlockPositions(currentBlock, currentPosition.x, currentPosition.y);
		currentPosition.y += currentBlock.size.h;
		print("CP becomes " + currentPosition.y);}}	
function setHorizontalHierarchyPositions(block, currentX, currentY){
	let currentPosition = new Position(currentX, currentY);
	for(let i = 0; i<block.blocks.length; i++){
		let currentBlock = block.blocks[i];
		setBlockPositions(currentBlock, currentPosition.x, currentPosition.y);
		currentPosition.x += currentBlock.size.w;}}
function drawBlock(canvas, block){
	console.log("  Drawing block:");
	if(block.type == Static){
		console.log("    Block is static");
		drawTextOnCanvas(block.data, block.position.x, block.position.y, canvas, "10px Arial");}
	else{
		console.log("    Block aint static");
		for(var i = 0; i<block.blocks.length; i++){
			drawBlock(canvas, block.blocks[i]);
		}
	}
}
*/
/*
function formatBlock(block){	// Formats everything inside and itself, recursively. Sets up the hierarchy
	for(let i = 0; i<block.tokenArray.length; i++){
		let token = block.tokenArray[i];
		if(token == "vertical" || token == "horizontal"){
			let start = i + 1; // '('
			let end = findClosingParanthesisPosition(block.tokenArray, start);
			let parameters = splitByComma(block.tokenArray.slice(start + 1, end));
			if(token == "vertical"){
				let newBlock = new Block(VerticalHierarchy, parameters);
				formatBlock(newBlock);
				block.addChildBlock(newBlock);}
			else if(token == "horizontal"){
				let newBlock = new Block(HorizontalHierarchy, parameters);
				formatBlock(newBlock);
				block.addChildBlock(newBlock);}
			i = end;}
		else block.addChildBlock(new Block(Static, token));
	}
}

var BaseBlock = new Block(VerticalHierarchy, parsedTokens);
for(let i = 0; i<nativeLines.length; i++){
	BaseBlock.addChildBlock(new Block(HorizontalHierarchy, nativeLines[i]));}
for(let i = 0; i<BaseBlock.blocks.length; i++){
	formatBlock(BaseBlock.blocks[i]);}
	
print("Formatting");
formatBlock(BaseBlock);
print("Setting size");
getBlockSize(BaseBlock);
console.log("Setting positions");
setBlockPositions(BaseBlock, 50, 50);
console.log("Drawing");
drawBlock(get("C"), BaseBlock);
*/






