import "moment/locale/th";
import React from "react";
import ReactTable from "react-table";
import ReactModal from "react-modal";
import DatePicker from "react-datepicker";
import moment from "moment";
import plusIconImage from "../../assets/icon/plus-icon.png";
import deleteIconImage from "../../assets/icon/empty-icon.png";
import editIconImage from "../../assets/icon/edit-icon.png";
import welletIconImage from "../../assets/icon/wellet-icon.png";
import "./Project.css";

const plusIcon = { src: plusIconImage, alt: "plus-icon" };
const editIcon = { src: editIconImage, alt: "edit-icon" };
const deleteIcon = { src: deleteIconImage, alt: "delete-icon" };
const welletIcon = { src: welletIconImage, alt: "preview-icon" };
const API_URL = "http://localhost:5000/api/";
const TAX = {
  PER_3: "per_3",
  PER_7: "per_7",
  NO_TAX: "no_tax"
};
const remarks = [
  { value: "DEPOSIT", text: "เงินฝากธนาคาร" },
  { value: "CASH", text: "เงินสด" }
];
const statuss = [
  { value: "RECEIVE", text: "ได้รับแล้ว" },
  { value: "NOT_RECEIVE", text: "ยังไม่ได้รับแล้ว" }
];
const agencyTypes = [
  { value: "GOVERMENT", text: "ภาครัฐ" },
  { value: "INDIVIDUAL", text: "ภาคเอกชน" },
  { value: "OTHER", text: "อื่นๆ" }
];
let globalSumPredict = {
  rev: 0,
  exp: 0,
  total: 0
};
let projectValue = 0;

moment.locale("th");

// this.props.history.push('/project-review', { })

class Project extends React.Component {
  state = {
    confirmModal: {
      isOpen: false,
      title: "",
      onOK: () => {},
      onCancel: () => {}
    },
    formSearch: {
      project_number: "",
      project_name: "",
      project_type_name: "กรุณาเลือกประเภทโครงการ",
      pact_start_date: null,
      pact_end_date: null
    },
    formAddProject: {
      project_name: "",
      project_number: "",
      project_type_id: 1,
      project_total: 0,
      pact_start_date: moment(),
      project_value: 0,
      pact_end_date: moment(),
      partner_name1: "",
      partner_ratio1: "",
      partner_name2: "",
      partner_ratio2: "",
      partner_name3: "",
      partner_ratio3: "",
      pact_id: "",
      employer_name: "",
      employer_type: agencyTypes[0].value
    },
    formProjectDetail: {
      project_id: "",
      project_number: "",
      project_name: "",
      project_type_id: 1,
      pact_start_date: moment(),
      project_value: 0,
      pact_end_date: moment(),
      partner_name1: "",
      partner_ratio1: "",
      partner_name2: "",
      partner_ratio2: "",
      partner_name3: "",
      partner_ratio3: "",
      pact_id: "",
      employer_name: "",
      employer_type: agencyTypes[0].value,
      revenue_id: "",
      expenditure_id: "",
      revenue: [],
      expenditure: [],
      predict_revenue_id: "",
      predict_expenditure_id: "",
      predict_revenue: [],
      predict_expenditure: []
    },
    formRevenue: {
      period: "",
      revenue_id: "",
      revenue_det_id: "",
      withdraw_date: moment(),
      predict_date: moment(),
      withdraw_date_true: null,
      price_per: 0,
      price: 0,
      remark: "",
      status: ""
    },
    formExpenditure: {
      expenditure_id: "",
      expenditure_det_id: "",
      period: "",
      expenditure_item: "",
      amount: "",
      price_per_unit: 0,
      price_total: 0,
      expenditure_date: moment(),
      remark: "",
      tax: TAX.NO_TAX
    },
    formPredictRev: {
      predict_revenue_id: "",
      predict_revenue_det_id: "",
      period: "",
      price: 0,
      price_bath: 0
    },
    formPredictExp: {
      predict_expenditure_id: "",
      predict_expenditure_det_id: "",
      period: "",
      price: 0
    },
    projects: [],
    projectTypes: [],
    openAddProject: false,
    openProjectDetail: false,
    openRevenue: false,
    openExpenditure: false,
    openPredict: false,
    modeRevenue: "ADD",
    modeExpenditure: "ADD",
    modePredict: "ADD"
  };

  columnsProject = [
    {
      Header: "รายการ",
      columns: [
        {
          Header: "ลำดับ",
          style: { textAlign: "center" },
          Cell: ({ row }) => row._index + 1
        },
        {
          Header: "รหัสโครงการ",
          style: { textAlign: "center" },
          accessor: "project_number"
        },
        {
          Header: "ชื่อโครงการ",
          style: { textAlign: "center" },
          accessor: "project_name"
        },
        {
          Header: "ประเภทโครงการ",
          style: { textAlign: "center" },
          accessor: "project_type_name"
        },
        {
          Header: "วันที่เริ่มต้น",
          style: { textAlign: "center" },
          id: "pact_start_date",
          accessor: d =>
            moment(d.pact_start_date)
              .add(-543, "year")
              .format("DD/MM/YYYY")
        },
        {
          Header: "วันที่สิ้นสุด",
          style: { textAlign: "center" },
          id: "pact_end_date",
          accessor: d =>
            moment(d.pact_end_date)
              .add(-543, "year")
              .format("DD/MM/YYYY")
        }
      ]
    },
    {
      Header: "เมนู",
      columns: [
        {
          Header: "ปริ้นพีวิว",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={welletIcon.src}
              alt={welletIcon.alt}
              onClick={() =>
                this.props.history.push("/project-preview", {
                  row,
                  projectTypes: this.state.projectTypes
                })
              }
            />
          )
        },
        {
          Header: "แก้ไข",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={editIcon.src}
              alt={editIcon.alt}
              onClick={() => this.onOpenProjectDetail(row)}
            />
          )
        },
        {
          Header: "ลบ",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={deleteIcon.src}
              alt={deleteIcon.alt}
              onClick={() => {
                this.setState({
                  confirmModal: {
                    ...this.state.confirmModal,
                    isOpen: true,
                    title: "ยืนยันการลบข้อมูลโปรเจค",
                    onOK: () => this.deleteProject(row)
                  }
                });
              }}
            />
          )
        }
      ]
    }
  ];

  columnsPredict = [
    {
      Header: "รายรับ",
      columns: [
        {
          Header: "งวด",
          style: { textAlign: "center" },
          accessor: "revenue.period"
        },
        // { Header: "จำนวน(เปอร์เซน)", accessor: "revenue.price" },
        {
          Header: "จำนวน(บาท)",
          style: { textAlign: "center" },
          id: "price_bath",
          accessor: d => this.calcucalePredictRevBath(d.revenue.price),
          Footer: data => {
            console.log("data =>", data);
            this.calculateSumPredict();
            return <span>รวม: {globalSumPredict.rev}</span>;
          }
        }
      ]
    },
    {
      Header: "รายจ่าย",
      columns: [
        {
          Header: "งวด",
          style: { textAlign: "center" },
          accessor: "expenditure.period"
        },
        {
          Header: "จำนวน(บาท)",
          style: { textAlign: "center" },
          accessor: "expenditure.price",
          Footer: () => {
            this.calculateSumPredict();
            return <span>รวม: {globalSumPredict.exp}</span>;
          }
        }
      ]
    },
    {
      Header: "เมนู",
      columns: [
        {
          Header: "แก้ไข",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={editIcon.src}
              alt={editIcon.alt}
              onClick={() => {
                this.onOpenPredict(row, "Edit");
              }}
            />
          )
        },
        {
          Header: "ลบ",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={deleteIcon.src}
              alt={deleteIcon.alt}
              onClick={() => {
                this.setState({
                  confirmModal: {
                    ...this.state.confirmModal,
                    isOpen: true,
                    title: "ยืนยันการลบข้อมูลประมาณการรายรับรับรายจ่าย",
                    onOK: () => this.deletePredict(row)
                  }
                });
              }}
            />
          )
        }
      ]
    }
  ];

  columnsRevenue = [
    {
      Header: "รายการ",
      columns: [
        // { Header: "งวด", Cell: ({ row }) => row._index + 1 },
        { Header: "งวด", style: { textAlign: "center" }, accessor: "period" },
        {
          Header: "วันที่เบิก",
          id: "withdraw_date",
          style: { textAlign: "center" },
          accessor: d =>
            moment(d.withdraw_date)
              .add(-543, "year")
              .format("DD/MM/YYYY")
        },
        {
          Header: "ประมาณการรับ",
          style: { textAlign: "center" },
          id: "predict_date",
          accessor: d =>
            moment(d.predict_date)
              .add(-543, "year")
              .format("DD/MM/YYYY")
        },
        {
          Header: "วันที่รับจริง",
          style: { textAlign: "center" },
          id: "withdraw_date_true",
          accessor: d => {
            if (!d.withdraw_date_true) {
              return null;
            }

            return moment(d.withdraw_date_true)
              .add(-543, "year")
              .format("DD/MM/YYYY");
          }
        },
        {
          Header: "จำนวน(%)",
          style: { textAlign: "center" },
          accessor: "price_per"
        },
        {
          Header: "จำนวน(บาท)",
          style: { textAlign: "center" },
          id: "price",
          accessor: d => {
            console.log(" ===");
            console.log("d.price_per", d.price_per);
            console.log("this.state", this.state);
            console.log("d.project_value", d.project_value);
            console.log(
              "this.state.formProjectDetail.project_value",
              projectValue
            );
            console.log("return", d.price_per * d.project_value / 100);

            return d.price_per * d.project_value / 100;
          }
        },
        {
          Header: "หมายเหตุ",
          style: { textAlign: "center" },
          id: "remark",
          accessor: d => remarks.filter(re => re.value === d.remark)[0].text
        },
        {
          Header: "สถานะ",
          style: { textAlign: "center" },
          id: "status",
          accessor: d => statuss.filter(st => st.value === d.status)[0].text
        }
      ]
    },
    {
      Header: "เมนู",
      columns: [
        {
          Header: "แก้ไข",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={editIcon.src}
              alt={editIcon.alt}
              onClick={() => {
                this.onOpenRevenue(row, "Edit");
              }}
            />
          )
        },
        {
          Header: "ลบ",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={deleteIcon.src}
              alt={deleteIcon.alt}
              onClick={() => {
                this.setState({
                  confirmModal: {
                    ...this.state.confirmModal,
                    isOpen: true,
                    title: "ยืนยันการลบข้อมูลรายรับ",
                    onOK: () => this.deleteRevenue(row)
                  }
                });
              }}
            />
          )
        }
      ]
    }
  ];

  // TODOEX
  columnsExpenditure = [
    {
      Header: "รายการ",
      columns: [
        // { Header: "งวด", Cell: ({ row }) => row._index + 1 },
        { Header: "งวด", style: { textAlign: "center" }, accessor: "period" },
        { Header: "รายการ", accessor: "expenditure_item" },
        {
          Header: "วันที่",
          style: { textAlign: "center" },
          id: "expenditure_date",
          accessor: d =>
            moment(d.expenditure_date)
              .add(-543, "year")
              .format("DD/MM/YYYY")
        },
        { Header: "จำนวน", style: { textAlign: "center" }, accessor: "amount" },
        {
          Header: "ราคา/หน่วย",
          style: { textAlign: "center" },
          accessor: "price_per_unit"
        },
        {
          Header: "ราคารวม",
          style: { textAlign: "center" },
          accessor: "price_total"
        },
        {
          Header: "หมายเหตุ",
          style: { textAlign: "center" },
          id: "remark",
          accessor: r => remarks.filter(re => re.value === r.remark)[0].text
        }
      ]
    },
    {
      Header: "เมนู",
      columns: [
        {
          Header: "แก้ไข",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={editIcon.src}
              alt={editIcon.alt}
              onClick={() => {
                this.onOpenExpenditure(row, "Edit");
              }}
            />
          )
        },
        // {
        //   Header: 'แก้ไข',
        //   Cell: ({ row }) => (
        //     <button onClick={(e) => console.log(e, row)}>Click Me</button>
        //   )
        // },
        {
          Header: "ลบ",
          style: { textAlign: "center" },
          Cell: ({ row }) => (
            <img
              style={{ height: "40px", width: "40px" }}
              src={deleteIcon.src}
              alt={deleteIcon.alt}
              onClick={() => {
                this.setState({
                  confirmModal: {
                    ...this.state.confirmModal,
                    isOpen: true,
                    title: "ยืนยันการลบข้อมูลรายจ่าย",
                    onOK: () => this.deleteExpenditure(row)
                  }
                });
              }}
            />
          )
        }
      ]
    }
  ];

  onOpenExpenditure(row, mode) {
    this.setState({
      modeExpenditure: mode,
      openExpenditure: true,
      formExpenditure:
        mode === "Add"
          ? {
              expenditure_id: "",
              expenditure_det_id: "",
              period: "",
              expenditure_item: "",
              amount: "",
              price_per_unit: 0,
              price_total: 0,
              expenditure_date: moment(),
              remark: remarks[0].value,
              tax: TAX.NO_TAX
            }
          : {
              ...row._original,
              expenditure_date: moment(row._original.expenditure_date).add(
                -543,
                "year"
              )
            }
    });
  }

  onOpenPredict(row, mode) {
    this.setState({
      openPredict: true,
      modePredict: mode,
      formPredictRev:
        mode === "Add"
          ? {
              predict_revenue_det_id: "",
              predict_revenue_id: "",
              period: "",
              price: 0,
              price_bath: 0
            }
          : {
              ...row._original.revenue,
              price_bath: this.calcucalePredictRevBath(row._original.price)
            },
      formPredictExp:
        mode === "Add"
          ? {
              predict_expenditure_det_id: "",
              predict_expenditure_id: "",
              period: "",
              price: 0
            }
          : { ...row._original.expenditure }
    });
  }

  onOpenRevenue(row, mode) {
    // const { project_id, revenue_id, expenditure_id } = row._original;
    this.setState({
      modeRevenue: mode,
      openRevenue: true,
      formRevenue:
        mode === "Add"
          ? {
              period: "",
              revenue_id: "",
              revenue_det_id: "",
              withdraw_date: moment(),
              predict_date: moment(),
              withdraw_date_true: null,
              price_per: 0,
              price: 0,
              remark: remarks[0].value,
              status: statuss[0].value
            }
          : {
              ...row._original,
              price:
                row._original.price_per *
                this.state.formProjectDetail.project_value /
                100,
              withdraw_date: moment(row._original.withdraw_date).add(
                -543,
                "year"
              ),
              predict_date: moment(row._original.predict_date).add(
                -543,
                "year"
              ),
              withdraw_date_true: !row._original.withdraw_date_true
                ? null
                : moment(row._original.withdraw_date_true).add(-543, "year")
            }
    });
  }

  onOpenProjectDetail(row) {
    const {
      project_id,
      revenue_id,
      expenditure_id,
      predict_revenue_id,
      predict_expenditure_id
    } = row._original;
    this.getProjectByID(project_id);
    this.getRevenue(revenue_id);
    this.getExpenditure(expenditure_id);
    this.getPredictRevenue(predict_revenue_id);
    this.getPredictExpenditure(predict_expenditure_id);
    this.setState({ openProjectDetail: true });
  }

  getProjectByID(project_id) {
    fetch(`${API_URL}project/${project_id}`)
      .then(res => res.json())
      .then(project => {
        this.setState(
          {
            formProjectDetail: {
              ...this.state.formProjectDetail,
              ...project[0],
              pact_start_date: moment(project[0].pact_start_date).add(
                -543,
                "year"
              ),
              pact_end_date: moment(project[0].pact_end_date).add(-543, "year")
            }
          },
          () => {
            this.setState({
              formProjectDetail: {
                ...this.state.formProjectDetail,
                ...project[0],
                pact_start_date: moment(project[0].pact_start_date).add(
                  -543,
                  "year"
                ),
                pact_end_date: moment(project[0].pact_end_date).add(
                  -543,
                  "year"
                )
              }
            });
            projectValue = project[0].project_value;
            this.forceUpdate();
            console.log("set leawwwwwwwwwwwwwwwww", projectValue);
          }
        );
      })
      // .then((project) => {
      //   const {pact_start_date} = project[0];
      //   console.log(pact_start_date)

      //   console.log(moment(pact_start_date).add(-543 ,'year')
      //   .format('DD/MM/YYYY'))
      // })
      .catch(err => console.log(err));
  }

  getPredictRevenue(predict_revenue_id) {
    if (predict_revenue_id !== 0 && !predict_revenue_id) {
      this.setState({
        formProjectDetail: {
          ...this.state.formProjectDetail,
          predict_revenue_id: "",
          predict_revenue: []
        }
      });
      return;
    }

    fetch(`${API_URL}predict-revenue/${predict_revenue_id}`)
      .then(res => res.json())
      .then(predict_revenue =>
        this.setState({
          formProjectDetail: {
            ...this.state.formProjectDetail,
            predict_revenue_id,
            predict_revenue
          }
        })
      )
      .catch(err => console.log(err));
  }

  getPredictExpenditure(predict_expenditure_id) {
    if (predict_expenditure_id !== 0 && !predict_expenditure_id) {
      this.setState({
        formProjectDetail: {
          ...this.state.formProjectDetail,
          predict_expenditure_id: "",
          predict_expenditure: []
        }
      });
      return;
    }

    fetch(`${API_URL}predict-expenditure/${predict_expenditure_id}`)
      .then(res => res.json())
      .then(predict_expenditure =>
        this.setState({
          formProjectDetail: {
            ...this.state.formProjectDetail,
            predict_expenditure_id,
            predict_expenditure
          }
        })
      )
      .catch(err => console.log(err));
  }

  getRevenue(revenue_id) {
    if (revenue_id !== 0 && !revenue_id) {
      this.setState({
        formProjectDetail: {
          ...this.state.formProjectDetail,
          revenue_id: "",
          revenue: []
        }
      });
      return;
    }

    fetch(`${API_URL}receipts/${revenue_id}`)
      .then(res => res.json())
      .then(revenue => {
        // console.log('revenue ', revenue)
        this.setState({
          formProjectDetail: {
            ...this.state.formProjectDetail,
            revenue_id,
            revenue
          }
        });
      })
      .catch(err => console.log(err));
  }

  getExpenditure(expenditure_id) {
    if (expenditure_id !== 0 && !expenditure_id) {
      this.setState({
        formProjectDetail: {
          ...this.state.formProjectDetail,
          expenditure_id: "",
          expenditure: []
        }
      });
      return;
    }

    fetch(`${API_URL}expense/${expenditure_id}`)
      .then(res => res.json())
      .then(expenditure =>
        this.setState({
          formProjectDetail: {
            ...this.state.formProjectDetail,
            expenditure_id,
            expenditure
          }
        })
      )
      .catch(err => console.log(err));
  }

  clearFormSearch() {
    this.setState({
      formSearch: {
        project_number: "",
        project_name: "",
        project_type_name: "กรุณาเลือกประเภทโครงการ",
        pact_start_date: null,
        pact_end_date: null
      }
    });
  }

  setQueryAndSearch() {
    const {
      project_number,
      project_name,
      project_type_name,
      pact_start_date,
      pact_end_date
    } = this.state.formSearch;

    let query = [];
    if (project_number !== "") query.push(`project_number=${project_number}`);
    if (project_name !== "") query.push(`project_name=${project_name}`);
    if (
      project_type_name !== "" &&
      project_type_name !== "กรุณาเลือกประเภทโครงการ"
    )
      query.push(`project_type_name=${project_type_name}`);
    if (pact_start_date)
      query.push(`pact_start_date=${this.formatDateToDB(pact_start_date)}`);
    if (pact_end_date)
      query.push(`pact_end_date=${this.formatDateToDB(pact_end_date)}`);

    const queryString = query.join("&").trim();
    this.getProject(queryString);
  }

  formatDateToDB(date) {
    if (!date) {
      return null;
    }
    // return moment(date).add(543 ,'year').format('YYYY-MM-DD HH:mm:ss');
    return moment(date)
      .add(543, "year")
      .format("YYYY-MM-DD");
  }

  getProjectType() {
    fetch(`${API_URL}project-types`)
      .then(res => res.json())
      .then(projectTypes => this.setState({ projectTypes }))
      .catch(err => console.log(err));
  }

  updateProject() {
    // console.log(this.state.formAddProject)
    const {
      project_id,
      project_name,
      project_type_id,
      pact_start_date,
      project_number,
      pact_end_date,
      partner_name1,
      partner_ratio1,
      partner_name2,
      partner_ratio2,
      partner_name3,
      partner_ratio3,
      pact_id,
      employer_name,
      project_value,
      revenue
    } = this.state.formProjectDetail;
    fetch(`${API_URL}project/${project_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        project_name,
        project_type_id,
        project_number,
        partner_name1,
        partner_ratio1,
        partner_name2,
        partner_ratio2,
        partner_name3,
        partner_ratio3,
        pact_id,
        employer_name,
        pact_start_date: this.formatDateToDB(pact_start_date),
        pact_end_date: this.formatDateToDB(pact_end_date),
        project_value,
        edit_by: JSON.parse(localStorage.getItem("user")).username,
        revenue
      })
    })
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id
        } = this.state.formProjectDetail;

        this.getProject();
        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.closeProjectDetail();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  insertProject() {
    // manual validate
    for (const i in this.state.formAddProject) {
      const value = this.state.formAddProject[i];
      if (
        [
          "partner_name1",
          "partner_ratio1",
          "partner_name2",
          "partner_ratio2",
          "partner_name3",
          "partner_ratio3"
        ].indexOf(i) !== -1
      ) {
        continue;
      }
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        console.log(i, value);
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
    }

    console.log("formAddProject ==> ", this.state.formAddProject);

    const {
      project_name,
      project_type_id,
      project_number,
      pact_start_date,
      pact_end_date,
      partner_name1,
      partner_ratio1,
      partner_name2,
      partner_ratio2,
      partner_name3,
      partner_ratio3,
      pact_id,
      employer_name,
      employer_type,
      project_value
    } = this.state.formAddProject;
    fetch(`${API_URL}project`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        project_name,
        project_type_id,
        partner_name1,
        partner_ratio1,
        partner_name2,
        partner_ratio2,
        partner_name3,
        partner_ratio3,
        pact_id,
        employer_name,
        employer_type,
        pact_start_date: this.formatDateToDB(pact_start_date),
        pact_end_date: this.formatDateToDB(pact_end_date),
        project_value,
        project_number,
        create_by: JSON.parse(localStorage.getItem("user")).username
      })
    })
      .then(() => {
        this.getProject();
        this.closeAddProjectModal();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  deleteProject(row) {
    console.log("delete naja");
    const {
      project_id,
      revenue_id,
      expenditure_id,
      predict_revenue_id,
      predict_expenditure_id
    } = row._original;
    console.log("before delete", row._original);
    fetch(
      `${API_URL}project/${project_id}/${revenue_id}/${expenditure_id}/${predict_revenue_id}/${predict_expenditure_id}`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(() => {
        this.getProject();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  insertExpenditure() {
    const { expenditure_id } = this.state.formProjectDetail;
    const {
      period,
      expenditure_item,
      amount,
      price_per_unit,
      price_total,
      expenditure_date,
      remark,
      tax
    } = this.state.formExpenditure;
    fetch(`${API_URL}expense`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        expenditure_id,
        period,
        expenditure_item,
        amount,
        price_per_unit,
        price_total,
        expenditure_date: this.formatDateToDB(expenditure_date),
        remark,
        tax,
        create_by: JSON.parse(localStorage.getItem("user")).username
      })
    })
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closeExpenditure();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  insertPredict() {
    Promise.all([this.insertPredictRev(), this.insertPredictExp()])
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closePredict();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  insertPredictRev() {
    const { predict_revenue_id } = this.state.formProjectDetail;
    const { period, price } = this.state.formPredictRev;
    return fetch(`${API_URL}predict-revenue`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        predict_revenue_id,
        period,
        price
      })
    });
  }

  insertPredictExp() {
    const { predict_expenditure_id } = this.state.formProjectDetail;
    const { period, price } = this.state.formPredictExp;
    return fetch(`${API_URL}predict-expenditure`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        predict_expenditure_id,
        period,
        price
      })
    });
  }

  insertRevenue() {
    const { revenue_id } = this.state.formProjectDetail;
    const {
      period,
      withdraw_date,
      predict_date,
      withdraw_date_true,
      price_per,
      price,
      remark,
      status
    } = this.state.formRevenue;
    console.log("project type is", this.state.formRevenue);

    fetch(`${API_URL}receipts`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        revenue_id,
        period,
        withdraw_date: this.formatDateToDB(withdraw_date),
        predict_date: this.formatDateToDB(predict_date),
        withdraw_date_true: this.formatDateToDB(withdraw_date_true),
        price_per,
        price,
        remark,
        status,
        create_by: JSON.parse(localStorage.getItem("user")).username
      })
    })
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closeRevenue();
        // this.getProject();
        // this.closeRevenue();
        // this.closeProjectDetail();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  deleteExpenditure(row) {
    const { expenditure_id, expenditure_det_id } = row._original;
    fetch(`${API_URL}expense/${expenditure_id}/${expenditure_det_id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closeExpenditure();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  updateExpenditure() {
    // console.log(this.state.formAddProject);
    // const { revenue_id } = this.state.formProjectDetail;

    // TODOEX
    const {
      expenditure_id,
      expenditure_det_id,
      period,
      expenditure_item,
      amount,
      price_per_unit,
      price_total,
      expenditure_date,
      remark,
      tax
    } = this.state.formExpenditure;
    fetch(`${API_URL}expense/${expenditure_det_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        expenditure_id,
        period,
        expenditure_item,
        amount,
        price_per_unit,
        price_total,
        expenditure_date: this.formatDateToDB(expenditure_date),
        remark,
        tax,
        edit_by: JSON.parse(localStorage.getItem("user")).username
      })
    })
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closeExpenditure();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  deletePredict(row) {
    Promise.all([
      this.deletePredictRevenue(row),
      this.deletePredictExpenditure(row)
    ])
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closeRevenue();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  deletePredictRevenue(row) {
    const { predict_revenue_det_id } = row._original.revenue;
    return fetch(`${API_URL}predict-revenue/${predict_revenue_det_id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  deletePredictExpenditure(row) {
    const { predict_expenditure_det_id } = row._original.expenditure;
    return fetch(
      `${API_URL}predict-expenditure/${predict_expenditure_det_id}`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  deleteRevenue(row) {
    const { revenue_id, revenue_det_id } = row._original;
    fetch(`${API_URL}receipts/${revenue_id}/${revenue_det_id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closeRevenue();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  updatePredict() {
    console.log("before all");
    Promise.all([this.updatePredictRevenue(), this.updatePredictExpenditure()])
      .then(() => {
        console.log("after all");
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closePredict();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  updatePredictRevenue() {
    // console.log(this.state.formAddProject);
    // const { revenue_id } = this.state.formProjectDetail;
    const {
      predict_revenue_id,
      predict_revenue_det_id,
      period,
      price
    } = this.state.formPredictRev;
    return fetch(`${API_URL}predict-revenue/${predict_revenue_det_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        predict_revenue_id,
        period,
        price
      })
    });
  }

  updatePredictExpenditure() {
    // console.log(this.state.formAddProject);
    // const { revenue_id } = this.state.formProjectDetail;
    const {
      predict_expenditure_id,
      predict_expenditure_det_id,
      period,
      price
    } = this.state.formPredictExp;
    console.log("allall", this.state.formPredictExp);
    return fetch(
      `${API_URL}predict-expenditure/${predict_expenditure_det_id}`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          predict_expenditure_id,
          period,
          price
        })
      }
    );
  }

  updateRevenue() {
    // console.log(this.state.formAddProject);
    // const { revenue_id } = this.state.formProjectDetail;
    const {
      revenue_id,
      period,
      revenue_det_id,
      withdraw_date,
      predict_date,
      withdraw_date_true,
      price_per,
      price,
      remark,
      status
    } = this.state.formRevenue;
    fetch(`${API_URL}receipts/${revenue_det_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        period,
        revenue_id,
        withdraw_date: this.formatDateToDB(withdraw_date),
        predict_date: this.formatDateToDB(predict_date),
        withdraw_date_true: this.formatDateToDB(withdraw_date_true),
        price_per,
        price,
        remark,
        status,
        edit_by: JSON.parse(localStorage.getItem("user")).username
      })
    })
      .then(() => {
        const {
          project_id,
          revenue_id,
          expenditure_id,
          predict_revenue_id,
          predict_expenditure_id
        } = this.state.formProjectDetail;

        this.getProjectByID(project_id);
        this.getRevenue(revenue_id);
        this.getExpenditure(expenditure_id);
        this.getPredictRevenue(predict_revenue_id);
        this.getPredictExpenditure(predict_expenditure_id);
        this.closeRevenue();
      })
      .catch(err => {
        alert("Not Success");
        console.log(err);
      });
  }

  closeExpenditure() {
    this.setState({
      openExpenditure: false,
      formExpenditure: {
        expenditure_id: "",
        expenditure_det_id: "",
        period: "",
        expenditure_item: "",
        amount: "",
        price_per_unit: 0,
        price_total: 0,
        expenditure_date: moment(),
        remark: "",
        tax: TAX.NO_TAX
      }
    });
  }

  closeRevenue() {
    this.setState({
      openRevenue: false,
      formRevenue: {
        period: "",
        revenue_id: "",
        revenue_det_id: "",
        withdraw_date: moment(),
        predict_date: moment(),
        withdraw_date_true: moment(),
        price_per: 0,
        price: 0,
        remark: "",
        status: ""
      }
    });
  }

  closeProjectDetail() {
    this.setState(
      {
        openProjectDetail: false,
        formProjectDetail: {
          project_id: "",
          project_name: "",
          project_number: "",
          project_type_id: 1,
          pact_start_date: moment(),
          pact_end_date: moment(),
          partner_name1: "",
          partner_ratio1: "",
          partner_name2: "",
          partner_ratio2: "",
          partner_name3: "",
          partner_ratio3: "",
          project_value: 0,
          revenue_id: "",
          expenditure_id: "",
          pact_id: "",
          employer_name: "",
          employer_type: agencyTypes[0].value,
          revenue: [],
          expenditure: [],
          predict_revenue_id: "",
          predict_expenditure_id: "",
          predict_revenue: [],
          predict_expenditure: []
        }
      },
      () => {
        projectValue = 0;
      }
    );
  }

  closeAddProjectModal() {
    this.setState(
      {
        openAddProject: false,
        formAddProject: {
          project_name: "",
          project_type_id: 1,
          pact_start_date: moment(),
          pact_end_date: moment(),
          project_value: 0,
          partner_name1: "",
          partner_ratio1: "",
          partner_name2: "",
          partner_ratio2: "",
          partner_name3: "",
          partner_ratio3: "",
          pact_id: "",
          employer_name: "",
          employer_type: agencyTypes[0].value
        }
      },
      () => {
        projectValue = 0;
      }
    );
  }

  getProject(queryString = "") {
    // console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
    console.log(queryString);
    fetch(`${API_URL}projects?${queryString}`)
      .then(res => res.json())
      .then(projects => this.setState({ projects }))
      .catch(err => console.log(err));
  }

  calculateSumRevenue() {
    const sumRevenue = this.state.formProjectDetail.revenue.reduce(
      (sum, r) =>
        this.state.formProjectDetail.project_value * r.price_per / 100 + sum,
      0
    );
    const tax = sumRevenue * 3 / 100;
    const all = sumRevenue - tax;
    return { sumRevenue, tax, all };
  }

  calculateSumExpenditure() {
    const sum = this.state.formProjectDetail.expenditure.reduce(
      (sum, e) => e.price_total + sum,
      0
    );
    return { sum };
  }

  calculateExpenditureTax() {
    const { tax, price_total } = this.state.formExpenditure;
    if (tax === TAX.NO_TAX) {
      return {
        tax: 0,
        total: price_total
      };
    } else {
      const perTax = tax === TAX.PER_3 ? 3 : 7;
      return {
        tax: price_total * (perTax / 100),
        total: price_total - price_total * (perTax / 100)
      };
    }
  }

  calcucalePredictRevBath = revPrice => {
    const { project_value } = this.state.formProjectDetail;
    const price = project_value * revPrice / 100;
    return price - price * 3 / 100;
  };

  closePredict() {
    this.setState({
      openPredict: false,
      modePredict: "ADD",
      formPredictRev: {
        predict_revenue_id: "",
        predict_revenue_det_id: "",
        period: "",
        price: 0,
        price_bath: 0
      },
      formPredictExp: {
        predict_expenditure_id: "",
        predict_expenditure_det_id: "",
        period: "",
        price: 0
      }
    });
  }

  calculateSumPredict() {
    const { formProjectDetail } = this.state;
    // if (!formProjectDetail || !formProjectDetail.predict_revenue || !formProjectDetail.predict_expenditure) {
    //   return {
    //     rev: 0,
    //     exp: 0,
    //     total: 0,
    //   }
    // } else {
    const rev = formProjectDetail.predict_revenue.reduce((sum, r) => {
      const price = formProjectDetail.project_value * r.price / 100;
      return sum + (price - price * 3 / 100);
    }, 0);
    const exp = formProjectDetail.predict_expenditure.reduce(
      (sum, e) => sum + e.price,
      0
    );
    globalSumPredict = {
      rev,
      exp,
      total: rev - exp
    };
    return {
      rev,
      exp,
      total: rev - exp
    };
    // }
  }

  componentWillMount() {
    if (!localStorage.getItem("user")) {
      this.props.history.replace("/login");
    }

    this.getProject();
    this.getProjectType();
  }

  render() {
    // console.log('props, ')
    const {
      openAddProject,
      openProjectDetail,
      openExpenditure,
      openRevenue,
      formSearch,
      projects,
      formAddProject,
      formProjectDetail,
      formRevenue,
      formExpenditure,
      projectTypes,
      modeRevenue,
      modeExpenditure,
      confirmModal,
      openPredict,
      modePredict,
      formPredictRev,
      formPredictExp
    } = this.state;
    const predicts = formProjectDetail.predict_revenue.map((r, i) => ({
      revenue: r,
      expenditure: formProjectDetail.predict_expenditure[i]
    }));

    return (
      <div>
        <div className="controllerButtons">
          <a className="button icon add-user">
            <img
              src={plusIcon.src}
              alt={plusIcon.alt}
              onClick={() => {
                this.setState({
                  openAddProject: true
                });
              }}
            />
          </a>
        </div>
        <ReactModal
          isOpen={openAddProject}
          aria={{
            labelledby: "project from",
            describedby: "project from"
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(7, 7, 7, 0.6)",
              zIndex: 1000
            }
          }}
        >
          <div className="root-form-user">
            <h1>เพิ่มโครงการ</h1>
            {/* project name */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ชื่อโครงการ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            project_name: e.target.value
                          }
                        });
                      }}
                      value={formAddProject.project_name}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* project number */}
            <div className="field">
              <div className="is-normal">
                <label className="label">เลขที่โครงการ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            project_number: e.target.value
                          }
                        });
                      }}
                      value={formAddProject.project_number}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* project types */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ประเภทโครงการ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <select
                      value={formAddProject.project_type_id}
                      className="select select-app"
                      onChange={e => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            project_type_id: e.target.value
                          }
                        });
                      }}
                    >
                      {projectTypes.map(pjType => (
                        <option key={pjType.value} value={pjType.id}>
                          {pjType.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* pact start date */}
            <div className="field">
              <div className="is-normal">
                <label className="label">วันที่เริ่มโครงการ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <DatePicker
                      dateFormat="DD/MM/YYYY"
                      className="input input-app"
                      locale="th"
                      selected={formAddProject.pact_start_date}
                      onChange={date => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            pact_start_date: date
                          }
                        });
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* pact end date */}
            <div className="field">
              <div className="is-normal">
                <label className="label">วันที่สิ้นสุดโครงการ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <DatePicker
                      dateFormat="DD/MM/YYYY"
                      className="input input-app"
                      locale="th"
                      selected={formAddProject.pact_end_date}
                      onChange={date => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            pact_end_date: date
                          }
                        });
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* project price */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ราคาโครงการ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      value={formAddProject.project_value}
                      onChange={e => {
                        this.setState(
                          {
                            formAddProject: {
                              ...formAddProject,
                              project_value: e.target.value
                            }
                          },
                          () => {
                            projectValue = e.target.value;
                          }
                        );
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* parner name 1
            // <div
            //   className="field"
            //   style={{ display: "flex", justifyContent: "space-around" }}
            // >
            //   <div>
            //     <div className="is-normal">
            //       <label className="label">ชื่อผู้ร่วมออกแบบ :</label>
            //     </div>
            //     <div className="field-body">
            //       <div className="field">
            //         <p className="control">
            //           <input
            //             className="input input-app"
            //             style={{ width: "100%", margin: "0 auto" }}
            //             type="text"
            //             onChange={e => {
            //               this.setState({
            //                 formAddProject: {
            //                   ...formAddProject,
            //                   partner_name1: e.target.value
            //                 }
            //               });
            //             }}
            //             value={formAddProject.partner_name1}
            //           />
            //         </p>
            //       </div>
            //     </div>
            //   </div>
            //   <div>
            //     <div className="is-normal">
            //       <label className="label">สัดส่วน :</label>
            //     </div>
            //     <div className="field-body">
            //       <div className="field">
            //         <p className="control">
            //           <input
            //             className="input input-app"
            //             style={{ width: "100%", margin: "0 auto" }}
            //             type="text"
            //             onChange={e => {
            //               this.setState({
            //                 formAddProject: {
            //                   ...formAddProject,
            //                   partner_ratio1: e.target.value
            //                 }
            //               });
            //             }}
            //             value={formAddProject.partner_ratio1}
            //           />
            //         </p>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            {/* parner name 2 */}
            {/* <div
              className="field"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <div>
                <div className="is-normal">
                  <label className="label">ชื่อผู้ร่วมออกแบบ :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        style={{ width: "100%", margin: "0 auto" }}
                        type="text"
                        onChange={e => {
                          this.setState({
                            formAddProject: {
                              ...formAddProject,
                              partner_name2: e.target.value
                            }
                          });
                        }}
                        value={formAddProject.partner_name2}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="is-normal">
                  <label className="label">สัดส่วน :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        style={{ width: "100%", margin: "0 auto" }}
                        type="text"
                        onChange={e => {
                          this.setState({
                            formAddProject: {
                              ...formAddProject,
                              partner_ratio2: e.target.value
                            }
                          });
                        }}
                        value={formAddProject.partner_ratio2}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
            {/* parner name 3 */}
            {/* <div
              className="field"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <div>
                <div className="is-normal">
                  <label className="label">ชื่อผู้ร่วมออกแบบ :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        style={{ width: "100%", margin: "0 auto" }}
                        type="text"
                        onChange={e => {
                          this.setState({
                            formAddProject: {
                              ...formAddProject,
                              partner_name3: e.target.value
                            }
                          });
                        }}
                        value={formAddProject.partner_name3}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="is-normal">
                  <label className="label">สัดส่วน :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        style={{ width: "100%", margin: "0 auto" }}
                        type="text"
                        onChange={e => {
                          this.setState({
                            formAddProject: {
                              ...formAddProject,
                              partner_ratio3: e.target.value
                            }
                          });
                        }}
                        value={formAddProject.partner_ratio3}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
            {/* pact id */}
            <div className="field">
              <div className="is-normal">
                <label className="label">เลขสัญญา :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            pact_id: e.target.value
                          }
                        });
                      }}
                      value={formAddProject.pact_id}
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* pact name */}
            <div className="field">
              <div className="is-normal">
                <label className="label">จ้างโดย : </label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            employer_name: e.target.value
                          }
                        });
                      }}
                      value={formAddProject.employer_name}
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* pact type */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ประเภทหน่วยงาน :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <select
                      value={formAddProject.employer_type}
                      className="select select-app"
                      onChange={e => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            employer_type: e.target.value
                          }
                        });
                      }}
                    >
                      {agencyTypes.map(ag => (
                        <option key={ag.value} value={ag.value}>
                          {ag.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="field">
              <div className="is-normal">
                <label className="label">ประเภทหน่วยงาน :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formAddProject: {
                            ...formAddProject,
                            employer_type: e.target.value
                          }
                        });
                      }}
                      value={formAddProject.employer_type}
                    />
                  </p>
                </div>
              </div>
            </div> */}

            <div className="block-btn-form-user">
              <a
                className="button is-medium is-link"
                onClick={() => {
                  this.insertProject();
                }}
              >
                &nbsp; เพิ่ม &nbsp;
              </a>
              <a
                className="button is-medium is-danger"
                onClick={() => {
                  this.getProject();
                  this.closeAddProjectModal();
                }}
              >
                ยกเลิก
              </a>
            </div>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={openProjectDetail}
          aria={{
            labelledby: "project from",
            describedby: "project from"
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(7, 7, 7, 0.6)",
              zIndex: 1000
            }
          }}
        >
          <div>
            {/* <div className="root-form-project"> */}
            <div className="root-form-project-det">
              <h1>รายละเอียดโครงการ</h1>
              {/* project name */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">ชื่อโครงการ :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        type="text"
                        onChange={e => {
                          this.setState({
                            formProjectDetail: {
                              ...formProjectDetail,
                              project_name: e.target.value
                            }
                          });
                        }}
                        value={formProjectDetail.project_name}
                      />
                    </p>
                  </div>
                </div>
              </div>
              {/* project number */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">เลขที่โครงการ :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        type="text"
                        onChange={e => {
                          this.setState({
                            formProjectDetail: {
                              ...formProjectDetail,
                              project_number: e.target.value
                            }
                          });
                        }}
                        value={formProjectDetail.project_number}
                      />
                    </p>
                  </div>
                </div>
              </div>
              {/* project types */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">ประเภทโครงการ :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <select
                        value={formProjectDetail.project_type_id}
                        className="select select-app"
                        onChange={e => {
                          this.setState({
                            formProjectDetail: {
                              ...formProjectDetail,
                              project_type_id: e.target.value
                            }
                          });
                        }}
                      >
                        {projectTypes.map(pjType => (
                          <option key={pjType.value} value={pjType.id}>
                            {pjType.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* pact start date */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">วันที่เริ่มโครงการ :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        className="input input-app"
                        locale="th"
                        selected={formProjectDetail.pact_start_date}
                        onChange={date => {
                          this.setState({
                            formProjectDetail: {
                              ...formProjectDetail,
                              pact_start_date: date
                            }
                          });
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
              {/* pact end date */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">วันที่สิ้นสุดโครงการ :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        className="input input-app"
                        locale="th"
                        selected={formProjectDetail.pact_end_date}
                        onChange={date => {
                          this.setState({
                            formProjectDetail: {
                              ...formProjectDetail,
                              pact_end_date: date
                            }
                          });
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
              {/* project price */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">ราคาโครงการ :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        type="text"
                        value={formProjectDetail.project_value}
                        onChange={e => {
                          this.setState(
                            {
                              formProjectDetail: {
                                ...formProjectDetail,
                                project_value: e.target.value
                              }
                            },
                            () => {
                              projectValue = 0;
                            }
                          );
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
              {/* parner name 1 */}
              {/* <div
                className="field"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <div>
                  <div className="is-normal">
                    <label className="label">ชื่อผู้ร่วมออกแบบ :</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          style={{ width: "100%", margin: "0 auto" }}
                          type="text"
                          onChange={e => {
                            this.setState({
                              formProjectDetail: {
                                ...formProjectDetail,
                                partner_name1: e.target.value
                              }
                            });
                          }}
                          value={formProjectDetail.partner_name1}
                        />
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="is-normal">
                    <label className="label">สัดส่วน :</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          style={{ width: "100%", margin: "0 auto" }}
                          type="text"
                          onChange={e => {
                            this.setState({
                              formProjectDetail: {
                                ...formProjectDetail,
                                partner_ratio1: e.target.value
                              }
                            });
                          }}
                          value={formProjectDetail.partner_ratio1}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* parner name 2 */}
              {/* <div
                className="field"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <div>
                  <div className="is-normal">
                    <label className="label">ชื่อผู้ร่วมออกแบบ :</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          style={{ width: "100%", margin: "0 auto" }}
                          type="text"
                          onChange={e => {
                            this.setState({
                              formProjectDetail: {
                                ...formProjectDetail,
                                partner_name2: e.target.value
                              }
                            });
                          }}
                          value={formProjectDetail.partner_name2}
                        />
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="is-normal">
                    <label className="label">สัดส่วน :</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          style={{ width: "100%", margin: "0 auto" }}
                          type="text"
                          onChange={e => {
                            this.setState({
                              formProjectDetail: {
                                ...formProjectDetail,
                                partner_ratio2: e.target.value
                              }
                            });
                          }}
                          value={formProjectDetail.partner_ratio2}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* parner name 3 */}
              {/* <div
                className="field"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <div>
                  <div className="is-normal">
                    <label className="label">ชื่อผู้ร่วมออกแบบ :</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          style={{ width: "100%", margin: "0 auto" }}
                          type="text"
                          onChange={e => {
                            this.setState({
                              formProjectDetail: {
                                ...formProjectDetail,
                                partner_name3: e.target.value
                              }
                            });
                          }}
                          value={formProjectDetail.partner_name3}
                        />
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="is-normal">
                    <label className="label">สัดส่วน :</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          style={{ width: "100%", margin: "0 auto" }}
                          type="text"
                          onChange={e => {
                            this.setState({
                              formProjectDetail: {
                                ...formProjectDetail,
                                partner_ratio3: e.target.value
                              }
                            });
                          }}
                          value={formProjectDetail.partner_ratio3}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* pact id */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">เลขสัญญา :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        type="text"
                        onChange={e => {
                          this.setState({
                            formProjectDetail: {
                              ...formProjectDetail,
                              pact_id: e.target.value
                            }
                          });
                        }}
                        value={formProjectDetail.pact_id}
                      />
                    </p>
                  </div>
                </div>
              </div>

              {/* pact name */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">จ้างโดย : </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input input-app"
                        type="text"
                        onChange={e => {
                          this.setState({
                            formProjectDetail: {
                              ...formProjectDetail,
                              employer_name: e.target.value
                            }
                          });
                        }}
                        value={formProjectDetail.employer_name}
                      />
                    </p>
                  </div>
                </div>
              </div>

              {/* pact type */}
              <div className="field">
                <div className="is-normal">
                  <label className="label">ประเภทหน่วยงาน :</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <select
                        value={formProjectDetail.employer_type}
                        className="select select-app"
                        onChange={e => {
                          this.setState({
                            formAddProject: {
                              ...formProjectDetail,
                              employer_type: e.target.value
                            }
                          });
                        }}
                      >
                        {agencyTypes.map(ag => (
                          <option key={ag.value} value={ag.value}>
                            {ag.text}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block-btn-form-user">
                <a
                  className="button is-medium is-link"
                  onClick={() => {
                    this.updateProject();
                  }}
                >
                  &nbsp; แก้ไข &nbsp;
                </a>
                <a
                  className="button is-medium is-danger"
                  onClick={() => {
                    this.getProject();
                    this.closeProjectDetail();
                  }}
                >
                  ยกเลิก
                </a>
              </div>
            </div>
            <div className="root-form-project-re-ex">
              <h1>ประมาณการ</h1>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a className="button icon add-user">
                  <img
                    src={plusIcon.src}
                    alt={plusIcon.alt}
                    onClick={() => {
                      this.onOpenPredict(null, "Add");
                    }}
                  />
                </a>
              </div>
              <ReactTable
                data={predicts}
                columns={this.columnsPredict}
                defaultPageSize={5}
                showPagination={true}
              />
              {/* <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "30%",
                    borderWidth: "2px",
                    borderColor: "black",
                    padding: "20px",
                    borderStyle: "solid",
                    marginTop: "10px"
                  }}
                >
                  <h2>สรุปประมาณการ</h2>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end"
                      }}
                    >
                      <h3>รายรับรวย :</h3>
                      <h3>รวยจ่ายรวม :</h3>
                      <h3>คงเหลือ :</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <h3>{this.calculateSumPredict().rev} บาท</h3>
                      <h3>{this.calculateSumPredict().exp} บาท</h3>
                      <h3>{this.calculateSumPredict().total} บาท</h3>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="root-form-project-re-ex">
              <h1>รายรับ</h1>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a className="button icon add-user">
                  <img
                    src={plusIcon.src}
                    alt={plusIcon.alt}
                    onClick={() => {
                      this.onOpenRevenue(null, "Add");
                    }}
                  />
                </a>
              </div>
              <ReactTable
                data={formProjectDetail.revenue.map(r => ({
                  ...r,
                  project_value: formProjectDetail.project_value
                }))}
                columns={this.columnsRevenue}
                defaultPageSize={5}
                showPagination={true}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "30%",
                    borderWidth: "2px",
                    borderColor: "black",
                    padding: "20px",
                    borderStyle: "solid",
                    marginTop: "10px"
                  }}
                >
                  <h2>สรุปรายรับ</h2>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end"
                      }}
                    >
                      <h3>รวมเป็นเงิน :</h3>
                      <h3>ภาษี 3% หัก ณ ที่จ่าย :</h3>
                      <h3>ยอดสุทธิ :</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <h3>{this.calculateSumRevenue().sumRevenue} บาท</h3>
                      <h3>{this.calculateSumRevenue().tax} บาท</h3>
                      <h3>{this.calculateSumRevenue().all} บาท</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="root-form-project-re-ex">
              <h1>รายจ่าย</h1>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a className="button icon add-user">
                  <img
                    src={plusIcon.src}
                    alt={plusIcon.alt}
                    onClick={() => {
                      // TODOEX
                      this.onOpenExpenditure(null, "Add");
                    }}
                  />
                </a>
              </div>
              <ReactTable
                data={formProjectDetail.expenditure}
                columns={this.columnsExpenditure}
                defaultPageSize={5}
                showPagination={true}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "30%",
                    borderWidth: "2px",
                    borderColor: "black",
                    padding: "20px",
                    borderStyle: "solid",
                    marginTop: "10px"
                  }}
                >
                  <h2>สรุปรายจ่าย</h2>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end"
                      }}
                    >
                      <h3>รวมเป็นเงิน :</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <h3>{this.calculateSumExpenditure().sum} บาท</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="root-form-project-re-ex">
              <h1>Revenue Detail</h1>
              <ReactTable
                data={formProjectDetail.revenue}
                columns={this.columnsRevenue}
                defaultPageSize={5}
                showPagination={true}
              />
            </div> */}
          </div>
        </ReactModal>
        {/* predict */}
        <ReactModal
          isOpen={openPredict}
          aria={{
            labelledby: "project from",
            describedby: "project from"
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(7, 7, 7, 0.6)",
              zIndex: 1000
            }
          }}
        >
          <div className="root-form-user">
            <h1>
              {" "}
              {`${
                modePredict === "Add" ? "เพิ่ม" : "แก้ไข้"
              } ประมาณการรายรับ`}{" "}
            </h1>

            {/* row._original.price *
                this.state.formProjectDetail.project_value /
                100 */}
            {/* period */}
            <div className="field">
              <div className="is-normal">
                <label className="label">งวด :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formPredictRev: {
                            ...formPredictRev,
                            period: e.target.value
                          }
                        });
                      }}
                      value={formPredictRev.period}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* price */}
            <div className="field">
              <div className="is-normal">
                <label className="label">เงิน :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formPredictRev: {
                            ...formPredictRev,
                            price: e.target.value
                          }
                        });
                      }}
                      value={formPredictRev.price}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* price */}
            <div className="field">
              <div className="is-normal">
                <label className="label">เงิน :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formPredictRev: {
                            ...formPredictRev,
                            price_bath: e.target.value
                          }
                        });
                      }}
                      disabled={true}
                      value={this.calcucalePredictRevBath(formPredictRev.price)} //MAYBE
                    />
                  </p>
                </div>
              </div>
            </div>

            <h1>
              {" "}
              {`${
                modePredict === "Add" ? "เพิ่ม" : "แก้ไข้"
              } ประมาณการรายจ่าย`}{" "}
            </h1>
            {/* period */}
            <div className="field">
              <div className="is-normal">
                <label className="label">งวด :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formPredictExp: {
                            ...formPredictExp,
                            period: e.target.value
                          }
                        });
                      }}
                      value={formPredictExp.period}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* price */}
            <div className="field">
              <div className="is-normal">
                <label className="label">เงิน :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formPredictExp: {
                            ...formPredictExp,
                            price: e.target.value
                          }
                        });
                      }}
                      value={formPredictExp.price}
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="block-btn-form-user">
              <a
                className="button is-medium is-link"
                onClick={() => {
                  // TODO Mode
                  // this.insertProject();
                  modePredict === "Add"
                    ? this.insertPredict()
                    : this.updatePredict();
                }}
              >
                &nbsp; {modePredict === "Add" ? "เพิ่ม" : "แก้ไข"} &nbsp;
              </a>
              <a
                className="button is-medium is-danger"
                onClick={() => {
                  this.closePredict();
                }}
              >
                ยกเลิก
              </a>
            </div>
          </div>
        </ReactModal>

        {/* predict */}

        <ReactModal
          isOpen={openRevenue}
          aria={{
            labelledby: "project from",
            describedby: "project from"
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(7, 7, 7, 0.6)",
              zIndex: 1000
            }
          }}
        >
          <div className="root-form-user">
            <h1> {`${modeRevenue === "Add" ? "เพิ่ม" : "แก้ไข้"} รายรับ`} </h1>
            {/* period */}
            <div className="field">
              <div className="is-normal">
                <label className="label">งวด :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            period: e.target.value
                          }
                        });
                      }}
                      value={formRevenue.period}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* withdraw date */}
            <div className="field">
              <div className="is-normal">
                <label className="label">วันที่เบิก :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <DatePicker
                      dateFormat="DD/MM/YYYY"
                      className="input input-app"
                      locale="th"
                      selected={formRevenue.withdraw_date}
                      onChange={date => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            withdraw_date: date
                          }
                        });
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* withdraw date */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ประมาณการรับ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <DatePicker
                      dateFormat="DD/MM/YYYY"
                      className="input input-app"
                      locale="th"
                      selected={formRevenue.predict_date}
                      onChange={date => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            predict_date: date
                          }
                        });
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* withdraw date */}
            <div className="field">
              <div className="is-normal">
                <label className="label">วันที่รับจริง :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <DatePicker
                      dateFormat="DD/MM/YYYY"
                      className="input input-app"
                      locale="th"
                      selected={formRevenue.withdraw_date_true}
                      onChange={date => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            withdraw_date_true: date
                          }
                        });
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* price_per */}
            <div className="field">
              <div className="is-normal">
                <label className="label">จำนวน(%) :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            price_per: e.target.value,
                            price:
                              e.target.value *
                              this.state.formProjectDetail.project_value /
                              100
                          }
                        });
                      }}
                      value={formRevenue.price_per}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* price */}
            <div className="field">
              <div className="is-normal">
                <label className="label">จำนวน(บาท) :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      disabled
                      onChange={e => {
                        // this.setState({
                        //   formRevenue: {
                        //     ...formRevenue,
                        //     price: e.target.value
                        //   }
                        // });
                      }}
                      value={formRevenue.price}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* remark */}

            <div className="field">
              <div className="is-normal">
                <label className="label">หมายเหตุ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <select
                      value={formRevenue.remark}
                      className="select select-app"
                      onChange={e => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            remark: e.target.value
                          }
                        });
                      }}
                    >
                      {remarks.map(re => (
                        <option key={re.value} value={re.value}>
                          {re.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="field">
              <div className="is-normal">
                <label className="label">หมายเหตุ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            remark: e.target.value
                          }
                        });
                      }}
                      value={formRevenue.remark}
                    />
                  </p>
                </div>
              </div>
            </div> */}

            {/* period */}
            <div className="field">
              <div className="is-normal">
                <label className="label">สถานะ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <select
                      value={formRevenue.status}
                      className="select select-app"
                      onChange={e => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            status: e.target.value
                          }
                        });
                      }}
                    >
                      {statuss.map(st => (
                        <option key={st.value} value={st.value}>
                          {st.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="field">
              <div className="is-normal">
                <label className="label">สถานะ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <select
                      value={formRevenue.status}
                      className="select select-app"
                      onChange={e => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            status: e.target.value
                          }
                        });
                      }}
                    >
                      {statuss.map(st => (
                        <option key={st.value} value={st.value}>
                          {st.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="field">
              <div className="is-normal">
                <label className="label">สถานะ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formRevenue: {
                            ...formRevenue,
                            status: e.target.value
                          }
                        });
                      }}
                      value={formRevenue.status}
                    />
                  </p>
                </div>
              </div>
            </div> */}

            <div className="block-btn-form-user">
              <a
                className="button is-medium is-link"
                onClick={() => {
                  // TODO Mode
                  // this.insertProject();
                  modeRevenue === "Add"
                    ? this.insertRevenue()
                    : this.updateRevenue();
                }}
              >
                &nbsp; {modeRevenue === "Add" ? "เพิ่ม" : "แก้ไข"} &nbsp;
              </a>
              <a
                className="button is-medium is-danger"
                onClick={() => {
                  this.closeRevenue();
                }}
              >
                ยกเลิก
              </a>
            </div>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={openExpenditure}
          aria={{
            labelledby: "project from",
            describedby: "project from"
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(7, 7, 7, 0.6)",
              zIndex: 1000
            }
          }}
        >
          <div className="root-form-user">
            <h1>
              {" "}
              {`${modeExpenditure === "Add" ? "เพิ่ม" : "แก้ไข"} รายจ่าย`}{" "}
            </h1>
            {/* period */}
            <div className="field">
              <div className="is-normal">
                <label className="label">งวด :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formExpenditure: {
                            ...formExpenditure,
                            period: e.target.value
                          }
                        });
                      }}
                      value={formExpenditure.period}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* item */}
            <div className="field">
              <div className="is-normal">
                <label className="label">รายการ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formExpenditure: {
                            ...formExpenditure,
                            expenditure_item: e.target.value
                          }
                        });
                      }}
                      value={formExpenditure.expenditure_item}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* date */}
            <div className="field">
              <div className="is-normal">
                <label className="label">วันที่ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <DatePicker
                      dateFormat="DD/MM/YYYY"
                      className="input input-app"
                      locale="th"
                      selected={formExpenditure.expenditure_date}
                      onChange={date => {
                        this.setState({
                          formExpenditure: {
                            ...formExpenditure,
                            expenditure_date: date
                          }
                        });
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* amount */}
            <div className="field">
              <div className="is-normal">
                <label className="label">จำนวน :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formExpenditure: {
                            ...formExpenditure,
                            amount: e.target.value,
                            price_total:
                              e.target.value * formExpenditure.price_per_unit
                          }
                        });
                      }}
                      value={formExpenditure.amount}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* price/unit */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ราคา/หน่วย :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formExpenditure: {
                            ...formExpenditure,
                            price_per_unit: e.target.value,
                            price_total: e.target.value * formExpenditure.amount
                          }
                        });
                      }}
                      value={formExpenditure.price_per_unit}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* total price */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ราคารวม :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      disabled
                      onChange={e => {
                        // this.setState({
                        //   formExpenditure: {
                        //     ...formExpenditure,
                        //     price_total: e.target.value
                        //   }
                        // });
                      }}
                      value={formExpenditure.price_total}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* remark */}
            <div className="field">
              <div className="is-normal">
                <label className="label">หมายเหตุ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <select
                      value={formExpenditure.remark}
                      className="select select-app"
                      onChange={e => {
                        this.setState({
                          formExpenditure: {
                            ...formExpenditure,
                            remark: e.target.value
                          }
                        });
                      }}
                    >
                      {remarks.map(re => (
                        <option key={re.value} value={re.value}>
                          {re.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="field">
              <div className="is-normal">
                <label className="label">หมายเหตุ :</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      onChange={e => {
                        this.setState({
                          formExpenditure: {
                            ...formExpenditure,
                            remark: e.target.value
                          }
                        });
                      }}
                      value={formExpenditure.remark}
                    />
                  </p>
                </div>
              </div>
            </div> */}

            <div className="block-btn-form-user">
              <a
                className="button is-medium is-link"
                onClick={() => {
                  // TODOEX
                  // this.insertProject();
                  modeExpenditure === "Add"
                    ? this.insertExpenditure()
                    : this.updateExpenditure();
                }}
              >
                &nbsp; {modeExpenditure === "Add" ? "เพิ่ม" : "แก้ไข"} &nbsp;
              </a>
              <a
                className="button is-medium is-danger"
                onClick={() => {
                  this.closeExpenditure();
                }}
              >
                ยกเลิก
              </a>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderWidth: "2px",
                    borderColor: "black",
                    padding: "20px",
                    borderStyle: "solid",
                    marginTop: "10px"
                  }}
                >
                  <h2>สรุปรายจ่าย</h2>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>
                      <input
                        type="radio"
                        value={formExpenditure.tax}
                        checked={formExpenditure.tax === TAX.NO_TAX}
                        onChange={() => {
                          this.setState({
                            formExpenditure: {
                              ...formExpenditure,
                              tax: TAX.NO_TAX
                            }
                          });
                        }}
                      />{" "}
                      ไม่คิดภาษี
                    </label>
                    <label>
                      <input
                        type="radio"
                        value={formExpenditure.tax}
                        checked={formExpenditure.tax === TAX.PER_7}
                        onChange={() => {
                          this.setState({
                            formExpenditure: {
                              ...formExpenditure,
                              tax: TAX.PER_7
                            }
                          });
                        }}
                      />{" "}
                      รวมภาษี 7%
                    </label>
                    <label>
                      <input
                        type="radio"
                        value={formExpenditure.tax}
                        checked={formExpenditure.tax === TAX.PER_3}
                        onChange={() => {
                          this.setState({
                            formExpenditure: {
                              ...formExpenditure,
                              tax: TAX.PER_3
                            }
                          });
                        }}
                      />{" "}
                      หัก ณ ที่จ่าย 3%
                    </label>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end"
                        }}
                      >
                        <h3>ค่าภาษี :</h3>
                        <h3>รวมสุทธิ :</h3>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h3>{this.calculateExpenditureTax().tax} บาท</h3>
                        <h3>{this.calculateExpenditureTax().total} บาท</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={confirmModal.isOpen}
          aria={{
            labelledby: "project from",
            describedby: "project from"
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(7, 7, 7, 0.6)",
              zIndex: 1000
            },
            content: {
              height: "200px",
              margin: "auto 300px"
            }
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 style={{ alignSelf: "center" }}>{confirmModal.title}</h1>
            <div className="block-btn-form-user">
              <a
                className="button is-medium is-link"
                onClick={() => {
                  confirmModal.onOK();
                  this.setState({
                    confirmModal: {
                      ...this.state.confirmModal,
                      isOpen: false
                    }
                  });
                }}
              >
                &nbsp; ตกลง &nbsp;
              </a>
              <a
                className="button is-medium is-danger"
                onClick={() => {
                  confirmModal.onCancel();
                  this.setState({
                    confirmModal: {
                      ...this.state.confirmModal,
                      isOpen: false
                    }
                  });
                }}
              >
                ยกเลิก
              </a>
            </div>
          </div>
        </ReactModal>
        <form>
          <fieldset className="inpurField">
            <div
              className="inputField"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="csFeild">
                {/* project_number */}
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">รหัสโครงการ</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={e => {
                            // form.username = e.target.value;
                            this.setState({
                              formSearch: {
                                ...formSearch,
                                project_number: e.target.value
                              }
                            });
                          }}
                          value={formSearch.project_number}
                        />
                      </p>
                    </div>
                  </div>
                </div>

                {/* project_name */}
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">ชื่อโครงการ</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={e => {
                            // form.username = e.target.value;
                            this.setState({
                              formSearch: {
                                ...formSearch,
                                project_name: e.target.value
                              }
                            });
                          }}
                          value={formSearch.project_name}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="csFeild">
                {/* project_type_name */}
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">ประเภทโครงการ</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      {/* <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={e => {
                            // form.username = e.target.value;
                            this.setState({
                              formSearch: {
                                ...formSearch,
                                project_type_name: e.target.value
                              }
                            });
                          }}
                          value={formSearch.project_type_name}
                        />
                      </p> */}
                      <p className="control">
                        <select
                          value={formSearch.project_type_name}
                          className="select select-app"
                          onChange={e => {
                            this.setState({
                              formSearch: {
                                ...formSearch,
                                project_type_name: e.target.value
                              }
                            });
                          }}
                        >
                          {[
                            { id: -1, value: "กรุณาเลือกประเภทโครงการ" },
                            ...projectTypes
                          ].map(pjType => (
                            <option key={pjType.id} value={pjType.value}>
                              {pjType.value}
                            </option>
                          ))}
                        </select>
                      </p>
                    </div>
                  </div>
                </div>
                {/* TODO */}
                {/* project types */}
                {/* <div className="field">
                  <div className="is-normal">
                    <label className="label">ประเภทโครงการ :</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <select
                          value={formProjectDetail.project_type_id}
                          className="select select-app"
                          onChange={e => {
                            this.setState({
                              formProjectDetail: {
                                ...formProjectDetail,
                                project_type_id: e.target.value
                              }
                            });
                          }}
                        >
                          {projectTypes.map(pjType => (
                            <option key={pjType.value} value={pjType.id}>
                              {pjType.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* TODO */}
                <div className="field field-normal" />
              </div>
              <div className="csFeild">
                {/* start date */}
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">วันที่เริ่มต้น</label>
                  </div>
                  {/* <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={(e) => {
                            // form.tel = e.target.value;
                          }}
                          defaultValue=""
                        />
                      </p>
                    </div>
                  </div> */}
                  <DatePicker
                    className="input input-app"
                    dateFormat="DD/MM/YYYY"
                    locale="th"
                    selected={formSearch.pact_start_date}
                    onChange={date => {
                      this.setState({
                        formSearch: {
                          ...formSearch,
                          pact_start_date: date
                        }
                      });
                    }}
                  />
                </div>
                {/* end date */}
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">วันที่สิ้นสุด</label>
                  </div>
                  <DatePicker
                    dateFormat="DD/MM/YYYY"
                    className="input input-app"
                    locale="th"
                    selected={formSearch.pact_end_date}
                    onChange={date => {
                      this.setState({
                        formSearch: {
                          ...formSearch,
                          pact_end_date: date
                        }
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "10px"
              }}
            >
              <a
                className="button is-medium is-link"
                style={{ margin: "0px 40px" }}
                onClick={() => {
                  this.setQueryAndSearch();
                }}
              >
                ค้นหา
              </a>
              <a
                className="button is-medium is-link"
                style={{ margin: "0px 40px" }}
                onClick={() => {
                  this.clearFormSearch();
                  this.getProject();
                }}
              >
                ยกเลิก
              </a>
            </div>
          </fieldset>
        </form>
        <div style={{ padding: "20px" }}>
          <ReactTable
            data={projects}
            columns={this.columnsProject}
            defaultPageSize={5}
            showPagination={true}
          />
        </div>
      </div>
    );
  }
}

export default Project;
