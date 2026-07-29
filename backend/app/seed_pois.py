from app.db import SessionLocal
from app.models.poi import POI


def seed_pois():
    db = SessionLocal()

    try:
        print("Deleting old POIs...")

        # ลบข้อมูลเก่าทั้งหมด
        db.query(POI).delete()

        print("Adding sample POIs...")

        pois = [

            # ==========================
            # FOOD
            # ==========================

            POI(
                id="food001",
                name="ร้านกาแฟโบราณ",
                category="food",
                description="กาแฟสูตรโบราณ เปิดมากว่า 40 ปี",
                image_url="/images/food001.jpg",
                map_x=12.5,
                map_y=18.2,
                qr_secret="qr_food001",
                status="active",
            ),

            POI(
                id="food002",
                name="ร้านก๋วยเตี๋ยวเจ๊แดง",
                category="food",
                description="ก๋วยเตี๋ยวหมูน้ำตกสูตรดั้งเดิม",
                image_url="/images/food002.jpg",
                map_x=20.3,
                map_y=22.1,
                qr_secret="qr_food002",
                status="active",
            ),

            POI(
                id="food003",
                name="ร้านขนมไทยคุณยาย",
                category="food",
                description="ขนมไทยทำสดทุกเช้า",
                image_url="/images/food003.jpg",
                map_x=26.8,
                map_y=17.5,
                qr_secret="qr_food003",
                status="active",
            ),

            POI(
                id="food004",
                name="ร้านอาหารริมน้ำ",
                category="food",
                description="ร้านอาหารที่ปิดกิจการแล้ว",
                image_url="/images/food004.jpg",
                map_x=31.2,
                map_y=19.6,
                qr_secret="qr_food004",
                status="closed",
            ),

            # ==========================
            # SHOP
            # ==========================

            POI(
                id="shop001",
                name="ร้านของฝากตลาดท่านา",
                category="shop",
                description="ของฝากจากชุมชน",
                image_url="/images/shop001.jpg",
                map_x=45.2,
                map_y=20.1,
                qr_secret="qr_shop001",
                status="active",
            ),

            POI(
                id="shop002",
                name="ร้านเครื่องจักสาน",
                category="shop",
                description="สินค้าหัตถกรรมพื้นบ้าน",
                image_url="/images/shop002.jpg",
                map_x=49.8,
                map_y=26.5,
                qr_secret="qr_shop002",
                status="active",
            ),

            POI(
                id="shop003",
                name="ร้านหนังสือเก่า",
                category="shop",
                description="ปัจจุบันปิดกิจการ",
                image_url="/images/shop003.jpg",
                map_x=51.3,
                map_y=30.7,
                qr_secret="qr_shop003",
                status="closed",
            ),

            # ==========================
            # HISTORY
            # ==========================

            POI(
                id="history001",
                name="ศาลเจ้าตลาดท่านา",
                category="history",
                description="ศาลเจ้าเก่าแก่ประจำชุมชน",
                image_url="/images/history001.jpg",
                map_x=60.0,
                map_y=35.2,
                qr_secret="qr_history001",
                status="active",
            ),

            POI(
                id="history002",
                name="ท่าเรือเก่า",
                category="history",
                description="จุดเริ่มต้นของตลาดท่านา",
                image_url="/images/history002.jpg",
                map_x=64.5,
                map_y=39.7,
                qr_secret="qr_history002",
                status="active",
            ),

            # ==========================
            # ART
            # ==========================

            POI(
                id="art001",
                name="จิตรกรรมฝาผนัง",
                category="art",
                description="ภาพวาดเล่าเรื่องวิถีชีวิตชุมชน",
                image_url="/images/art001.jpg",
                map_x=70.1,
                map_y=15.8,
                qr_secret="qr_art001",
                status="active",
            ),

            POI(
                id="art002",
                name="ซุ้มภาพถ่ายย้อนยุค",
                category="art",
                description="มุมถ่ายภาพยอดนิยม",
                image_url="/images/art002.jpg",
                map_x=74.3,
                map_y=18.6,
                qr_secret="qr_art002",
                status="active",
            ),

            # ==========================
            # ACTIVITY
            # ==========================

            POI(
                id="activity001",
                name="จุดให้อาหารปลา",
                category="activity",
                description="กิจกรรมยอดนิยมริมแม่น้ำ",
                image_url="/images/activity001.jpg",
                map_x=82.6,
                map_y=40.5,
                qr_secret="qr_activity001",
                status="active",
            ),

            POI(
                id="activity002",
                name="ลานกิจกรรมชุมชน",
                category="activity",
                description="ใช้จัดงานเทศกาล",
                image_url="/images/activity002.jpg",
                map_x=88.1,
                map_y=44.2,
                qr_secret="qr_activity002",
                status="active",
            ),

            # ==========================
            # SERVICE
            # ==========================

            POI(
                id="service001",
                name="ห้องน้ำสาธารณะ",
                category="service",
                description="ห้องน้ำสำหรับนักท่องเที่ยว",
                image_url="/images/service001.jpg",
                map_x=92.5,
                map_y=24.8,
                qr_secret="qr_service001",
                status="active",
            ),

            POI(
                id="service002",
                name="จุดประชาสัมพันธ์",
                category="service",
                description="สอบถามข้อมูลตลาด",
                image_url="/images/service002.jpg",
                map_x=95.3,
                map_y=21.4,
                qr_secret="qr_service002",
                status="active",
            ),
        ]

        db.add_all(pois)

        db.commit()

        print(f"Successfully added {len(pois)} POIs.")

    except Exception as e:
        db.rollback()
        print("Seed failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_pois()
