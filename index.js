const fs = require('fs');
const path = './collatz_results.txt';
const MAX_CONCURRENT = 1000000000000;

function logResult(number, result) {
    fs.appendFileSync(path, `Number ${number}: ${result}\n`, 'utf8');
}

function collatzConjecture(num) {
    let originalNum = num;
    const seenNumbers = new Set();

    while (num !== 1) {
        if (seenNumbers.has(num)) {
            return `Infinite loop without reaching 1`;
        }
        seenNumbers.add(num);

        if (num % 2 === 0) {
            num = num / 2;
        } else {
            num = 3 * num + 1;
        }
    }

    return `It ends up in the 4 -> 2 -> 1 loop`;
}

async function checkRange(start) {
    let end = start + MAX_CONCURRENT;
    for (let i = start; i < end; i++) {
        let result = collatzConjecture(i);
        logResult(i, result);
    }
}

async function main() {
    let start = 1;
    while (true) {
        let promises = [];
        for (let i = 0; i < MAX_CONCURRENT; i++) {
            promises.push(checkRange(start + i * MAX_CONCURRENT));
        }
        await Promise.all(promises);
        start += MAX_CONCURRENT * MAX_CONCURRENT;
    }
}

main().catch(console.error);