import { APIGatewayEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { createDataRecordRequestSchema, deleteDataRecordRequestSchema, deleteDataRecordResponseSchema, getDataRecordResponseSchema, 
    syncDataRecordRequestSchema, updateDataRecordRequestSchema, updateDataRecordResponseSchema } from "./schema";
import { DataRecordService } from "./service";
import { getResponse, validateRequest } from "./utils/controller-validators";
import { z } from "zod";

export class DataRecordController {
    private dataRecordService: DataRecordService;
    constructor() {
        this.dataRecordService = new DataRecordService();
    }

    public async getAllDataRecords() {
        const result = await this.dataRecordService.getAllDataRecords();
        return getResponse(getDataRecordResponseSchema, result);
    }

    public async syncDataRecords(event: APIGatewayEvent) {
        const { body: { previousSync}} = validateRequest(event, {
            body: syncDataRecordRequestSchema,
        });
        const result = await this.dataRecordService.syncDataRecords(new Date(previousSync));
        return getResponse(getDataRecordResponseSchema, result);
    }

    public async createDataRecords(event: APIGatewayEvent) {
        const { body:  dataRecords } = validateRequest(event, {
            body: createDataRecordRequestSchema,
        });
        const result = await this.dataRecordService.createDataRecords(dataRecords);
        return getResponse(getDataRecordResponseSchema, result);
    }

    public async updateDataRecords(event: APIGatewayEvent) {
        const { body: { lastSync, dataRecordsUpdate }} = validateRequest(event, {
            body: updateDataRecordRequestSchema,
        });
        const result = await this.dataRecordService.updateDataRecords(new Date(lastSync), dataRecordsUpdate);
        return getResponse(updateDataRecordResponseSchema, result);

    }

    public async deleteDataRecords(event: APIGatewayEvent) {
        const { body: { lastSync, dataRecords }} = validateRequest(event, {
            body: z.object({
                dataRecords: z.array(deleteDataRecordRequestSchema),
                lastSync: z.string().optional(),
            }),
        });
        const result = await this.dataRecordService.deleteDataRecords(new Date(lastSync), dataRecords);
        return getResponse(deleteDataRecordResponseSchema, result);
    }
}