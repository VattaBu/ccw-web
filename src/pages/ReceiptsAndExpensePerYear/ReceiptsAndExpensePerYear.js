import "react-table/react-table.css";
import React from "react";
import _ from "lodash";
import ReactTable from "react-table";
import { HorizontalBar } from "react-chartjs-2";
import printIcon from "../../assets/icon/print-icon.png";
import "./ReceiptsAndExpensePerYear.css";

const API_URL = "http://localhost:5000/api/";
const yearList = _.range(2561 - 543, 2000 - 543, -1);
const mountList = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม'
];
// add defualt
// yearList.unshift('---ระบุปี---');
// mountList.unshift({ id: 0, value: '---ระบุเดือน---' });

const columns = [
  // { Header: "ลำดับ", accessor: "index" },
  {
    Header: "เดือน",
    style: { textAlign: "center" },
    id: 'month',
    accessor: d =>  mountList[d.month - 1]
  },
  {
    Header: "รายรับ",
    id: 'price_revenue',
    style: { textAlign: "center" },
    accessor: d => d.price_revenue.toLocaleString(),

  },
  {
    Header: "รายจ่าย",
    id: 'price_expenditure',
    style: { textAlign: "center" },
    accessor: d => d.price_expenditure.toLocaleString()
  },
  {
    Header: "คงเหลือ",
    id: 'total',
    style: { textAlign: "center" },
    accessor: d => d.total.toLocaleString()
  }
];
// const datas = [
//   {
//     'index': 5505,
//     'mount': '110360/2552',
//     'revenue': 500,
//     'expendation': 400,
//     'total': Date.now().toString(),
//   },
// ]

class ReceiptsAndExpensePerYear extends React.Component {
  state = {
    year: yearList[0],
    datas: []
  };
  componentWillMount() {
    if (!localStorage.getItem("user")) {
      this.props.history.replace("/login");
    }
  }

  componentDidMount() {
    this.getReceiptsAndExpense();
  }

  getReceiptsAndExpense() {
    fetch(`${API_URL}receipts-expense/${this.state.year + 543}`)
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

  render() {
    // const datasInTable = datas.map((data, index) => ({ ...data, index }));
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
      <div className="re-ex-year-root">
        <div className="controllerButtons">
          <a className="button icon add-user">
            <img
              src={printIcon}
              alt="export ot pdf"
              onClick={() => this.props.history.push('/per-year-preview', { year: this.state.year })}
            />
          </a>
        </div>
        <div className="re-ex-year-block-filter">
          {/* year */}
          <div className="field">
            <div className="is-normal">
              <label className="label">ปี:</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <select
                    value={this.state.year}
                    className="select select-app"
                    onChange={e => {
                      this.setState(
                        {
                          year: e.target.value
                        },
                        () => this.getReceiptsAndExpense()
                      );
                    }}
                  >
                    {yearList.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="re-ex-year-block-button">
            <a className="button is-medium is-link" onClick={() => {}}>
              ค้นหา
            </a>
            <a className="button is-medium is-warning" onClick={() => {}}>
              ยกเลิก
            </a>
          </div>
        </div>
        <div className="re-ex-year-block-table">
          <ReactTable
            data={this.state.datas}
            columns={columns}
            defaultPageSize={10}
            className="-striped -highlight"
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
                width: "40%",
                borderWidth: "2px",
                borderColor: "black",
                padding: "20px",
                borderStyle: "solid",
                marginTop: "10px"
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end"
                  }}
                >
                  <h3>รวมยอดรายรับ :</h3>
                  <h3>รวมยอดรายจ่าย :</h3>
                  <h3>รวมยอดคงเหลือ :</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h3>{this.calculateSum().revenue.toLocaleString()} บาท</h3>
                  <h3>{this.calculateSum().expenditure.toLocaleString()} บาท</h3>
                  <h3>{this.calculateSum().total.toLocaleString()} บาท</h3>
                </div>
              </div>
            </div>
          </div>
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

export default ReceiptsAndExpensePerYear;
