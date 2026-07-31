import LogoMark from "../components/LogoMark";

// Owner: Person B (Check-in & Stamp book)
function About() {
  return (
    <main className="page-inner">
      <section className="about-hero">
        <LogoMark className="about-hero-badge" tone="light" />
        <h1 className="about-hero-title">ตลาดท่านา</h1>
        <p className="about-hero-sub">ตลาดริมน้ำอายุกว่า 140 ปี · นครชัยศรี นครปฐม</p>
      </section>

      <div className="section-head">
        <div className="section-eyebrow">เกี่ยวกับโครงการ</div>
      </div>

      <div className="about-section">
        <p>
          ตลาดท่านามีรากฐานมาตั้งแต่สมัยรัชกาลที่ 1 และพัฒนาเป็นชุมชนค้าขายสำคัญในสมัยรัชกาลที่ 5
          ชื่อ "ตลาดท่านา" มาจากการที่บริเวณนี้เคยเป็นท่าเรือสำหรับซื้อขายและขนส่งข้าวเปลือก ข้าวสาร
        </p>
        <p>
          ปัจจุบันตลาดประสบปัญหาจำนวนนักท่องเที่ยวลดลง จากการย้ายออกของร้านอาหารชื่อดัง ประกอบกับปัญหาการขาดระบบนำทางและข้อมูลสำหรับนักท่องเที่ยว
          ทำให้ผู้มาเยือนไม่ทราบว่าแต่ละร้านจำหน่ายสินค้าประเภทใด ไม่มีเส้นทางแนะนำไปยังจุดที่น่าสนใจ และไม่สามารถเข้าถึงเสน่ห์ที่ซ่อนอยู่ภายในชุมชนได้อย่างเต็มที่
        </p>
        <p>
          เว็บแอปนี้จึงเกิดขึ้นเพื่อแก้ปัญหาดังกล่าว ด้วยแผนที่ดิจิทัลของตลาดชุมชน และกิจกรรม Walk-Rally ที่ใช้ระบบสแกน QR Code
          เพื่อกระตุ้นให้นักท่องเที่ยวสำรวจตลาดอย่างครบถ้วน และสร้างโอกาสทางการค้าให้แก่ผู้ประกอบการในชุมชนอย่างยั่งยืน
        </p>
      </div>

      <div className="section-head">
        <div className="section-eyebrow">วิธีเล่น</div>
      </div>
      <ol className="about-steps">
        <li>
          <span className="about-step-num">1</span>
          <span className="about-step-text">เดินหาป้าย QR code ตามจุดต่างๆ ทั้ง 7 จุดในตลาด</span>
        </li>
        <li>
          <span className="about-step-num">2</span>
          <span className="about-step-text">สแกน QR code ด้วยกล้องมือถือ ระบบจะบันทึกแสตมป์ให้อัตโนมัติ</span>
        </li>
        <li>
          <span className="about-step-num">3</span>
          <span className="about-step-text">เก็บครบทั้ง 7 จุด แล้วนำหน้าจอสมุดแสตมป์ไปแสดงที่ตู้จ่ายภาพ</span>
        </li>
      </ol>

      <div className="section-head">
        <div className="section-eyebrow">ทีมพัฒนา</div>
      </div>
      <div className="about-section">
        <div className="about-credit-role">หัวหน้าโครงการ</div>
        <ul className="about-credit-list">
          <li>นายณรงค์วัส วาจรัต</li>
        </ul>

        <div className="about-credit-role">ผู้ร่วมทีมพัฒนา</div>
        <ul className="about-credit-list">
          <li>นางสาวปารณีย์ หอสุวรรณานนท์</li>
          <li>นายญาณวุฒิ นิลทรัตน์</li>
          <li>นางสาวชนัญชิดา บุญไชยโย</li>
          <li>นายธนภัทร เธียรจินดากุล</li>
          <li>นายศิลปะ ชัยบุรัมย์</li>
          <li>นายรัชชานนท์ ชานันโท</li>
          <li>นายกิตติพิชญ์ คุณรักษ์พงศ์</li>
        </ul>

        <div className="about-credit-role">ที่ปรึกษาโครงการ</div>
        <ul className="about-credit-list">
          <li>นางสาวดวงแข ศรีคุณ — สาขาวิชาเคมี โรงเรียนมหิดลวิทยานุสรณ์</li>
          <li>นางสาวเกล็ดทราย ภูผาคุณ — สาขาวิชาฟิสิกส์ โรงเรียนมหิดลวิทยานุสรณ์</li>
          <li>นายบุญฤทธิ์ พูนพนิช — คณะศิลปวิจิตร สถาบันบัณฑิตทัศนศิลป์</li>
          <li>นายนิชชาฌ ปัญจกาญน์มณี — ผู้ใหญ่บ้านชุมชนตลาดท่านา</li>
        </ul>
      </div>

      <p className="about-colophon">
        แผนที่จาก OpenStreetMap · ภาพประกอบทั้งหมดวาดขึ้นใหม่สำหรับโครงการนี้
      </p>
    </main>
  );
}

export default About;
