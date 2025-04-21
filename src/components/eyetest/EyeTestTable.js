import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";
import useToggleDrawer from "hooks/useToggleDrawer";
import StaffDrawer from "components/drawer/StaffDrawer";
import DeleteModal from "components/modal/DeleteModal";
import ActiveInActiveButton from "components/table/ActiveInActiveButton";
import EditDeleteButton from "components/table/EditDeleteButton";
import Status from "components/table/Status";
import MainDrawer from "components/drawer/MainDrawer";
import { showingTranslateValue } from "utils/translate";
import useFilter from "hooks/useFilter";
import { showDateFormat } from "utils/dateFormate";
import Tooltip from "components/tooltip/Tooltip";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { FiZoomIn } from "react-icons/fi";

const StaffTable = ({ staffs, lang }) => {
  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();

  const { globalSetting } = useFilter();
  // console.log(staffs[0]._id, "hi")

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <StaffDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {staffs?.map((staff) => (
          <TableRow key={staff._id}>
            <TableCell>
              <div className="flex items-center">
                <Avatar
                  className="hidden mr-3 md:block bg-gray-50"
                  src={staff.image}
                  alt="staff"
                />
                <div>
                  <h2 className="text-sm font-medium">
                    {showingTranslateValue(staff?.name, lang)}
                  </h2>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm">{staff.user_email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm ">{staff.user_phone}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {/* {dayjs(staff.joiningData).format("DD/MM/YYYY")} */}
                {
                  staff.services
                }
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">{staff?.store_location}</span>
            </TableCell>
            {/* <TableCell className="text-center text-xs">
              <Status status={staff.time} /> 
            </TableCell> */}

            {/* <TableCell className="text-center">
              <ActiveInActiveButton
                id={staff?._id}
                staff={staff}
                option="staff"
                status={staff.status}
              />
            </TableCell> */}

            <TableCell>
              <Link
                to={`/eye-test/${staff?._id}`}
                className="flex justify-center text-gray-400 hover:text-green-600"
              >
                <Tooltip
                  id="view"
                  Icon={FiZoomIn}
                  title={t("DetailsTbl")}
                  bgColor="#10B981"
                />
              </Link>
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={staff._id}
                staff={staff}
                isSubmitting={isSubmitting}
                // handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                handleResetPassword={handleResetPassword}
                title={showingTranslateValue(staff?.name, lang)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default StaffTable;
