import { CustomError } from "./customErrors";

export class CustomFileError extends CustomError {}

export class FileSizeError extends CustomFileError {}
export class FileRequiredError extends CustomFileError {}
export class FileMimeTypeError extends CustomFileError {}
