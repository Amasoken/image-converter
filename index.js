const { convertImage, getFileList } = require('./src/file');

const FORMATS = {
    jpeg: { format: 'jpeg' },
    png: { format: 'png' },
    png_sticker: {
        format: 'png',
        actions: [
            (img) =>
                img.resize({
                    width: 512,
                    height: 512,
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 },
                    withoutEnlargement: true,
                }),
        ],
    },
    webp: { format: 'webp' },
    webp_sticker: {
        format: 'webp',
        actions: [
            (img) =>
                img.resize({
                    width: 512,
                    height: 512,
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 },
                    withoutEnlargement: true,
                }),
        ],
    },
    avif: { format: 'avif' },
};

async function runAsyncQueueFromGenerator(getNext, concurrency = 10) {
    let activeCount = 0;

    const processNext = async (resolve) => {
        const currentFunction = getNext();

        if (!currentFunction) {
            if (activeCount === 0) resolve();
            return;
        }

        activeCount++;
        await currentFunction();
        activeCount--;

        processNext(resolve);
    };

    return new Promise((resolve) => {
        for (let i = 0; i < concurrency; i++) {
            processNext(resolve);
        }
    });
}

async function convertFiles() {
    const [mode, ...files] = process.argv.slice(2);

    if (mode && Object.keys(FORMATS).includes(mode) && files.length) {
        const params = FORMATS[mode];
        const fileList = getFileList(files);
        const errors = {};

        function* queueMaker() {
            for (const file of fileList) {
                yield () =>
                    convertImage(file, params)
                        .then(({ oldPath, newPath }) =>
                            console.log(`Converted     ${oldPath}\n     Into     ${newPath}\n`)
                        )
                        .catch((error) => {
                            errors[file] = error.message;
                        });
            }

            return;
        }

        const queue = queueMaker();
        await runAsyncQueueFromGenerator(() => queue.next().value, 10);

        if (Object.keys(errors).length) {
            console.log('========\nEncountered ' + Object.keys(errors).length + ' errors while converting:\n');

            for (const key of Object.keys(errors)) {
                console.log('File path     ' + key);
                console.log('    ERROR     ' + errors[key], '\n');
            }

            process.exit(1);
        }
    } else {
        console.log('No files to convert');
    }
}

convertFiles();
