import React from "react";
import jsPDF from "jspdf";
import _ from "lodash";
import html2canvas from "html2canvas";
import moment from "moment";
import { HorizontalBar } from "react-chartjs-2";
import printIcon from "../../assets/icon/print-icon.png";

moment.locale("th");

const API_URL = "http://localhost:5000/api/";
const yearList = _.range(2561, 2000, -1);
const monthList = [
  { id: 1, value: "01", text: "มกราคม" },
  { id: 2, value: "02", text: "กุมภาพันธ์" },
  { id: 3, value: "03", text: "มีนาคม" },
  { id: 4, value: "04", text: "เมษายน" },
  { id: 5, value: "05", text: "พฤษภาคม" },
  { id: 6, value: "06", text: "มิถุนายน" },
  { id: 7, value: "07", text: "กรกฎาคม" },
  { id: 8, value: "08", text: "สิงหาคม" },
  { id: 9, value: "09", text: "กันยายน" },
  { id: 10, value: "10", text: "ตุลาคม" },
  { id: 11, value: "11", text: "พฤศจิกายน" },
  { id: 12, value: "12", text: "ธันวาคม" }
];
const MONTH_TEXT = {
  "01": "มกราคม",
  "02": "กุมภาพันธ์",
  "03": "มีนาคม",
  "04": "เมษายน",
  "05": "พฤษภาคม",
  "06": "มิถุนายน",
  "07": "กรกฎาคม",
  "08": "สิงหาคม",
  "09": "กันยายน",
  "10": "ตุลาคม",
  "11": "พฤศจิกายน",
  "12": "ธันวาคม"
};
const remarks = [
  { value: "DEPOSIT", text: "เงินฝากธนาคาร" },
  { value: "CASH", text: "เงินสด" }
];
const statuss = [
  { value: "RECEIVE", text: "ได้รับแล้ว" },
  { value: "NOT_RECEIVE", text: "ยังไม่ได้รับแล้ว" }
];

class PerMonthPDF extends React.Component {
  state = {
    // datas: [{ 'index': 1,'project_number': 100 , 'project_name': 'eiei' }],
    datas: []
  };

  componentWillMount() {
    if (!localStorage.getItem("user")) {
      this.props.history.replace("/login");
      return;
    }
  }

  componentDidMount() {
    this.getProjectDetailByDate();
  }

  getProjectDetailByDate() {
    const { year, month } = this.props.location.state;
    return fetch(`${API_URL}receipts-expense/${month}/${year + 543}`)
      .then(res => res.json())
      .then(datas => {
        console.log(
          "datas ==> ",
          `${API_URL}receipts-expense/${month}/${year}`,
          datas
        );
        console.log(this.props.location.state);
        this.setState({
          datas,
          month,
          year
        });
      })
      .catch(error => alert("เกิดข้อผิดพลาด"));
  }

  calculateSumRevenue(revenue) {
    const sum = revenue.reduce(
      (sum, r) => {
        if (r.status === statuss[1].value) {
          return sum;
        }
        return (r.price_per * r.project_value / 100) + sum;
      },
      0
    );

    return sum;
  }

  calculateSumExpenditure(expenditure) {
    const sum = expenditure.reduce((sum, e) => e.price_total + sum, 0);
    return sum;
  }

  calculateSum() {
    const { datas } = this.state;
    console.log("datas ==> cal", datas);
    const title = [];
    const resultRev = [];
    const resultExp = [];

    for (let i = 0; i < datas.length; i++) {
      const data = { ...datas[i] };
      title.push(data.project_name);
      resultRev.push(this.calculateSumRevenue(data.revenue));
      resultExp.push(this.calculateSumExpenditure(data.expenditure));
    }

    const sumRev = resultRev.reduce((sum, r) => sum + r, 0);
    const sumExp = resultExp.reduce((sum, e) => sum + e, 0);
    return {
      sumRev,
      sumExp,
      total: sumRev - sumExp
    };
  }

  generateDataChart() {
    const { datas } = this.state;
    const title = [];
    const resultRev = [];
    const resultExp = [];

    for (let i = 0; i < datas.length; i++) {
      const data = { ...datas[i] };
      title.push(data.project_name);
      resultRev.push(this.calculateSumRevenue(data.revenue));
      resultExp.push(this.calculateSumExpenditure(data.expenditure));
    }

    return {
      title,
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
      pdf.save("per-month.pdf");
    });
  }

  formatDateToText(m) {
    console.log(m.date);
    return `${m.date()}/${m.month()}/${m.year()}`;
  }

  render() {
    const { datas } = this.state;
    console.log("datas", datas);
    const { year, month } = this.props.location.state;
    const { resultExp, resultRev, title } = this.generateDataChart();
    const datasChart = {
      labels: [...this.generateDataChart().title],
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
        <h1>รีวิวสรุปรายงานประจำเดือน</h1>
        <div
          id="per-year-pdf"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "720px",
            margin: "0 auto"
          }}
        >
          <h2>รายงานสรุปรายเดือน</h2>
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
              <p>ประจำปี: {year}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingRight: "100px"
              }}
            >
              <p>จำนวน: {datas.length} โครงการ</p>
            </div>
          </div>
          <br />
          <p>ประจำเดือน: {month}</p>
          <h3 style={{ alignSelf: "center" }}>รายรับ</h3>
          <table className="pdf">
            <thead>
              <tr>
                <th>เดือน</th>
                <th>รายรับ</th>
                <th>รายจ่าย</th>
              </tr>
            </thead>
            <tbody>
              {title.map((t, i) => (
                <tr>
                  <td>{t}</td>
                  <td>{resultRev[i]}</td>
                  <td>{resultExp[i]}</td>
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
          <br />
          <div style={{ textAlign: "right", paddingRight: "70px" }}>
            <p>รวมรายรับ {this.calculateSum().sumRev} บาท</p>
            <p>รวมรายรับ {this.calculateSum().sumExp} บาท</p>
            <p>รวมคเหลือ {this.calculateSum().total} บาท</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PerMonthPDF;
