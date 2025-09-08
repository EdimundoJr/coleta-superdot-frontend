import { ArrowTopRightIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import * as Form from "@radix-ui/react-form";
import { ChangeEvent, useState } from "react";
import { SampleFile } from "../../interfaces/sample.interface";
import { seeAttachment } from "../../api/sample.api";
import { Flex } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";

interface SampleUploadFileProps {
    sampleFiles: SampleFile[];
    setSampleFiles: (files: SampleFile[]) => void;
    notifyFileChange?: React.MutableRefObject<boolean>;
    messageError?: string;
}

const SampleUploadFile = ({ sampleFiles, setSampleFiles, notifyFileChange, messageError }: SampleUploadFileProps) => {
    const [currentFileKeyToUpload, setCurrentFileKeyToUpload] = useState<string | undefined>(undefined);

    const handleChangeFileToUpload = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrentFileKeyToUpload(e.target.value);
    };

    /** REMOVE A UPLOAD */
    const handleRemoveFileUploaded = (sampleFileKey: string) => {
        const filesUpdated = sampleFiles.map((sampleFile) => {
            if (sampleFile.key === sampleFileKey) {
                return {
                    ...sampleFile,
                    uploadedFile: undefined,
                };
            } else {
                return sampleFile;
            }
        });

        setSampleFiles(filesUpdated);
        setCurrentFileKeyToUpload(undefined);
    };

    /** UPLOAD A FILE */
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (notifyFileChange) notifyFileChange.current = true;

        if (!e.target.files?.length) {
            return;
        }

        const fileUploaded = e.target.files[0];

        const filesUpdated = sampleFiles.map((sampleFile) => {
            if (sampleFile.key === currentFileKeyToUpload) {
                return {
                    ...sampleFile,
                    uploadedFile: fileUploaded,
                };
            } else {
                return sampleFile;
            }
        });

        setSampleFiles(filesUpdated);
        setCurrentFileKeyToUpload(undefined);
    };

    /** FILES RULES */

    /** PREVIEW A FILE */
    const handleViewPDFUploaded = async (fileName: string | undefined, fileKey: string) => {
        // File uploaded only in frontend
        if (!fileName) {
            const sampleFile = sampleFiles.find((sampleFile) => sampleFile.key === fileKey);

            if (sampleFile?.uploadedFile) {
                const fileObjectURL = URL.createObjectURL(sampleFile.uploadedFile);
                window.open(fileObjectURL);
            }
        }

        // File uploaded in backend
        const response = await seeAttachment(fileName || "");
        if (response.status === 200) {
            const fileObjectURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            window.open(fileObjectURL);
        }
    };

    return (
        <div className="col-span-3 animate-fade-in animate-delay-800">
            <h3 className="text-left text-primary">Anexos</h3>
            <Separator.Root className="my-6 h-px w-full bg-black" />
            <div className="flex">
                <Form.Field name="sampleFiles" className=" w-full ">
                    <Form.Label className="block text-left text-xs font-bold uppercase tracking-wide">
                        Tipo de Anexo
                    </Form.Label>
                    <div className="gap-2 flex max-lg:flex-col  items-center">
                        <select
                            onChange={handleChangeFileToUpload}
                            value={currentFileKeyToUpload}
                            className="h-[40px] w-full rounded-[4px] px-4  border-2 border-gray-500 bg-white text-sm max-sm:text-[14px]  max-sm:px-2 text-black"
                        >
                            <option value="" className="">Selecionar Arquivo</option>
                            {sampleFiles.map((sampleFile, index) => {
                                if (!sampleFile.uploadedFile)
                                    return (
                                        <option key={index} value={sampleFile.key}>
                                            {sampleFile.label}
                                        </option>
                                    );
                            })}
                        </select>
                        <Flex justify={"center"} align={"center"}>
                            <label
                                htmlFor="chooseFile"
                                className="bg-primary flex border-2 rounded-lg p-2 justify-center  text-white  min-w-[200px] hover:cursor-pointer align-middle hover:bg-secondary active:bg-primary active:brightness-90 max-sm:text-[12px] btn-primary animate-bounce-in"
                            >
                                Anexar arquivo
                                <Icon.UploadSimple className="ml-2 h-[20px] w-[20px]" />
                            </label>
                        </Flex>
                        <input
                            disabled={!currentFileKeyToUpload}
                            id="chooseFile"
                            onChange={handleFileUpload}
                            hidden
                            type="file"
                        ></input>
                    </div>
                    <span className="error-message">{messageError}</span>
                </Form.Field>
            </div>
            {sampleFiles && (
                <div>
                    <h3 className="text-left text-primary">Anexos carregados:</h3>
                    {sampleFiles.map((sampleFile, index) => {
                        if (sampleFile.uploadedFile)
                            return (
                                <div className="mt-4 flex text-black" key={index}>
                                    {sampleFile.label}: {sampleFile.uploadedFile?.name}
                                    <div className="flex items-center">
                                        <ArrowTopRightIcon
                                            onClick={() =>
                                                handleViewPDFUploaded(sampleFile.backendFileName, sampleFile.key)
                                            }
                                            className="mx-4 h-[20px] w-[20px] cursor-pointer rounded-sm bg-red-300 align-middle"
                                        />
                                        <Cross2Icon
                                            onClick={() => handleRemoveFileUploaded(sampleFile.key)}
                                            className="mx-4 h-[20px] w-[20px] cursor-pointer rounded-sm bg-red-300 align-middle"
                                        />
                                    </div>
                                </div>
                            );
                    })}
                </div>
            )}
            <Separator.Root className="h-px" />
        </div>
    );
};

export default SampleUploadFile;
