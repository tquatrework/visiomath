export type GetTeacherInvoiceDetailQueryResult = {
  id: number;
  teacherName: string;
  amount: number;
  creationDate: string;
  pdfFile: string;
  status: string;
  dueDate: string | null;
};