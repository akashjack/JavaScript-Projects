const character = "!";
const count = 10;
const rows = [];
let inverted = true;

function padRow(rowNumber, rowCount) {
    return " ".repeat(rowCount - rowNumber) + character.repeat(2 * rowNumber -1) + " ".repeat(rowCount - rowNumber);    
}

//To Display Pyramid 
// .push() => Add a new rows to end of an array
// .pop() => remove a rows from end of an array
// .unshift() => add a new rows to beginning of an array 
// .shift() => remove rows from beginning of an array

//Using For loop
for (let i = 1; i <= count; i++ ) {
    rows.push(padRow(i, count));
}

//Using while loop

while(rows.length < count ) {
    rows.push(padRow(rows.length + 1,count));
}

//To reverse or inverse a Pyramid 

//Using if else
for (let i = 1; i <= count; i++ ) {
    if (inverted) {
        rows.unshift(padRow(i,count));
    }
    else {
        rows.push(padRow(i,count));
    }
}

let result = " ";
for ( const row of rows) {
    result = result + "\n" + row;    
}
console.log(result);