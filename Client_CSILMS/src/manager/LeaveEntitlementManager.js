import React, { Component } from "react";
import { Button } from "reactstrap";
import "../common/Styles.css";
import { Redirect, withRouter } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { isManagerRole } from "../util/APIUtils";
import { fetchData } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";
import ExportToExcel from "../hradmin/LeaveEntitlementToExcel";
import LoadingPage from "../common/LoadingPage";

class LeaveEntitlementManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaveEntitlementData: [],
      loading: true
    };
  }
  _isMounted = false;

  loadLeaveEntitlement = () => {
    fetchData({
      url: API_BASE_URL + "/leaveentitlement/managerreportees",
      method: "GET"
    })
      .then(data => {
        this.setState({
          leaveEntitlementData: data,
          loading: false
        });
      })
      .catch(error => {
        if (error.status === 401) {
          this.props.history.push("/login");
        }
        this.setState({
          leaveEntitlementData: [],
          loading: false
        });
      });
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadLeaveEntitlement();
  }

  componentWillMount() {
    this._isMounted = false;
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      this.loadLeaveEntitlement();
    }
  }

  render() {
    if (!isManagerRole(this.props.currentUser)) {
      return <Redirect to="/forbidden" />;
    }
    const leaveEntitlementCols = [
      {
        id: "emplid",
        Header: "Employee ID",
        accessor: "id.emplid",
        minWidth: 110,
        sortable: true,
        filterable: true
      },
      {
        id: "name",
        Header: "Employee Name",
        accessor: "employeeDetails.name",
        minWidth: 180,
        sortable: true,
        filterable: true
      },
      {
        id: "leaveYear",
        Header: "Year",
        accessor: "id.year",
        minWidth: 70,
        sortable: true,
        filterable: true,
        style: {
          textAlign: "center"
        }
      },
      {
        id: "leaveType",
        Header: "Leave Type",
        accessor: "leaveCategory.leaveDescr",
        minWidth: 180,
        sortable: true,
        filterable: true
      },
      {
        id: "carryForward",
        Header: "Carried Forward",
        accessor: str => str.carryForward + " day(s)",
        minWidth: 120,
        sortable: true,
        filterable: true,
        style: {
          textAlign: "center"
        }
      },
      {
        id: "entitlement",
        Header: "Entitlement",
        accessor: str => str.entitlement + " day(s)",
        // minWidth: 120,
        sortable: true,
        filterable: true,
        style: {
          textAlign: "center"
        }
      },
      {
        id: "availableLeave",
        Header: "Available Leave",
        accessor: str => str.availableLeave + " day(s)",
        // minWidth: 120,
        sortable: true,
        filterable: true,
        style: {
          textAlign: "center"
        }
      },
      {
        id: "takenLeave",
        Header: "Taken Leave",
        accessor: str => str.takenLeave + " day(s)",
        // minWidth: 120,
        sortable: true,
        filterable: true,
        style: {
          textAlign: "center"
        }
      },
      {
        id: "balanceLeave",
        Header: "Balance Leave",
        accessor: str => str.balanceLeave + " day(s)",
        // minWidth: 120,
        sortable: true,
        filterable: true,
        style: {
          textAlign: "center"
        }
      },
    ];

    return (
      <div className="mainContainerFlex">
        <div className="headerContainerFlex">
          <span className="header">
            <h3 className="headerStyle">Leave Entitlements</h3>
          </span>
        </div>
        {this.state.loading ? (
          <LoadingPage />
        ) : (
          <React.Fragment>
            <div className="reactTableContainer">
              <div className="mainListBtnContainer">
                <div className="SubListBtnLeftContainer">
                  <Button
                    variant="contained"
                    color="primary"
                    className="largeButtonOverride"
                    onClick={() =>
                      document.getElementById("test-table-xls-button").click()
                    }
                  >
                    <span
                      className="fa fa-file-excel-o"
                      style={{ margin: "0px 5px 0px 0px" }}
                    />
                    Export List to Excel
                  </Button>
                </div>

              </div> 
              <ReactTable
                data={this.state.leaveEntitlementData}
                columns={leaveEntitlementCols}
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id])
                    .toLowerCase()
                    .includes(filter.value.toLowerCase())
                }
                defaultPageSize={10}
                pages={this.state.pages}
                loading={this.state.loading}
                filterable={true}
                sortable={true}
                multiSort={true}
                loadingText="Loading Leave Entitlements..."
                noDataText="No data available."
                className="-striped"
              />
              <ExportToExcel
                leaveEntitlementData={this.state.leaveEntitlementData}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withRouter(LeaveEntitlementManager);
