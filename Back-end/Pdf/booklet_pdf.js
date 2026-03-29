const axios = require('axios');
const puppeteer = require('puppeteer');
const conn = require("../main_app/db");
const path = require('path');
const chromePaths = require('chrome-paths');
const fs = require('fs');


const loadData = async (c_code) => {
  try {
    const [summaries] = await conn.query(`
      SELECT * FROM summaries 
      WHERE collegecode = ?`,
      [c_code]
    );

    const [coursesall] = await conn.query(`
      SELECT * FROM coursesall 
      WHERE collegecode = ?`,
      [c_code]
    );

    const [proposed_branch] = await conn.query(`
      SELECT * FROM proposed_branch 
      WHERE collegecode = ?`,
      [c_code]
    );

    // await conn.end();

    return { summaries: summaries[0], coursesall, proposed_branch };
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
}

async function generatePDF(data, res, c_code) {

  try {


    


    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: chromePaths.chrome,
      timeout: 60000,
    });
    var $index = 0;
    const page = await browser.newPage();

    const courses = data.coursesall;
    const summary = data.summaries;
    const proposed = data.proposed_branch; // Fetching proposed data

    let content = `
      <html>
          <head>
          <title>Booklet</title>
           <style>
           body {
    font-family: Arial, sans-serif;
    font-size: 9px;
    margin: 0;
    padding: 20px;
}

.container {
    width: 100%;
    max-width: 800px;
    margin: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; /* Ensures fixed table layout */
}

table, th, td {
    border: 1px solid;
}

th, td {
    padding: 8px;
    text-align: center;
}

/* Style for a fixed rectangular box */
.rectangle-box {
    width: 635px;
    height: 64px;
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-items: center; /* Centers content vertically */
    text-align: center;
    background-color: #fffefe;
    margin-left: 40px;
    font-size: 11px;
    position: relative;
    left: 40px;
    top: -64px;
    box-sizing: border-box; /* Ensures padding doesn’t affect the box size */
}

/* Style for a fixed square box */
.square-box {
    width: 60px;
    height: 60px;
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fffefe;
    font-size: 17px;
}
  

/* Removes border where required */
.no-border {
    border: none;
}

/* Fixed positions for main-info table */
.main-info {
    width: 46%;
    vertical-align: top;
    font-size: 12px;
    position: absolute;
    top: 120px; /* Adjust as needed */
    left: 20px; /* Adjust as needed */
}
.main-info th:nth-child(1),
.main-info td:nth-child(1) {
    width: 95px; /* Adjust width as desired */
}

/* Fixed position for Hostel table */
.Hostel {
    width: 46%;
    position: absolute;
    font-size: 12px;
    top: 520px; /* Adjust as needed */
    left: 20px;
}

/* Fixed position for main-info2 table */
.main-info2 {
    width: 47%;
    font-size: 12px;
    position: absolute;
    top: 120px; /* Same top value as main-info */
    right: 20px; /* Aligns to the right side */
}

/* Fixed position for course table */
.course {
    width: 49%;
    position: relative;
    font-size: 11px;
    top: 250px; 
    right: -363px;
}
.course th:nth-child(1),
.course td:nth-child(1) {
    width: 27px; /* Adjust width as desired */
}

.course th:nth-child(2),
.course td:nth-child(2) {
    width: 34px; /* Adjust width as desired */
}

.course th:nth-child(3),
.course td:nth-child(3) {
    width: 47px; /* Adjust width as desired */
}
.course th:nth-child(4),
.course td:nth-child(4) {
    width: 45px; /* Adjust width as desired */
}
.course th:nth-child(5),
.course td:nth-child(5) {
    width: 54px; /* Adjust width as desired */
}

.course th, .course td {
    padding: 2px 5px;
    line-height: 1;
    height: 20px;
    text-align: center;
}

.course td {
    line-height: 0.5;
    height: 17px;
    padding: 2px 5px;
}

// .proposed {
//     width: 47%;
//     position: relative;
//     font-size: 11px;
//     top: 698px; 
//     right: 20px;
//            }
         
           .proposed th, .proposed td {
               padding: 2px 5px;
               line-height: 1;
               height: 20px;
               text-align: center;
                font-size:12px;

           }
           /* Adjusting the width of the proposed table's columns */
           .proposed th:nth-child(1),
           .course td:nth-child(1) {
               width: 3px; /* Adjust width as desired */
           }

           .proposed th:nth-child(2),
           .course td:nth-child(2) {
               width: 42px; /* Adjust width as desired */
           }

           .proposed th:nth-child(3),
           .course td:nth-child(3) {
               width: 7px; /* Adjust width as desired */
           }
            .proposed th:nth-child(4),
           .course td:nth-child(4) {
               width: 20px; /* Adjust width as desired */
           }
               .proposed th:nth-child(5),
           .course td:nth-child(5) {
               width: 20px; /* Adjust width as desired */
           }

          .proposed-container{
          display:flex;
          flex-direction:column;
          width: 49%;
    position: relative;
    font-size: 11px;
    top: 250px; 
    right: -363px;
          }

          .table-heading{
          position:relative;
          margin-bottom:5px;
          font-size:12px;
          font-weight:bold;
          }
     

           </style>
          </head>
          <body>
            <div class="container">
              <div class="square-box">
                <h4>${summary.collegecode}</h4>
              </div>
              <div class="rectangle-box">
                <h2>&nbsp&nbsp&nbsp${summary.collegename}</h2>
              </div>
              <table class="main-info">
                <tr><td>Dean/Principal</td><td>${!summary.name ? '-' : summary.name}</td></tr>
                <tr><td>Address</td><td>${!summary.address ? '-' : summary.address}</td></tr>
                <tr><td>Taluk</td><td>${!summary.taluk ? '-' : summary.taluk}</td></tr>
                <tr><td>District</td><td>${!summary.district ? '-' : summary.district}</td></tr>
                <tr><td>Pincode</td><td>${!summary.pincode ? '-' : summary.pincode}</td></tr>
                <tr><td>Phone/Fax</td><td>${!summary.phone ? '-' : summary.phone}</td></tr>
                <tr><td>Email-ID</td><td>${!summary.email ? '-' : summary.email}</td></tr>
                <tr><td>Website</td><td>${!summary.website ? '-' : summary.website}</td></tr>
                <tr><td>Anti-Ragging Phone No</td><td>${!summary.antiphone ? '-' : summary.antiphone}</td></tr>
                ${summary.placement ? `<tr><td>Placement</td><td>${summary.placement}%</td>` : ''}
                
                
              </table>
              <table class="main-info2">
                <tr><td>Bank A/c No</td><td>${!summary.accno ? '-' : summary.accno}</td></tr>
                <tr><td>Bank Name</td><td>${!summary.bankname ? '-' : summary.bankname}</td></tr>
                <tr><td>Distance in KMS from Dist. HQ</td><td>${!summary.distance ? '-' : summary.distance}</td></tr>
                <tr><td>Nearest Railway Station</td><td>${!summary.rly ? '-' : summary.rly}</td></tr>
                <tr><td>Distance in KMS from Nearest Railway Station</td><td>${!summary.rlydistance ? '-' : summary.rlydistance}</td></tr>
                <tr><td>Minority Status</td><td>${!summary.minority ? '-' : summary.minority}</td></tr>
                <tr><td>Autonomous Status</td><td>${!summary.autonomo ? '-' : summary.autonomo}</td></tr>
              </table><br>
              <table class="Hostel">
                <tr><th>Hostel Facilities</th><th>Boys</th><th>Girls</th></tr>
                <tr><td>Accommodation Available for UG</td><td>${!summary.accb ? '-' : summary.accb}</td><td>${!summary.accg ? '-' : summary.accg}</td></tr>
                <tr><td>Permanent or Rental (P/R)</td><td>${!summary.htypeb ? '-' : summary.htypeb}</td><td>${!summary.htypeg ? '-' : summary.htypeg}</td></tr>
                <tr><td>Type of Mess (Veg/NV)</td><td>${!summary.messb ? '0' : summary.messb}</td><td>${!summary.messg ? '-' : summary.messg}</td></tr>
                <tr><td>Mess Bill</td><td>${!summary.billb ? '0' : summary.billb}</td><td>${!summary.billg ? '0' : summary.billg}</td></tr>
                <tr><td>Room Rent</td><td>${!summary.rentb ? '0' : summary.rentb}</td><td>${!summary.rentg ? '0' : summary.rentg}</td></tr>
                <tr><td>Electricity Charges</td><td>${!summary.elecb ? '0' : summary.elecb}</td><td>${!summary.elecg ? '0' : summary.elecg}</td></tr>
                <tr><td>Caution Deposit</td><td colspan="2">${!summary.caution ? '0' : summary.caution}</td>
                <tr><td>Establishment Charges</td><td colspan="2">${!summary.estab ? '0' : summary.estab}</td>
                <tr><td>Admission Fees</td><td colspan="2">${!summary.adm ? '0' : summary.adm}</td>
                <tr><td>Transport Facilities (Y/N)</td><td colspan="2">${!summary.trans ? '-' : summary.trans}</td>
                <tr><td>Min Transport Charges</td><td colspan="2">${!summary.mintrans ? '0' : summary.mintrans}</td>
                <tr><td>Max Transport Charges</td><td colspan="2">${!summary.maxtrans ? '0' : summary.maxtrans}</td>
              </table>
              <table class="course">
                <tr><th>SL.No</th><th>Branch Code</th><th>Approved Intake</th><th>Year of Starting of Course</th><th>Whether NBA Accredited</th><th>Accreditation Valid Upto</th></tr>
                ${courses.map((course, index) => `
                  <tr>  
                    <td>${index + 1}</td>
                    <td>${course.coursecode}</td>
                    <td>${course.intake}</td>
                    <td>${course.startyear}</td>
                    <td>${course.nba}</td>
                    <td>${course.validity}</td>
                  </tr>
                `).join('')}
              </table>
               ${proposed.length > 0 || courses.length > 0 ? `
              
              <div class="proposed-container">
             

             
                 <h3 class="table-heading">Proposed Branch/Intake</h3>
                    <table class="proposed">
                   

                      <tr><th>SL.No</th><th>Branch Name</th><th colspan="2">Intake</th><th>Remarks</th></tr>
                      ${proposed.map((branch, index) => `
                        <tr>
                          <td>${++index}</td>
                          <td>${branch.coursename}</td>
                          <td colspan="2">${branch.intake}</td>
                           <td>${branch.remarks}</td>
                        </tr>
                      `).join('')}

                       ${courses.map((branch) =>
      branch.new_intake != null ?
        ` 
                    <tr>
                      <td>${++proposed.length}</td>
                      <td>${branch.coursename}</td>
                      <td>${branch.intake}</td>
                      <td>${branch.new_intake}</td>
                      <td>${branch.remarks ?(branch.remarks):(`<p>-</p>`)}</td>
                    </tr>`: ''
    ).join('')
        }
                    </table>
                    </div>
                  </div>
                ` : ''
      }
              
              
              
            </div>
          </body>
        </html>
    `;

    await page.setContent(content, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px',
      },
    });

    console.log('PDF successfully generated.');
    await browser.close();

    // Correctly setting headers to return a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${c_code}_booklet.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);


    res.end(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ msg: 'Failed to create PDF' });
  }
}

async function main_pdf(req, res) {
  const { c_code } = req.body;
  console.log(c_code);
  console.log("in pdf function");

  const data = await loadData(c_code);
  console.log("fetched data : \n", data);
  if (data) {
    await generatePDF(data, res, c_code);
  }
}

module.exports = {
  main_pdf
};
