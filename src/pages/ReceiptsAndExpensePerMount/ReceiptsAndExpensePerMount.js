import "react-table/react-table.css";
import React from "react";
import moment from "moment";
import { HorizontalBar } from "react-chartjs-2";
import _ from "lodash";
import ReactTable from "react-table";
import printIcon from "../../assets/icon/print-icon.png";
import "./ReceiptsAndExpensePerMount.css";

moment.locale("th");

const API_URL = "http://localhost:5000/api/";
const yearList = _.range(2561  - 543, 2000  - 543, -1);
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

const columns = [
  { Header: "ลำดับ", style: { textAlign: "center" }, accessor: "index" },
  { Header: "รหัสโครงการ", style: { textAlign: "center" }, accessor: "project_number" },
  { Header: "ชื่อโครงการ", style: { textAlign: "center" }, accessor: "project_name" },
  { Header: "รายรับ", style: { textAlign: "center" }, accessor: "revenue" },
  { Header: "รายจ่าย", style: { textAlign: "center" }, accessor: "expendation" },
  { Header: "เดือน", style: { textAlign: "center" }, accessor: "mount" }
];
const subColumnsByTimes = [
  { Header: "งวด", style: { textAlign: "center" }, accessor: "period" },
  { Header: "วันที่รับจริง", style: { textAlign: "center" }, accessor: "date" },
  { Header: "%", style: { textAlign: "center" }, accessor: "per" },
  { Header: "จำนวน", style: { textAlign: "center" }, accessor: "count" },
  { Header: "หมายเหตุ", style: { textAlign: "center" }, accessor: "remark" },
  { Header: "สถานะ", style: { textAlign: "center" }, accessor: "status" }
];
const subColumnsByLists = [
  { Header: "งวด", style: { textAlign: "center" }, accessor: "period" },
  { Header: "ลำดับ", style: { textAlign: "center" }, accessor: "index" },
  { Header: "รายการ", accessor: "list" },
  { Header: "วันที่", style: { textAlign: "center" }, accessor: "date" },
  { Header: "จำนวน", style: { textAlign: "center" }, accessor: "count" },
  { Header: "ราคา/หน่วย", style: { textAlign: "center" }, accessor: "priece" },
  { Header: "ราคารวม", style: { textAlign: "center" }, accessor: "total" }
];

// const datas = [
//   {
//     'project_number': 5505,
//     'project_name': '110360/2552',
//     'revenue': 500,
//     'expendation': 400,
//     'mount': Date.now().toString(),
//   },
// ];
const datasByTime = [
  {
    period: 1,
    index: 1,
    list: "test",
    date: Date.now(),
    count: 5,
    priece: 50,
    total: 70
  }
];
const datasByLists = [
  {
    period: 1,
    date: Date.now(),
    per: 33,
    count: 5,
    remark: "test",
    status: "pass"
  }
];

class ReceiptsAndExpensePerMount extends React.Component {
  state = {
    // datas: [{ 'index': 1,'project_number': 100 , 'project_name': 'eiei' }],
    datas: [],
    year: yearList[0],
    month: monthList[0].value
  };
  columns = [
    { Header: "ลำดับ", style: { textAlign: "center" }, accessor: "index" },
    { Header: "รหัสโครงการ", style: { textAlign: "center" }, accessor: "project_number" },
    { Header: "ชื่อโครงการ", style: { textAlign: "center" }, accessor: "project_name" },
    {
      Header: "รายรับ",
      style: { textAlign: "center" },
      id: "revenue",
      accessor: d => this.calculateSumRevenue(d.revenue)
    },
    {
      Header: "รายจ่าย",
      style: { textAlign: "center" },
      id: "expendation",
      accessor: d => this.calculateSumExpenditure(d.expenditure)
    },
    {
      Header: "คงเหลือ",
      style: { textAlign: "center" },
      id: "total",
      accessor: d =>
        this.calculateSumRevenue(d.revenue) -
        this.calculateSumExpenditure(d.expenditure)
    }
  ];
  subColumnsByRevenue = [
    { Header: "งวด", accessor: "period" },
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
    { Header: "%", style: { textAlign: "center" }, accessor: "price_per" },
    {
      Header: "จำนวน(บาท)",
      style: { textAlign: "center" },
      id: "price",
      accessor: d => d.price_per * d.project_value / 100
    },
    {
      Header: "หมายเหตุ",
      style: { textAlign: "center" },
      id: "remark",
      accessor: r => remarks.filter(re => re.value === r.remark)[0].text
    },
    {
      Header: "สถานะ",
      style: { textAlign: "center" },
      id: "status",
      accessor: d => statuss.filter(st => st.value === d.status)[0].text
    }
  ];
  subColumnsByExpenditure = [
    { Header: "งวด", style: { textAlign: "center" }, accessor: "period" },
    { Header: "รายการ", style: { textAlign: "center" }, accessor: "expenditure_item" },
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
    { Header: "ราคา/หน่วย", style: { textAlign: "center" }, accessor: "price_per_unit" },
    { Header: "ราคารวม", style: { textAlign: "center" }, accessor: "price_total" },
    { Header: "หมายเหตุ", style: { textAlign: "center" }, accessor: "remark" },
    {
      Header: "หมายเหตุ",
      style: { textAlign: "center" },
      id: "remark",
      accessor: r => remarks.filter(re => re.value === r.remark)[0].text
    }
  ];

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
    const { year, month } = this.state;
    return fetch(`${API_URL}receipts-expense/${month}/${year + 543}`)
      .then(res => res.json())
      .then(datas => {
        console.log(
          "datas ==> ",
          `${API_URL}receipts-expense/${month}/${year + 543}`,
          datas
        );
        this.setState({ datas });
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

  render() {
    const { year, month, datas } = this.state;
    const datasInTable = datas.map((data, index) => ({ ...data, index: index + 1 }));
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
      <div className="re-ex-mount-root">
        <div className="controllerButtons">
          <a className="button icon add-user">
            <img
              src={printIcon}
              alt="export ot pdf"
              onClick={() =>
                this.props.history.push("/per-month-preview", {
                  year: year,
                  month: month,
                })
              }
            />
          </a>
        </div>
        <div className="re-ex-mount-block-filter">
          {/* year */}
          <div className="field">
            <div className="is-normal">
              <label className="label">ปี:</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <select
                    value={year}
                    className="select select-app"
                    onChange={e => {
                      this.setState({
                        year: e.target.value
                      });
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
          {/* mount */}
          <div className="field">
            <div className="is-normal">
              <label className="label">เดือน:</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <select
                    value={month}
                    className="select select-app"
                    onChange={e => {
                      this.setState({
                        month: e.target.value
                      });
                    }}
                  >
                    {monthList.map(mount => (
                      <option key={mount.id} value={mount.value}>
                        {mount.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="re-ex-mount-block-button">
            <a
              className="button is-medium is-link"
              onClick={() => this.getProjectDetailByDate()}
            >
              ค้นหา
            </a>
          </div>
        </div>
        <div className="re-ex-mount-block-table">
          <ReactTable
            data={datasInTable}
            columns={this.columns}
            defaultPageSize={10}
            SubComponent={row => {
              return (
                <div style={{ padding: "20px" }}>
                  <br />
                  <h1>รายรับ</h1>
                  <ReactTable
                    data={row.original.revenue}
                    columns={this.subColumnsByRevenue}
                    defaultPageSize={5}
                  />
                  <br />
                  <h1>รายจ่าย</h1>
                  <ReactTable
                    data={row.original.expenditure}
                    columns={this.subColumnsByExpenditure}
                    defaultPageSize={5}
                  />
                  <br />
                </div>
              );
            }}
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
                  <h3>{this.calculateSum().sumRev.toLocaleString()} บาท</h3>
                  <h3>{this.calculateSum().sumExp.toLocaleString()} บาท</h3>
                  <h3>{this.calculateSum().total.toLocaleString()} บาท</h3>
                </div>
              </div>
            </div>
          </div>
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
                display: `กราฟแสดง รายรับ - รายจ่าย ประจำ ${
                  MONTH_TEXT[month]
                } ปี ${year}`,
                text: ""
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default ReceiptsAndExpensePerMount;

// import "react-table/react-table.css";
// import React from 'react';
// import moment from 'moment';
// import _ from 'lodash';
// import ReactTable from "react-table";
// import './ReceiptsAndExpensePerMount.css';

// // const yearList = _.range(2000, 2560, -1);
// const API_URL = "http://localhost:5000/api/";
// const yearList = _.range(2561, 2000, -1);
// const monthList = [
//   { id: 1, value: '01', text: 'มกราคม' },
//   { id: 2, value: '02', text: 'กุมภาพันธ์' },
//   { id: 3, value: '03', text: 'มีนาคม' },
//   { id: 4, value: '04', text: 'เมษายน' },
//   { id: 5, value: '05', text: 'พฤษภาคม' },
//   { id: 6, value: '06', text: 'มิถุนายน' },
//   { id: 7, value: '07', text: 'กรกฎาคม' },
//   { id: 8, value: '08', text: 'สิงหาคม' },
//   { id: 9, value: '09', text: 'กันยายน' },
//   { id: 10, value: '10', text: 'ตุลาคม' },
//   { id: 11, value: '11', text: 'พฤศจิกายน' },
//   { id: 12, value: '12', text: 'ธันวาคม' }
// ];
// const remarks = [
//   { value: 'DEPOSIT', text: 'เงินฝากธนาคาร' },
//   { value: 'CASH', text: 'เงินสด' } ,
// ];
// const statuss = [
//   { value: 'RECEIVE', text: 'ได้รับแล้ว' },
//   { value: 'NOT_RECEIVE', text: 'ยังไม่ได้รับแล้ว' },
// ];

// const columns = [
//   {
//     Header: "Name",
//     columns: [
//       {
//         Header: "First Name",
//         accessor: "firstName"
//       },
//       {
//         Header: "Last Name",
//         id: "lastName",
//         accessor: d => d.lastName
//       }
//     ]
//   },
//   {
//     Header: "Info",
//     columns: [
//       {
//         Header: "Age",
//         accessor: "age"
//       },
//       {
//         Header: "Status",
//         accessor: "status"
//       }
//     ]
//   },
//   {
//     Header: "Stats",
//     columns: [
//       {
//         Header: "Visits",
//         accessor: "visits"
//       }
//     ]
//   }
// ];
// // add defualt
// // yearList.unshift('---ระบุปี---');
// // mountList.unshift({ id: 0, value: '---ระบุเดือน---' });

// // const datas = [
// //   {
// //     'project_number': 5505,
// //     'project_name': '110360/2552',
// //     'revenue': 500,
// //     'expendation': 400,
// //     'mount': Date.now().toString(),
// //   },
// // ];
// // const datasByTime = [
// //   {
// //     period: 1,
// //     index: 1,
// //     list: 'test',
// //     date: Date.now(),
// //     count: 5,
// //     priece: 50,
// //     total: 70,
// //   },
// // ];
// // const datasByLists = [
// //   {
// //     period: 1,
// //     date: Date.now(),
// //     per: 33,
// //     count: 5,
// //     remark: 'test',
// //     status: 'pass'
// //   },
// // ];

// class ReceiptsAndExpensePerMount extends React.Component {
//   state = {
//     datas: [{ 'index': 1,'project_number': 100 , 'project_name': 'eiei' }],
//     year: yearList[0],
//     month: monthList[0].value
//   };
//   columns = [
//     // { Header: 'ลำดับ', accessor: 'index' },
//     { Header: 'รหัสโครงการ', accessor: 'project_number' },
//     { Header: 'ชื่อโครงการ', accessor: 'project_name' },
//     {
//       Header: 'รายรับ',
//       id: 'revenue',
//       accessor: d => 0
//     },
//     {
//       Header: 'รายจ่าย',
//       id: 'expendation',
//       accessor: d => 0
//     },
//   ];
//   subColumnsByRevenue = [
//     { Header: 'งวด', accessor: 'period' },
//     {
//       Header: "วันที่รับจริง",
//       id: "withdraw_date_true",
//       accessor: d =>
//         moment(d.withdraw_date_true)
//           .add(-543, "year")
//           .format("DD/MM/YYYY")
//     },
//     { Header: '%', accessor: 'price_per' },
//     {
//       Header: 'จำนวน(บาท)',
//       id: 'price',
//       accessor: d => d.price_per * d.project_value  / 100
//     },
//     { Header: "หมายเหตุ", id: 'remark', accessor: r => remarks.filter(re => re.value === r.remark)[0].text},
//     { Header: "สถานะ", id: 'status', accessor: d => statuss.filter(st => st.value === d.status)[0].text }
//   ];
//   subColumnsByExpenditure = [
//     { Header: 'งวด', accessor: 'period' },
//     { Header: 'รายการ', accessor: 'expenditure_item' },
//     {
//       Header: "วันที่",
//       id: "expenditure_date",
//       accessor: d =>
//         moment(d.expenditure_date)
//           .add(-543, "year")
//           .format("DD/MM/YYYY")
//     },
//     { Header: 'จำนวน', accessor: 'amount' },
//     { Header: 'ราคา/หน่วย', accessor: 'price_per_unit' },
//     { Header: 'ราคารวม', accessor: 'price_total' },
//     { Header: 'หมายเหตุ', accessor: 'remark' },
//     { Header: "หมายเหตุ", id: 'remark', accessor: r => remarks.filter(re => re.value === r.remark)[0].text}
//   ];

//   componentWillMount() {
//     if (!localStorage.getItem("user")) {
//       this.props.history.replace('/login');
//       return;
//     }
//   }

//   componentDidMount() {
//     this.getProjectDetailByDate();
//   }

//   getProjectDetailByDate() {
//     // const { year, month } = this.state;
//     // return fetch(`${API_URL}receipts-expense/${month}/${year}`)
//     //   .then(res => res.json())
//     //   .then(datas => {
//     //     console.log('datas ==> ', `${API_URL}receipts-expense/${month}/${year}` , datas)
//     //     this.setState({ datas })
//     //   })
//     //   .catch(error => alert('เกิดข้อผิดพลาด'))
//   }

//   render() {
//     const { year, month, datas } = this.state;
//     // const datasInTable = datas.map((data, index) => ({ ...data, index }));

//     return (
//       <div className="re-ex-mount-root">
//         <div className="re-ex-mount-block-filter">
//           {/* year */}
//           <div className="field">
//             <div className="is-normal">
//               <label className="label">ปี:</label>
//             </div>
//             <div className="field-body">
//               <div className="field">
//                 <div className="control">
//                   <select
//                     value={year}
//                     className="select select-app"
//                     onChange={(e) => {
//                       this.setState({
//                         year: e.target.value
//                        })
//                     }}
//                   >
//                     {yearList.map((year) => (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* mount */}
//           <div className="field">
//             <div className="is-normal">
//               <label className="label">เดือน:</label>
//             </div>
//             <div className="field-body">
//               <div className="field">
//                 <div className="control">
//                   <select
//                     value={month}
//                     className="select select-app"
//                     onChange={(e) => {
//                        this.setState({
//                         month: e.target.value
//                        })
//                     }}
//                   >
//                     {monthList.map((mount) => (
//                       <option key={mount.id} value={mount.value}>
//                         {mount.text}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="re-ex-mount-block-button">

//             <a
//               className="button is-medium is-link"
//               onClick={() => this.getProjectDetailByDate()}
//             >
//               ค้นหา
//             </a>
//             <a
//               className="button is-medium is-warning"
//               onClick={() => {}}
//             >
//               ยกเลิก
//             </a>
//           </div>
//         </div>
//         <div className="re-ex-mount-block-table">
//           <ReactTable
//             data={datas}
//             columns={this.columns}
//             defaultPageSize={10}
//             SubComponent={row => {
//               return (
//                 <div style={{ padding: '20px' }}>
//                   <br />
//                   <br />
//                   <h1>รายรับ</h1>
//                   <ReactTable
//                     data={this.columns}
//                     columns={datas}
//                     defaultPageSize={5}
//                     showPagination={false}
//                     className="-striped -highlight"
//                   />
//                   <br />
//                   <br />
//                   <h1>รายจ่าย</h1>
//                   <ReactTable
//                     data={this.columns}
//                     columns={datas}
//                     defaultPageSize={5}
//                     showPagination={false}
//                     className="-striped -highlight"
//                   />
//                   <br />
//                   <br />
//                 </div>
//               );
//             }}
//           />

//           {/* <ReactTable
//           data={data}
//           columns={columns}
//           defaultPageSize={10}
//           className="-striped -highlight"
//           SubComponent={row => {
//             return (
//               <div style={{ padding: "20px" }}>
//                 <em>
//                   You can put any component you want here, even another React
//                   Table!
//                 </em>
//                 <br />
//                 <br />
//                 <ReactTable
//                   data={[]}
//                   columns={columns}
//                   defaultPageSize={3}
//                   showPagination={false}
//                   SubComponent={row => {
//                     return (
//                       <div style={{ padding: "20px" }}>
//                         Another Sub Component!
//                       </div>
//                     );
//                   }}
//                 />
//               </div>
//             );
//           }}
//         /> */}
//         </div>
//       </div>
//     );
//   }
// }

// export default ReceiptsAndExpensePerMount;
