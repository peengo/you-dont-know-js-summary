# Async & Performance

## Asynchrony: Now & Later

### Event Loop

Event loop is a continuously running loop and each iteration of this loop is called a "tick". For each "tick" if an event is waiting on the queue, it's taken off and executed. 

The environment places your callback into the event loop, such that some future tick will pick it up and execute it. Only one event can be processed from the queue at a  time.

simplified pseudocode to illustrate the concept:
```javascript
var eventLoop = [ ];
var event;

while (true) {
	if (eventLoop.length > 0) {
		event = eventLoop.shift();
		try {
			event();
		}
		catch (err) {
			reportError(err);
		}
	}
}
```

## Callbacks

A callback function is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of routine or action.


```javascript
// A
setTimeout( function(){
	// C
}, 1000 );
// B
```

A and B happens now and C happens later. 

```javascript
// nested callbacks
function first() {
    console.log("first");
    setTimeout(function second() {
            console.log("second");
            setTimeout(function third() {
                    console.log("third");
            }, 1000);
    }, 1000);
}

first();

// without nesting

function second() {
    console.log("second");
    setTimeout(third, 1000);
}

function first() {
    console.log("first");
    setTimeout(second, 1000);
}

function third() {
    console.log("third");
}

first();
```

The first code is callback hell with nesting / indentation. The second code is more sequential but still we are bouncing around our code from one function to another. 

Callbacks suffer from inversion of control that gives control over to another third party utility to invoke the contiuation of our program.

This means the callback could be called too early, or never at all. The third party could fail to pass along any necessary parameters to the callback. The callback could get called too few or too many times. Errors or exceptions could be swallowed.

We have to code our checks for all of this if we are using callbacks from third parties. 

## Promises

Promises are an easily repeatable mechanism for encapsulating and composing future values.  

A `Promise` is a future value on which we call `.then` and pass a fulfilment handler and an error handler. The error handler inside `.then` will catch errors in the promise while the `.catch` will catch errors in the handling of the promise. Both return new promises.

Promises are immutable and chainable.

```javascript
var a = new Promise((resolve, reject) => { setTimeout(() => resolve(2), 2000) });
var b = new Promise((resolve, reject) => { setTimeout(() => resolve(3), 5000) });


Promise.all([a, b])
	.then((values) => {
		console.log(values[0] + values[1]);
	}); // 5

a.then((val) => console.log(val)); // 2
b.then((val) => console.log(val)); // 3
```

### Promise Trust

Promises are built on trust compared to previous method of callback functions.

#### Calling Too Early

Even immediately fulfilled Promise (`new Promise(function(resolve){resolve(1);})`) cannot be observed synchronously. The callback provided to `.then` will always be called asynchronously. 

#### Calling Too Late

When a Promise is resolved, all `.then` callbacks on it will be called in order, at the next asynchronous opportunity. Nothing that happens inside one of those callbacks can affect or delay the calling of the other callbacks.

```javascript
p.then(function(){
	p.then( function(){
		console.log("C");
	});
	console.log("A");
});
p.then( function(){
	console.log("B");
});
// A B C
```

#### Never Calling the Callback

Promise either gets resolved or rejected. If that doesn't happen in a timely matter we can use a higher level of abstraction called `Promise.race` with our promise and a timeout promise that can ensure us that after a certain time the promise is rejected.

```javascript
var promise = new Promise(function (resolve, reject) {
	setTimeout(resolve, 3000, 'our promise was first');
});

var promiseTimeout = new Promise(function (resolve, reject) {
	setTimeout(reject, 1000, 'timeout promise was first');
});

Promise.race([promise, promiseTimeout]).then(
	function fullfilled(value) {
		console.log('fullfiled:', value);
	}, 
	function rejected(reason) {
		console.log('rejected:', reason);
	});
// rejected: timeout promise was first
```

#### Calling Too Few or Too Many Times

A Promise can only be resolved once. If for some reason resolve or reject were called multiple times, only the first resolution would be accepted.

#### Failing to Pass Along Any Parameters/Environment

Promises can have, at most, one resolution value (fulfillment or rejection). If no value is passed, it will be `undefined`. If resolve or reject is called with multiple parameters, all but the first will be ignored.

#### Swallowing Any Errors/Exceptions

If you explicitly reject the promise with a reason that value is then passed to the rejection callback(s). 

If for example `TypeError` or `ReferenceError` occurs inside a promise, that exception will be caught and force the promise in question to be rejected.

```javascript
var p = new Promise(function (resolve, reject) {
	foo.bar(); // error here - doesn't go below
	resolve(42);
	console.log("promise");
});

p.then(
	function fulfilled() {
		console.log("fulfilled"); // doesn't reach here
	},
	function rejected(err) {
		console.error(err);
	}
);
// ReferenceError: foo is not defined
```

### Chain Flow

Every time we call `.then()` on a promise, it creates and returns a new promise, which we can chain with. The value that we return in `.then()` function is passed to the next chained `.then()` function. 

```javascript
var p = Promise.resolve(21);

var p2 = p.then(function (v) {
	console.log(v);	// 21
	return v * 2;
});

p2.then(function (v) {
	console.log(v);	// 42
});
```

We can eaither return a new promise or use a return statement.

```javascript
var p = Promise.resolve(1);

var p2 = p.then(function (v) {
	console.log(v); // 1

	return new Promise(function (resolve, reject) {
		resolve(v * 2);
	});
}).then(function (v) {
	console.log(v);	// 2

	return v * 3;
}).then(function (v) {
	console.log(v) // 6
});
```

## Generators

Generators are functions that don't have to run to completion. We can start them and pause them in the middle. They are declared with `function*`.

To indicate a pause point we use `yield` keyword. Before using the generator we must first construct its iterator. 

We can then call `.next()` on the iterator to eaither start the iterator or continue from yielding. This returns an object of two properties, the yielding `value` and `done` of type boolean to indicate a generator completion.

We can use `yield` and `next(..)` to input/output values to the generator.

### Iteration Messaging

```javascript
// generator function
function *foo(x) {
	var y = x * (yield "Hello");
	return y;
}

// construct its iterator
var it = foo(5);


var res = it.next();	// start the iterator
res.value;		// "Hello"	(output of first yield)
res.done;		// false

res = it.next(6);	// passing 6 to waiting yield	(input to first yield)
res.value;		// 30	(output of generator return statement)
res.done;		// true
```

### Generators + Promises

We can combine generators with promises into synchronous-looking async code and we can even catch the errors. 

```javascript
function timeoutPromise(ms) {
	return new Promise(function (resolve, reject) {
		setTimeout(reject, ms, "Hello");
	});
}

function* main() {
	try {
		var text = yield timeoutPromise(1000);
		console.log(text);
	} catch (err) {
		console.log('catch error:', err);
	}
}

var it = main();

var p = it.next().value;

p.then(
	function fullfiled(text) {
		it.next(text);
	},
	function rejected(err) {
		it.throw('iterator throw error: ' + err);
	}
);

// catch error: iterator throw error: Hello
```
#### ES7: async and await

The `await` operator is used to wait for a `Promise`. It can only be used inside an `async function`. 

So instead of `yield`ing a `Promise` we `await` for it to resolve. Async function automatically knows what to do if you `await` a `Promise`. It pauses the function until the Promise is resolved. 

Async function returns a Promise which will be resolved with the value returned by the async function, or rejected with an uncaught exception thrown from within the async function.

```javascript
function timeout(x) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(x);
		}, 2000);
	});
}

async function a() {
	var x = await timeout(10);
	console.log('inside a:', x);
	return x + 1;
}

a().then(x => console.log('then a:', x));

/*
inside a: 10
then a: 11
*/

// console.log(typeof a); // "function"
// console.log(Object.getPrototypeOf(a));	// AsyncFunction {}
// console.log(Object.getPrototypeOf(a()));	// Promise {}
```

### Generator Delegation

The `yield*` expression is used to delegate to another generator or iterable object. The purpose of `yield`-delegation is mostly code organization, and in that way is symmetrical with normal function calling.

```javascript
function* f1() {
	console.log('inside f1');
	yield 1;
	console.log('still inside f1');
	return 2;
}

function* f2() {
	console.log('inside f2');
	var x = yield* f1();
	console.log('x:', x);
	console.log('still inside f2');
	return x + 1;
}

const iterator = f2();

console.log(iterator.next());
console.log(iterator.next());

/*

inside f2
inside f1
{ value: 1, done: false }

still inside f1
x: 2
still inside f2
{ value: 3, done: true }

*/
```

## Program Performance

### Web Workers

Web workes are a part of the web browser hosting environment. They allow us to run scripts on a seperate thread. This allows us to run different parts of our program in parallel. They use async events to message between the threads. They’re wonderful for offloading long-running or resource-intensive tasks to a different thread, leaving the main UI thread more responsive.

Web Workers are commonly used for:
* processing intensive math calculations,
* sorting large data sets,
* data operations such as compression, and
* high network traffic communications

example: <https://github.com/peengo/webworker-test>  
live: <https://stackblitz.com/edit/js-r7ajmj>

## asynquence Library

Asynquence is an abstraction library that runs on top of promises (promise chains) that lets you express flow control steps with callbacks, promises, or generators. 

```javascript
const timeoutDone = done => {
    setTimeout(() => done('timeout done!'), 1000);
}

const timeoutFail = done => {
    setTimeout(() => done.fail('timeout failed!'), 1000);
}

const promiseResolved = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve('promise resolved!') }, 5000);
    });
}

const promiseRejected = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { reject('promise rejected!') }, 5000);
    });
}

const e2 = (x, done) => {
    setTimeout(() => done(x * x), 1000);
}


const seq = ASQ(timeoutDone)
    .val((done) => console.log(done))
    .gate(
        timeoutDone,
        done => {
            setTimeout(() => done('second timeout done!'), 2000);
        }
    )
    .val((msg1, msg2) => console.log('gate:', msg1, msg2))
    .last(
        timeoutDone,
        ASQ().promise(promiseResolved)
    )
    .val(last => console.log('last:', last))
    .none(
        timeoutFail,
        done => {
            setTimeout(() => done.fail('second timeout failed!'), 3000);
        }
    )
    .val((msg1, msg2) => console.log('none:', msg1, msg2))
    .map([2, 4, 6], e2)
    .val(array => console.log(array))
    .then(ASQ().promise(promiseRejected))
    .onerror(err => console.log('error:', err));

/*

timeout done!
gate: timeout done! second timeout done!
last: promise resolved!
none: timeout failed! second timeout failed!
[ 4, 16, 36 ]
error: promise rejected!

*/
```
