# Bản thiết kế chi tiết ứng dụng web: Random tiết kiệm hàng ngày

## 1. Mục tiêu ứng dụng

Xây dựng một ứng dụng web cho phép người dùng:

- Quay ngẫu nhiên ra một ngày hợp lệ trong năm từ 1 đến 365 hoặc 1 đến 366 tùy năm nhuận
- Có thể chọn các ngày trong quá khứ để quay số
- Không thể quay các ngày trong tương lai
- Mỗi ngày trong năm chỉ được quay một lần
- Nếu một ngày đã được quay trước đó thì không được quay lại
- Lưu lịch sử kết quả quay và hiển thị danh sách các ngày đã quay

## 2. Phạm vi chức năng

### 2.1. Chức năng chính

#### 2.1.1 Chọn năm

- Người dùng chọn một năm bất kỳ
- Hệ thống xác định năm đó có:
  - 365 ngày nếu là năm thường
  - 366 ngày nếu là năm nhuận

#### 2.1.2 Quay số ngẫu nhiên

- Khi bấm nút Quay số
- Hệ thống chọn ngẫu nhiên một ngày trong khoảng hợp lệ (1-365/366)

#### 2.1.3 Ràng buộc ngày hợp lệ

- Với năm trong quá khứ: Không được quay
- Với năm hiện tại: chỉ được chọn ngày 01/01 đến ngày hiện tại để quay số
- Với ngày tương lai: không cho phép quay

#### 2.1.4 Không quay trùng

- Một ngày đã quay rồi sẽ bị loại khỏi tập ngày có thể quay

#### 2.1.5 Lưu kết quả

- Kết quả quay được lưu lại để:
  - hiển thị danh sách
  - chống quay trùng
  - khôi phục khi tải lại trang

#### 2.1.6 Hiển thị danh sách ngày đã quay

- Hiển thị:
  - Ngày quay số
  - Số đã quay được tương ứng

## 3. Quy tắc nghiệp vụ

### 3.1. Xác định năm nhuận

Một năm là năm nhuận nếu:

- chia hết cho 400, hoặc
- chia hết cho 4 nhưng không chia hết cho 100

Ví dụ:

- 2024 → nhuận → 366 ngày
- 2025 → không nhuận → 365 ngày

### 3.2. Xác định ngày hợp lệ để quay

<b>Trường hợp 1: Năm nhỏ hơn năm hiện tại</b>

- Không được quay

<b>Trường hợp 2: Năm bằng năm hiện tại</b>

- Chỉ được quay từ ngày 01/01 đến ngày hiện tại trong năm
- Ví dụ hôm nay là ngày 31/03 của năm, chỉ được quay từ ngày 01/01 đến ngày 31/03

<b>Trường hợp 3: Là ngày tương lai</b>

- Không được quay
- Nút quay bị vô hiệu hóa

### 3.3. Quy tắc không quay trùng

- Mỗi ngày trong năm chỉ được phép xuất hiện một lần
- Khi một ngày đã được quay:
  - thêm vào danh sách kết quả
  - Số đã quay được bị loại khỏi danh sách ứng viên quay tiếp theo
- Nếu toàn bộ các ngày hợp lệ đã quay hết:
  - vô hiệu hóa nút quay
  - hiển thị thông báo: Đã quay số toàn bộ ngày trong năm
- Ví dụ: ngày 02/25 đã quay được số 265, thì những ngày khác không được quay ra số 265 nữa.

## 4. Đối tượng dữ liệu

### 4.1. Thông tin năm

```json
{
  "year": 2025,
  "maxNumber": 365
}
```

<b>Ý nghĩa</b>

- `year`: năm đang chọn
- `maxNumber`: số lớn nhất có thể quay

### 4.2. Kết quả một lần quay

```json
{
  "id": "uuid",
  "year": 2025,
  "number": 127,
  "drawnAt": "2026-03-11T09:30:00.000Z"
}
```

<b>Ý nghĩa</b>

- `id`: mã định danh duy nhất
- `year`: năm áp dụng
- `number`: số đã quay được
- `drawnAt`: thời điểm quay

### 4.3. Dữ liệu lịch sử theo năm

```json
{
  "2024": [
    {
      "id": "a1",
      "year": 2024,
      "number": 12,
      "drawnAt": "2026-03-11T08:00:00.000Z"
    },
    {
      "id": "a2",
      "year": 2024,
      "number": 300,
      "drawnAt": "2026-03-11T08:05:00.000Z"
    }
  ],
  "2025": [
    {
      "id": "b1",
      "year": 2025,
      "number": 25,
      "drawnAt": "2026-03-11T09:00:00.000Z"
    }
  ]
}
```

## 5. Thiết kế giao diện

### 5.1. Bố cục chính

Ứng dụng gồm các khu vực:

1. Tiêu đề ứng dụng
2. Khu chọn ngày quay số
3. Khu hiển thị trạng thái
4. Khu quay số
5. Khu danh sách lịch sử

### 5.2. Thành phần giao diện

#### A. Header

- Tên ứng dụng: Random tiết kiệm hàng ngày

#### B. Khu chọn ngày

- hiển thị khởi tạo là ngày hiện tại
- Input ngày hoặc chọn ngày từ datepicker

#### C. Khu thống kê

Hiển thị:

- Tổng kết quả đã quay được trong năm hiện tại, sau đó nhân với 1000.
- Hiển thị định dạng kiểu tiền tệ VND.

Ví dụ:

- Tổng tiền đã tích lũy: 1,200,000 VND

#### D. Khu quay số

- Nút chính: Quay số
- Khu hiển thị kết quả mới nhất:
  - số vừa quay được

Tùy chọn UX:

- hiệu ứng chạy số trước khi dừng
- hiệu ứng nổi bật kết quả cuối cùng

#### E. Khu lịch sử

Hiển thị danh sách, theo phân trang 10 record/page:

- STT
- Thời điểm quay
- Số đã quay
- sắp xếp giảm dần theo ngày quay số

## 6. Các trạng thái giao diện

## 7. Luồng hoạt động

### Luồng chính

1. Người dùng mở ứng dụng
2. Hệ thống mặc định chọn ngày hiện tại
3. Hệ thống xác định:

- năm nhuận hay không
- số tối đa có thể quay

4. Hệ thống tải lịch sử quay của năm đó
5. Người dùng bấm Quay số
6. Hệ thống:

- tạo tập các số hợp lệ từ 1 đến 365/366
- loại bỏ các số đã quay
- chọn ngẫu nhiên 1 số còn lại
- lưu kết quả
- cập nhật danh sách hiển thị

7. Nếu hết số:

- khóa nút quay
- hiện thông báo hết số

## 8. Công nghệ sử dụng

- Next.js
- TailwindCss
