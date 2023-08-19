import { model, Schema } from "mongoose";
import { DataRecord } from "./schema";

const dataRecordMongooseSchema = new Schema<DataRecord>({
    id: { type: String, required: true, index: true },
    dataPoint: { type: Number, required: true, index: true },
    createdDate: { type: Date, required: true, index: true },
    updatedDate: { type: Date },
    deletedDate: { type: Date },
    deleted: { type: Boolean, default: false, index: true },
    version: { type: Number, required: true, default: 1 },
});

export const DataRecordModel = model("data-record", dataRecordMongooseSchema);

