import { z } from "zod";

export const dataRecord = z.object({
    id: z.string(),
    dataPoint: z.number(),
    createdDate: z.date(),
    updatedDate: z.date().optional(),
    deletedDate: z.date().optional(),
    archived: z.boolean().optional(),
    deleted: z.boolean().optional(),
    version: z.number(),
});

export type DataRecord = z.infer<typeof dataRecord>;

export const getDataRecordResponseSchema = z.object({
    dataRecords: z.array(dataRecord),
});

export type GetDataRecordResponseDTO = z.infer<typeof getDataRecordResponseSchema>;

export const idDataRecordSchema = dataRecord.pick({
    id: true,
});

export const syncDataRecordRequestSchema = z.object({
    previousSync: z.string().optional(),
});

export type SyncDataRecordRequestDTO = z.infer<typeof idDataRecordSchema>;


export const updateDataRecordSchema = dataRecord.pick({
    id: true,
    dataPoint: true,
});

export const updateDataRecordRequestSchema = z.object({
    dataRecordsUpdate: z.array(updateDataRecordSchema),
    lastSync: z.string().optional(),
});

export type UpdateDataRecordRequestDTO = z.infer<typeof updateDataRecordSchema>;

export const updateDataRecordResponseSchema = z.object({
    updatedRecords: z.number(),
    recordsWithConflict: z.array(dataRecord).optional(),
});

export type UpdateDataRecordResponseDTO = z.infer<typeof updateDataRecordResponseSchema>;

export const deleteDataRecordRequestSchema = dataRecord.pick({
    id: true,
});

export type DeleteDataRecordRequestDTO = z.infer<typeof deleteDataRecordRequestSchema>;

export const deleteDataRecordResponseSchema = z.object({
    deletedRecords: z.number(),
    recordsWithConflict: z.array(dataRecord).optional(),
});

export type DeleteDataRecordResponseDTO = z.infer<typeof deleteDataRecordResponseSchema>;

export const createDataPointSchema = dataRecord.pick({
    dataPoint: true,
});

export const createDataRecordRequestSchema = z.object({
    dataRecords: z.array(createDataPointSchema)
}); 

export type CreateDataRecordRequestDTO = z.infer<typeof createDataRecordRequestSchema>;