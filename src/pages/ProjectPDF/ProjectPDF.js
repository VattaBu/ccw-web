import React from "react";
import jsPDF from "jspdf"; 
import idx from 'idx';
import html2canvas from "html2canvas";
import moment from "moment";
import printIcon from "../../assets/icon/print-icon.png";

moment.locale("th");

const API_URL = "http://localhost:5000/api/";
const remarks = {
  DEPOSIT: "เงินฝากธนาคาร",
  CASH: "เงินสด"
};
const statuss = {
  RECEIVE: "ได้รับแล้ว",
  NOT_RECEIVE: "ยังไม่ได้รับแล้ว"
};
const agencyTypes = {
  GOVERMENT: "ภาครัฐ",
  INDIVIDUAL: "ภาคเอกชน",
  OTHER: "อื่นๆ"
};

class ProjectPDF extends React.Component {
  state = {
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
      employer_type: agencyTypes.GOVERMENT,
      revenue_id: "",
      expenditure_id: "",
      revenue: [],
      expenditure: [],
      predict_revenue_id: "",
      predict_expenditure_id: "",
      predict_revenue: [],
      predict_expenditure: []
    }
  };

  calculateSumRevenue() {
    // return this.state.formProjectDetail.revenue.reduce(
    //   (sum, r) => r.price + sum,
    //   0
    // );

    return this.state.formProjectDetail.revenue.reduce(
      (sum, r) =>
        (r.status === "NOT_RECEIVE")
          ? sum
          :this.state.formProjectDetail.project_value * r.price_per / 100 + sum,
      0
    );
  }

  // calculateSumRevenue() {
  //   const sumRevenue = this.state.formProjectDetail.revenue.reduce(
  //     (sum, r) =>
  //       (r.status === statuss[1].value)
  //         ? sum
  //         :this.state.formProjectDetail.project_value * r.price_per / 100 + sum,
  //     0
  //   );
  //   const tax = sumRevenue * 3 / 100;
  //   const all = sumRevenue - tax;
  //   return { sumRevenue, tax, all };
  // }

  calculateSumExpenditure() {
    return this.state.formProjectDetail.expenditure.reduce(
      (sum, e) => e.price_total + sum,
      0
    );
  }

  calcucalePredictRevBath = (revPrice) => {
    const { project_value } = this.state.formProjectDetail;
    const price = project_value * revPrice / 100;
    return price - (price * 3 / 100);
  }

  getProjectByID(project_id) {
    fetch(`${API_URL}project/${project_id}`)
      .then(res => res.json())
      .then(project =>
        this.setState({
          formProjectDetail: {
            ...this.state.formProjectDetail,
            ...project[0],
            pact_start_date: moment(project[0].pact_start_date).add(
              -543,
              "year"
            ),
            pact_end_date: moment(project[0].pact_end_date).add(-543, "year")
          }
        })
      )
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
      .then(revenue =>
        this.setState({
          formProjectDetail: {
            ...this.state.formProjectDetail,
            revenue_id,
            revenue
          }
        })
      )
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
        const price = (formProjectDetail.project_value * r.price) / 100;
        return sum + (price - (price * 3 / 100));
      }, 0);
      const exp = formProjectDetail.predict_expenditure.reduce((sum, e) => sum + e.price, 0);

      return {
        rev,
        exp,
        total: rev - exp,
      }
    // }
  }

  exportToPDF() {
    const input = document.getElementById("project-pdf");
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      // const width = pdf.internal.pageSize.width;
      // const height = pdf.internal.pageSize.height;
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("project.pdf");
    });
  }

  formatDateToText(m) {
    console.log(m.date);
    return `${m.date()}/${m.month()}/${m.year()}`;
  }

  componentWillMount() {
    if (!localStorage.getItem("user")) {
      this.props.history.replace("/login");
    }
  }

  componentDidMount() {
    const { row } = this.props.location.state;
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
  }

  render() {
    const { projectTypes } = this.props.location.state;
    const { formProjectDetail } = this.state;
    return (
      <div style={{ margin: "100px 20px" }}>
        <div className="controllerButtons">
          <a className="button icon add-user">
            <img
              src={printIcon}
              alt="export ot pdf"
              onClick={() => this.exportToPDF()}
            />
          </a>
        </div>
        <h1>รีวิวโปรเจค</h1>
        <div
          id="project-pdf"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "720px",
            margin: "0 auto"
          }}
        >
          <h2>รายงานสรุปโครงการ</h2>
          <div
            className="pdf"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <p>เลขโครงการ: </p>
              <p>ชื่อโครงการ: </p>
              <p>ประเภทโครงการ: </p>
              <p>ราคาโครงการ: </p>
              <p>เลขสัญญา: </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <p>{formProjectDetail.project_number} </p>
              <p>{formProjectDetail.project_name} </p>
              <p>{projectTypes[formProjectDetail.project_type_id - 1].value}</p>
              <p>{formProjectDetail.project_value || 0} </p>
              <p>{formProjectDetail.pact_id}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <p>วันที่เริ่มโครงการ: </p>
              <p>วันที่สิ้นสุดโครงการ: </p>
              <p>จ้างโดย: </p>
              <p>ประเภทหน่วยงาน: </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <p>{formProjectDetail.pact_start_date.format("DD/MM/YYYY")}</p>
              <p>{formProjectDetail.pact_end_date.format("DD/MM/YYYY")}</p>
              <p>{formProjectDetail.employer_name}</p>
              <p>{agencyTypes[formProjectDetail.employer_type]} </p>
            </div>
          </div>
          <br />    
          <table className="pdf">
            <thead>
              <tr>
              <th colSpan={4}>ประมาณการ</th>
              </tr>
              <tr>
                <th colSpan={2}>รายรับ</th>
                <th colSpan={2}>รายจ่าย</th>
              </tr>
              <tr>
                <th>งวด</th>
                <th>จำนวน(บาท)</th>
                <th>งวด</th>
                <th>จำนวน(บาท)</th>
              </tr>
            </thead>
            <tbody>
              {formProjectDetail.predict_revenue.map((r, i) => (
                <tr>
                  <td>{r.period}</td>
                  <td>{this.calcucalePredictRevBath(r.price)}</td>
                  <td>{idx(formProjectDetail.predict_expenditure, _ => _[i].period)}</td>
                  <td>{idx(formProjectDetail.predict_expenditure, _ => _[i].price)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}>รวม {
                  formProjectDetail.predict_revenue.reduce((sum, r) => (
                    this.calcucalePredictRevBath(r.price) + sum
                  ), 0)
                } บาท</td>
                <td colSpan={2}>รวม {
                  formProjectDetail.predict_expenditure.reduce((sum, e) => (
                    e.price + sum
                  ), 0)
                } บาท</td>
              </tr>
            </tbody>
          </table>
          <br />
          <table className="pdf">
            <thead>
              <tr>
                <th colSpan={5} >รายรับ</th>
              </tr>
              <tr>
                <th>งวด</th>
                <th>วันที่รับเงิน</th>
                <th>จำนวน(%)</th>
                <th>จำนวน(บาท)</th>
                <th>หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {formProjectDetail.revenue.map(r => (
                <tr>
                  <td>{r.period}</td>
                  <td>
                    {
                      (!r.withdraw_date_true)
                      ? null
                      : moment(r.withdraw_date_true)
                        .add(-543, "year")
                        .format("DD/MM/YYYY")}
                  </td>
                  <td>{r.price_per}</td>
                  <td>{r.price_per * formProjectDetail.project_value / 100}</td>
                  <td>{remarks[r.remark]}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} style={{ textAlign: 'right', paddingRight: '10px' }} >
                  สรุปรายรับ: {this.calculateSumRevenue()} บาท (คำนวณเฉพาะรายรับที่ได้รับแล้ว)
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <table className="pdf">
            <thead>
              <tr>
                <th colSpan={7} >รายจ่าย</th>
              </tr>
              <tr>
                <th>งวด</th>
                <th>&nbsp;&nbsp; วันที่ &nbsp;&nbsp;</th>
                <th style={{ textAlign: 'left' }} >รายการ</th>
                <th>จำนวน</th>
                <th>ราคา/หน่วย</th>
                <th>ราคารวม</th>
                <th>หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {formProjectDetail.expenditure.map(e => (
                <tr>
                  <td>{e.period}</td>
                  <td>
                    {moment(e.expenditure_date)
                      .add(-543, "year")
                      .format("DD/MM/YYYY")}
                  </td>
                  <td style={{ textAlign: 'left' }} >{e.expenditure_item}</td>
                  <td>{e.amount}</td>
                  <td>{e.price_per_unit}</td>
                  <td>{e.price_total}</td>
                  <td>{remarks[e.remark]}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={7} style={{ textAlign: 'right', paddingRight: '10px' }} >
                  สรุปรายจ่าย: {this.calculateSumExpenditure()} บาท
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <table className="pdf">
            <tbody>
              <td style={{ textAlign: 'right', paddingRight: '10px' }}>
                คงเหลือ:{" "}
                {(this.calculateSumRevenue() + this.calculateSumExpenditure()) + ' บาท'}
              </td>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ProjectPDF;
