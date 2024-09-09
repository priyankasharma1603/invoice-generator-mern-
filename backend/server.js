// server.js
const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const ejs = require('ejs');
const num2words = require('num2words');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Invoice generation route
app.post('/generate-invoice', async (req, res) => {
  try {
    const invoiceData = req.body;

    // Calculate net amount, tax, and total for each item
    invoiceData.items = invoiceData.items.map((item) => {
      item.netAmount = item.unitPrice * item.quantity - item.discount;
      if (invoiceData.placeOfSupply === invoiceData.placeOfDelivery) {
        item.taxType = 'CGST/SGST';
        item.taxAmount = item.netAmount * 0.18; // 18% Tax
      } else {
        item.taxType = 'IGST';
        item.taxAmount = item.netAmount * 0.18;
      }
      item.totalAmount = item.netAmount + item.taxAmount;
      return item;
    });

    // Calculate totals
    const totalRow = invoiceData.items.reduce((acc, item) => acc + item.totalAmount, 0);
    invoiceData.totalAmountInWords = num2words(totalRow, { lang: 'en' });

    // Render the HTML template
    ejs.renderFile(path.join(__dirname, 'template.ejs'), { data: invoiceData }, (err, html) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Generate PDF from HTML
      pdf.create(html).toStream((err, stream) => {
        if (err) {
          return res.status(500).send(err);
        }

        // Set the correct headers and send the PDF
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
      });
    });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred during invoice generation.' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
