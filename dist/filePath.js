"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * A helper function to find the absolute path to a desired file from a relative path.
 *
 * (Implementation is unimportant: don't worry about it.)
 *
 * @param relativePath - the relative path to the
 * @returns string
 */
const filePath = (relativePath) => 
// using the special __dirname variable: https://www.digitalocean.com/community/tutorials/nodejs-how-to-use__dirname
path_1.default.join(__dirname, relativePath);
exports.default = filePath;
