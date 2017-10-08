const fs = require('fs');
const PATH_ASSETS = `${process.cwd()}/assets`;
const out = {};

function base64_encode(file) {
    var bin = fs.readFileSync(PATH_ASSETS + '/' + file);
    out[file] = new Buffer(bin).toString('base64');
}

const SOUNDS = fs.readdirSync(PATH_ASSETS)
    .filter(file => /.mp3$/.test(file));

SOUNDS.forEach(file => base64_encode(file));

fs.writeFileSync(
    `${process.cwd()}/src/sounds.js`,
    `export default ${JSON.stringify(out)}`
);

console.log(`Converted ${SOUNDS.length} sound file(s).`);