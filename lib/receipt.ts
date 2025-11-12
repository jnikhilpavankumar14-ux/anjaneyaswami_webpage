import jsPDF from 'jspdf'

export interface ReceiptData {
  donorName: string
  amount: number
  paymentId: string
  orderId: string
  date: string
  note?: string
}

export function generateReceiptPDF(data: ReceiptData): jsPDF {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(255, 153, 51) // Saffron
  doc.text('Sri Abhayanjaneya Swamy Temple', 105, 20, { align: 'center' })
  doc.text('Gandlapalli', 105, 30, { align: 'center' })
  
  // Title
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('DONATION RECEIPT', 105, 45, { align: 'center' })
  
  // Line
  doc.setDrawColor(255, 153, 51)
  doc.setLineWidth(0.5)
  doc.line(20, 50, 190, 50)
  
  // Receipt details
  doc.setFontSize(12)
  let y = 65
  
  doc.text(`Receipt No: ${data.orderId}`, 20, y)
  y += 10
  doc.text(`Date: ${data.date}`, 20, y)
  y += 10
  doc.text(`Payment ID: ${data.paymentId}`, 20, y)
  y += 15
  
  doc.setFontSize(14)
  doc.text(`Donor Name: ${data.donorName}`, 20, y)
  y += 10
  doc.text(`Amount: ₹${data.amount.toLocaleString('en-IN')}`, 20, y)
  y += 15
  
  if (data.note) {
    doc.setFontSize(12)
    doc.text(`Note: ${data.note}`, 20, y)
    y += 15
  }
  
  // Footer
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('This is an electronic receipt. No signature required.', 105, 250, { align: 'center' })
  doc.text('Thank you for your generous donation!', 105, 260, { align: 'center' })
  
  return doc
}

export function generateReceiptHTML(data: ReceiptData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Donation Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; color: #FF9933; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .details { margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .amount { font-size: 20px; font-weight: bold; color: #138808; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Sri Abhayanjaneya Swamy Temple</h1>
        <h2>Gandlapalli</h2>
      </div>
      <div class="title">DONATION RECEIPT</div>
      <div class="details">
        <div class="detail-row"><strong>Receipt No:</strong> ${data.orderId}</div>
        <div class="detail-row"><strong>Date:</strong> ${data.date}</div>
        <div class="detail-row"><strong>Payment ID:</strong> ${data.paymentId}</div>
        <div class="detail-row"><strong>Donor Name:</strong> ${data.donorName}</div>
        <div class="detail-row"><strong>Amount:</strong> <span class="amount">₹${data.amount.toLocaleString('en-IN')}</span></div>
        ${data.note ? `<div class="detail-row"><strong>Note:</strong> ${data.note}</div>` : ''}
      </div>
      <div class="footer">
        <p>This is an electronic receipt. No signature required.</p>
        <p>Thank you for your generous donation!</p>
      </div>
    </body>
    </html>
  `
}

