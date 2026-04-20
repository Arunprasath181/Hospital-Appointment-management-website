package com.hospital.service;

import com.hospital.entity.Appointment;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;

@Service
public class BookingExportService {

    public byte[] generatePdf(List<Appointment> appointments) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);

        Paragraph paragraph = new Paragraph("Appointment Report", fontTitle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(paragraph);
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] { 1.5f, 3.5f, 3.0f, 3.0f, 2.5f });
        table.setSpacingBefore(10);

        writeTableHeader(table);
        writeTableData(table, appointments);

        document.add(table);
        document.close();

        return out.toByteArray();
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);

        cell.setPhrase(new Phrase("ID", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Patient", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Doctor", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Date", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Time", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table, List<Appointment> appointments) {
        for (Appointment appt : appointments) {
            table.addCell(String.valueOf(appt.getId()));
            table.addCell(appt.getPatient() != null ? appt.getPatient().getName() : "N/A");
            table.addCell(appt.getDoctor() != null ? appt.getDoctor().getName() : "N/A");
            table.addCell(appt.getAppointmentDate().toString());
            table.addCell(appt.getSlotTime().toString());
        }
    }

    public byte[] generateCsv(List<Appointment> appointments) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(out))) {
            String[] header = { "ID", "Patient", "Doctor", "Date", "Time", "Status" };
            writer.writeNext(header);

            for (Appointment appt : appointments) {
                String[] data = {
                        String.valueOf(appt.getId()),
                        appt.getPatient() != null ? appt.getPatient().getName() : "N/A",
                        appt.getDoctor() != null ? appt.getDoctor().getName() : "N/A",
                        appt.getAppointmentDate().toString(),
                        appt.getSlotTime().toString(),
                        appt.getStatus()
                };
                writer.writeNext(data);
            }
        }
        return out.toByteArray();
    }
}
