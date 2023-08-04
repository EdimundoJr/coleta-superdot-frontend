import { InferType, object, string } from "yup";

export const mySamplesFiltersSchema = object({
    researcherTitle: string(),
    sampleTitle: string(),
});

export type MySamplesFilters = InferType<typeof mySamplesFiltersSchema>;
