const axios = require('axios');
const puppeteer = require('puppeteer-core');
const conn = require("../main_app/db")
const path = require('path')
const chromePaths = require('chrome-paths');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs')

function logError(errorMessage = "") {
  const logMessage = `
    \n======================
    Time: ${new Date().toISOString()}
    Error: ${errorMessage}
    ======================\n`;

  fs.appendFileSync(
    path.join("error_log.txt"),
    logMessage,
    "utf8"
  );
}

const loadData = async (c_code) => {


  try {
    // const [summaries] = await conn.query(`
    //         SELECT * FROM summaries where collegecode in (select c_code from login where freeze='F')`
    // );
    const [summaries] = await conn.query(`
            SELECT a.*,b.freeze FROM summaries as a join login as b on a.collegecode=b.c_code`
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
    // console.log("Starting PDF generation...");
    
    logError("Chrome Path : " + chromePaths.chrome);



    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: chromePaths.chrome,
      timeout: 60000,
    });

    const mergedPdf = await PDFDocument.create();

    // // console.log("in fuction");

    // // console.log(proposed_branch);



    for (let i = 0; i < summaries.length; i++) {
      const item = summaries[i];
      const clgCourses = coursesall.filter(course => course.collegecode == item.collegecode);
      const clgProposedCourses = proposed_branch.filter(course => course.collegecode == item.collegecode);

      // // console.log("in loop");
      // 
      // // console.log(proposed_branch);



      const pageContent = `
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
    width: 49%;
    position: relative;
    font-size: 11px;
    top:250px; 
    right:-385px;
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
    right: -385px;
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
                <h4>${item.collegecode}</h4>
              </div>
              <div class="rectangle-box">
                <h2>&nbsp&nbsp&nbsp${item.collegename}</h2>
              </div>
              ${item.freeze === "F" ? `
              <table class="main-info">
                <tr><td>Dean/Principal</td><td>${!item.name ? '-' : item.name}</td></tr>
                <tr><td>Address</td><td>${!item.address ? '-' : item.address}</td></tr>
                <tr><td>Taluk</td><td>${!item.taluk ? '-' : item.taluk}</td></tr>
                <tr><td>District</td><td>${!item.district ? '-' : item.district}</td></tr>
                <tr><td>Pincode</td><td>${!item.pincode ? '-' : item.pincode}</td></tr>
                <tr><td>Phone/Fax</td><td>${!item.phone ? '-' : item.phone}</td></tr>
                <tr><td>Email-ID</td><td>${!item.email ? '-' : item.email}</td></tr>
                <tr><td>Website</td><td>${!item.website ? '-' : item.website}</td></tr>
                <tr><td>Anti-Ragging Phone No</td><td>${!item.antiphone ? '-' : item.antiphone}</td></tr>
                ${summaries.placement ? `<tr><td>Placement</td><td>${summaries.placement}%</td>` : ''}
              </table>
              <table class="main-info2">
                <tr><td>Bank A/c No</td><td>${!item.accno ? '-' : item.accno}</td></tr>
                <tr><td>Bank Name</td><td>${!item.bankname ? '-' : item.bankname}</td></tr>
                <tr><td>Distance in KMS from Dist. HQ</td><td>${!item.distance ? '-' : item.distance}</td></tr>
                <tr><td>Nearest Railway Station</td><td>${!item.rly ? '-' : item.rly}</td></tr>
                <tr><td>Distance in KMS from Nearest Railway Station</td><td>${!item.rlydistance ? '-' : item.rlydistance}</td></tr>
                <tr><td>Minority Status</td><td>${!item.minority ? '-' : item.minority}</td></tr>
                <tr><td>Autonomous Status</td><td>${!item.autonomo ? '-' : item.autonomo}</td></tr>
              </table><br>

              <table class="Hostel">
                <tr><th>Hostel Facilities</th><th>Boys</th><th>Girls</th></tr>
                <tr><td>Accommodation Available for UG</td><td>${!item.accb ? '-' : item.accb}</td><td>${!item.accg ? '-' : item.accg}</td></tr>
                <tr><td>Permanent or Rental (P/R)</td><td>${!item.htypeb ? '-' : item.htypeb}</td><td>${!item.htypeg ? '-' : item.htypeg}</td></tr>
                <tr><td>Type of Mess (Veg/NV)</td><td>${!item.messb ? '0' : item.messb}</td><td>${!item.messg ? '0' : item.messg}</td></tr>
                <tr><td>Room Rent</td><td>${!item.rentb ? '0' : item.rentb}</td><td>${!item.rentg ? '0' : item.rentg}</td></tr>
                <tr><td>Electricity Charges</td><td>${!item.elecb ? '0' : item.elecb}</td><td>${!item.elecg ? '0' : item.elecg}</td></tr>
                <tr><td>Caution Deposit</td><td colspan="2">${!item.caution ? '0' : item.caution}</td>
                <tr><td>Establishment Charges</td><td colspan="2">${!item.estab ? '0' : item.estab}</td>
                <tr><td>Admission Fees</td><td colspan="2">${!item.adm ? '0' : item.adm}</td>
                <tr><td>Transport Facilities (Y/N)</td><td colspan="2">${!item.trans ? '0' : item.trans}</td>
                <tr><td>Min Transport Charges</td><td colspan="2">${!item.mintrans ? '0' : item.mintrans}</td>
                <tr><td>Max Transport Charges</td><td colspan="2">${!item.maxtrans ? '0' : item.maxtrans}</td>
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
             <div class="proposed-container">
             

        
              ${clgProposedCourses.length > 0 ? `
                 <h3 class="table-heading">Proposed Branch/Intake</h3>
                    <table class="proposed">
                   

                      <tr><th>SL.No</th><th>Branch Name</th><th colspan="2">Intake</th><th>Remarks</th></tr>
                      ${clgProposedCourses.map((branch, index1) => `
                        <tr>
                          <td>${index = index1 + 1}</td>
                          <td>${branch.coursename}</td>
                          <td colspan="2">${branch.intake}</td>
                           <td>${branch.remarks}</td>
                        </tr>
                      `).join('')}

                       ${clgCourses.map((branch) =>
        branch.new_intake != null && branch.new_intake != 0 ?
          `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${branch.coursename}</td>
                      <td>${branch.intake}</td>
                      <td>${branch.new_intake}</td>
                      <td>${branch.remarks}</td>
                    </tr>`: ''
      ).join('')
            }
                    </table>
                    </div>
                  </div>
                ` : ''
          }
                    </table>
                    </div>
                  </div>
                ` : ''
        }
              
              
              
            </div>
          </body>
        </html>`;

      const page = await browser.newPage();
      await page.setContent(pageContent, { waitUntil: 'domcontentloaded' });

      // Generate a PDF buffer for each page and add it to the merged PDF
      const singlePagePdf = await page.pdf({ format: 'A4', printBackground: true });
      const pdfToMerge = await PDFDocument.load(singlePagePdf);
      const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));

      await page.close();
    }

    await browser.close();

    // Export the final merged PDF
    const mergedPdfBuffer = await mergedPdf.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=booklet.pdf`);
    res.setHeader('Content-Length', mergedPdfBuffer.length);
    res.end(mergedPdfBuffer);
    // console.log("PDF successfully generated ");
  } catch (error) {
    console.error('Error generating PDF:', error);
    logError("Error in generating PDF : " + error);
    res.status(500).json({ msg: 'Failed to create PDF', error });
  }
}

async function main_booklet_pdf(req, res) {


  // // console.log("in pdf function");



  const { summaries, coursesall, proposed_branch } = await loadData();
  // // console.log(proposed_branch);

  await generatePDF(summaries, coursesall, proposed_branch, res);
}


module.exports = {
  main_booklet_pdf
}
