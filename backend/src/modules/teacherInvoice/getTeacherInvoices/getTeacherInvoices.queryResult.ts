export interface TeacherInvoiceResult {
  id: number;
  teacherName: string;
  amount: number;
  pdfFile: string;
  creationDate: Date;
  status: string;
}

export interface GetTeacherInvoicesQueryResult {
  teacherInvoices: TeacherInvoiceResult[];
}