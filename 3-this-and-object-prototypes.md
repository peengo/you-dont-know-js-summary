# `this` & Object Prototypes

## `this`

`this` keyword is a binding that is made when a function is invoked, and what it references
is determined entirely by the call-site where the function is called.

`this` mechanism provides a more elegant way of implicitly "passing along" an object reference,
leading to cleaner API design and easier re-use.

`this` is not an author-time binding but a runtime binding.

There are 4 rules that the call-site determines where `this` will point during the
execution of a function.

### Default binding

This is the default rule when no other rules apply.
`this` references the global object (window object in a browser) or undefined in strict mode.

```javascript
function foo() {
	console.log(this.a);
}

var a = 2;
foo(); // 2
```

### Implicit binding

If the function is called on an object, `this` is is that context object.

```javascript
function foo() {
	console.log(this.a);
}

var obj = {
	a: 2,
	foo: foo
};

obj.foo(); // 2
```

### Explicit binding

If the function is called with `call()`, `apply()`, `bind()`, `this` is explicitly 
specified object.

```javascript
function foo() {
	console.log(this.a);
}

var obj = {
	a: 2
};

foo.call(obj); // 2
```

### New binding

If the functions is called with the `new` keyword, `this` is the newly constructed object.

```javascript
function foo(a) {
	this.a = a;
}

var bar = new foo(2);
console.log(bar.a); // 2
```

There is a priority order to this rules...

**new > explicit > implicit > default**

ES6 introduces an arrow function `=>` which is an exception to this rules.
It adopts the `this` binding from the enclosing (function or global) scope.

```javascript
function foo() {
	return (a) => {
		// `this` here is lexically adopted from `foo()`
		console.log(this.a);
	};
}

var obj1 = {
	a: 2
};

var obj2 = {
	a: 3
};

var bar = foo.call(obj1);
bar.call(obj2); // 2, not 3!
```

## Objects

Objects are collections of key/value pairs. The values can be accessed as properties, 
via `.propName` (dot) or `["propName"]` (bracket) notation.

There are 6 primary types and many other object sub-types.

Primary:
- `string`
- `number`
- `boolean`
- `null` (`typeof null` returns `"object"` which is a bug)
- `undefined`
- `object`

Built-in Objects: `String`, `Number`, `Boolean`, `Object`, `Function`, `Array`, 
`Date`, `RegExp`, `Error`

```javascript
var strPrimitive = "I am a string";
typeof strPrimitive;    // "string"
strPrimitive instanceof String; // false

var strObject = new String("I am a string");
typeof strObject;   // "object"
strObject instanceof String;    // true

// inspect the object sub-type
Object.prototype.toString.call(strObject);  // [object String]
```
### Duplicating Objects

If an object is JSON-safe we can duplicate it with JSON.stringify and JSON.parse functions.

```javascript
var newObj = JSON.parse(JSON.stringify(someObj));
```

The `Object.assign()` method is used to copy the values of all enumerable own properties 
from one or more source objects to a target object. It will return the target object.

```javascript
const object1 = {
  a: 1,
  b: 2,
  c: 3
};

const object2 = Object.assign({c: 4, d: 5}, object1);

console.log(object2.c, object2.d); // expected output: 3 5
```

### Property descriptors

As of ES5, all properties are described in terms of a property descriptor.

```javascript
var myObject = {
	a: 2
};

Object.getOwnPropertyDescriptor(myObject,"a");
// {
//    value: 2,
//    writable: true,
//    enumerable: true,
//    configurable: true
// }
```

Writable defines whether or not you can change the value.
Enumerable defines whether or not the property can be iterated over.
Configurable defines whether or not you can modify the property descriptor.

Configurable set to false means you can never change any of these values again.
Errors for changing this values are only seen in strict mode otherwise it silently fails.

### Immutability

`Object.preventExtensions()` prevents an object from having new properties added to it.

`Object.seal()` "seals" the object with `Object.preventExtenstions()` and sets 
all properties to `configurable: false`.

This prevents you from adding new properties as well as reconfiguring or deleting them.
You can however still modify their values.

`Object.freeze()` "freezes" the object with `Object.seal()` and sets all properties 
to `writable: false`. This is the highest level of immutability.


### Getter / Setter

Properties in an object don't have to contain values -- they can be "accessor properties" 
as well, with getters/setters. They can also be either enumerable or not, which controls 
if they show up in `for..in` loop iterations, for instance.

```javascript
var myObject = {
	// define a getter for `a`
	get a() {
		return 2;
	}
};

myObject.a = 3;
myObject.a; // 2
```

### Existence

The `in` operator checks if the property is in the object, or if it exists at any
higher level of the prototype chain.

The `Object.hasOwnProperty()` method returns a boolean indicating whether the object 
has the specified property as its own property (as opposed to inheriting it).

```javascript
var obj = { a: 2 };

console.log('a' in obj); // true
console.log('toString' in obj); // true

console.log(obj.hasOwnProperty('a')); // true
console.log(obj.hasOwnProperty('toString')); // false
```

## Classes

JavaScript has objects and not classes. The `class` keyword is just syntactic sugar
over objects. In traditional OOP, classes perform copy behaviour when you inherit or
instantiate. In JavaScript objects don't get copied to other objects rather they get 
linked together.

### Prototype

Mostly all objects have a prototype chain. That means if the property is not found
on the object the prototype link is followed. 

We can create new objects with `Object.create()` or `new` keyword. The difference
is that `Object.create()` doesn't call the constructor function but `new` does.

```javascript
var obj = function() {
	this.a = 2;
}
obj.prototype.get_a = function() {
	console.log(this.a);
}

var newTest = new obj();
newTest.get_a(); // 2

var createTest = Object.create(obj.prototype);
createTest.get_a(); // undefined
```

## Behavior Delegation

Behavior delegation is a very powerful design pattern as opposed to classes and inheritance.
JavaScript's prototype mechanism is a delegation mechanism. In behavior delegation, objects 
act as peers of each other, which delegate amongst themselves, rather than parent and child 
class relationships. We can allow object A to delegate to object B when needed. OLOO
(objects-linked-to-other-objects) is a code style which creates and relates objects 
directly without the abstraction of classes.

A simple rectangle and square example to show 3 design patterns.

### "class" design (pure JavaScript no "class" helpers)

```javascript
// parent class
function Rectangle(length, width) {
    this.length = length;
    this.width = width;
}

Rectangle.prototype.calculateArea = function () {
    return this.length * this.width;
}

Rectangle.prototype.calculatePerimeter = function () {
    return 2 * (this.length + this.width);
}

Rectangle.prototype.calculate = function () {
    return { area: this.calculateArea(), perimeter: this.calculatePerimeter() };
}

// child class
function Square(length) {
    Rectangle.call(this, length);
    this.width = length; // square only has length
}

Square.prototype = Object.create(Rectangle.prototype);

const rectangle = new Rectangle(4, 6);
console.log(rectangle.calculate()); // { area: 24, perimeter: 20 }

const square = new Square(6);
console.log(square.calculate()); // { area: 36, perimeter: 24 }
```

### ES6 `class` sugar

ES6 class is just a syntax sugar over objects which also hides the live delegation links 
between objects.

The `super` keyword is used to access and call functions on an object's parent.

The `extends` keyword is used in class declarations or class expressions to create a 
class which is a child of another class.

```javascript
// parent class
class Rectangle {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }
    calculateArea() {
        return this.length * this.width;
    }
    calculatePerimeter() {
        return 2 * (this.length + this.width);
    }
    calculate() {
        return { area: this.calculateArea(), perimeter: this.calculatePerimeter() };
    }
}

// child class
class Square extends Rectangle {
    constructor(length) {
        super(length);
        this.width = length; // square only has length
    }
}

const rectangle = new Rectangle(4, 6);
console.log(rectangle.calculate()); // { area: 24, perimeter: 20 }

const square = new Square(6);
console.log(square.calculate()); // { area: 36, perimeter: 24 }
```
**... and now the best way**

### **OLOO** style delegation (Objects Linked to Other Objects)

```javascript
const Rectangle = {
    init(length, width) {
        this.length = length;
        this.width = width;
    },
    calculateArea() {
        return this.length * this.width;
    },
    calculatePerimeter() {
        return 2 * (this.length + this.width);
    },
    calculate() {
        return { area: this.calculateArea(), perimeter: this.calculatePerimeter() };
    }
}

const Square = Object.create(Rectangle);

Square.init = function (length) {
    this.length = length;
    this.width = length; // square only has length
}

const rectangle = Object.create(Rectangle);
rectangle.init(4, 6);
console.log(rectangle.calculate()); // { area: 24, perimeter: 20 }

const square = Object.create(Square)
square.init(6);
console.log(square.calculate()); // { area: 36, perimeter: 24 }
```