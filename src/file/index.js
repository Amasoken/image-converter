const sharp = require('sharp');
const fs = require('fs');
const pathUtil = require('path');

function getFileList(files) {
    const fileList = [];

    for (const path of files) {
        scanFiles(path, (filePath) => fileList.push(filePath));
    }

    return fileList;
}

function scanFiles(path, cb) {
    const stats = fs.lstatSync(path);

    if (stats.isDirectory()) {
        const directoryItems = fs.readdirSync(path);
        for (const itemPath of directoryItems) {
            scanFiles(pathUtil.join(path, itemPath), cb);
        }
    } else if (stats.isFile()) {
        cb(path);
    }
}

function getFileName(path) {
    if (typeof path !== 'string') throw new Error('Expected path to be a string');

    const pathSplit = path.split(/\/|\\/);
    const fullName = pathSplit.pop();

    const fullNameSplit = fullName.split('.');
    const ext = fullNameSplit.pop();

    return {
        folder: pathSplit.join('/'),
        name: fullNameSplit.join('.'),
        ext,
    };
}

function fileExists(path) {
    return new Promise((resolve) => {
        fs.access(path, fs.constants.F_OK, (error) => {
            resolve(!error);
        });
    });
}

async function getNewFilePath(folder, name, format) {
    let newPath = folder + '/' + name + '.' + format;

    if (!(await fileExists(newPath))) return newPath;

    let counter = 1;
    newPath = folder + '/' + name + ' (' + counter + ')' + '.' + format;

    while (await fileExists(newPath)) {
        newPath = folder + '/' + name + ' (' + ++counter + ')' + '.' + format;
    }

    return newPath;
}

async function convertImage(file, params) {
    return new Promise(async (resolve, reject) => {
        const { format } = params;
        const { folder, name, ext } = getFileName(file);

        const img = sharp(file).withMetadata();

        for (const action of params?.actions ?? []) {
            action(img);
        }

        const newPath = await getNewFilePath(folder, name, format);
        await img.toFile(newPath).catch(reject);

        resolve({
            oldPath: `${folder}/${name}.${ext}`,
            newPath,
        });
    });
}

module.exports = { convertImage, getFileList };
