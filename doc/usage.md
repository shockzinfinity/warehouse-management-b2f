# Warehouse Management 사용법

> 본 서비스는 지하2층 화장품 샘플 창고 관리를 위해 개발되었습니다.
> 기능 추가 및 버그사항은 아래의 게시판을 이용하시기 바랍니다.
> [Feedback](https://warehouse-management-b2f.firebaseapp.com/board/feedback)

---

<br/>

### 개요

현재 서비스되고 있는 **https://warehouse-management-b2f.firebaseapp.com** 은 테스트용 사이트 이며, 실제 운용 환경에서는 용량 제한 및 성능 이슈로 인하여 사용하기 부적절 합니다. 서버 설정이 필요하므로 별도로 문의하시기 바랍니다. ([shockzinfinity@gmail.com](mailto://shockzinfinity@gmail.com))

---

<br/>

### 사이트 운영에 관한 일반사항

> 사이트 설정을 위하여 별도의 구글 Firebase 설정이 필요합니다. 특히 내부 기능 중 핵심적인 부분이 Free 요금제인 **Spark** 요금제에서는 동작되지 않으므로, **Blaze** 요금제가 필요합니다.  
> 이를 위해서는 신용카드 등록절차가 필요합니다. 즉, 사이트 설정을 위하여 등록절차가 필요하므로 별도로 문의해주시기 바랍니다.

> MS IE 11을 제외한 대부분의 브라우저에서 (모바일 포함) 테스트 되었으나, 크롬 및 Edge 에서 최적으로 보여집니다.

---

<br/>

### 관리 범위

- 랙 (Rack)
  : 하위에 박스를 포함하는 개념
- 박스 (Box)
  : 하위에 샘플을 포함하는 개념
- 샘플 (Sample)
  : 샘플 관리 최소 기본 단위

> 2020년 8월 3일 기준으로 Box 및 Sample 등의 이동 기능은 지원하지 않고 있습니다. 추후 개발 예정입니다.  
> 모든 항목(rack, box, sample)은 등록 시점에서 QR code 가 생성됩니다.  
> TODO: QR code specification 첨부

---

<br/>

### 로그인 및 메뉴

- 로그인
  - **우측 상단**의 로그인 아이콘으로 로그인 하시기 바랍니다.  
    <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F01.loginIcon.png?alt=media&token=34c85fe9-b4d5-44e3-95c1-3d855693a14c" width="30px" />
  - 구글 (Google) 계정만 허용됩니다.  
    <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F02.login.png?alt=media&token=83eab161-8d7d-45d0-9e4b-4201c3d08ed8" width="180px" />
- 권한
  - **전체 사이트 설정 기능은 별도 문의하시기 바랍니다.**
  - 랙 (Rack) 생성/정보수정/제거 는 관리자만 허용됩니다.
  - 박스, 샘플 추가/수정/삭제는 일반 권한에 허용됩니다.
- 사이드 메뉴에 랙 (Rack) 및 박스 (Box) 등록방법  
  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F03.menuEdit.png?alt=media&token=1bfec7ff-8d40-4dca-ad0c-86eeead1ec5f" width="300px" />
- 가급적 수정 완료 후에는 수정모드를 **해제**하시기 바랍니다.
- Step  
  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F04.sideMenuMode.png?alt=media&token=6f8858cb-93d6-4692-bb79-e95b3cba7e44" width="300px" />  
  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F05.sideMenuAdd.png?alt=media&token=f8c0fccc-9a8b-47f1-a230-651755c3f868" width="300px" />  
  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F06.mainMenuItem.png?alt=media&token=785cd765-e818-45ad-963a-13162d5d9549" width="300px" />  
  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F07.subMenuItem.png?alt=media&token=956d2df5-7f27-411d-9c9a-561ebe5ea7d2" width="300px" />
- **등록 시 주의사항**
  1. 상위 메뉴의 **아이콘**은 [링크](http://materialdesignicons.com/cdn/2.0.46/)를 참고하시기 바랍니다. (기본 아이콘은 'mdi-crosshairs-question' 입니다.)
  2. 하위 메뉴의 **경로**는 다음과 같은 형식이어야 합니다.
     - rack 전체 리스트: /rack
     - box 전체 리스트: /box
     - 'rack-1'의 직접링크: /rack/rack-1  
       <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F08.rackList.png?alt=media&token=288a80c9-5da4-42c3-a02e-b8b3f3bfe8c2" width="250px" />
       <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F09.boxList.png?alt=media&token=8bcf2d41-96ee-4739-b291-7fc92db60b29" width="250px" />
  3. _Admin Item_, _Admin Subitem_ 체크 시 관리자만 접근 가능한 메뉴를 만들 수 있습니다.
- 랙 및 박스는 사이드 메뉴에 직접 등록하여 사용할 수 있습니다. (**샘플 직접 링크는 지원하지 않습니다.**)

---

<br/>

### 랙

- 랙 전체 리스트 화면  
   <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F10.rackList.png?alt=media&token=5a64ae02-c41c-4759-b3f5-20777846df2a" width="500px">
- 랙 추가
  > 메뉴에서 직접 등록하는 방법만 지원
  1. 사이드 메뉴 > Rack > 신규 메뉴 추가  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F10-1.add-1.png?alt=media&token=4285b4fa-9f40-454d-9d38-3d7360c19b33" width="300px">
  2. 경로: **/rack/{랙 이름}** _e.g. /rack/addRack_  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F10-2.add-2.png?alt=media&token=9d9bec4f-2ad8-4ab3-8e12-4b23824bd1c1" width="300px">
  3. 해당 링크 클릭 혹은 _수정모드_ 해제 후 메뉴 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F10-3.add-3.png?alt=media&token=38cd906b-7c48-48e2-8907-1bafd9bfb406" width="300px">
  4. 랙 세부정보 입력  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F10-4.add-4.png?alt=media&token=b01b6f7f-c99e-4ee7-b351-e374ed553c90" width="400px">
- 랙 정보 수정
  1. 해당 랙으로 이동
  - 사이드 메뉴 클릭
  2. 정보 아이콘 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F10-5.update-1.png?alt=media&token=5f29f52a-b372-4f2d-9bf9-1d72687cad48" width="400px">
  3. 수정 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F10-6.update-2.png?alt=media&token=cc7ea18b-619a-4cac-b4a6-73f980d1536b" width="200px">
- **랙 삭제 기능은 관리자에게 문의하시기 바랍니다.**

---

<br/>

### 박스

- 박스 전체 리스트 화면  
   <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F11.boxList.png?alt=media&token=f426b9d7-6910-44fa-9615-a6f1146acb32" width="500px">
- 박스 추가
  1. 포함시키고자 하는 랙에서 추가 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F11-1.add-1.png?alt=media&token=e7792a56-ca4c-46ba-81f6-c0f1c10f3d40" width="300px">
  2. 박스 이름 입력 후 Enter 혹은 저장 버튼 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F11-2.add-2.png?alt=media&token=15099e0d-126c-4647-9162-9cbfbb320d9b" width="300px">
  3. 세부 정보 입력  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F11-3.add-3.png?alt=media&token=ebbafa96-342f-4bac-b80e-9ac2ad758a20" width="400px">
- 박스 정보 수정
  1. 해당 박스로 이동
     - 해당 박스가 포함된 랙으로 이동하여 선택  
       <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F11-4.update-0.png?alt=media&token=e65be425-5879-423b-88cf-7e8231a64e70" width="400px">
  2. 정보 아이콘 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F11-4.update-1.png?alt=media&token=1fcae2a4-424f-4c02-885b-64bbfde48f9d" width="400px">
  3. 수정 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F11-5.update-2.png?alt=media&token=5ecc9a4f-afac-42a0-828a-9dbf7d6af381" width="200px">
- ** 삭제 기능은 관리자에게 문의하시기 바랍니다.**

---

<br/>

### 샘플

- 샘플 추가
  1. 포함시키고자 하는 박스에서 추가 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F12.sample.add.1.png?alt=media&token=f61877ab-d59d-489d-a6eb-a15a0553d72d" width="300px">
  2. 샘플 추가 (_복사/붙여넣기 사용 가능_)  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F12.sample.add.2.png?alt=media&token=b980beaf-d972-4407-ad27-59254ae0c3b5" width="300px">
- 샘플 정보 수정
  1. 포함된 박스 리스트 화면에서 샘플 선택  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F12.sample.update.1.png?alt=media&token=c1d5ba6e-e636-451d-bfc7-8c081c9f04e8" width="300px">
  2. 수정 클릭  
     <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F12.sample.update.2.png?alt=media&token=a79b5ec0-d472-49e7-b980-c93967730f92" width="300px">
- 재고 수정

  > 샘플 정보 상단 이용

  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F12.sample.currentStock.png?alt=media&token=da62c43e-539d-4f5b-b7a9-a840ea47bca1" width="300px">

- 히스토리 확인

  > 샘플 정보 하단의 history 클릭

  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F12.sample.history.1.png?alt=media&token=10055451-b1f0-4785-a76a-df368b8c758d" width="300px">  
  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F12.sample.history.2.png?alt=media&token=7dd92b66-2838-4d37-a297-1634c080cb8c" width="300px">

- 댓글, 좋아요

  > 샘플 정보 하단

  <img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F12.sample.comment.png?alt=media&token=ca770988-6162-4424-bf62-3f6272ef9988" width="300px">

---

<br/>

### 창고 정보 수정

<img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F13.warehouse.1.png?alt=media&token=6111f5d7-9204-456b-af8d-0e82b744baa7" width="300px">  
<img src="https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/documentations%2Fusage%2F13.warehouse.2.png?alt=media&token=4a351884-ce50-441c-b193-f370cfc8d5c2" width="300px">

---

<br/>

### QR code 사용방법

> 스마트폰의 **카메라** 기능 중 QR 코드 인식하는 기능을 가진 카메라에서만 적용됩니다.
> 카메라에서 QR 코드 인식 후 링크를 클릭하면 해당 코드의 정보를 스마트폰에서 확인할 수 있습니다.

---

<br/>

### 버그 및 요청사항 등록 방법

> **이 서비스는 지속적으로 개발중입니다.**
>
> 추가 기능 요청 사항이나 버그 등을 발견했다면 Feedback 게시판에 등록해주시기 바랍니다.
