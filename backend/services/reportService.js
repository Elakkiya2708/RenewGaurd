const PDFDocument = require("pdfkit");

function createPDF(res, renewals) {

    const doc = new PDFDocument({
        margin: 40
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=RenewGuard_Report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20)
        .text("RenewGuard - Renewal Report", {
            align: "center"
        });

    doc.moveDown();

    doc.fontSize(10)
        .text(`Generated: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    renewals.forEach((item, index) => {

        doc.fontSize(12)
            .text(`${index + 1}. ${item.name}`);

        doc.fontSize(10)
            .text(`Category: ${item.category || "-"}`)
            .text(`Organization: ${item.organization || "-"}`)
            .text(`Expiry Date: ${item.expiry_date || "-"}`)
            .text(`Cost: Rs. ${item.cost || 0}`)
            .text(`Priority: ${item.priority || "-"}`)
            .text(`Status: ${item.status || "-"}`);

        doc.moveDown();
    });

    doc.end();
}

module.exports = {
    createPDF
};