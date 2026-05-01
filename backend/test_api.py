import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjllZjg4YWMyMWU5NGEzM2U2MWFiOGZlIiwiZXhwIjoxNzc3OTkxODU3fQ.DOu_nxRs6kwiQXGJGBK8ocGSW3i22L-zUjRfjdEK0qM"

with open("test_report.pdf", "rb") as f:
    response = requests.post(
        "http://localhost:8000/analyze",
        headers={"authorization": f"Bearer {token}"},
        files={"file": ("test_report.pdf", f, "application/pdf")}
    )

print("Status:", response.status_code)
print("Response:", response.text)