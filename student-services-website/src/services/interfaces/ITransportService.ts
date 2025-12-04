export interface ITransportService {
  requestTransport(studentId: string, details: any): Promise<boolean>
}
