import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Select,
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
import StaffDrawer from "components/drawer/StaffDrawer";
import TableLoading from "components/preloader/TableLoading";
import StaffTable from "components/eyetest/EyeTestTable";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { AdminContext } from "context/AdminContext";
import { SidebarContext } from "context/SidebarContext";
import EyeTestServices from "services/EyeTestServices";

const Staff = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { toggleDrawer, lang } = useContext(SidebarContext);

  const { data, loading } = useAsync(() => EyeTestServices.getAllBookings({ email: adminInfo.email }));
  // console.log("Fetched data:", data.data);

  const {
    userRef,
    setRole,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleSubmitUser,
  } = useFilter(data.data);

  const { t } = useTranslation();

  // console.log("Filtered dataTable:", dataTable);
  // console.log("Service data:", serviceData);

  return (
    <>
      <PageTitle>{t("StaffPageTitle")} </PageTitle>
      <MainDrawer>
        <StaffDrawer />
      </MainDrawer>

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
            {/* <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Select
                onChange={(e) => setRole(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
              >
                <option value="All" defaultValue hidden>
                  {t("StaffRole")}
                </option>
                <option value="Admin">{t("StaffRoleAdmin")}</option>
                <option value="Cashier">{t("SelectCashiers")}</option>
                <option value="Super Admin">{t("SelectSuperAdmin")}</option>
              </Select>
            </div> */}

            {/* <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                <span className="mr-3">
                  <FiPlus />
                </span>
                {t("AddStaff")}
              </Button>
            </div> */}
          </form>
        </CardBody>
      </Card>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={7} width={163} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("StaffNameTbl")}</TableCell>
                <TableCell>{t("StaffEmailTbl")}</TableCell>
                <TableCell>{t("StaffContactTbl")}</TableCell>
                <TableCell>{t("Services")}</TableCell>
                <TableCell>{t("Store Location")}</TableCell>
                <TableCell className="text-center">{t("DetailsTbl")}</TableCell>
                {/* <TableCell className="text-center">{t("Time")}</TableCell> */}
                {/* <TableCell className="text-center">{t("PublishedTbl")}</TableCell> */}

                <TableCell className="text-right">{t("StaffActionsTbl")}</TableCell>
              </tr>
            </TableHeader>

            <StaffTable staffs={dataTable} lang={lang} />
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
        <NotFound title="Sorry, There are no staff right now." />
      )}
    </>
  );
};

export default Staff;