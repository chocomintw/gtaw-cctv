
const coordRegex = /^[\(]?(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)(?:[,\s]+-?\d+(?:\.\d+)?)?[\)]?$/;

const testCases = [
    "10, 20",
    "10 20",
    "(10, 20)",
    "(10, 20)",
    "-10.5, 20.1",
    "( -10, 20 )", // Spaces inside parens
    "10, 20, 30",
    "(10, 20, 30)",
    "abc",
    "10, abc",
];

testCases.forEach(test => {
    const match = test.trim().match(coordRegex);
    console.log(`'${test}': ${match ? `Matched (X=${match[1]}, Y=${match[2]})` : 'No match'}`);
});
