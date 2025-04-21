import {
    Button,
    Card,
    CardBody,
    Input,
    Pagination,
    Table,
    TableCell,
    TableContainer,
    TableFooter,
    TableHeader,
} from "@windmill/react-ui";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

//internal import
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import MainDrawer from "components/drawer/MainDrawer";
import StoreDrawer from "components/drawer/SroteDrawer";
import TableLoading from "components/preloader/TableLoading";
import StoreTable from "components/store/StoreTable";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { AdminContext } from "context/AdminContext";
import { SidebarContext } from "context/SidebarContext";
import StoreServices from "services/StoreServices";

const Store = () => {
    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    const { toggleDrawer, isDrawerOpen } = useContext(SidebarContext);

    const { data, loading } = useAsync(() => StoreServices.getAllStores({ Store_Address: adminInfo.StoreAddress }));
    console.log("Fetched Store:", data);

    const {
        userRef,
        setRole,
        handleChangePage,
        totalResults,
        resultsPerPage,
        dataTable,
        serviceData,
        handleSubmitUser,
    } = useFilter(data);

    const { t } = useTranslation();

    return (
        <>
            <PageTitle>{t("Store")} </PageTitle>
            {isDrawerOpen && (
                <MainDrawer>
                    <StoreDrawer />
                </MainDrawer>
            )}

            <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
                <CardBody>
                    <form
                        onSubmit={handleSubmitUser}
                        className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
                    >
                        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                            <Input
                                ref={userRef}
                                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                                type="search"
                                name="search"
                                placeholder={t("StaffSearchBy")}
                            />
                            <button type="submit" className="absolute right-0 top-0 mt-5 mr-1"></button>
                        </div>

                        <div className="w-full md:w-56 lg:w-56 xl:w-56">
                            <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                                <span className="mr-3">
                                    <FiPlus />
                                </span>
                                {t("AddStore")}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            {loading ? (
                <TableLoading row={12} col={7} width={163} height={20} />
            ) : serviceData?.length !== 0 ? (
                <TableContainer className="mb-8 rounded-b-lg">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>{t("Store Address")}</TableCell>
                                <TableCell>{t("Services")}</TableCell>
                                <TableCell className="text-center">{t("DetailsTbl")}</TableCell>
                                <TableCell className="text-right">{t("StaffActionsTbl")}</TableCell>
                            </tr>
                        </TableHeader>

                        <StoreTable staffs={dataTable} />
                    </Table>
                    <TableFooter>
                        <Pagination
                            totalResults={totalResults}
                            resultsPerPage={resultsPerPage}
                            onChange={handleChangePage}
                            label="Table navigation"
                        />
                    </TableFooter>
                </TableContainer>
            ) : (
                <NotFound title="Sorry, There are no Stores right now." />
            )}
        </>
    );
};

export default Store;