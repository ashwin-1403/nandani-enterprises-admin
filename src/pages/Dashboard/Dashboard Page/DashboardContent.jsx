import { useEffect, useState } from "react";
import otrIcon from "../../../assets/img/OTRIcon.png";
import utrIcon from "../../../assets/img/UTRIcon.png";
import stationIcon from "../../../assets/img/StationsIcon.png";
import totalIcon from "../../../assets/img/totalIcon.png";
import EmployeDetails from "./EmployeeDetails/EmployeDetails";
import "./dashboardContent.scss";
import GetApi from "../../../services/GetApi";
import Loader from "../../../Utils/Loader/Loader";

export default function DashboardContent() {
  const [dashboardCount, setDashboardCount] = useState({});
  const [loading, setloading] = useState(false);
  const fetchDashboardData = async () => {
    try {
      setloading(true);
      const res = await GetApi("emp/employee-count");
      if (res?.status === 200) {
        setloading(false);
        setDashboardCount(res?.data);
      }
    } catch (error) {
      setloading(false);
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <div>
      {loading ? (
        <Loader startLoading={loading} />
      ) : (
        <div className="dashboard">
          <div className="container">
            <div className="row">
              <div className="col-md-6 mb-4">
                <EmployeDetails
                  render="/employees?type=OTR"
                  type="OTR"
                  image={otrIcon}
                  paraHead="No. of OTR Employees"
                  cardDetail={dashboardCount?.totalOTR || "0"}
                />
              </div>
              <div className="col-md-6 mb-4">
                <EmployeDetails
                  render="/employees?type=UTR"
                  type="UTR"
                  image={utrIcon}
                  paraHead="No. of UTR Employees"
                  cardDetail={dashboardCount?.totalUTR || "0"}
                />
              </div>
              <div className="col-md-6">
                <EmployeDetails
                  render="/employees"
                  image={totalIcon}
                  paraHead="No. of total Employees"
                  cardDetail={dashboardCount?.totalEmployee || "0"}
                />
              </div>
              <div className="col-md-6">
                <EmployeDetails
                  render="/stations"
                  image={stationIcon}
                  paraHead="No. of total Stations"
                  cardDetail={dashboardCount?.totalStation || "0"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
