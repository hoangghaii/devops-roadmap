# 🚀 CI/CD Căn Bản - Hướng Dẫn Đầy Đủ

## Từ Lý Thuyết Đến Thành Thạo GitHub Actions

**Đối tượng:** Lập trình viên học DevOps và tự động hóa

**Bạn sẽ học được:**

- CI/CD là gì và tại sao quan trọng
- Sự khác biệt: Continuous Integration vs Continuous Deployment vs Continuous Delivery
- Các giai đoạn trong CI/CD pipeline
- So sánh các công cụ CI/CD phổ biến
- Kiến trúc GitHub Actions chi tiết
- Ví dụ thực tế và workflows

**Thời gian:** 3-4 giờ để đọc và hiểu

---

# Phần 1: Hiểu Về CI/CD

## 1.1 CI/CD Là Gì?

### Vấn Đề Trước Khi Có CI/CD

**Phát triển phần mềm truyền thống (cách cũ):**

```
Developer A viết code (2 tuần)
Developer B viết code (2 tuần)
Developer C viết code (2 tuần)
    ↓
Ngày Tích Hợp (Thứ 6): Gộp tất cả code lại
    ↓
💥 XUNG ĐỘT CODE Ở KHẮP NƠI!
💥 Code không chạy được với nhau
💥 Tests fail hàng loạt
💥 Cuối tuần hỏng vì phải debug
    ↓
Địa Ngục Tích Hợp 😱
```

**Điều gì sai:**

```
❌ Code được tích hợp hiếm (mỗi 2 tuần một lần)
❌ Không có automated testing
❌ Quy trình deploy thủ công
❌ Vòng phản hồi dài
❌ Rủi ro cao khi đưa lên production
❌ Releases căng thẳng
```

---

### Giải Pháp: CI/CD

**CI/CD = Tích Hợp Liên Tục / Triển Khai Liên Tục**

```
Developer viết code → Commit → Push
    ↓ (Tự động trong vài phút)
CI Server:
- Pull code mới nhất
- Build ứng dụng
- Chạy tests
- Kiểm tra chất lượng code
    ↓
Tests pass ✅
    ↓ (Tự động)
CD Server:
- Đóng gói ứng dụng
- Deploy lên môi trường
- Chạy smoke tests
- Thông báo team
    ↓
Code lên production 🚀

Tổng thời gian: 5-15 phút (không phải tuần!)
```

**Điều gì thay đổi:**

```
✅ Code được tích hợp liên tục (nhiều lần mỗi ngày)
✅ Testing tự động trên mỗi commit
✅ Pipeline deployment tự động
✅ Phản hồi nhanh (phút, không phải ngày)
✅ Rủi ro thấp hơn (thay đổi nhỏ)
✅ Tự tin hơn khi release
```

---

## 1.2 Continuous Integration (CI) - Tích Hợp Liên Tục

### Định Nghĩa

**Continuous Integration = Thực hành tự động build và test code mỗi khi thành viên team commit thay đổi lên version control**

### Cách CI Hoạt Động

```
Bước 1: Developer thực hiện thay đổi
git add feature.js
git commit -m "Thêm tính năng đăng nhập"
git push origin main

Bước 2: CI Server phát hiện thay đổi
- GitHub/GitLab/Bitbucket webhook kích hoạt
- CI server (Jenkins/GitHub Actions/CircleCI) bắt đầu

Bước 3: Build Stage
- Pull code mới nhất
- Cài dependencies
- Compile code (nếu cần)
- Tạo build artifact

Bước 4: Test Stage
- Chạy unit tests
- Chạy integration tests
- Kiểm tra code coverage
- Phân tích code tĩnh (linting)

Bước 5: Báo Cáo Kết Quả
✅ Tất cả tests pass → Build xanh
❌ Tests fail → Build đỏ, thông báo developer

Tổng thời gian: 2-10 phút
```

---

### Nguyên Tắc Cốt Lõi Của CI

**1. Commit Code Thường Xuyên**

```
Xấu:
- Commit mỗi tuần một lần
- Thay đổi lớn
- Rủi ro cao bị conflict

Tốt:
- Commit nhiều lần mỗi ngày
- Thay đổi nhỏ
- Dễ merge
- Dễ tìm bugs
```

**2. Build Tự Động**

```
Build thủ công:
Developer: "Này, bạn build code mới nhất giúp mình được không?"
Build engineer: "OK, cho mình 2 giờ"
Kết quả: Chậm, dễ lỗi

Build tự động:
git push → Build tự động bắt đầu → Xong trong 5 phút
```

**3. Testing Tự Động**

```
Testing thủ công:
QA: "Tôi sẽ test cái này vào ngày mai"
Developer: *chờ đợi lo lắng*
QA: "Tìm thấy 10 bugs"
Developer: "Nhưng nó chạy được trên máy tôi mà!" 😢

Testing tự động:
git push → Tests chạy → Test fail được xác định → Sửa ngay
Thời gian phản hồi: 5 phút (không phải 1 ngày)
```

**4. Mọi Người Commit Vào Mainline Hàng Ngày**

```
Xấu:
- Feature branches tồn tại hàng tuần
- Địa ngục merge khi tích hợp

Tốt:
- Merge vào main branch hàng ngày
- Thay đổi nhỏ, tăng dần
- Ít conflict hơn
```

**5. Mỗi Commit Kích Hoạt Một Build**

```
Không chỉ một số commits - MỌI commit!

Tại sao?
- Phát hiện bugs ngay lập tức
- Biết chính xác commit nào gây lỗi
- Rollback nhanh nếu cần
```

**6. Build Nhanh**

```
Mục tiêu thời gian build:
- Dưới 10 phút: ✅ Tuyệt vời
- 10-30 phút: 🟡 Chấp nhận được
- Trên 30 phút: 🔴 Quá chậm, cần tối ưu!

Tại sao phải nhanh?
- Developers chờ phản hồi
- Build chậm = commit ít hơn
- Build chậm = phát hiện bug chậm
```

**7. Test Trong Môi Trường Giống Production**

```
Môi trường test nên giống production:
- Cùng phiên bản OS
- Cùng dependencies
- Cùng cấu hình

Tránh:
"Nó chạy được trong test nhưng không chạy trong production"
```

**8. Mọi Người Có Thể Thấy Kết Quả Build**

```
Dashboard build hiển thị cho tất cả:
- Main branch: ✅ Tất cả tests pass
- Feature-x: ❌ 3 tests failing
- Feature-y: 🟡 Build đang chạy

Minh bạch = Trách nhiệm
```

---

### Lợi Ích Của CI

```
1. Phát Hiện Bugs Sớm
   Trước: Bugs tìm thấy trong production (đắt!)
   Sau: Bugs tìm thấy trong vài phút (rẻ!)

2. Giảm Rủi Ro Tích Hợp
   Trước: "Tuần tích hợp" đau đớn
   Sau: Tích hợp liên tục, không bất ngờ

3. Chất Lượng Code Tốt Hơn
   Trước: Không có kiểm tra tự động
   Sau: Linting, testing, coverage trên mỗi commit

4. Phát Triển Nhanh Hơn
   Trước: Chờ nhiều ngày để có phản hồi
   Sau: Phản hồi trong vài phút

5. Team Tự Tin Hơn
   Trước: "Hy vọng cái này không làm hỏng production"
   Sau: "Tests pass, chúng ta ổn!"

6. Tài Liệu Thông Qua Tests
   Tests = Tài liệu sống về cách code hoạt động

7. Giảm Công Việc Thủ Công
   Trước: Build và test thủ công
   Sau: Tự động, nhất quán, đáng tin cậy
```

---

## 1.3 Continuous Delivery vs Continuous Deployment

### Sự Khác Biệt Được Giải Thích

**Continuous Delivery (Phân Phối Liên Tục):**

```
Code → Build → Test → Package → [PHẢI DUYỆT THỦ CÔNG] → Deploy lên Production
                                        ↑
                                Con người click nút
```

**Continuous Deployment (Triển Khai Liên Tục):**

```
Code → Build → Test → Package → Tự Động Deploy lên Production
                                 ↑
                          Không cần con người can thiệp
```

---

### Continuous Delivery (CD)

**Định nghĩa:** Tự động chuẩn bị code để release, nhưng cần phê duyệt thủ công để deploy lên production

**Cách hoạt động:**

```
1. Developer push code
2. CI chạy (build + test)
3. Nếu tests pass:
   - Đóng gói ứng dụng
   - Deploy lên staging tự động
   - Chạy smoke tests
   - Sẵn sàng cho production
4. Team review staging
5. Product owner click nút "Deploy to Production"
6. Deployment tự động lên production
```

**Khi nào dùng:**

```
✅ Ngành có quy định (tài chính, y tế)
✅ Cần phê duyệt của con người để tuân thủ
✅ Business muốn kiểm soát thời điểm release
✅ Ứng dụng lớn, quan trọng
✅ Team chưa tự tin với automated testing
```

**Ví dụ workflow:**

```
Thứ Hai:
- 20 commits vào main
- Tất cả tự động deploy lên staging
- Product owner review staging
- Quyết định: "Chưa sẵn sàng, chờ tính năng X"

Thứ Sáu:
- Tính năng X hoàn thành
- Product owner: "Trông ổn!"
- Click "Deploy to Production"
- Go live

Deployments: Tự động lên staging, thủ công lên production
```

---

### Continuous Deployment (CD)

**Định nghĩa:** Tự động deploy mọi thay đổi qua tests lên production (không cần phê duyệt thủ công)

**Cách hoạt động:**

```
1. Developer push code
2. CI chạy (build + test)
3. Nếu tests pass:
   - Đóng gói ứng dụng
   - Deploy lên staging
   - Chạy smoke tests
   - Nếu smoke tests pass:
     → Tự động deploy lên production
     → Chạy production smoke tests
     → Monitor metrics
4. Code lên production trong 10 phút!

Không cần con người click!
```

**Khi nào dùng:**

```
✅ Văn hóa DevOps trưởng thành
✅ Automated testing toàn diện (tự tin cao)
✅ Thay đổi nhỏ, thường xuyên
✅ Web applications / SaaS
✅ Team thoải mái với deployments thường xuyên
✅ Có monitoring và khả năng rollback tốt
```

**Ví dụ workflow:**

```
10:00 AM: Developer commit sửa bug
10:05 AM: Tests pass, deploy lên staging
10:10 AM: Smoke tests pass, deploy lên production
10:15 AM: Production smoke tests pass ✅
10:15 AM: Monitoring không có vấn đề ✅

Developer quay lại viết code.
Không chờ đợi, không bước thủ công.
```

---

### Bảng So Sánh

| Khía Cạnh                | Continuous Delivery             | Continuous Deployment         |
| ------------------------ | ------------------------------- | ----------------------------- |
| **Tự Động Hóa**          | Một phần (deploy prod thủ công) | Hoàn toàn (mọi thứ tự động)   |
| **Production Deploy**    | Click nút thủ công              | Tự động                       |
| **Tần Suất Deploy**      | Theo nhu cầu (tuần/ngày)        | Mỗi commit (10-100x/ngày)     |
| **Rủi Ro**               | Thấp hơn (có review con người)  | Cần tin tưởng vào tự động hóa |
| **Tốc Độ**               | Hàng giờ đến ngày               | Vài phút                      |
| **Phù Hợp Nhất**         | Ngành có quy định               | Startup phát triển nhanh      |
| **Độ Trưởng Thành Team** | Trung cấp                       | Cao cấp                       |
| **Testing Yêu Cầu**      | Testing tốt                     | Testing xuất sắc              |

---

### So Sánh Trực Quan

```
Continuous Delivery:
┌──────┐   ┌──────┐   ┌──────┐   ┌─────────┐   ┌──────────┐
│ Code │ → │Build │ → │ Test │ → │ Staging │ → │   👤     │ → Production
└──────┘   └──────┘   └──────┘   └─────────┘   │ Phê Duyệt│
    ↑          ↑          ↑            ↑       └──────────┘
  Tự động   Tự động   Tự động     Tự động         Thủ công

Continuous Deployment:
┌──────┐   ┌──────┐   ┌──────┐   ┌─────────┐   ┌────────────┐
│ Code │ → │Build │ → │ Test │ → │ Staging │ → │ Production │
└──────┘   └──────┘   └──────┘   └─────────┘   └────────────┘
    ↑          ↑          ↑            ↑              ↑
  Tự động   Tự động   Tự động     Tự động        Tự động
```

---

### Ví Dụ Thực Tế

**Continuous Delivery: Ứng Dụng Ngân Hàng**

```
Công ty: Ngân hàng lớn
Tại sao Delivery (không phải Deployment):
- Tuân thủ quy định (cần phê duyệt)
- Ngành né rủi ro
- Kiểm toán yêu cầu ký duyệt thủ công

Workflow:
Thứ Hai-Năm:
- Developers commit code
- Tự động builds và deploys lên staging
- QA test trên staging
- Compliance review các thay đổi

Thứ Sáu 3 PM:
- Release manager review tất cả thay đổi
- Ký duyệt deployment
- Click "Deploy to Production"
- Deployment tự động diễn ra
- Team monitor trong 2 giờ

Kết quả:
- Releases hàng tuần
- Tự tin cao
- Duy trì tuân thủ quy định
```

**Continuous Deployment: Facebook**

```
Công ty: Facebook (Meta)
Tại sao Deployment:
- Công ty phát triển nhanh
- Cần deploy fixes ngay lập tức
- Hàng nghìn kỹ sư
- Testing toàn diện

Workflow:
Bất cứ lúc nào, bất cứ ngày nào:
- Kỹ sư commit code
- Tests chạy (10 phút)
- Nếu tests pass → Canary deployment (1% users)
- Nếu canary healthy → Tăng dần lên 100%
- Tổng thời gian: 30 phút từ commit đến production

Kết quả:
- 100+ deployments mỗi ngày
- Lặp lại nhanh
- Sửa bugs nhanh
- Lợi thế cạnh tranh
```

---

### Bạn Nên Dùng Cái Nào?

```
Bắt đầu với Continuous Delivery nếu:
☐ Mới làm quen với CI/CD
☐ Testing chưa toàn diện
☐ Team né rủi ro
☐ Ngành có quy định
☐ Ứng dụng lớn, phức tạp
☐ Releases không thường xuyên (tuần/tháng)

Tiến lên Continuous Deployment khi:
☐ Test coverage xuất sắc (>80%)
☐ Team tự tin với automated testing
☐ Có monitoring tốt
☐ Khả năng rollback nhanh
☐ Thay đổi nhỏ, thường xuyên
☐ Văn hóa DevOps trưởng thành
```

---

## 1.4 Lợi Ích Của CI/CD

### 1. Phản Hồi Nhanh Hơn

**Trước CI/CD:**

```
Developer viết code → Chờ 1 tuần → QA tìm bug
Vòng phản hồi: 7 ngày

Vấn đề:
- Developer quên context
- Đắt để sửa (code đã tiến xa)
- Làm chậm phát triển
```

**Với CI/CD:**

```
Developer viết code → Commit → Tests chạy → Bug tìm thấy
Vòng phản hồi: 5 phút

Lợi ích:
- Context còn tươi
- Nhanh để sửa
- Không block công việc khác
```

---

### 2. Phát Hiện Bugs Sớm

**Chi phí của bugs:**

```
Bug tìm thấy ở:
- Development (5 phút sau commit): 10.000đ để sửa
- QA (1 tuần sau): 100.000đ để sửa
- Staging (2 tuần sau): 1.000.000đ để sửa
- Production (1 tháng sau): 10.000.000đ để sửa

CI/CD bắt bugs ở giai đoạn development!
```

**Ví dụ:**

```
Không có CI/CD:
Tuần 1: Developer tạo bug
Tuần 2: Thêm code dựa trên code lỗi
Tuần 3: Thêm nhiều code phụ thuộc hơn
Tuần 4: QA tìm bug
Tuần 5: Cần refactor lớn để sửa
Chi phí: 1 tuần công việc

Với CI/CD:
Thứ Hai 10:00 AM: Developer tạo bug
Thứ Hai 10:05 AM: CI bắt bug
Thứ Hai 10:15 AM: Bug được sửa
Chi phí: 15 phút
```

---

### 3. Testing Tự Động

**Vấn đề testing thủ công:**

```
❌ Chậm (ngày đến tuần)
❌ Không nhất quán (lỗi con người)
❌ Đắt (thời gian QA)
❌ Nhàm chán (QA ghét tests lặp lại)
❌ Không thể test mọi thứ
```

**Lợi ích testing tự động:**

```
✅ Nhanh (vài phút)
✅ Nhất quán (giống nhau mỗi lần)
✅ Rẻ (chạy trên servers)
✅ Toàn diện (test mọi thứ)
✅ Chạy trên mỗi commit
```

**Coverage:**

```
Kim tự tháp test điển hình trong CI/CD:

        /\      5% - E2E Tests (chậm, đắt)
       /  \
      /────\    15% - Integration Tests (trung bình)
     /      \
    /────────\  80% - Unit Tests (nhanh, rẻ)
   /          \

Tất cả chạy tự động trên mỗi commit!
```

---

### 4. Deployments Nhất Quán

**Vấn đề deployment thủ công:**

```
Developer: "Nó chạy được trên máy tôi"
Operations: "Không chạy được trong production"

Tại sao?
- Các bước thủ công (dễ bỏ sót)
- Khác biệt môi trường
- Không có tài liệu
- Kiến thức chỉ trong đầu một người
```

**Lợi ích deployment tự động:**

```
✅ Các bước giống nhau mỗi lần
✅ Tài liệu hóa trong code (pipeline)
✅ Ai cũng có thể deploy
✅ Môi trường đồng nhất
✅ Lặp lại được và đáng tin cậy
```

**Ví dụ:**

```
Deployment thủ công (dễ lỗi):
1. SSH vào server (server nào nhỉ?)
2. Pull code (tôi dùng đúng branch chưa?)
3. Cài dependencies (ồ, quên bước này!)
4. Restart service (lệnh gì nhỉ?)
5. Kiểm tra logs (logs ở đâu nhỉ?)

Deployment tự động (đáng tin cậy):
git push → Mọi thứ tự động:
- Build
- Test
- Package
- Deploy
- Verify
- Thông báo team
```

---

### 5. Giảm Rủi Ro

**Releases lớn, không thường xuyên:**

```
Release mỗi 3 tháng:
- 1000 thay đổi
- Rủi ro cao
- Khó debug nếu có lỗi
- Thay đổi nào trong 1000 cái gây lỗi? 🤷

Nếu release fail:
- Rollback tất cả 1000 thay đổi
- Mất 3 tháng công việc
```

**Releases nhỏ, thường xuyên:**

```
Release mỗi giờ:
- 1-5 thay đổi
- Rủi ro thấp
- Dễ xác định vấn đề
- "Chắc là commit abc123 gây lỗi"

Nếu release fail:
- Rollback 1 commit
- Sửa trong 10 phút
- Thử lại
```

---

### 6. Tăng Năng Suất

**Ngày làm việc của developer không có CI/CD:**

```
9:00 AM - Viết code
11:00 AM - Build project thủ công
11:30 AM - Chạy tests thủ công
12:00 PM - Ăn trưa
1:00 PM - Sửa test failures
2:00 PM - Đóng gói app thủ công
3:00 PM - Email ops để deploy
5:00 PM - Vẫn đang chờ ops...

Code thực sự: 2 giờ
Chờ/công việc thủ công: 6 giờ
```

**Ngày làm việc của developer với CI/CD:**

```
9:00 AM - Viết code
11:00 AM - Commit code
11:05 AM - CI/CD pipeline hoàn thành ✅
11:05 AM - Tiếp tục viết code
12:00 PM - Ăn trưa
1:00 PM - Viết thêm code
3:00 PM - Commit code
3:05 PM - CI/CD pipeline hoàn thành ✅
3:05 PM - Tiếp tục viết code
5:00 PM - Xong! Nhiều features được ship!

Code thực sự: 6 giờ
Chờ/công việc thủ công: 0 giờ
```

---

### 7. Cộng Tác Tốt Hơn

**Không có CI/CD:**

```
Developer A: "Tôi hoàn thành feature X"
Developer B: "Tôi hoàn thành feature Y"
Tích hợp: "Hãy merge..."
💥 Conflicts!
💥 Không chạy được với nhau!
💥 Trò chơi đổ lỗi bắt đầu
```

**Với CI/CD:**

```
Developer A commits → Tests pass ✅
Developer B commits → Tests pass ✅
Không bất ngờ, phản hồi rõ ràng

Nếu có conflict:
- Phát hiện ngay lập tức
- Rõ ràng commit nào gây ra
- Sửa trước khi tiếp tục
```

---

### 8. Chất Lượng Được Cải Thiện

**Metrics chất lượng với CI/CD:**

```
Trước:
- Code coverage: 20%
- Bugs trong production: 50/tháng
- Deployments thất bại: 30%
- Thời gian sửa trung bình: 2 ngày

Sau 6 tháng CI/CD:
- Code coverage: 80%
- Bugs trong production: 5/tháng
- Deployments thất bại: 2%
- Thời gian sửa trung bình: 2 giờ

Chất lượng cải thiện đáng kể!
```

---

## 1.5 Các Giai Đoạn Trong CI/CD Pipeline

### Pipeline Chuẩn

```
Source → Build → Test → Deploy

Mỗi giai đoạn phải pass trước khi chuyển sang giai đoạn tiếp theo
```

### Chi Tiết Các Giai Đoạn Pipeline

```
┌──────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                        │
└──────────────────────────────────────────────────────────┘

Giai Đoạn 1: SOURCE (Trigger)
├─ Git commit
├─ Pull request
├─ Scheduled trigger
└─ Manual trigger

Giai Đoạn 2: BUILD
├─ Checkout code
├─ Cài dependencies
├─ Compile code (nếu cần)
├─ Bundle assets
└─ Tạo build artifact

Giai Đoạn 3: TEST
├─ Unit tests (nhanh, tách biệt)
├─ Integration tests (components hoạt động cùng nhau)
├─ Code quality (linting, formatting)
├─ Security scan (lỗ hổng dependencies)
└─ Code coverage (mục tiêu >80%)

Giai Đoạn 4: PACKAGE
├─ Tạo Docker image (hoặc zip, jar, v.v.)
├─ Tag với version
├─ Push lên registry
└─ Tạo release notes

Giai Đoạn 5: DEPLOY (Staging)
├─ Deploy lên môi trường staging
├─ Chạy smoke tests
├─ Chạy E2E tests
└─ Xác minh deployment

Giai Đoạn 6: APPROVE (Tùy chọn - Continuous Delivery)
├─ Review thủ công
├─ Phê duyệt business
└─ Click nút deploy

Giai Đoạn 7: DEPLOY (Production)
├─ Deploy lên production
├─ Chạy production smoke tests
├─ Monitor metrics
└─ Thông báo team

Giai Đoạn 8: POST-DEPLOY
├─ Chạy verification tests
├─ Kiểm tra error rates
├─ Monitor performance
└─ Cảnh báo nếu có bất thường
```

---

### Giai Đoạn 1: Source (Trigger)

**Điều gì kích hoạt pipeline:**

```
Trigger Type 1: Push lên branch
git push origin main
→ Pipeline bắt đầu

Trigger Type 2: Pull Request
Tạo PR → Pipeline chạy trên PR branch
Ngăn merge code bị lỗi

Trigger Type 3: Schedule
Cron: "0 2 * * *" (chạy lúc 2 AM hàng ngày)
Dùng cho: nightly builds, integration tests

Trigger Type 4: Manual
Developer click "Run workflow"
Dùng cho: deployments, migrations
```

**Ví dụ:**

```yaml
# Ví dụ GitHub Actions triggers
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch: # Trigger thủ công
```

---

### Giai Đoạn 2: Build

**Điều gì xảy ra:**

```
1. Checkout Code
   git clone repository
   git checkout specific-commit

2. Setup Environment
   Cài Node.js 20
   Cài Python 3.11
   Cài system dependencies

3. Cài Dependencies
   npm install
   pip install -r requirements.txt

4. Compile (nếu cần)
   TypeScript → JavaScript
   SASS → CSS
   Java → .class files

5. Bundle
   Webpack bundles
   Minify JavaScript
   Tối ưu images

6. Tạo Artifact
   thư mục dist/
   build.zip
   app.jar
```

**Ví dụ build step:**

```bash
# Node.js build
npm install        # Cài dependencies
npm run build      # Build application
npm run bundle     # Tạo production bundle

# Output: thư mục dist/ sẵn sàng để deploy
```

---

### Giai Đoạn 3: Test

**Kim tự tháp test:**

```
      ╱╲      E2E Tests (5%)
     ╱──╲     - Chậm (vài phút)
    ╱────╲    - Đắt để maintain
   ╱──────╲   - Test toàn bộ user flows
  ╱────────╲
 ╱──────────╲ Integration Tests (15%)
╱────────────╲- Tốc độ trung bình (giây)
──────────────- Test tương tác components

Unit Tests (80%)
- Nhanh (milliseconds)
- Test các functions riêng lẻ
- Dễ maintain
```

**Điều gì được test:**

```
Unit Tests:
✅ Các functions riêng lẻ hoạt động đúng
✅ Các trường hợp biên được xử lý
✅ Error handling hoạt động

Integration Tests:
✅ Database connections hoạt động
✅ API endpoints trả về data đúng
✅ Services giao tiếp đúng

Code Quality:
✅ Linting (ESLint, Pylint)
✅ Formatting (Prettier, Black)
✅ Code coverage (>80%)

Security:
✅ Lỗ hổng dependencies
✅ Vấn đề bảo mật code
✅ Tuân thủ license
```

---

### Giai Đoạn 4: Package

**Tạo artifact có thể deploy:**

```
Source code → Build artifact → Package → Sẵn sàng deploy

Định dạng packaging:
- Docker image (phổ biến nhất)
- Zip file (serverless)
- JAR file (Java)
- Binary (Go, Rust)
- NPM package (thư viện Node.js)
```

**Ví dụ Docker:**

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY dist/ .
EXPOSE 3000
CMD ["node", "server.js"]

# Build
docker build -t myapp:v1.2.3 .

# Tag
docker tag myapp:v1.2.3 myapp:latest

# Push lên registry
docker push myregistry.com/myapp:v1.2.3
```

---

### Giai Đoạn 5: Deploy (Staging)

**Staging deployment:**

```
Mục đích: Testing cuối trước production

1. Deploy lên môi trường staging
   - Dùng phương thức deploy giống production
   - Cấu hình giống hệt

2. Chạy smoke tests
   - Kiểm tra health endpoint
   - Xác minh các đường dẫn quan trọng hoạt động

3. Chạy E2E tests
   - User login flow
   - Purchase flow
   - Chức năng tìm kiếm

4. Manual testing (tùy chọn)
   - QA team xác minh
   - Product owner review
```

---

### Giai Đoạn 6: Approval (Continuous Delivery)

**Cổng thủ công trước production:**

```
Ai phê duyệt:
- Product Owner
- Tech Lead
- Release Manager

Họ kiểm tra gì:
- Staging trông ổn
- Không có bugs nghiêm trọng
- Thời điểm business phù hợp
- Tất cả stakeholders sẵn sàng

Phương thức phê duyệt:
- Click nút trong CI/CD tool
- Comment trên PR: "/deploy"
- Slack approval workflow
```

---

### Giai Đoạn 7: Deploy (Production)

**Production deployment:**

```
Chiến lược deployment:

Chiến lược 1: Rolling
- Cập nhật từng instance một
- Zero downtime
- Rollout dần dần

Chiến lược 2: Blue-Green
- Chuyển tất cả traffic cùng lúc
- Rollback tức thì
- Cần gấp đôi infrastructure

Chiến lược 3: Canary
- Deploy cho 5% users trước
- Monitor metrics
- Tăng dần lên 100%

Tất cả nên tự động!
```

---

### Giai Đoạn 8: Post-Deploy

**Xác minh và monitoring:**

```
Kiểm tra tự động:
1. Health checks pass
   GET /health → 200 OK

2. Smoke tests pass
   - User có thể đăng nhập
   - Homepage load được
   - API phản hồi

3. Metrics bình thường
   - Error rate <1%
   - Response time <200ms
   - CPU <70%

4. Alerts được cấu hình
   - Slack notification gửi
   - Team biết về deployment
   - On-call engineer sẵn sàng

Kiểm tra thủ công (giờ đầu):
- Monitor error logs
- Xem metrics dashboard
- Kiểm tra user reports
- Sẵn sàng rollback nếu cần
```

---

## 1.6 Các Công Cụ CI/CD Phổ Biến

### Bảng So Sánh

| Công Cụ              | Phù Hợp Nhất              | Giá                           | Hosting     | Độ Khó     |
| -------------------- | ------------------------- | ----------------------------- | ----------- | ---------- |
| **GitHub Actions**   | Người dùng GitHub         | Free tier, trả theo dùng      | Cloud       | Dễ         |
| **GitLab CI**        | Người dùng GitLab         | Free tier, tùy chọn self-host | Cloud/Self  | Trung bình |
| **Jenkins**          | Hệ thống legacy, tùy biến | Free (mã nguồn mở)            | Self-hosted | Khó        |
| **CircleCI**         | Dự án dựa trên Docker     | Free tier                     | Cloud       | Trung bình |
| **Travis CI**        | Dự án mã nguồn mở         | Free cho OSS                  | Cloud       | Dễ         |
| **Azure Pipelines**  | Microsoft stack           | Free tier                     | Cloud       | Trung bình |
| **AWS CodePipeline** | AWS infrastructure        | Trả theo pipeline             | Cloud       | Trung bình |

---

### GitHub Actions (Khuyến Nghị Cho Người Mới)

**Ưu điểm:**

```
✅ Tích hợp với GitHub
✅ Free cho public repos
✅ 2,000 phút miễn phí/tháng (private repos)
✅ Marketplace actions lớn
✅ Cú pháp YAML dễ
✅ Tài liệu tuyệt vời
✅ Matrix builds (test nhiều versions)
```

**Nhược điểm:**

```
❌ Chỉ cho GitHub repositories
❌ Giới hạn 6 giờ mỗi job
❌ Có thể đắt ở quy mô lớn
```

**Khi nào dùng:**

```
✅ Code của bạn trên GitHub
✅ Đang học CI/CD
✅ Dự án nhỏ đến trung bình
✅ Dự án mã nguồn mở
```

---

### GitLab CI

**Ưu điểm:**

```
✅ Tích hợp với GitLab
✅ Private projects không giới hạn (free tier)
✅ Docker registry tích hợp
✅ Security scanning tích hợp
✅ Có thể self-host (miễn phí!)
✅ Auto DevOps feature
```

**Nhược điểm:**

```
❌ Chỉ cho GitLab repositories
❌ Self-hosting cần bảo trì
❌ Cộng đồng nhỏ hơn GitHub
```

**Khi nào dùng:**

```
✅ Code của bạn trên GitLab
✅ Muốn tùy chọn self-hosted
✅ Cần tính năng security tích hợp
✅ Yêu cầu enterprise
```

---

### Jenkins

**Ưu điểm:**

```
✅ Trưởng thành nhất (15+ năm)
✅ Hệ sinh thái plugin khổng lồ (1,800+ plugins)
✅ Hoàn toàn miễn phí
✅ Kiểm soát hoàn toàn (self-hosted)
✅ Có thể tích hợp với bất cứ thứ gì
```

**Nhược điểm:**

```
❌ Độ dốc học tập cao
❌ Cần bảo trì server
❌ UI cảm giác lỗi thời
❌ Cấu hình có thể phức tạp
```

**Khi nào dùng:**

```
✅ Cần tính linh hoạt tối đa
✅ Workflows phức tạp, tùy biến
✅ Đã có Jenkins
✅ Yêu cầu on-premise
```

---

### CircleCI

**Ưu điểm:**

```
✅ Thời gian build nhanh
✅ Hỗ trợ Docker tuyệt vời
✅ SSH vào build để debug
✅ Orbs (gói config tái sử dụng)
✅ Dễ song song hóa
```

**Nhược điểm:**

```
❌ Free tier giới hạn (6,000 phút/tháng)
❌ Cấu hình có thể dài dòng
❌ Ít tích hợp hơn GitHub Actions
```

**Khi nào dùng:**

```
✅ Workflows Docker-heavy
✅ Cần builds nhanh
✅ Yêu cầu testing phức tạp
```

---

### Bạn Nên Chọn Công Cụ Nào?

```
Cây quyết định:

Code trên GitHub?
└─ Có → GitHub Actions ✅

Code trên GitLab?
└─ Có → GitLab CI ✅

Cần self-hosted?
├─ Kiểm soát tối đa → Jenkins
└─ Dễ sử dụng → GitLab CI (self-hosted)

Dự án tập trung Docker?
└─ CircleCI

Đã dùng AWS?
└─ AWS CodePipeline

Học CI/CD lần đầu?
└─ GitHub Actions (dễ nhất) ✅
```

---

# Phần 2: Kiến Trúc GitHub Actions

## 2.1 Tổng Quan GitHub Actions

### GitHub Actions Là Gì?

**GitHub Actions = Nền tảng CI/CD tích hợp vào GitHub**

```
Tính năng:
✅ Tự động hóa workflows
✅ CI/CD pipelines
✅ Lên lịch tasks
✅ Phản hồi GitHub events
✅ Actions tái sử dụng
✅ Matrix builds
✅ Self-hosted runners
```

### Cách Hoạt Động

```
1. Bạn định nghĩa workflows (file YAML)
   .github/workflows/ci.yml

2. GitHub theo dõi triggers
   - Push lên branch
   - Pull request
   - Schedule
   - v.v.

3. Khi được kích hoạt, GitHub Actions:
   - Khởi động runner (Ubuntu/Windows/MacOS)
   - Checks out code của bạn
   - Chạy jobs của bạn
   - Báo cáo kết quả

4. Bạn thấy kết quả trong:
   - GitHub UI
   - Email notifications
   - Status checks trên PRs
```

---

## 2.2 Các Khái Niệm Cốt Lõi

### 1. Workflows

**Định nghĩa:** Quy trình tự động được định nghĩa trong file YAML

**Vị trí:** `.github/workflows/*.yml`

**Cấu trúc:**

```yaml
name: CI Pipeline # Tên workflow
on: [push, pull_request] # Triggers
jobs: # Jobs để chạy
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

**Điểm chính:**

```
✅ Một repository có thể có nhiều workflows
✅ Mỗi workflow độc lập
✅ Workflows có thể gọi workflows khác
✅ Lưu trong version control
✅ Có thể disable/enable theo branch
```

**Ví dụ workflows:**

```
.github/workflows/
├── ci.yml              # Chạy tests trên mỗi PR
├── deploy-staging.yml  # Deploy lên staging (push to develop)
├── deploy-prod.yml     # Deploy lên production (manual)
├── nightly.yml         # Chạy integration tests (schedule)
└── release.yml         # Tạo release (tag)
```

---

### 2. Jobs

**Định nghĩa:** Tập hợp các steps thực thi trên cùng một runner

**Đặc điểm:**

```
- Chạy song song mặc định
- Có thể phụ thuộc vào jobs khác
- Mỗi job chạy trên runner mới
- Có thể chạy trên OS khác nhau
```

**Ví dụ:**

```yaml
jobs:
  # Job 1: Build
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  # Job 2: Test (phụ thuộc vào build)
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  # Job 3: Lint (chạy song song với test)
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
```

**Phụ thuộc jobs:**

```
Tình huống 1: Không phụ thuộc (song song)
build    test    lint
  ↓       ↓       ↓
(Tất cả chạy cùng lúc)

Tình huống 2: Có phụ thuộc (tuần tự)
build
  ↓
test ← (chờ build)
  ↓
deploy ← (chờ test)
```

---

### 3. Steps

**Định nghĩa:** Task riêng lẻ trong một job

**Các loại:**

```
Loại 1: Chạy command
- run: npm install

Loại 2: Dùng action
- uses: actions/checkout@v4

Loại 3: Chạy script
- run: |
    echo "Multi-line"
    echo "Script"
```

**Ví dụ:**

```yaml
steps:
  # Step 1: Checkout code
  - name: Checkout repository
    uses: actions/checkout@v4

  # Step 2: Setup Node.js
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'

  # Step 3: Cài dependencies
  - name: Cài dependencies
    run: npm install

  # Step 4: Chạy tests
  - name: Chạy tests
    run: npm test
```

---

### 4. Runners

**Định nghĩa:** Server chạy workflows của bạn

**Các loại:**

**GitHub-hosted runners:**

```
Do GitHub cung cấp miễn phí:
✅ ubuntu-latest (Ubuntu 22.04)
✅ windows-latest (Windows Server 2022)
✅ macos-latest (macOS 12)

Thông số:
- 2 vCPU
- 7 GB RAM
- 14 GB SSD

Free tier:
- Public repos: không giới hạn
- Private repos: 2,000 phút/tháng
```

**Self-hosted runners:**

```
Servers của bạn:
✅ Kiểm soát hoàn toàn
✅ Phần mềm tùy biến
✅ Phút không giới hạn
✅ Truy cập tài nguyên riêng tư

Setup:
1. Vào Settings → Actions → Runners
2. Click "New self-hosted runner"
3. Làm theo hướng dẫn cài đặt trên server
```

**Chọn runner:**

```yaml
jobs:
  build:
    # GitHub-hosted
    runs-on: ubuntu-latest

  build-windows:
    # GitHub-hosted Windows
    runs-on: windows-latest

  build-custom:
    # Self-hosted
    runs-on: self-hosted
```

---

### 5. Actions

**Định nghĩa:** Đơn vị code tái sử dụng (như functions)

**Các loại:**

**JavaScript actions:**

```javascript
// Chạy trực tiếp trên runner
// Nhanh
// Dùng: actions viết bằng Node.js
```

**Docker actions:**

```dockerfile
# Chạy trong Docker container
# Môi trường cô lập
# Dùng: bất kỳ ngôn ngữ nào
```

**Composite actions:**

```yaml
# Kết hợp nhiều steps
# Workflows tái sử dụng
```

**Tìm actions:**

```
GitHub Marketplace:
https://github.com/marketplace?type=actions

Actions phổ biến:
- actions/checkout@v4        (checkout code)
- actions/setup-node@v4      (cài Node.js)
- actions/upload-artifact@v4 (lưu files)
- docker/build-push-action@v5 (build Docker)
```

**Sử dụng actions:**

```yaml
steps:
  # Dùng action từ marketplace
  - uses: actions/checkout@v4

  # Dùng action với parameters
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'

  # Dùng action từ cùng repo
  - uses: ./.github/actions/my-custom-action

  # Dùng action từ repo khác
  - uses: username/repo-name@main
```

---

### 6. Triggers (Events)

**Định nghĩa:** Events bắt đầu workflows

**Triggers phổ biến:**

```yaml
# Trigger khi push lên branches cụ thể
on:
  push:
    branches: [main, develop]

# Trigger khi pull request
on:
  pull_request:
    branches: [main]

# Trigger theo lịch (cron)
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM hàng ngày

# Trigger thủ công
on:
  workflow_dispatch:

# Trigger khi release
on:
  release:
    types: [published]

# Nhiều triggers
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

**Event filters:**

```yaml
# Chỉ trên paths cụ thể
on:
  push:
    paths:
      - 'src/**'        # Chỉ khi src/ files thay đổi
      - '!docs/**'      # Bỏ qua docs/ changes

# Chỉ trên branches cụ thể
on:
  push:
    branches:
      - main
      - 'release/**'    # Tất cả release branches

# Chỉ trên tags
on:
  push:
    tags:
      - 'v*'            # v1.0.0, v2.1.3, v.v.
```

---

## 2.3 Ví Dụ Workflow Hoàn Chỉnh

### CI Workflow Đơn Giản

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

# Trigger khi push và pull request vào main
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Jobs để chạy
jobs:
  # Job 1: Build và Test
  build-and-test:
    name: Build và Test
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout code
      - name: Checkout repository
        uses: actions/checkout@v4

      # Step 2: Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # Step 3: Cài dependencies
      - name: Cài dependencies
        run: npm ci

      # Step 4: Chạy linter
      - name: Lint code
        run: npm run lint

      # Step 5: Chạy tests
      - name: Chạy tests
        run: npm test

      # Step 6: Build application
      - name: Build application
        run: npm run build

      # Step 7: Upload build artifact
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/
```

---

## 2.4 Khái Niệm Nâng Cao

### Matrix Builds

**Test trên nhiều versions:**

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test

# Tạo 9 jobs:
# ubuntu + node 18, ubuntu + node 20, ubuntu + node 22
# windows + node 18, windows + node 20, windows + node 22
# macos + node 18, macos + node 20, macos + node 22
```

---

### Environment Variables

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NODE_ENV: production
      API_URL: https://api.example.com

    steps:
      - run: echo "Environment là $NODE_ENV"
      - run: echo "API URL là $API_URL"
```

---

### Secrets

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy lên server
        env:
          SSH_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          API_TOKEN: ${{ secrets.API_TOKEN }}
        run: |
          echo "$SSH_KEY" > key.pem
          chmod 600 key.pem
          ssh -i key.pem user@server 'deploy.sh'
```

---

### Thực Thi Có Điều Kiện

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    # Chỉ chạy trên main branch
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy
        # Chỉ chạy nếu tests passed
        if: success()
        run: deploy.sh

      - name: Rollback
        # Chỉ chạy nếu deploy failed
        if: failure()
        run: rollback.sh
```

---

## 2.5 Best Practices

```
✅ Giữ workflows nhanh (<10 phút)
✅ Dùng caching (dependencies, build artifacts)
✅ Fail fast (dừng khi có lỗi đầu tiên)
✅ Dùng matrix cho nhiều versions
✅ Tách workflows CI và CD
✅ Dùng environment protection rules
✅ Giữ secrets trong GitHub Secrets
✅ Dùng tên mô tả
✅ Tài liệu hóa workflows phức tạp
✅ Version pin actions (dùng @v4, không phải @main)
```

---

# Tóm Tắt

## Điểm Chính

```
1. CI/CD tự động hóa building, testing, và deploying code

2. Continuous Integration:
   - Merge code thường xuyên
   - Testing tự động
   - Phản hồi nhanh

3. Continuous Delivery vs Deployment:
   - Delivery: Phê duyệt thủ công cho production
   - Deployment: Hoàn toàn tự động lên production

4. Lợi ích:
   - Phản hồi nhanh hơn (phút vs ngày)
   - Phát hiện bugs sớm (rẻ để sửa)
   - Testing tự động (nhất quán)
   - Giảm rủi ro (thay đổi nhỏ)
   - Tăng năng suất

5. Pipeline stages:
   Source → Build → Test → Deploy

6. GitHub Actions:
   - Workflows (file YAML)
   - Jobs (song song mặc định)
   - Steps (tasks riêng lẻ)
   - Runners (servers)
   - Actions (code tái sử dụng)
   - Triggers (events)

7. Bắt đầu đơn giản, lặp lại:
   - Bắt đầu với CI cơ bản
   - Thêm tests dần dần
   - Tự động hóa deployment
   - Tối ưu theo thời gian
```

---

# Các Bước Tiếp Theo

```
1. ✅ Đọc guide này
2. ⏭️ Thực hành: Tạo GitHub Actions workflow đầu tiên
3. ⏭️ Học: Cú pháp GitHub Actions chi tiết
4. ⏭️ Build: Pipeline CI/CD hoàn chỉnh
5. ⏭️ Deploy: Tự động hóa deployment lên server
```

---

**Chúc mừng!** Bạn giờ hiểu về CI/CD fundamentals rồi! 🎉

**Sẵn sàng build pipeline đầu tiên?** 🚀
