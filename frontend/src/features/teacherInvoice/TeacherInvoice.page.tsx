import React, {useMemo, useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import GetTeacherAmountToInvoiceComponent
    from "@src/features/teacherInvoice/getTeacherAmountToInvoice/GetTeacherAmountToInvoice.component";
import {
    GetTeacherAmountToInvoiceProvider
} from "@src/features/teacherInvoice/getTeacherAmountToInvoice/getTeacherAmountToInvoice.repository.provider";
import {
    GetTeacherAmountToInvoiceFetchRepository
} from "@src/features/teacherInvoice/getTeacherAmountToInvoice/getTeacherAmountToInvoice.fetchRepository";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
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
    from "@src/features/teacherInvoice/createTeacherInvoice/CreateTeacherInvoice.component";;
import {
    CreateTeacherInvoiceFetchRepository
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.fetchRepository";

import {
    GetTeacherInvoicesProvider
} from "@src/features/teacherInvoice/getTeacherInvoices/getTeacherInvoices.repository.provider";
import {
    GetTeacherInvoicesComponent
} from "@src/features/teacherInvoice/getTeacherInvoices/GetTeacherInvoices.component";
import {
    GetTeacherInvoicesFetchRepository
} from "@src/features/teacherInvoice/getTeacherInvoices/getTeacherInvoices.fetchRepository";
import {
    GetTeacherInvoicesNumberForCurrentMonthComponent
} from "@src/features/teacherInvoice/getTeacherInvoicesNumberForCurrentMonth/GetTeacherInvoicesNumberForCurrentMonth.component";
import {
    GetTeacherInvoicesNumberForCurrentMonthProvider
} from "@src/features/teacherInvoice/getTeacherInvoicesNumberForCurrentMonth/getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository.provider";
import {
    GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFetchRepository
} from "@src/features/teacherInvoice/getTeacherInvoicesNumberForCurrentMonth/getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.fetchRepository";

import {
    GetCurrentTeacherInvoicesComponent
} from "@src/features/teacherInvoice/getCurrentTeacherInvoices/GetCurrentTeacherInvoices.component";
import {
    GetCurrentTeacherInvoicesProvider
} from "@src/features/teacherInvoice/getCurrentTeacherInvoices/getCurrentTeacherInvoices.teacherInvoice.repository.provider";
import {
    GetCurrentTeacherInvoicesTeacherInvoiceFetchRepository
} from "@src/features/teacherInvoice/getCurrentTeacherInvoices/getCurrentTeacherInvoices.teacherInvoice.fetchRepository";
import {useUser} from "@src/providers/UserContext";


const TeacherInvoicePage: React.FC = () => {
    const location = useLocation();
    const [tabIndex, setTabIndex] = useState(0);

    const { userInfo } = useUser();

    const isFinancialManager = userInfo?.role.includes('financial_admin');

    let userInvoiceTabs = [];

    if (isFinancialManager) {
        userInvoiceTabs = ['Liste des factures' ];
    } else {
        userInvoiceTabs = ['Informations de facturation', 'Facturer', 'Mes factures'];
    }


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get('tab');
        if (tabParam) {
            const tabNumber = parseInt(tabParam);
            if (!isNaN(tabNumber) && tabNumber >= 0 && tabNumber <= 2) {
                setTabIndex(tabNumber);
            }
        }
    }, [location.search]);

    const getTeacherPaymentInfoRepository = useMemo(() => new GetTeacherPaymentInfoFetchRepository(), []);
    const saveTeacherPaymentInfoRepository = useMemo(() => new SaveTeacherPaymentFetchRepository(), []);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Facturation Enseignant</h2>


            <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
                <TabList className="flex border-b border-gray-200">
                    {userInvoiceTabs.map((label, idx) => (
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

                    <GetTeacherInvoicesNumberForCurrentMonthProvider
                        getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository={new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFetchRepository()}>
                        <GetTeacherInvoicesNumberForCurrentMonthComponent/>
                    </GetTeacherInvoicesNumberForCurrentMonthProvider>

                    <GetTeacherAmountToInvoiceProvider
                        getTeacherAmountToInvoiceRepository={new GetTeacherAmountToInvoiceFetchRepository()}>
                        <GetTeacherAmountToInvoiceComponent/>
                    </GetTeacherAmountToInvoiceProvider>


                    <CreateTeacherInvoiceRepositoryProvider
                        createTeacherInvoiceRepository={new CreateTeacherInvoiceFetchRepository()}>
                        <CreateTeacherInvoiceComponent/>
                    </CreateTeacherInvoiceRepositoryProvider>
                </TabPanel>

                <TabPanel className="p-4">
                    <GetTeacherInvoicesProvider
                        getTeacherInvoicesRepository={new GetTeacherInvoicesFetchRepository()}>
                        <GetTeacherInvoicesComponent/>
                    </GetTeacherInvoicesProvider>
                </TabPanel>


                <TabPanel className="p-4">
                    <GetCurrentTeacherInvoicesProvider
                        getCurrentTeacherInvoicesRepository={new GetCurrentTeacherInvoicesTeacherInvoiceFetchRepository()}>
                        <GetCurrentTeacherInvoicesComponent/>
                    </GetCurrentTeacherInvoicesProvider>
                </TabPanel>
            </Tabs>

        </div>
    );
};

export default TeacherInvoicePage;
