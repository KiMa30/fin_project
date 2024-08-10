"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var sourceDir = path.join(__dirname, '../../allure-report', 'history');
var targetDir = path.join(__dirname, '../../allure-results', 'history');
function copyFolderSync(source, target) {
    fs.mkdirSync(target, { recursive: true });
    fs.readdirSync(source).forEach(function (item) {
        var sourcePath = path.join(source, item);
        var targetPath = path.join(target, item);
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, targetPath);
        }
        else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}
if (fs.existsSync(sourceDir)) {
    copyFolderSync(sourceDir, targetDir);
    console.log('Папка History скопирована');
}
else {
    console.log('Пакпки history не существует');
}
