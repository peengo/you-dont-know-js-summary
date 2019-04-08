// DESIGN PATTERNS


// SINGLETON PATTERN
const singleton = (function () {
    let foods = ['broccoli', 'apple', 'potato', 'artichoke'];
    let instance;

    let createInstance = () => {
        return { food: foods[Math.floor(Math.random() * foods.length)] };
    }

    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    }
})();

var a = singleton.getInstance();
var b = singleton.getInstance();

console.log(a, b);



// OBSERVER PATTERN
class Subject {
    constructor() {
        this.observers = [];
    }
    sub(observer) {
        this.observers.push(observer);
    }
    unsub(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }
    notify() {
        for (const o of this.observers) {
            o.update();
        }
    }
    increment(observer) {
        observer.obj.num++;
        this.notify();
    }
}

class Observer {
    constructor(obj) {
        this.obj = obj;
    }
    update() {
        console.log('Observer', this.obj, 'is notifed');
    }
}

var subject = new Subject();

var o1 = new Observer({ num: 1 });
var o2 = new Observer({ num: 2 });

subject.sub(o1);
subject.sub(o2);

console.log(subject.observers); // [ Observer { obj: { num: 1 } }, Observer { obj: { num: 2 } } ]
subject.notify(o2);
// Observer { num: 1 } is notifed
// Observer { num: 2 } is notifed

subject.increment(o2);
// Observer { num: 1 } is notifed
// Observer { num: 3 } is notifed

console.log(subject.observers); // [ Observer { obj: { num: 1 } }, Observer { obj: { num: 3 } } ]



// MEDIATOR PATTERN
// Colleague
class User {
    constructor(username) {
        this.username = username;
        this.msgsystem = null;
    }
    send(message, to) {
        this.msgsystem.store(message, this, to);
    }
    showAll() {
        const msgArr = this.msgsystem.retrieveAll(this.username);

        if (msgArr.length > 0) {
            for (const m of msgArr) {
                console.log(`${m.from} -> ${m.to}: ${m.message}`);
            }
        } else {
            console.log('no messages!');
        }
    }
}
// Mediator
class MsgSystem {
    constructor() {
        this.users = {};
        this.messages = [];
    }
    join(user) {
        this.users[user.username] = user;
        user.msgsystem = this;
    }
    store(message, from, to) {
        this.messages.push({
            from: from.username,
            to: to.username,
            message
        });
    }
    retrieveAll(to) {
        return this.messages.filter(m => m.to === to);
    }
}

const john = new User('john');
const george = new User('george');
const oscar = new User('oscar');

const msgSystem = new MsgSystem();
msgSystem.join(john);
msgSystem.join(george);
msgSystem.join(oscar);

john.send('text message', george);
john.send('another text message', george);
oscar.send('another text message', john);

george.showAll();
// john -> george: text message
// john -> george: another text message
oscar.showAll();
// no messages!

console.log(JSON.stringify(msgSystem.messages, 0, 3));
/*
[
   {
      "from": "john",
      "to": "george",
      "message": "text message"
   },
   {
      "from": "john",
      "to": "george",
      "message": "another text message"
   },
   {
      "from": "oscar",
      "to": "john",
      "message": "another text message"
   }
]
*/



// COMMAND PATTERN
class MyArray {
    constructor() {
        this.arr = [];
    }
    add(item) {
        if (!this.arr.includes(item)) {
            this.arr.push(item);
            console.log('added item:', item);
        } else {
            console.log('duplicate:', item, '(no change)');
        }
    }
    remove(item) {
        if (this.arr.includes(item)) {
            this.arr = this.arr.filter(v => v !== item);
            console.log('removed item:', item);
        } else {
            console.log('item:', item, 'not found (no change)');
        }
    }
    do(name) {
        const args = Array.from(arguments);
        args.shift();

        if (typeof this[name] === 'function') {
            for (const arg of args) {
                this[name](arg);
            }
        } else {
            console.log('function does not exist');
        }
    }
}

const arr = new MyArray();

arr.do('add', 1);		// added item: 1
arr.do('add', 2);		// added item: 2
arr.do('add', 2);		// duplicate: 2 (no change)
arr.do('add', 3);		// added item: 3

arr.do('remove', 2);	// removed item: 2
arr.do('remove', 4);	// item: 4 not found (no change)

arr.do('add', 1, 5, 6, 7, 8);
/*
duplicate: 1 (no change)
added item: 5
added item: 6
added item: 7
added item: 8
*/
arr.do('remove', 6, 8, 9);
/*
removed item: 6
removed item: 8
item: 9 not found (no change)
*/
arr.do('something', 1, 2, 3); // function does not exist

console.log(arr);   // MyArray { arr: [ 1, 3, 5, 7 ] }
