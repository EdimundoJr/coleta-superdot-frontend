import { CustomFileError } from "../errors/fileErrors";
import { SampleFile } from "../interfaces/sample.interface";
import { LIMIT_FILE_SIZE } from "../utils/consts.utils";

export const validateFiles = (sampleFilesToValidate: SampleFile[]) => {
    // Required files
    for (let i = 0; i < sampleFilesToValidate.length; i++) {
        if (sampleFilesToValidate[i].required && !sampleFilesToValidate[i].uploadedFile) {
            throw new CustomFileError(`Por favor, carregue o ${sampleFilesToValidate[i].label}`);
        }
    }

    sampleFilesToValidate?.forEach((sampleFile) => {
        // Mime type
        if (sampleFile.uploadedFile && sampleFile.uploadedFile.type !== "application/pdf") {
            throw new CustomFileError("Por favor, carregue apenas PDFs.");
        }

        // File size
        if (sampleFile.uploadedFile?.size && sampleFile.uploadedFile?.size > LIMIT_FILE_SIZE) {
            throw new CustomFileError("Por favor, carregue arquivos menores do que 10Mb.");
        }
    });

    return true;
};
