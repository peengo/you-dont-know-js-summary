# Scope & Closures

## Lexical Scope

JavaScript uses lexical scope which is defined at lexing time. Lexical scope is based on
where variables and blocks of scope are authored at write time.Lexical scope cares where a function was declared, but dynamic scope cares where a function was called from.

You can cheat lexical scope using `eval()` or `with`, but its considered a bad practice.

```javascript
function foo() {
	console.log( a ); // 2	Reference of a in foo() will be globaly resolved
}

function bar() {
	var a = 3;
	foo();
}

var a = 2;
bar();
```

## Function declaration vs function expressions

If "function" is the very first thing in the statement, then it's a function declaration.
Otherwise, it's a function expression.

```javascript
function foo() {
    console.log('function declaration');
}

var a = bar() {
    console.log('function expression');
}
```

## Blocks as scopes

ES6 introduced `let` and `const` which are block-scoped variables.
Let is really useful in for-loops.

```javascript
for (let i=0; i<10; i++) {
	console.log( i );
}

console.log( i ); // ReferenceError: i is not defined
```

ES3 introduced a `try/catch` block in which the catch method is block-scoped to the try block.

```javascript
try {
	undefined();
}
catch (err) {
	console.log(err); // TypeError: "undefined is not a function"
}

console.log(err); // ReferenceError: err is not defined
```

## Hoisting

Hoisting is a concept in which JavaScript puts variables and functions declarations into
memory during compile phase. JavaScript only hoists declarations, not initializations.
If a variable is declared and initialized after using it, the value will be undefined.

```javascript
foo();

function foo() {
	console.log( a ); // undefined

	var a = 2;
}
```

Functions are hoisted first before variables.

```javascript
foo(); // 1

var foo;

function foo() {
	console.log(1);
}

foo = function() {
	console.log(2);
};
```
## Closures

Closure is when a function is able to "remember" and access its lexical scope even when that
function is executing outside its lexical scope.

```javascript
function makeFunc() {
	let name = "Name";

  	function displayName() {
    	console.log(name);
	}

  	return displayName;
}

var myFunc = makeFunc();
myFunc(); // Name
```

## Modules

Modules are code patterns which leverage the power of closure but which do not on the surface
appear to be about callbacks. 

```javascript
function myModule() {
	let greeting = "hello";

	function sayGreeting() { // closes over the private scope of myModule
		console.log(greeting);
	};

	return {
		greet: sayGreeting
	};
}

const m = myModule(); // creates an instance of myModule
m.greet(); // exercises the closure and logs hello
```