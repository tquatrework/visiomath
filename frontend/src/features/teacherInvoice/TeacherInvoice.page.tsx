import React, {useMemo, useState} from 'react';
import GetTeacherAmountToInvoiceComponent
    from "@src/features/teacherInvoice/getTeacherAmountToInvoice/GetTeacherAmountToInvoiceComponent";
import {
    GetTeacherAmountToInvoiceProvider
} from "@src/features/teacherInvoice/getTeacherAmountToInvoice/getTeacherAmountToInvoice.repository.provider";
import {
    GetTeacherAmountToInvoiceFetchRepository
} from "@src/features/teacherInvoice/getTeacherAmountToInvoice/getTeacherAmountToInvoice.fetchRepository";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import AdministrativeProfile from "@src/features/profile/AdministrativeProfile";
import PedagogicalProfile from "@src/features/profile/PedagogicalProfile";
import FinancialProfile from "@src/features/profile/FinancialProfile";
import TeacherProfile from "@src/features/profile/TeacherProfile";
import {
    GetTeacherPaymentInfoProvider
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository.provider";
import {
    SaveTeacherPaymentInfoRepositoryProvider
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository.provider";
import TeacherPaymentInfoFormComponent from "@src/features/teacherInvoice/TeacherPaymentInfoForm.component";
import {
    GetTeacherPaymentInfoFetchRepository
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.fetchRepository";
import {
    SaveTeacherPaymentFetchRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.fetchRepository";
import {
    CreateTeacherInvoiceRepositoryProvider
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.repository.provider";
import CreateTeacherInvoiceComponent
    from "@src/features/teacherInvoice/createTeacherInvoice/CreateTeacherInvoice.component";
import {
    CreateTeacherInvoiceFailureInMemoryRepository
} from "@src/features/teacherInvoice/createTeacherInvoice/test/createTeacherInvoice.failureInMemoryRepository";
import {
    CreateTeacherInvoiceSuccessInMemoryRepository
} from "@src/features/teacherInvoice/createTeacherInvoice/test/createTeacherInvoice.successInMemoryRepository";

const TeacherInvoicePage: React.FC = () => {

    const [tabIndex, setTabIndex] = useState(0);

    const getTeacherPaymentInfoRepository = useMemo(() => new GetTeacherPaymentInfoFetchRepository(), []);
    const saveTeacherPaymentInfoRepository = useMemo(() => new SaveTeacherPaymentFetchRepository(), []);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Facturation Enseignant</h2>


            <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
                <TabList className="flex border-b border-gray-200">
                    {['Informations de facturation', 'Facturer', ].map((label, idx) => (
                        <Tab
                            key={label}
                            className={`cursor-pointer py-2 px-4 ${tabIndex === idx ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                        >
                            {label}
                        </Tab>
                    ))}
                </TabList>

                <TabPanel className="p-4">
                    <GetTeacherPaymentInfoProvider
                        getTeacherPaymentInfoRepository={getTeacherPaymentInfoRepository}>
                        <SaveTeacherPaymentInfoRepositoryProvider
                            saveTeacherPaymentInfoRepository={saveTeacherPaymentInfoRepository}>
                            <TeacherPaymentInfoFormComponent/>
                        </SaveTeacherPaymentInfoRepositoryProvider>
                    </GetTeacherPaymentInfoProvider>
                </TabPanel>

                <TabPanel className="p-4">
                    <GetTeacherAmountToInvoiceProvider
                        getTeacherAmountToInvoiceRepository={new GetTeacherAmountToInvoiceFetchRepository()}>
                        <GetTeacherAmountToInvoiceComponent/>
                    </GetTeacherAmountToInvoiceProvider>


                    <CreateTeacherInvoiceRepositoryProvider
                        createTeacherInvoiceRepository={new CreateTeacherInvoiceSuccessInMemoryRepository()}>
                        <CreateTeacherInvoiceComponent/>
                    </CreateTeacherInvoiceRepositoryProvider>
                </TabPanel>

            </Tabs>

        </div>
    );
};

export default TeacherInvoicePage;
