import { DataRecordModel } from "./model";
import { APIError } from "./utils/api-error";
import {
    CreateDataRecordRequestDTO, DataRecord, DeleteDataRecordRequestDTO, DeleteDataRecordResponseDTO,
    GetDataRecordResponseDTO,
    SyncDataRecordRequestDTO,
    UpdateDataRecordRequestDTO, UpdateDataRecordResponseDTO
} from "./schema";
import { v4 as uuid } from "uuid";

export class DataRecordService {
    public async getAllDataRecords(): Promise<GetDataRecordResponseDTO> {
        const data = await DataRecordModel.find(
            {},
            { _id: 0, __v: 0 },
        )
            .sort({ updatedDate: 1 })
            .lean();
        return { dataRecords: data };
    }

    public async syncDataRecords(previousSync?: Date): Promise<GetDataRecordResponseDTO> {
        const filter = {};
        if (previousSync) {
            filter["$or"] = [
                { updatedDate: { $gte: previousSync } },
                { deletedDatedDate: { $gte: previousSync } }
            ];
        }
        const data = await DataRecordModel.find(
            filter,
            { _id: 0, __v: 0 },
        )
            .sort({ updatedDate: 1 })
            .lean();
        if (data.length === 0 || !data) {
            throw new APIError(204, "No changes found");
        }
        return { dataRecords: data };
    }

    public async createDataRecords(request: CreateDataRecordRequestDTO): Promise<GetDataRecordResponseDTO> {
        const dataRecordsForCreate = request.dataRecords.map((dataRecord) => {
            return {
                ...dataRecord,
                id: uuid(),
                createdDate: new Date(),
                updatedDate: new Date(),
                version: 1,
            };
        });
        const data = await DataRecordModel.insertMany(dataRecordsForCreate);
        return { dataRecords: data };
    }

    public async updateDataRecords(lastSync: Date, dataRecords: UpdateDataRecordRequestDTO[]): Promise<UpdateDataRecordResponseDTO> {
        const dataRecordsForUpdate = await DataRecordModel.find({ id: { $in: dataRecords.map(dataRecord => dataRecord.id) }, deleted: false });
        const recordsWithConflict: Array<DataRecord> = [];

        const bulkOperations = [];
        dataRecordsForUpdate.map((dataRecordForUpdate) => {
            const dataRecord = dataRecords.find(dataRecord => dataRecord.id === dataRecordForUpdate.id);
            if (dataRecordForUpdate.updatedDate < lastSync) {
                const operation = {
                    updateOne: {
                        filter: { id: dataRecord.id },
                        update: { ...dataRecord, updatedDate: new Date(), $inc: { version: 1 } },
                        upsert: false,
                    },
                };
                bulkOperations.push(operation);
            } else {
                // We want to return the latest version of the records if they are updated after the sync so the user can resolve the conflicts
                recordsWithConflict.push(dataRecordForUpdate);
            }
        });
        const result = await DataRecordModel.bulkWrite(bulkOperations, { ordered: false });
        return {
            updatedRecords: result.modifiedCount,
            recordsWithConflict: recordsWithConflict,
        };
    }

    public async deleteDataRecords(lastSync: Date, dataRecords: DeleteDataRecordRequestDTO[]): Promise<DeleteDataRecordResponseDTO> {
        const dataRecordsForDelete = await DataRecordModel.find({ id: { $in: dataRecords.map(dataRecord => dataRecord.id) }, deleted: false });
        const recordsWithConflict: Array<DataRecord> = [];
        const bulkOperation = [];
        dataRecordsForDelete.map((dataRecordForUpdate) => {
            if (dataRecordForUpdate.updatedDate < lastSync && !dataRecordForUpdate.deleted) {
                const operation = {
                    updateOne: {
                        filter: { id: dataRecordForUpdate.id },
                        update: { updatedDate: new Date(), deletedDate: new Date(), deleted: true },
                        upsert: false,
                    },
                };
                bulkOperation.push(operation);
            } else {
                recordsWithConflict.push(dataRecordForUpdate);
            }
        });
        const result = await DataRecordModel.bulkWrite(bulkOperation, { ordered: false });
        return {
            deletedRecords: result.modifiedCount,
            recordsWithConflict: recordsWithConflict,
        };
    }
}