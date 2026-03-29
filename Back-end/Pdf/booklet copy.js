const axios = require('axios');
const puppeteer = require('puppeteer-core');
const conn = require("../main_app/db")
const path = require('path')
const chromePaths = require('chrome-paths');
const fs = require('fs')

const loadData = async (c_code) => {


  try {
    const [summaries] = await conn.query(`
            SELECT * FROM summaries limit 2`
    );

    const [coursesall] = await conn.query(`
            SELECT * FROM coursesall`
    );
    const [proposed_branch] = await conn.query(`
            SELECT * FROM proposed_branch`
    );

    return { summaries: summaries, coursesall: coursesall, proposed_branch: proposed_branch };
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
}



async function generatePDF(summaries, coursesall, proposed_branch, res) {
  try {
    console.log("Starting PDF generation...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: chromePaths.chrome,
      timeout: 60000,
    });

    const page = await browser.newPage();



    const content = `
        <html>
          <head>
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
    width: 47%;
    position: absolute;
    font-size: 11px;
    top: 398px; 
    right: 20px;
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


   .proposed {
                width: 47%;
                position: absolute;
               font-size: 11px;
               top: 398px; 
              right: 20px;
           }
           .proposed th, .proposed td {
               padding: 2px 5px;
               line-height: 1;
               height: 20px;
               text-align: center;
           }
           /* Adjusting the width of the proposed table's columns */
           .proposed th:nth-child(1),
           .course td:nth-child(1) {
               width: 2px; /* Adjust width as desired */
           }

           .proposed th:nth-child(2),
           .course td:nth-child(2) {
               width: 45px; /* Adjust width as desired */
           }

           .proposed th:nth-child(3),
           .course td:nth-child(3) {
               width: 4px; /* Adjust width as desired */
           }


           
           
     

           </style>
          </head>
          
          ${summaries.map((item, index) => {
            const clgCourses = coursesall.filter(courses => item.collegecode == courses.collegecode)
      const clgProposedCourses = proposed_branch.filter(courses => courses.collegecode == item.collegecode)
      return (
        
        `
        <body>
               <div class="whole_pdf>
               <div class="container">
              <div class="square-box">
                <h4>${item.collegecode}</h4>
              </div>
              <div class="rectangle-box">
                <h2>&nbsp&nbsp&nbsp${item.collegename}</h2>
              </div>
              <table class="main-info">
                <tr><td>Dean/Principal</td><td>${item.name}</td></tr>
                <tr><td>Address</td><td>${item.address}</td></tr>
                <tr><td>Taluk</td><td>${item.taluk}</td></tr>
                <tr><td>District</td><td>${item.district}</td></tr>
                <tr><td>Pincode</td><td>${item.pincode}</td></tr>
                <tr><td>Phone/Fax</td><td>${item.phone}</td></tr>
                <tr><td>Email-ID</td><td>${item.email}</td></tr>
                <tr><td>Website</td><td>${item.website}</td></tr>
                <tr><td>Anti-Ragging Phone No</td><td>${item.antiphone}</td></tr>
              </table>
              <table class="main-info2">
                <tr><td>Bank A/c No</td><td>${item.accno}</td></tr>
                <tr><td>Bank Name</td><td>${item.bankname}</td></tr>
                <tr><td>Distance in KMS from Dist. HQ</td><td>${item.distance}</td></tr>
                <tr><td>Nearest Railway Station</td><td>${item.rly}</td></tr>
                <tr><td>Distance in KMS from Nearest Railway Station</td><td>${item.rlydistance}</td></tr>
                <tr><td>Minority Status</td><td>${item.minority}</td></tr>
                <tr><td>Autonomous Status</td><td>${item.autonomo}</td></tr>
              </table><br>
               <section class="whole_pdf"></section>

              <table class="Hostel">
                <tr><th>Hostel Facilities</th><th>Boys</th><th>Girls</th></tr>
                <tr><td>Accommodation Available for UG</td><td>${item.accb}</td><td>${item.accg}</td></tr>
                <tr><td>Permanent or Rental (P/R)</td><td>${item.htypeb}</td><td>${item.htypeg}</td></tr>
                <tr><td>Type of Mess (Veg/NV)</td><td>${item.messb}</td><td>${item.messg}</td></tr>
                <tr><td>Mess Bill</td><td>${item.billb}</td><td>${item.billg}</td></tr>
                <tr><td>Room Rent</td><td>${item.rentb}</td><td>${item.rentg}</td></tr>
                <tr><td>Electricity Charges</td><td>${item.elecb}</td><td>${item.elecg}</td></tr>
                <tr><td>Caution Deposit</td><td colspan="2">${item.caution}</td>
                <tr><td>Establishment Charges</td><td colspan="2">${item.estab}</td>
                <tr><td>Admission Fees</td><td colspan="2">${item.adm}</td>
                <tr><td>Transport Facilities (Y/N)</td><td colspan="2">${item.trans}</td>
                <tr><td>Min Transport Charges</td><td colspan="2">${item.mintrans}</td>
                <tr><td>Max Transport Charges</td><td colspan="2">${item.maxtrans}</td>
              </table>
              <table class="course">
                <tr><th>SL.No</th><th>Branch Code</th><th>Approved Intake</th><th>Year of Starting of Course</th><th>Whether NBA Accredited</th><th>Accreditation Valid Upto</th></tr>
                ${(clgCourses || []).map((course, index) => `
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

                ${clgProposedCourses.length > 0 ? `
                    <table class="proposed" >
                      <tr><th>SL.No</th><th>Branch Name</th><th>Intake</th></tr>
                      ${clgProposedCourses.map((branch, index) => `
                        <tr>
                          <td>${index + 1}</td>
                          <td>${branch.coursename}</td>
                          <td>${branch.intake}</td>
                        </tr>
                      `).join('')}
                    </table>
                ` : ''
        }
              

                </div>
              </div>
              </body>
            `)
    }
    ).join('')
      }
        </html>
        `;

    page.setContent(content, { waitUntil: 'domcontentloaded' });


    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    // const singlePagePdf = await PDFDocument.load(pdfBuffer);
    // const [singlePage] = pdfDoc.copyPages(singlePagePdf, [0]);
    // pdfDoc.addPage(singlePage)

    // buffArr.push(pdfBuffer)

    await page.close();

    // }

    await browser.close();

    // const combinedPdf = Buffer.concat(buffArr)
    console.log('PDF successfully generated.');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename = booklet.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.end(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ msg: 'Failed to create PDF' });
  }
}

async function main_booklet_pdf(req, res) {


  console.log("in pdf function");



  const { summaries, coursesall, proposed_branch } = await loadData();
  await generatePDF(summaries, coursesall, proposed_branch, res);
}


module.exports = {
  main_booklet_pdf
}
