export interface SampleFile {
    key: string; // FormData field
    jsonFileKey?: string; // JSON backend field
    backendFileName?: string;
    label: string; // Display name to user
    required?: boolean;
    uploadedFile?: File;
}

export interface AcceptSampleFile {
    jsonFileKey: string;
    backendFileName: string;
    label: string;
    accepted?: boolean;
}
