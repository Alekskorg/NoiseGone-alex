# NoiseGone API Specification

## 1. Разделение аудио (/api/separate)
- **Method:** `POST`
- **Body:** `multipart/form-data` с полем `file`.
- **Response (200 OK):**
  ```json
  {
    "vocalUrl": "...",
    "instrumentalUrl": "..."
  }
