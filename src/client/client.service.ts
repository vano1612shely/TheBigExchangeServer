import { Injectable } from "@nestjs/common";
import { IClient, IClientRequest } from "./client-service.interface";
import { DatabaseService } from "src/database/database.service";
import * as XLSX from "xlsx";
import { FilesService } from "src/files/files.service";
@Injectable()
export class ClientService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly fileService: FilesService,
  ) {}
  async addClient(client: IClient) {
    const candidate = await this.databaseService.client.findFirst({
      where: {
        phone: client.phone,
        name: client.name,
        telegram: client.telegram,
      },
    });
    if (candidate) {
      return candidate;
    }
    const createData: IClient = {
      email: "",
      telegram: "",
      name: "",
      phone: "",
      clientId: "",
    };
    createData.name = client.name;
    createData.phone = client.phone;
    if (client.telegram !== undefined) {
      createData.telegram = client.telegram;
    }
    if (client.email !== undefined) {
      createData.email = client.email;
    }
    if (client.clientId !== undefined) {
      createData.clientId = client.clientId;
    }
    const res = await this.databaseService.client.create({
      data: createData,
    });
    return res;
  }

  async addClientRequest(data: IClientRequest) {
    const res = await this.databaseService.clientRequest.create({
      data: data,
    });
    return res;
  }

  async getClients() {
    const res = await this.databaseService.client.findMany();
    return res;
  }
  async setStatus(requestId: string, status: string) {
    const update = await this.databaseService.clientRequest.updateMany({
      where: { requestId: requestId },
      data: { status: status },
    });
    return update;
  }
  async getRequestById(id: string) {
    const res = await this.databaseService.clientRequest.findFirst({
      where: { requestId: id },
    });
    return res;
  }
  async getRequestsByClientId(clientId: string) {
    const client = await this.databaseService.client.findFirst({
      where: { clientId: String(clientId) },
    });
    if (client) {
      const requests = await this.databaseService.clientRequest.findMany({
        where: { client_id: client.id },
      });
      return requests;
    }
    return [];
  }
  async getClientsWithRequest() {
    const res = await this.databaseService.client.findMany({
      include: { clientRequests: true },
    });
    return res;
  }
  async getRequest() {
    const res = await this.databaseService.clientRequest.findMany();
    return res;
  }
  objectsToCSV(dataArray) {
    const headers = Object.keys(dataArray[0]);
    const rows = dataArray.map((obj) => headers.map((header) => obj[header]));
    rows.unshift(headers);
    return rows.map((row) => row.join(",")).join("\n");
  }
  async downloadClientsDataCSV() {
    const clientsWithRequests = await this.getClients();
    const csvContent = this.objectsToCSV(clientsWithRequests);
    const filename = "data.csv";
    await this.fileService.createFileFromBuffer(
      Buffer.from(csvContent),
      filename,
    );
    return filename;
  }
  async downloadClientsDataXLSX() {
    const data = await this.getClients();
    const sheet = XLSX.utils.json_to_sheet(data);

    // Створення нової книги Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Дані");

    // Збереження книги Excel у файл
    const filename = "data.xlsx";
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    await this.fileService.createFileFromBuffer(excelBuffer, filename);
    return filename;
  }
  async downloadRequestDataCSV() {
    const data = await this.getRequest();
    const csvContent = this.objectsToCSV(data);
    const filename = "data.csv";
    await this.fileService.createFileFromBuffer(
      Buffer.from(csvContent),
      filename,
    );
    return filename;
  }
  async downloadRequestDataXLSX() {
    const data = await this.getRequest();
    const sheet = XLSX.utils.json_to_sheet(data);

    // Створення нової книги Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Дані");

    // Збереження книги Excel у файл
    const filename = "data.xlsx";
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    await this.fileService.createFileFromBuffer(excelBuffer, filename);
    return filename;
  }
}
