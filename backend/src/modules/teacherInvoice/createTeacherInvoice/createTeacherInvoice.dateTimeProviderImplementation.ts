import { Injectable } from '@nestjs/common';
import { CreateTeacherInvoiceDateTimeProvider } from './createTeacherInvoice.dateTimeProvider';

@Injectable()
export class CreateTeacherInvoiceDateTimeProviderImplementation implements CreateTeacherInvoiceDateTimeProvider {
    now(): Date {
        return new Date();
    }
}
