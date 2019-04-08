# ES6 & Beyond

## Syntax

### Block-Scoped Declarations

With `let` statement we can declare a block-scoped local variable. You cannot access the `let` variable before its declared thus should be declared at the top of the block for later use. 

```javascript
var arr = [];

for (let i = 0; i < 3; i++) {
	arr.push(() => i);
}

console.log(arr[0] () );	//	0
console.log(arr[1] () );	//	1
console.log(arr[2] () );	//	2
```

`const` is a read only block-scoped variable. The value cannot be changed through reassignment or be redeclared. If the value is complex, such as an `object` or `array`, the contents of the value can still be modified.

```javascript
{
	const a = [1, 2, 3];
	a.push(4);
	console.log(a);		// [1,2,3,4]

	try {
		a = 42;				
	} catch (e) {
		console.log(e);	// TypeError: "invalid assignment to const `a'"
	}
}
```

### Spread/Rest

If the spread operator `...` is used before an array or any other iterable it spreads out its individual values.

```javascript
function foo(x,y,z) {
	console.log( x, y, z );
}

foo(...[1,2,3]);  		// 1 2 3

console.log(...[4,5,6]);	// 4 5 6
```

We can also use it to concatinate values.

```javascript
var a = [2,3,4];
var b = [ 1, ...a, 5 ];

console.log(b);   // [1,2,3,4,5]
```

The other use is as a rest parameter syntax which allows us to *gather* a set of values together into an `array`.

```javascript
function foo(x, y, ...z) {
	console.log(x, y, z);
}

foo(1, 2, 3, 4, 5);	// 1 2 [3,4,5]
```

### Default Parameter Values and Value Expressions

```javascript
function b() {
	return 2;
}

function a(x = 1, y = b()) {
	return x + y;
}

console.log(a());                   //	3
console.log(a(2, 3));               //	5
console.log(a(null, undefined));    //	2	null coerces to 0 and undefined is a missing value
```

### Destructuring

The destructuring assignment syntax is an expression that unpacks values from `arrays`, or properties from `objects`, into distinct variables.

```javascript
// basic variable assignment
var arr = [1, 2, 3];
var obj = { x: 4, y: 5, z: 6 };

var [a, b, c] = arr;
var { x, y, z } = obj;
console.log(a, b, c, x, y, z);		// 1 2 3 4 5 6

// object property assignment pattern
var { x: d, y: e, z: f } = obj;
console.log(d, e, f);			// 4 5 6

// computed property expression
var which = "x", o = {};
({ [which]: o[which] } = obj);		// ({ [x]: o[x] } = { x:4, y:5, z:6 })
console.log(o.x);			// 4
console.log(o);				// { x: 4 }

// assignment seperate from declaration
var g, h;
[g, h] = [1, 2];
console.log(g, h);	// 1 2

// swapping variables without a need for the third variable
[g, h] = [h, g];
console.log(g, h);	// 2 1

// repeated assignments
var { a: i, a: j } = { a: 1 };
console.log(i, j)	// 1 1

// nested destructoring
var [a, [b, c, d], e] = [1, [2, 3, 4], 5];
console.log(a, b, c, d, e);	// 1 2 3 4 5

var { x: { y: { z: w } } } = { x: { y: { z: 6 } } };
console.log(w);			// 6
```

### Object Literal Extensions

#### Concise Properties and Methods

```javascript
var x = 2, y = () => 3;

obj = {
	x,
	y,
	z() {
		return 4;
	}
};

console.log(obj.x);	// 2
console.log(obj.y());	// 3
```

#### Computed Property Names

```javascript
var prefix = "user";

var obj = {
	[prefix + "_call"]: () => `${prefix} called!`
};

console.log(obj.user_call());	// "user called!"
```

#### Object `super`

We can use `super` to access parent object's concise methods.

```javascript
var o1 = {
	foo() {
		console.log("o1:foo");
	}
};

var o2 = {
	foo() {
		super.foo();
		console.log("o2:foo");
	}
};

Object.setPrototypeOf(o2, o1);

o2.foo();	// o1:foo
		// o2:foo
```

### Template Literals

```javascript
function upper(s) {
	return s.toUpperCase();
}

var who = "reader";

var text =
	`A very ${upper("warm")} welcome
to all of you ${upper(`${who}s`)}!`;

console.log(text);
// A very WARM welcome
// to all of you READERS!
```

#### Tagged Template Literals

```javascript
const a = (str, ...val) => {
	// str = [ 'Template literal string with', ' and ', '!' ]
	// val = [ 'text', 'some more text' ]

	return str.reduce((accumulator, currentValue, currentIndex) =>
		accumulator + val[currentIndex - 1] + currentValue);
}

var b = "text";
var c = "some more text";

var d = a`Template literal string with ${b} and ${c}!`;

console.log(d);
// Template literal string with text and some more text!
```

### Arrow Functions

Arrow functions are anonymous function expressions. Their bindings for `this`, `arguments`, `super` and `new.target` are lexical, inherited from their parent. 

```javascript
var f1 = () => 12;
var f2 = x => x * 2;
var f3 = (x, y) => {
	var z = x * 2 + y;
	y++;
	x *= 3;
	return (x + y + z) / 2;
};
```

When to use an arrow function:
* in a single-statement inline function expression, where the only statement is a `return` of some computed value where we don't use any self-reference. 
* in an inner function expression that uses `var self = this` hack or a `.bind(this)` call on the enclosing function
* in an inner function expression that uses something like `var args = Array.prototype.slice.call(arguments)` to make the lexical copy of arguments

### `for..of` Loops

The `for..of` statement creates a loop iterating over iterable objects, including: built-in `String`, `Array`, `Array`-like objects... and user-defined iterables.

**for..in vs for..of**

```javascript
var a = ["a", "b", "c"];

for (var i in a) {
	console.log(i);
}
// 0 1 2	keys/indexes

for (var v of a) {
	console.log(v);
}
// "a" "b" "c"	values
```

### Symbols

`symbol` is a new primitive type that doesn't have a literal form.

```javascript
var sym = Symbol("some optional description");

typeof sym;			// "symbol"
sym.toString();			// "Symbol(some optional description)"
sym instanceof Symbol;		// false

var symObj = Object( sym );
symObj instanceof Symbol;	// true

symObj.valueOf() === sym;	// true
```

The internal value of the `symbol` is unique and cannot be obtained. The optional parameter to the symbol should be a `string` description of the symbol.

The main point of a `symbol` is to create a string-like value that can't collide with any other value.

## Organization

### Iterators

#### `next()` Iteration

```javascript
var arr = [1, 2, 3];
var it = arr[Symbol.iterator]();

it.next();		// { value: 1, done: false }
it.next();		// { value: 2, done: false }
it.next();		// { value: 3, done: false }
it.next();		// { value: undefined, done: true }
```

#### Custom Iterators

```javascript
var i10 = {
	[Symbol.iterator]() {
		var n = 0;

		return {
			// make the iterator itself an iterable!
			[Symbol.iterator]() { return this; },
			next() {
				if (n < 10) {
					n++;
					return { value: n, done: false };
				} else {
					return { value: undefined, done: true }
				}
			}
		};
	}
}

for (var v of i10) {
	console.log(v);
}
/* 	
	1
	...
	10
*/

console.log(...i10);
// 1 2 3 4 5 6 7 8 9 10


it = i10[Symbol.iterator]();

console.log(it.next());
// { value: 1, done: false }
console.log(it.next());
// { value: 2, done: false }
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
// { value: 10, done: false }
console.log(it.next());
// { value: undefined, done: true }
```

#### Iterator Consumption

```javascript
var a = [1, 2, 3, 4, 5];
var it = a[Symbol.iterator]();

var [x, y] = it;
var [z, ...w] = it;

x;		// 1
y;		// 2
z;		// 3
w;		// [4,5]

it.next();	// { value: undefined, done: true }
```

### ES6 Modules

* file-based module with one module per file
* module's API is static
* modules are singletons (single instance and state)
* exposed properties and methods are bindings (almost like pointers) to the identifiers in your inner module definition
* importing a module is a static request

#### `export`
```javascript
//			./module.js

function foo() { console.log('foo'); }
function bar() { console.log('bar'); }
// declaration export
export function baz() { console.log('baz'); }

// named exports
export { foo as default, bar };
```

#### `import`
```javascript
// 			./index.js

// importing whole module to m
import * as m from './module.js';
console.log(m); //  Object { bar: bar(), baz: baz(), default: foo(), … }
m.default();    //  "foo"

// renaming the bound identifiers
import { default as f, bar as b, baz as c } from './module.js';
f();    //  "foo"
b();    //  "bar"
c();    //  "baz"

// importing only default
import a from './module.js';
a();     //  "foo";

// all imported bindings are immutable and/or read-only
try {
    a = () => { console.log('new foo'); };
} catch (e) {
    console.log(e);     // TypeError: ""a" is read-only"
}

// importing part of the module
import { bar } from './module.js';
bar();  // "bar"

try {
    baz();
} catch (e) {
    console.log(e);     // ReferenceError: "baz is not defined"
}
```

### Classes

* `class Foo` creates a (special) `function` of the name Foo
* `constructor(..)` method is a special method for creating and initializing an `object`
* Class methods use "concise method" syntax available to `object` literal and are non-enumerable whereas `object` methods are by default enumerable
* no commas are allowed to seperate members in a `class` body.
* Class must be instantiated with keyword `new`
* `class Foo` is not hoisted
* `class Foo` in the top global scope creates a lexical `Foo` identifier and not a global object property

#### `extends` and `super`

```javascript
class A {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	sum() {
		return this.x + this.y;
	}
}

// prototype delegation link
class B extends A {
	constructor(x, y, z) {
		super(x, y);
		this.z = z;
	}

	sum() {
		return super.sum() + this.z;
	}
}

var a = new B(1, 2, 3);
console.log(a.sum());	// 6
```

#### `extend`ing Natives

```javascript
class MyString extends String {
	first() { return this.charAt(0); }
	last() { return this.charAt(this.length - 1); }
}

var a = new MyString('test string');

console.log(a);		// [String: 'test string']
console.log(a.length);	// 11

console.log(a.first());	// t
console.log(a.last());	// g
```

## Collections

### Maps

`Map`s are an ordered key/value pair data structures where we can use non-`string` value (`object`s and primitive values) as a key.

```javascript
var o = {};

var x = { id: 1 },
	y = { id: 2 };

o[x] = "foo";
o[y] = "bar";

console.log(o[x]);	// "bar"
console.log(o[y]);	// "bar"
console.log(o);		// { '[object Object]': 'bar' }
// Both stringify to "[object Object]" so only one key is set

var m = new Map();

m.set(x, "foo");
m.set(y, "bar");

console.log(m.get(x));	// "foo"
console.log(m.get(y));	// "bar"

console.log(m);		// Map { { id: 1 } => 'foo', { id: 2 } => 'bar' }

// Map iterator
var it = m.entries();
console.log(it.next());	// { value: [ { id: 1 }, 'foo' ], done: false }
console.log(it.next());	// { value: [ { id: 2 }, 'bar' ], done: false }
console.log(it.next());	// { value: undefined, done: true }
```

### WeakMaps

`WeakMap`s take (only) `object`s as keys. Those `object`s are held weakly, which means if the `object` itself is garbage collected, the key entry in the `WeakMap` is also removed.

### Sets

`Set` is a collection of unique values (duplicates are ignored). `Set` uniqueness does not allow coercion, so `1` and `"1"` are considered distinct values.

```javascript
var s = new Set();

var x = { id: 1 },
	y = { id: 2 };

s.add(x);
s.add(y);
s.add(x);

s.size;			// 2

// Set iterator
var it = s.values();
it.next().value;	// Object { id: 1 }
it.next().value;	// Object { id: 2 }
it.next().value;	// undefined

s.delete(y);
s.size;			// 1

s.clear();
s.size;			// 0
```

### WeakSets

`WeakSet`s holds its values weakly and its values must be `object`s.

## API Additions

### `Array`

#### `Array.of(..)` Static Function

This method creates and array from a variable number of arguments.  
It solves the problem with `Array(7)` for instance, which creates an array with 7 empty slots.

```javascript
Array.of(7);       // [7] 
Array.of(1, 2, 3); // [1, 2, 3]

Array(7);          // [ <7 empty slots> ]
Array(1, 2, 3);    // [1, 2, 3]
```

#### `Array.from(..)` Static Function

The `Array.from()` method creates a new, shallow-copied `Array` instance from an `array`-like or iterable `object`. It takes the second paramter as a map function to call on every element of the array and third paramater as a reference to `this` in the mapping. 

```javascript
console.log(Array.from('foo'));
// [ 'f', 'o', 'o' ]

console.log(Array.from([1, 2, 3], function (x) {
	return x + this;
}, 4));
// [ 5, 6, 7 ]

console.log([,,,]);
// [ <3 empty items> ]
console.log(Array.from([,,,]));
// [ undefined, undefined, undefined ] it never produces empty slots but undefined values
```

#### `find(..)` and `findIndex(..)` Prototype Methods

`find()` method returns the value of the first element that satisfies the provided testing function, where `findIndex()` returns the index integer. If the element is not found `find()` returns `undefined` and `findIndex()` returns `-1`. 

```javascript
var a = [1, 2, 3, 4, 5];

console.log(a.find(v => v === 2));	// 2
console.log(a.find(v => v === 6));	// undefined

console.log(a.findIndex(v => v === 2));	// 1
console.log(a.findIndex(v => v === 6));	// -1

// custom matcher function also works with complex values like objects
var points = [
	{ x: 1, y: 2 },		// index 0
	{ x: 2, y: 3 },		// index 1
	{ x: 3, y: 4 }		// index 2
];

var pointIndex = points.findIndex(p => p.x === 2 && p.y === 3);
console.log(pointIndex);	// 1
```

#### `entries()`, `values()`, `keys()` Prototype Methods

```javascript
var a = [1, 2, 3];

console.log([...a.values()]);		// [1,2,3]	not wokring in node
console.log([...a.keys()]);		// [0,1,2]
console.log([...a.entries()]);		// [ [0,1], [1,2], [2,3] ]

console.log([...a[Symbol.iterator]()]);	// [1,2,3]
```

#### `Array#includes(..)` [ES7]

The `includes()` method determines whether an `array` includes a certain value among its entries, returning `true` or `false` as appropriate. `+0` and `-0` are considered equal match.

```javascript
var vals = ["foo", "bar", 42, "baz", 0];

if (vals.includes(42)) {
	console.log('found 42!');
}
// "found 42!""

if (vals.includes(-0)) {
	console.log('found +/-0!');
}
// "found +/-0!2
```

## Meta Programming

### Well Known Symbols

#### `Symbol.iterator`

Many objects come with an iterator but we can also override it or define our own.

```javascript
var arr = [1, 2, 3, 4, 5];

// reverse order
arr[Symbol.iterator] = function* () {
	let index = this.length;

	while (index > 0) {
		index--;
		yield this[index];
	}
};

for (var v of arr) {
	console.log(v);
}
// 5 4 3 2 1
```

#### `Symbol.toStringTag` and `Symbol.hasInstance`

```javascript
function Foo(greeting) {
	this.greeting = greeting;
}

Foo.prototype[Symbol.toStringTag] = "Foo";

Object.defineProperty(Foo, Symbol.hasInstance, {
	value: function (inst) {
		return inst.greeting == "hello";
	}
});
// Object.defineProperty(..) as the default one on Function.prototype is writable: false

var a = new Foo("hello");
console.log(a.toString());	// "[object Foo]"	[object ___] stringification
console.log(a instanceof Foo);	// true

var b = new Foo("world");
console.log(b instanceof Foo);	// false
```

#### `Symbol.toPrimitive`

The `Symbol.toPrimitive` is a symbol that specifies a function valued property that is called to convert an object to a corresponding primitive value.

```javascript
var obj = { x: 2 };

console.log(obj + 3);	// "[object Object]3"

obj[Symbol.toPrimitive] = function (hint) {
	console.log(hint);

	if (hint == "default" || hint == "number") {
		if (this.hasOwnProperty('x')) {
			return this.x;
		} else {
			return 0;
		}
	}
}

var another_obj = Object.create(obj);
another_obj.x = 5;

console.log(obj + 3);				// 5	hint = "default"
console.log(obj + another_obj);			// 7	hint = "default"
console.log(obj * another_obj);			// 10	hint = "number"	
console.log(String(obj) + String(another_obj));	// "25"	hint = "string"
```

`hint` is either `"string"`, `"number"` or `"default"` (which should be interpreted as `"number"`) depending on the operation invoking `ToPrimitive`.


`+` operation has no hint (`"default"` is passed)   
`*` operation would hint `"number"`  
`String(arr)` would hint `"string"`

### Proxies

A `Proxy` is a special kind of `object` that sits in front of another `object`. We can use it to define custom behavior for fundamental operations (e.g. property lookup, assignment, enumeration, function invocation, etc).

We can use `Proxy.revocable()` method to create a revocable `Proxy` object.

```javascript
var obj = { int: 20 };

var handlers = {
	get(obj, prop) {
		console.log('GET');

		if (prop in obj) {
			return obj[prop];
		}
	},
	set(obj, prop, val) {
		console.log('SET');

		if (prop === 'int') {
			if (!Number.isInteger(val)) {
				console.error(`${prop} should be integer!`);
			} else {
				obj[prop] = val;
				return true;
			}
		}
	},
	deleteProperty(obj, prop) {
		console.log('DELETE');

		if (prop in obj) {
			delete obj[prop];
			return true;
		} else {
			console.error(`${prop} not found!`);
		}
	},
};

var { proxy, revoke } = Proxy.revocable(obj, handlers);

console.log(proxy.int);	// GET
// 20

proxy.int = 100;	// SET
proxy.int = 'test';	// SET
// int should be integer!

console.log(obj.int);
// 100
console.log(proxy.int);	// GET
// 100

delete proxy.int;	// DELETE

console.log(obj.int);
// undefined

delete proxy.something;	// DELETE
// something not found!

revoke();
proxy.int = 200;	// TypeError: Cannot perform 'set' on a proxy that has been revoked
```
