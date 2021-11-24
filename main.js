/*
 * Project:
 * File Name: main.js
 * Description:
 *
 * Created Date: 11/23/21
 * Author: Rodolf John Gayem
 *
 */
const fs = require("fs").promises;
const path = require("path");
const IOhandler = require("./IOhandler"),
    zipFilePath = `${__dirname}/myfile.zip`,
    pathUnzipped = `${__dirname}/unzipped`,
    pathProcessed = `${__dirname}/grayscaled`;

const unzipFile = async() => {
    await IOhandler.unzip(zipFilePath, pathUnzipped);
};

unzipFile()
    .then(async() => await IOhandler.readDir(pathUnzipped))
    .then(
        async(data) =>
        await data.forEach(async(image) => {
            let randomId = await Math.floor(Math.random() * 600);
            await IOhandler.grayScale(image, `${pathProcessed}/${randomId}.png`);
        })
    )
    .catch((err) => console.log(err));