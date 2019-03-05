# Types And Grammar

## Types

There are 7 built-in types in JavaScript: `null`, `undefined`, `boolean`, `number`, `string`, `object`, `symbol` (added in ES6).

All of these except `object` are called "primitives".

### typeof null Bug!

```javascript
typeof null === "object"; // true
```

This has been known to be a bug for two decades and will likely never be fixed where fixing it would produce more bugs in already existed web code.

If you want to test for a null value using its type, you need a compound condition.

```javascript
var a = null;

(!a && typeof a === "object"); // true
```

`null` is the only primitive value that returns `false` and that also returns `"object"` from the `typeof` check.

### Values as Types

Variables don't have types.  
Values have types.  
Variables can hold any value, at any time.

The typeof operator always returns a string.

```javascript
typeof typeof 42; // "string"
```

The first `typeof 42` returns `"number"`, and `typeof "number"` is `"string"`.

### Safe Existance Check

To check if variable was declared without throwing a `ReferenceError` use the code below...

```javascript
// this is a safe existence check
if (typeof DEBUG !== "undefined") {
	console.log("Debugging is starting");
}
```

We can also do a check on the global variable since it is also a property on the global object.

```javascript
if (window.DEBUG) {
	// ..
}
```

There is no `ReferenceError` if you try to access an object property that doesn't exist.

## Values

### Arrays

Use `array`s for holding strictly numerically indexed values and `object`s for holding key/value pairs.

### Strings

`string`s are immutable, while `array`s are mutable. 
None of the methods that alter `string`s can modify in-place, but must create and return a new `string`.
Many of the `array` methods that change its content actually do modify in-place.

```javascript
var a = "foo";
var b = ["f","o","o"];

c = a.toUpperCase(); // returns new string which is stored in c
a === c;	// false
a;		// "foo"
c;		// "FOO"

b.push("!"); // in-place modifier
b;		// ["f","O","o","!"]
```

Many of the `array` methods we can actually use also on `string`s.

```javascript
var e = Array.prototype.some.call(a, (x) => x === "f" ); // true
var e = Array.prototype.some.call(a, (x) => x === "e" ); // false

var f = Array.prototype.find.call(a, (x) => x === "f"); // "f"
var f = Array.prototype.find.call(a, (x) => x === "e"); // undefined
```

### Numbers

`number`s are generally expressed as base-10 decimal literals. JavaScript uses "floating-point" numbers.

```javascript
var a = 42;
var b = 42.3;

var a = 0.42;
var b = .42;

var a = 42.0;
var b = 42.;

var a = 42.300;
var b = 42.0;

// numbers are outputed with trailing fractionals removed
a; // 42.3
b; // 42

// very large and small numbers will be outputted in exponent form
var a = 5E10;
a;					// 50000000000
a.toExponential();	// "5e+10"

var b = a * a;
b;					// 2.5e+21

var c = 1 / a;
c;					// 2e-11
```

We can use `Number.prototype` functions directly on the number literal.

```javascript
// invalid syntax:
42.toFixed(3);	// SyntaxError	because . is a part of 42. literal which is valid and then there is no . property operator present

// these are all valid:
(42).toFixed(3);	// "42.000"
0.42.toFixed(3);	// "0.420"
42..toFixed(3);	// "42.000"
```

We can represent numbers also as binary, octal, hexadecimal. Lowercase predicates are prefered: `0b`, `0o`, `0x`.

```javascript
0b11110011;	// binary for: 243
0o363;		// octal for: 243
0xf3; 		// hexadecimal for: 243
```

#### Small Decimal Values

```javascript
0.1 + 0.2 === 0.3; // false
```

The representation for `0.1` and `0.2` in binary floating-point are not exact. The sum of those two values is `0.30000000000000004`.
For this type of calculations its best to use a big numbers library.

### Testing for Integers

We can test if a value is an integer or safe integer.

```javascript
Number.isInteger(42);		// true
Number.isInteger(42.000);	// true
Number.isInteger(42.3);	// false

Number.isSafeInteger(Number.MAX_SAFE_INTEGER );	// true
Number.isSafeInteger(Math.pow(2,53));		// false
Number.isSafeInteger(Math.pow(2,53)-1);		// true
```

### Special Values

For both `undefined` and `null` its type and value are the same.

type: `undefined`, value: `undefined`  
type: `null`, value: `null`

`undefined` is a missing value / hasn't had value yet  
`null` is an empty value / had a value and doesn't anymore

`null` is a special keyword and not an identifier but `undefined` is an identifier.

```javascript
function foo() {
	undefined = 2; // really bad idea!
}

foo();
```

#### `void` Operator

The `void` operator "voids" out any value and returns `undefined`

```javascript
console.log (void "test"); // undefined

var test = setTimeout(()=> console.log("test"), 2000);
console.log(test); // TimeoutID positive integer in browser and object in nodejs

var void_test = void setTimeout(()=> console.log("void test"), 3000);
console.log(void_test); // undefined
```

If a value exists in some expression and you need it to return `undefined` use the `void` operator.

### Special Numbers

#### The Not a Number, Number

Mathematic operation between both operands not being a number will produce a value `NaN` (not a number) which is still of type `number`.

`NaN` is a very special value and its never equal to another `NaN` or itself. To check if something is `NaN` we use the built-in helper function `isNaN()`.

```javascript
var a = 2 / "foo"; 	// NaN

typeof a === "number";	// true

a == NaN;		// false
a === NaN;		// false

NaN == NaN;		// false
NaN === NaN;		// false

Number.isNaN(a); 	// true
```

#### Infinities

```javascript
1 / 0;	// Infinity (any positive number)
-1 / 0;	// -Infinity (any negative number)
Infinity / Infinity // NaN
1 / Infinity // 0 (any positive number)
-1 / Infinity // -0 (any negative number)
```

#### Zeros

```javascript
var a = 0 / -3;
a; 				// -0

a.toString();			// "0"
String(a);			// "0"
JSON.stringify(a);		// "0"

+"-0";				// -0
Number("-0");			// -0
JSON.parse("-0");		// -0	inconsistent with JSON.stringify()

var a = 0;
var b = 0 / -3;

a == b;		// true
-0 == 0;	// true

a === b;	// true
-0 === 0;	// true

0 > -0;		// false
a > b;		// false
```

#### Special Equality

The `Object.is()` method determines whether two values are the same value (ES6+).

```javascript
Object.is(NaN, NaN)		// true
Object.is(NaN, 1 / "a") 	// true
Object.is(-3 * 0, -0) 		// true
Object.is(-0, 0) 		// false
```

### Value vs. Reference

Simple scalar primitives (`string`s, `number`s, ...) are assigned by value-copy but compound 
values (`object`s, `array`s) are assigned by reference-copy. References are not like pointers in other languages. They are references to the value itself and not the variable.

```javascript
// value-copy
var a = 2;
var b = a; 	// `b` is always a copy of the value in `a`
b++;
a; // 2
b; // 3

// reference-copy
var c = [1,2,3];
var d = c; 	// `d` is a reference to the shared `[1,2,3]` value
d.push(4);
c; // [1,2,3,4]
d; // [1,2,3,4]
```

To empty an existing array without creating a new array we can use `Array.length = 0`.
This is usefull if an array is passed into function as a parameter.

```javascript
function foo(x) {
	x.push(4);
	x; // [1,2,3,4]

	// later
	x.length = 0; // empty existing array in-place
	/* 
	without the upper line the a; would be [1,2,3,4,5,6,7]
	if the upper line would be x = []; the a; would be [1,2,3,4] 
	because we made a referene to a newly created array and we didn't touch a again
	with the second push(4,5,6,7)
	*/
	x.push(4,5,6,7);
	x; // [4,5,6,7]
}

var a = [1,2,3];

foo(a);

a; // [4,5,6,7]
```

## Natives

Most commonly used natives: `String()`, `Number()`, `Boolean()`, `Array()`, `Object()`, `Function()`, `RegExp()`, `Date()`, `Error()`, `Symbol()`.

### Boxing Wrappers

JavaScript automatically boxes (object wrap) primitive values with properties and methods of their object subtype. 

```javascript
var a = "abc";

a.length; // 3
a.toUpperCase(); // "ABC"

Object.prototype.toString.call(a); // "[object String]"
```

### Unboxing

If we wanna access the primitive value under the object wrapper we can use `valueOf()` method.

```javascript
var a = new String("abc");
var b = new Number(42);
var c = new Boolean(true);

a.valueOf(); // "abc"
b.valueOf(); // 42
c.valueOf(); // true
```

### Natives as Constructors

For `array`, `object`, `function`, and regular-expression values, it's almost universally preferred that you use the literal form for creating the values.  

There is no literal form for 
`Date(..)` and `Error(..)` native constructors.

```javascript
Date(); // "Wed Feb 20 2019 15:10:04 GMT+0100 (Central European Standard Time)"
new Date(); // Date object with current date and its methods
Date.now(); // 1550671999731 -> number of milliseconds elapsed since January 1, 1970 00:00:00 UTC

throw new Error("error message"); // useful for determening the position of the error in the code and call-stack.
```

## Coercion

### Converting Values

```javascript
var a = 42;

var b = a + "";		// implicit coercion

var c = String(a);	// explicit coercion
```

### ToString

Very large and very small numbers are represented in exponential form.

```javascript
var a = 1.07 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000;
a.toString(); // "1.07e21"
```

### JSON Stringification

JSON-safe value can be stringified using `JSON.stringify()`. JSON-safe is any value that doesn't include `undefined`s, `function`s, `symbol`s and `object`s. First three values are stringified as `null` but for the `object` the lookup occurs for the `toJSON()` function which should return a JSON-safe `object` (not `string`) which is then stringified by the `JSON.stringify()` function. `object`s that have cyclic reference(s) are not JSON-safe and produce an error at stringification. 

```javascript
var o = { };

var a = {
	b: 42,
	c: o,
	d: function(){}
};

o.e = a;

a.toJSON = function() {
	return { b: this.b };
};

JSON.stringify(a); // "{"b":42}"
```

### ToNumber

`true` becomes `1`  
`false` becomes `0`  
`undefined` becomes `NaN`  
`null` becomes `0`

### ToBoolean

"falsy" list:
* undefined
* null
* false
* +0, -0, and NaN
* ""

This values coerce to `false`. Anything not on the list coerces to `true`.

```javascript
var a = "0";
var b = "";

Boolean(a); // true
Boolean(b); // false
// we can also use double negation to coerce to Boolean
!!a; // true
!!b; // false
```

### Explicitly: Parsing Numeric Strings

Parsing a numberic value out of a string is tolerant and it will stop when it encounters first non numeric character from left-to-right. Coercion is not tolerant and it will result in the `NaN` value. 

```javascript
var a = "42";
var b = "42px";

Number(a);	// 42
parseInt(a);	// 42

Number(b);	// NaN
parseInt(b);	// 42
```

### Implicit Coercion

If either operand to `+` is a `string` (or becomes one), the operation will be `string` concatenation. Otherwise, it's always numeric addition. `object` (including `array`) for either operand, it first calls the `ToPrimitive` abstract operation on the value, which then calls the [[DefaultValue]] algorithm with a context hint of `number`.

```javascript
[1,2] + [3,4] //	"1,23,4" = "1,2 + "3,4"
// [1,2].toString() + [3,4].toString();
```

The `valueOf()` fails to produce a simple primitive so the `toString()` is used in the above example. 

```javascript
[] + {} // "[object Object]" = "" + "[object Object]"
// [].toString() + new Object().toString();

var a = 42;
var b = a + "";

b; // "42"
```

For coercing from `string` to `number` we can use the `-`, `*`, `/` operators. 
This operators are only defined for numeric operations.

```javascript
var a = "3.14";
var b = a - 0;
b; // 3.14

var c = [3];
var d = [1];
c - d; // 2
```

#### Implicitly: * --> Boolean

The following expression operations force implicit boolean coercion:
* `if(..)` statement
* `for(..; ..; ..)` (second clause) in loop
* `while(..)` and `do..while(..)` loops
* `? :` (first clause) in ternary expressions
* `||` ("logical or") and `&&` ("logical and") operators in a test expression

### Symbol Coercion

Explicit coercion from `symbol` to `string` is allowed but implicit throws an error.

```javascript
var s1 = Symbol("cool");
String(s1);	// "Symbol(cool)"

var s2 = Symbol("not cool");
s2 + "";	// TypeError: can't convert symbol to string
```

`symbol` values cannot coerce to `number` but they can explicitly and implcitly coerce to `boolean` (always `true`).

### Loose Equals vs. Strict Equals

```javascript
// strings to numbers
var a = 42;
var b = "42";

a == b;		// true		(with coercion)		42 = 42
a === b;	// false	(without coercion)	42 = "42"

// anything to boolean
var a = "42";
var b = true;

a == b;	// false	42 == 1	(both get coerced to number)

// null to undefined
var a = null;
var b;

a == b;		// true
a == null;	// true
b == null;	// true

a == false;	// false
b == false;	// false
a == "";	// false
b == "";	// false
a == 0;		// false
b == 0;		// false

// objects to non-objects
var a = 42;
var b = [42];

a == b;	// true		42 == "42"	with coercion	42 == 42
```

### Abstract Relational Comparison

The algorithm first calls `ToPrimitive` coercion on both values, and if the return result of either call is not a `string`, then both values are coerced to `number` values using the `ToNumber` operation rules, and compared numerically.

```javascript
var a = [ 42 ];
var b = [ "43" ];

a < b;	// true		42 < 43
b < a;	// false	43 < 42
```

If `ToPrimitive` call coerces to two `string` values they are compared lexicographically.

```javascript
var a = [ "42" ];
var b = [ "043" ];

a < b;	// false
```

## Grammar

### Statements & Expressions

Statements are sentences, expressions are phrases, and operators are conjunctions/punctuation.

```javascript
var a = 3 * 6;	// declaration statement but without var its assignment expression
var b = a;	// -||-
b; // expression statement
// *,= are operators here
```

### Expression Side Effects

```javascript
var a = 42;
var b = a++;	// postfix increment which happens after the value is returned from the expression

a;	// 43
b;	// 42
```

### Operator Precedence

```javascript
var a = 42;
var b = "foo";
var c = false;

var d = a && b || c ? c || b ? a : c && b : a;

d;		// 42
```

```javascript
((a && b) || c) ? ( (c || b) ? a : (c && b) ) : a 	// precedence: && over || over ( ? : )
("foo" || c) ? ( (c || b) ? a : (false) ) : a		// evaluated && operator
"foo" ? ("foo" ? a : false ) : a			// evaluated || operator
"foo" ? 42 : 42						// evaluated inner ternary operator
42							// evaluated outer ternary operator
```

### `try..finally`

The code in the `finally` clause always runs and also after the `try` and `catch` clause finish.
If we have a `return` or `throw` statement in the `finally` clause that will also override as the primary completion of that function. The previous return value for `try` or `catch` clause will be abandoned.

```javascript
function foo() {
	try {
		console.log("console try");
		throw "throw try";
	}
	catch (e) {
		console.log("console catch");
		throw "catch";
	}
	finally {
		console.log("console finally");
		throw "finally"
	}

	console.log("never runs");
}

console.log(foo());
/*

console try
console catch
console finally
Error: finally

*/
```

### `switch`

The matching that occurs in the `case` expression is identical to the `===` algorithm. We can force the coercive equality (`==`) with the next example. The `default` clause doesn't need to be at the end. 

```javascript
var a = "42";

switch (true) {
	case a == 10:
		console.log("10 or '10'");
		break;
	case a == 42:
		console.log("42 or '42'");
		break;
	default:
		// never gets here
}
// 42 or '42'
```
