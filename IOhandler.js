/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:11-23-2021
 * Author: Rodolf John Gayem
 *
 */

const unzipper = require("unzipper"),
    fs = require("fs"),
    fsP = require("fs").promises,
    PNG = require("pngjs").PNG,
    path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
    return fs
        .createReadStream(pathIn)
        .pipe(unzipper.Extract({ path: pathOut }))
        .promise()
        .then(() => console.log("Extraction operation complete"))
        .catch((err) => console.log(err));
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = async(dir) => {
    if (fs.existsSync(dir)) {
        const files = await fsP.readdir(dir);

        // const filter_file =
        let new_file = [];
        files.forEach((file) => {
            new_file.push(path.join(dir, file));
        });

        const filtered_file = new_file.filter((file) => file.includes("png"));
        return filtered_file;
    }
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
//make the image black and white
const grayScale = (pathIn, pathOut) => {
    fs.createReadStream(pathIn)
        .pipe(new PNG())
        .on("error", (err) => console.log(err))
        .on("parsed", function() {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    // invert color
                    red = this.data[idx];
                    green = this.data[idx + 1];
                    blue = this.data[idx + 2];

                    grey = (red + green + blue) / 3;

                    this.data[idx] = grey;
                    this.data[idx + 1] = grey;
                    this.data[idx + 2] = grey;

                    // // and reduce opacity
                    this.data[idx + 3] = this.data[idx + 3] >> 1;
                }
            }

            this.pack().pipe(fs.createWriteStream(pathOut));
        });
};

module.exports = {
    unzip,
    readDir,
    grayScale,
};