# Up & Going

A simple rectangle area and perimeter calculation.

```javascript
const LENGTH = 4;
const WIDTH = 6;

// Rectangle functions
const calculateArea = (length, width) => {
    return length * width;
}

const calculatePerimeter = (length, width) => {
    return 2 * (length + width);
}

const calculate = (length, width) => {
    // very simple string to number conversion
    if (typeof length === 'string') {
        length = Number(length);
    }
    if (typeof width === 'string') {
        width = Number(width);
    }

    const area = calculateArea(length, width);
    const perimeter = calculatePerimeter(length, width);

    console.log('Area for length:', length, 'and width:', width, 'is :', area);
    console.log('Perimeter for length:', length, 'and width:', width, 'is :', perimeter, '\n');

    return { area: area, perimeter: perimeter };
}

calculate(LENGTH, WIDTH); // 24, 20
calculate('3', '3'); // 9, 12   without conversion the perimeter would be 66 (2 * '3'+'3')

let squareLength = 1;

// calculate for rectangles with length starting from 1
while (squareLength <= 20) {
    let calc = calculate(squareLength, squareLength);

    if (calc.area >= 100) {
        break;
    }

    squareLength++;
}
```

## Scopes

Scope is a context in which values and expressions can be referenced.
If variable or expression is not in the current scope then it is unavailable.
Scopes have a parent and a child hierarchy called nested scopes.

An example is variable declared inside a function cannot be accessed outside
or another function.

```javascript
function foo() {
    var bar = 'bar';
}
console.log(bar); // ReferenceError: bar is not defined
```

## IIFEs

Immediately Invoked Function Expressions (IIFEs)
Is a function expressions that is imemediately invoked and executed.
Can be anonymous and its in its own function scope.

```javascript
(async () => {
    try {
        console.log('Minifying script.js');
        const src = await readFile(path.join(__dirname, '/public/js/script.js'), 'utf8');
        const min = uglify.minify(src);
        
        if (min.error) {
            console.log(min.error);
        }
        
        await writeFile(path.join(__dirname, '/public/js/script.min.js'), min.code);
    } catch (e) {
        console.log(e);
    }
})();
```

## Closures

Closure is a way to "remember" and continue to access a function's scope (its variables)
even when the function has finished running.

```javascript
function outer() {
   var b = 1;

   function inner() {
         var a = 2; 
         console.log(a+b);
    }
   return inner;
}
```
 
## Polyfill

Polyfill is a piece of code used to provide modern functionality on 
older browsers that do not natively support it.

## Transpiling

Transpiling is a method of converting your newer code into older
code equivalents. BABEL for example