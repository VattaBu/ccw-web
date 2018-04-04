import React from "react";
import jsPDF from "jspdf";
import _ from "lodash";
import html2canvas from "html2canvas";
import moment from "moment";
import { HorizontalBar } from 'react-chartjs-2';
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
const monthNames = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม"
];
const yearList = _.range(2561, 2000, -1);

class PerYearPDF extends React.Component {
  state = {
    year: yearList[0],
    datas: [],
    projectNum: 0,
  };

  componentWillMount() {
    if (!localStorage.getItem("user")) {
      this.props.history.replace("/login");
    }
  }

  componentDidMount() {
    const { year } = this.props.location.state;
    this.getReceiptsAndExpense(year);
    this.getProjectInYear(year);
  }

  getReceiptsAndExpense(year) {
    fetch(`${API_URL}receipts-expense/${year + 543}`)
      .then(res => res.json())
      .then(datas => {
        console.log(datas);
        this.setState({
          datas
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getProjectInYear(year) {
    fetch(`${API_URL}projects-in-year/${year + 543}`)
      .then(res => res.json())
      .then(({ projectNum }) => {
        console.log('project number', projectNum );
        this.setState({
          projectNum
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  calculateSum() {
    const { datas } = this.state;
    const expenditure = datas.reduce(
      (sum, data) => data.price_expenditure + sum,
      0
    );
    const revenue = datas.reduce((sum, data) => data.price_revenue + sum, 0);
    const total = revenue - expenditure;
    return {
      expenditure,
      revenue,
      total
    };
  }

  generateDataChart() {
    let resultRev = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let resultExp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.state.datas.map(d => {
      resultRev[d.month - 1] = d.price_revenue;
      resultExp[d.month - 1] = d.price_expenditure;
    });

    return {
      resultRev,
      resultExp
    };
  }

  exportToPDF() {
    const input = document.getElementById("per-year-pdf");
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      // const width = pdf.internal.pageSize.width;
      // const height = pdf.internal.pageSize.height;
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("per-year.pdf");
    });
  }

  formatDateToText(m) {
    console.log(m.date);
    return `${m.date()}/${m.month()}/${m.year()}`;
  }

  render() {
    const { datas, projectNum } = this.state;
    const { year } = this.props.location.state;
    const datasChart = {
      labels: [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "ม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค."
      ],
      datasets: [
        {
          label: "รายรับ",
          backgroundColor: "blue",
          data: this.generateDataChart().resultRev
        },
        {
          label: "รายจ่าย",
          backgroundColor: "green",
          data: this.generateDataChart().resultExp
        }
      ]
    };

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
        <h1>รีวิวสรุปรายงานประจำปี</h1>
        <div
          id="per-year-pdf"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "720px",
            margin: "0 auto"
          }}
        >
          <h2>รายงานสรุปรายปี</h2>
          <div
            className="pdf"
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <p>ประจำปี: {year}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <p>จำนวน: {projectNum} โครงการ</p>
            </div>
          </div>
          <br />
          <table className="pdf">
            <thead>
              <tr>
                <th>เดือน</th>
                <th>รายรับ</th>
                <th>รายจ่าย</th>
              </tr>
            </thead>
            <tbody>
              {monthNames.map((m, i) => (
                <tr>
                  <td>{m}</td>
                  <td>{this.generateDataChart().resultRev[i]}</td>
                  <td>{this.generateDataChart().resultExp[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <HorizontalBar
            data={datasChart}
            option={{
              elements: {
                rectangle: {
                  borderWidth: 2
                }
              },
              responsive: true,
              legend: {
                position: "right"
              },
              title: {
                display: `กราฟแสดง รายรับ - รายจ่าย ประจำปี ${this.state.year}`,
                text: ""
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default PerYearPDF;
