var fs = require('fs');

var bmp;

//Reading the file
try {
    bmp = fs.readFileSync('image9.bmp');
} catch (e) {
    console.error(e);
}

//Getting basic BMP header info and starting some variables
var data_start = bmp.readUIntLE(0xA,4),
    data_size = bmp.readUIntLE(0x22,4),
    width = bmp.readUIntLE(0x12,4),
    padding = (width * 3) % 4,
    k = 0,
    char_ascii = [],
    j = 0;

function get_LSB(byte) {
    var bin = (byte >>> 0).toString(2);

    return bin.substr(-1,1);
}

//Building the array of strings with the LSBs
function buildNewBinary(array) {
    var num = [],
        n = 0;
    num[0] = '';

    for (var i = 0; i < array.length; i++) {
        num[n] += array[i];

        if ((i + 1) % 8 == 0) {
            num[n] = parseInt(num[n].split('').reverse().join(''), 2);
            if (num[n] == '00000000')
                break;
            n++;
            num[n] = '';
        }
    }

    return num;
}

function convertBinToChar(array) {
    var frase = '';

    for (var i = 0; i < array.length; i++)
        frase += String.fromCharCode(array[i]);

    return frase;
}

/* Start of the program */

for (var i = data_start; i < data_start + data_size; i++) {
    if (k++ == (width * 3)) {
        i += padding;
        k = 0;
    }

    char_ascii[j++] = get_LSB(bmp[i]);
}

//Converting to characters

var bin = buildNewBinary(char_ascii),
    frase = convertBinToChar(bin);

console.log(frase);