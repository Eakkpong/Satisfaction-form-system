function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ระบบสร้างแบบฟอร์มประเมินความพึงพอใจ วิทยาลัยชุมชนสมุทรสาคร')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function createSatisfactionForm(data) {
  try {
    var formTitle = data.projectName + ' - แบบประเมินความพึงพอใจ';
    var formDescription = 'วันที่จัดกิจกรรม: ' + data.eventDate + '\nสถานที่จัดกิจกรรม: ' + data.location + '\n\nโปรดประเมินความพึงพอใจของท่านตามความเป็นจริง เพื่อเป็นแนวทางในการพัฒนาและปรับปรุงการดำเนินงานในโอกาสต่อไป ขอขอบคุณในความร่วมมือมา ณ โอกาสนี้';
    
    // สร้างฟอร์มใหม่
    var form = FormApp.create(formTitle);
    form.setDescription(formDescription);
    form.setConfirmationMessage('ขอขอบคุณที่สละเวลาร่วมตอบแบบประเมินความพึงพอใจ');
    
    // ข้อมูลทั่วไปของผู้ตอบ (สร้างเมื่อมีการเปิดตัวเลือกอย่างน้อย 1 อย่าง)
    if (data.askGender || data.askAge || data.askStatus) {
      form.addSectionHeaderItem().setTitle('ส่วนที่ 1: ข้อมูลทั่วไป');
      
      if (data.askGender) {
        form.addMultipleChoiceItem()
            .setTitle('เพศ')
            .setChoiceValues(['ชาย', 'หญิง', 'ไม่ระบุ'])
            .setRequired(true);
      }
      
      if (data.askAge) {
        form.addMultipleChoiceItem()
            .setTitle('ช่วงอายุ')
            .setChoiceValues(['ต่ำกว่า 18 ปี', '18-25 ปี', '26-35 ปี', '36-45 ปี', '46-55 ปี', '56 ปีขึ้นไป'])
            .setRequired(true);
      }
      
      if (data.askStatus && data.statusOptions && data.statusOptions.length > 0) {
        form.addMultipleChoiceItem()
            .setTitle('สถานภาพ')
            .setChoiceValues(data.statusOptions)
            .setRequired(true);
      }
    }
        
    // ส่วนการประเมิน
    var section2Title = (data.askGender || data.askAge || data.askStatus) ? 'ส่วนที่ 2: การประเมินความพึงพอใจ' : 'การประเมินความพึงพอใจ';
    form.addPageBreakItem().setTitle(section2Title);
    
    var questions = data.questions || [];
    
    for (var i = 0; i < questions.length; i++) {
      form.addScaleItem()
          .setTitle(questions[i])
          .setBounds(1, 5)
          .setLabels('น้อยที่สุด', 'มากที่สุด')
          .setRequired(true);
    }
    
    // ข้อเสนอแนะเพิ่มเติม
    var section3Title = (data.askGender || data.askAge || data.askStatus) ? 'ส่วนที่ 3: ข้อเสนอแนะเพิ่มเติม' : 'ข้อเสนอแนะเพิ่มเติม';
    form.addPageBreakItem().setTitle(section3Title);
    
    form.addParagraphTextItem()
        .setTitle('ข้อเสนอแนะ หรือสิ่งที่ควรปรับปรุง')
        .setRequired(false);
        
    var publishedUrl = form.getPublishedUrl();
    var editUrl = form.getEditUrl();
    
    // สร้าง QR Code ด้วย API ฟรี (api.qrserver.com)
    var qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(publishedUrl);
    
    return {
      status: 'success',
      publishedUrl: publishedUrl,
      editUrl: editUrl,
      qrCodeUrl: qrCodeUrl
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.toString()
    };
  }
}
