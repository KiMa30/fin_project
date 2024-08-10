import * as fs from 'fs';
import * as path from 'path';

const sourceDir = path.join(__dirname, '../../allure-report', 'history');
const targetDir = path.join(__dirname, '../../allure-results', 'history');

function copyFolderSync(source: string, target: string): void {
    fs.mkdirSync(target, { recursive: true });

    fs.readdirSync(source).forEach(item => {
        const sourcePath = path.join(source, item);
        const targetPath = path.join(target, item);

        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

if (fs.existsSync(sourceDir)) {
    copyFolderSync(sourceDir, targetDir);
    console.log('Папка History скопирована');
} else {
    console.log('Пакпки history не существует');
}