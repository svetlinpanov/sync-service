import { Handler, Context, APIGatewayEvent } from 'aws-lambda';

import { DataRecordController } from './controller';
import { Storage } from './utils/mongose-db';

const dataRecordController = new DataRecordController();
const storage = new Storage();
storage.connectToDB();

export const getAllDataRecords: Handler = async () => {
  try {
    if (!storage.checkConnection()) {
      await storage.connectToDB();
    }
    const response = await dataRecordController.getAllDataRecords();
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify(error.message),
    };
  }
};

export const syncDataRecords: Handler = async (event: APIGatewayEvent) => {
  try {
    if (!storage.checkConnection()) {
      await storage.connectToDB();
    }
    const response = await dataRecordController.syncDataRecords(event);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify(error.message),
    };
  }
}

export const createDataRecords: Handler = async (event: APIGatewayEvent) => {
  try {
    if (!storage.checkConnection()) {
      await storage.connectToDB();
    }
    const response = await dataRecordController.createDataRecords(event);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify(error.message),
    };
  }
}

export const updateDataRecords: Handler = async (event: APIGatewayEvent) => {
  try {
    if (!storage.checkConnection()) {
      await storage.connectToDB();
    }
    const response = await dataRecordController.updateDataRecords(event);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify(error.message),
    };
  }
}

export const deleteDataRecords: Handler = async (event: APIGatewayEvent) => {
  try {
    if (!storage.checkConnection()) {
      await storage.connectToDB();
    }
    const response = await dataRecordController.deleteDataRecords(event);
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify(error.message),
    };
  }
}