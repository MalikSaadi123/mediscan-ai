from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("test_report.pdf", pagesize=letter)
c.drawString(100, 750, "BLOOD TEST REPORT")
c.drawString(100, 720, "Patient: Ibrar Saad")
c.drawString(100, 700, "Date: 2024-01-15")
c.drawString(100, 670, "COMPLETE BLOOD COUNT (CBC)")
c.drawString(100, 650, "Hemoglobin: 11.2 g/dL  (Normal: 13.5-17.5)")
c.drawString(100, 630, "WBC: 11.5 x10^3/uL  (Normal: 4.5-11.0)")
c.drawString(100, 610, "Platelets: 145 x10^3/uL  (Normal: 150-400)")
c.drawString(100, 590, "RBC: 4.2 x10^6/uL  (Normal: 4.5-5.5)")
c.drawString(100, 560, "METABOLIC PANEL")
c.drawString(100, 540, "Glucose: 126 mg/dL  (Normal: 70-100)")
c.drawString(100, 520, "Cholesterol: 210 mg/dL  (Normal: <200)")
c.drawString(100, 500, "Creatinine: 0.9 mg/dL  (Normal: 0.7-1.2)")
c.save()
print("test_report.pdf created!")