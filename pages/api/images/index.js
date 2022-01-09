const fse = require('fs-extra');

const downloadImage = async (url, path) => {
    return await axios({
        url,
        responseType: 'stream',
    }).then(response => {
        fse.outputFileSync(path, '');
        response.data.pipe(fse.createWriteStream(path, {
            flags: 'w'
        }));
        return true;
    }).catch(error => {
        console.log(error);
        Log.error('downloadImage ', error);
        return false;
    });
}
const get = async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    const prefix = req.query.prefix ? decodeURIComponent(req.query.prefix) : '';
    let basePath = url.replace('https://', '')
        .replace('http://', '')
        .replace('//', '/');
    if (prefix) {
        basePath = prefix + '/' + basePath;
    }
    // const path = './public/manga/' + basePath;
    // if (fse.existsSync(path)) {
    //     return fse.createReadStream(path).pipe(res);
    // }
    const result = await fetch(url).catch(error => {
        console.log(error);
    });
    const body = await result.body;
    // try {
    //     fse.outputFileSync(path, '');
    //     body.pipe(fse.createWriteStream(path, {
    //         flags: 'w'
    //     }));
    // } catch (error) {
        
    // }
    return body.pipe(res);
};

export default get;