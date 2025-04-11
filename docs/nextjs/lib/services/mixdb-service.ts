import { MixDatabase, MixDatabaseData, MixDatabaseForm } from '@/types/mixdb';
import { PaginatedResponse, Request } from '@/types';
import { axios } from '../axios';

const baseUrl = '/api/v2/rest/mix-portal';

export const MixDbService = {
  getDatabases: async (
    request: Request
  ): Promise<PaginatedResponse<MixDatabase>> => {
    const response = await axios.post(`${baseUrl}/mix-database/list`, request);
    return response.data;
  },

  getDatabase: async (id: number): Promise<MixDatabase> => {
    const response = await axios.get(`${baseUrl}/mix-database/${id}`);
    return response.data;
  },

  createDatabase: async (
    database: Partial<MixDatabase>
  ): Promise<MixDatabase> => {
    const response = await axios.post(`${baseUrl}/mix-database`, database);
    return response.data;
  },

  updateDatabase: async (database: MixDatabase): Promise<MixDatabase> => {
    const response = await axios.put(
      `${baseUrl}/mix-database/${database.id}`,
      database
    );
    return response.data;
  },

  deleteDatabase: async (id: number): Promise<boolean> => {
    const response = await axios.delete(`${baseUrl}/mix-database/${id}`);
    return response.data.success;
  },

  duplicateDatabase: async (id: number): Promise<MixDatabase> => {
    const response = await axios.get(`${baseUrl}/mix-database/duplicate/${id}`);
    return response.data;
  },

  migrateDatabase: async (name: string): Promise<boolean> => {
    const response = await axios.get(`${baseUrl}/mix-database/migrate/${name}`);
    return response.data.success;
  },

  backupDatabase: async (name: string): Promise<boolean> => {
    const response = await axios.get(`${baseUrl}/mix-database/backup/${name}`);
    return response.data.success;
  },

  restoreDatabase: async (name: string): Promise<boolean> => {
    const response = await axios.get(`${baseUrl}/mix-database/restore/${name}`);
    return response.data.success;
  },

  // Forms
  getForms: async (
    request: Request
  ): Promise<PaginatedResponse<MixDatabaseForm>> => {
    const response = await axios.post(
      `${baseUrl}/mix-database-form/list`,
      request
    );
    return response.data;
  },

  getForm: async (id: number): Promise<MixDatabaseForm> => {
    const response = await axios.get(`${baseUrl}/mix-database-form/${id}`);
    return response.data;
  },

  createForm: async (
    form: Partial<MixDatabaseForm>
  ): Promise<MixDatabaseForm> => {
    const response = await axios.post(`${baseUrl}/mix-database-form`, form);
    return response.data;
  },

  updateForm: async (form: MixDatabaseForm): Promise<MixDatabaseForm> => {
    const response = await axios.put(
      `${baseUrl}/mix-database-form/${form.id}`,
      form
    );
    return response.data;
  },

  deleteForm: async (id: number): Promise<boolean> => {
    const response = await axios.delete(`${baseUrl}/mix-database-form/${id}`);
    return response.data.success;
  },

  // Database Data
  getDatabaseData: async (
    databaseName: string,
    request: Request
  ): Promise<PaginatedResponse<MixDatabaseData>> => {
    const response = await axios.post(
      `${baseUrl}/mix-db/${databaseName}/filter`,
      request
    );
    return response.data;
  },

  getSingleData: async (
    databaseName: string,
    id: number
  ): Promise<MixDatabaseData> => {
    const response = await axios.get(`${baseUrl}/mix-db/${databaseName}/${id}`);
    return response.data;
  },

  createData: async (
    databaseName: string,
    data: Partial<MixDatabaseData>
  ): Promise<MixDatabaseData> => {
    const response = await axios.post(
      `${baseUrl}/mix-db/${databaseName}`,
      data
    );
    return response.data;
  },

  updateData: async (
    databaseName: string,
    data: MixDatabaseData
  ): Promise<MixDatabaseData> => {
    const response = await axios.put(
      `${baseUrl}/mix-db/${databaseName}/${data.id}`,
      data
    );
    return response.data;
  },

  deleteData: async (databaseName: string, id: number): Promise<boolean> => {
    const response = await axios.delete(
      `${baseUrl}/mix-db/${databaseName}/${id}`
    );
    return response.data.success;
  },

  exportDatabase: async (
    databaseName: string,
    request: Request
  ): Promise<any> => {
    const response = await axios.post(
      `${baseUrl}/mix-db/${databaseName}/export`,
      request
    );
    return response.data;
  },

  importDatabase: async (databaseName: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
      `${baseUrl}/mix-db/${databaseName}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
};
