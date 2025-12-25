from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models import User, Property

SAMPLE_USERS = ["birdza007", "lfcbeer", "molly_fufu"]

SAMPLE_PROPERTIES = [
    {
        "title": "บ้านนิรดา แจ้งวัฒนะ - ชัยพฤกษ์",
        "image": "https://residence.centralpattana.co.th/uploads/images/250307150111uvWF.webp",
        "location": "แจ้งวัฒนะ - ชัยพฤกษ์",
        "description": "สัมผัสการใช้ชีวิตระดับคลาสนะ อย่างเต็มภาคภูมิ...",
        "price": 25000000,
        "category": "บ้านเดี่ยว",
        "project_tag": "โครงการใหม่",
        "highlight": "เริ่ม 25 ล้านบาท",
        "nearby": "รถไฟฟ้า 1.2 กม."
    },
    {
        "title": "บ้านนิณยา รามอินทรา 83",
        "image": "https://residence.centralpattana.co.th/uploads/images/250307150111uvWF.webp",
        "location": "รามอินทรา 83",
        "description": "บ้านเดี่ยว 3 ชั้น พร้อมฟังก์ชันเล่นระดับ",
        "price": 14500000,
        "category": "บ้านเดี่ยว",
        "project_tag": "โครงการใหม่",
        "highlight": "เริ่ม 14.5 ล้าน",
        "nearby": "รพ. 1.7 กม."
    },
    {
        "title": "บ้านนิณยา กระบี่",
        "image": "https://residence.centralpattana.co.th/uploads/images/250307150111uvWF.webp",
        "location": "กระบี่",
        "description": "วิลล่าหรู เปิดโซนใหม่ วิวเขา",
        "price": 16000000,
        "category": "บ้านเดี่ยว",
        "project_tag": "โครงการใหม่",
        "highlight": "เริ่ม 16 - 25 ล้าน",
        "nearby": "สนามบิน 9.9 กม."
    },
]

def seed_if_empty(db: Session):
    user_count = db.execute(select(User.username)).first()
    if not user_count:
        for u in SAMPLE_USERS:
            db.add(User(username=u))
        db.commit()

    prop_count = db.execute(select(Property.id)).first()
    if not prop_count:
        for p in SAMPLE_PROPERTIES:
            db.add(Property(**p))
        db.commit()