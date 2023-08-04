export interface SampleFile {
    key: string; // FormData field
    jsonFileKey?: string // JSON backend field
    backendFileName?: string
    label: string; // Display name to user
    required?: boolean;
    uploadedFile?: File;
}
