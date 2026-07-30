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
                name="ผัดไทยหอยทอด เบื้องญวน",
                category="food",
                description="ผัดไทยหอยอร่อย การันตีโดยเชฟคุณภาพ",
                image_url="/images/food001.jpg",
                map_x=12.5,
                map_y=18.2,
                qr_secret="pending_food001",
                status="active",
            ),

            POI(
                id="food002",
                name="ร้านอาหารสีฟ้า",
                category="food",
                description="ร้านเจ้าเก่า วิวติดริมน้ำ",
                image_url="/images/food002.jpg",
                map_x=20.3,
                map_y=22.1,
                qr_secret="pending_food002",
                status="active",
            ),

            POI(
                id="food003",
                name="หน่อยเบเกอรี่",
                category="food",
                description="ขนมปังหอมๆ พร้อมไส้แน่นๆ",
                image_url="/images/food003.jpg",
                map_x=26.8,
                map_y=17.5,
                qr_secret="pending_food003",
                status="active",
            ),

            POI(
                id="food004",
                name="บ้านป้าระเบียบ",
                category="food",
                description="ร้านอาหารแนว Modern และอาหารที่แปลกใหม่",
                image_url="/images/food004.jpg",
                map_x=31.2,
                map_y=19.6,
                qr_secret="pending_food004",
                status="closed",
            ),
            
            POI(
                id="food005",
                name="AYA Coffee",
                category="food",
                description="เครื่องดื่มหลากหลายรูปแบบ พร้อมกลิ่นหอมที่ลงตัว",
                image_url="/images/food005.jpg",
                map_x=31.2,
                map_y=19.6,
                qr_secret="Checkin_1_Coffee",
                status="closed",
            ),
            
            POI(
                id="food006",
                name="ร้านลุงโทนี่ อาหารตามสั่ง",
                category="food",
                description="ร้านอาหารที่ปิดกิจการแล้ว",
                image_url="/images/food006.jpg",
                map_x=31.2,
                map_y=19.6,
                qr_secret="pending_food005",
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
                qr_secret="pending_shop001",
                status="active",
            ),

            POI(
                id="shop002",
                name="นครชัยศรี แอนทีค",
                category="shop",
                description="ร้านจำหน่ายของเก่า",
                image_url="/images/shop002.jpg",
                map_x=49.8,
                map_y=26.5,
                qr_secret="Checkin_2_Antique",
                status="active",
            ),

            POI(
                id="shop003",
                name="กล้วยอบน้ำผึ้งทอด แม่เจริญ",
                category="shop",
                description="ร้านขนม",
                image_url="/images/shop003.jpg",
                map_x=51.3,
                map_y=30.7,
                qr_secret="pending_shop003",
                status="closed",
            ),

            # ==========================
            # HISTORY
            # ==========================

            POI(
                id="history001",
                name="ศาลเจ้าแม่เบิกไพร ตลาดท่านา",
                category="history",
                description="ศาลเจ้าเก่าแก่ประจำชุมชน",
                image_url="/images/history001.jpg",
                map_x=60.0,
                map_y=35.2,
                qr_secret="Checkin_3_history001",
                status="active",
            ),

            # ==========================
            # ART
            # ==========================

            POI(
                id="art001",
                name="จิตรกรรมฝาผนังบริเวณทางเดิน",
                category="art",
                description="ภาพวาดของขายดีในตลาดท่านา",
                image_url="/images/art001.jpg",
                map_x=70.1,
                map_y=15.8,
                qr_secret="Checkin_4_Art",
                status="active",
            ),

            POI(
                id="art002",
                name="ภาพวาดในตลาด",
                category="art",
                description="มุมถ่ายภาพยอดนิยม",
                image_url="/images/art002.jpg",
                map_x=74.3,
                map_y=18.6,
                qr_secret="pending_art002",
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
                qr_secret="Checkin_5_Activity",
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
                qr_secret="pending_activity002",
                status="active",
            ),


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
