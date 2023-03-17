const xml2js = require('xml2js');
const fs = require('fs');
const pathBounds = require('svg-path-bounds');

fs.readFile('us_map.svg', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    xml2js.parseString(data, (err, jsData) => {
        if (err) {
            console.error(err);
            return;
        }

        const usMapData = [];

        const paths = jsData.svg.g[0].path;
        paths.forEach((path) => {
            const stateName = path.$.class;
            const d = path.$.d;

            // Calculate the bounding box and centroid
            const bounds = pathBounds(d);
            const centroid = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];

            usMapData.push({ name: stateName, path: d, centroid });
        });

        fs.writeFile('usMapData.js', `const usMapData = ${JSON.stringify(usMapData)};\n`, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('usMapData.js has been created');
        });
    });
});
