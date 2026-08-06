import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { POI } from "../types";
import { submitCheckIn } from "../api/checkins";
import { fetchPOI } from "../api/pois";
import { fetchVisitorStatus, registerVisitor } from "../api/visitors";
import { getVisitorId } from "../lib/visitor";
import PoiArt, { artVariantFor } from "../components/PoiArt";

type Status = "checking" | "register" | "pending" | "stamped" | "invalid" | "error";

// Owner: Person B (Check-in & Stamp book)
// This is the page a printed QR code opens: /checkin/{poiId}?t={secret}
// It is the first thing a visitor sees after scanning a sign in the market, so
// it has to read clearly on a phone in bright sun, one-handed.
function CheckIn() {
  const { poiId } = useParams<{ poiId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") ?? "";
  const [status, setStatus] = useState<Status>("checking");
  const [poi, setPoi] = useState<POI | undefined>(undefined);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  function doCheckIn(visitorId: string) {
    setStatus("pending");
    submitCheckIn(poiId!, token, visitorId)
      .then((res) => setStatus(res.stamped ? "stamped" : "invalid"))
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    if (!poiId) return;
    fetchPOI(poiId)
      .then(setPoi)
      .catch(() => {
        // POI info is a nice-to-have here; missing it shouldn't block check-in
      });

    const visitorId = getVisitorId();
    fetchVisitorStatus(visitorId)
      .then((res) => (res.registered ? doCheckIn(visitorId) : setStatus("register")))
      // A flaky connection checking registration shouldn't block the stamp itself.
      .catch(() => doCheckIn(visitorId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poiId, token]);

  function handleRegister(name: string, phone: string) {
    const visitorId = getVisitorId();
    setRegistering(true);
    setRegisterError(false);
    registerVisitor(visitorId, name, phone)
      .then(() => doCheckIn(visitorId))
      .catch(() => {
        setRegistering(false);
        setRegisterError(true);
      });
  }

  if (status === "checking") {
    return (
      <main className="page-inner">
        <div className="checkin-result is-pending">
          <div className="checkin-spinner" aria-hidden="true" />
          <div className="checkin-result-title">กำลังโหลด...</div>
        </div>
      </main>
    );
  }

  if (status === "register") {
    return (
      <main className="page-inner">
        <RegisterForm submitting={registering} error={registerError} onSubmit={handleRegister} />
      </main>
    );
  }

  if (status === "pending") {
    return (
      <main className="page-inner">
        <div className="checkin-result is-pending">
          <div className="checkin-spinner" aria-hidden="true" />
          <div className="checkin-result-title">กำลัง check-in...</div>
        </div>
      </main>
    );
  }

  if (status === "stamped") {
    return (
      <main className="page-inner">
        <div className="checkin-result success">
          {poi && (
            <div className="checkin-result-art">
              <PoiArt variant={artVariantFor(poi.id, poi.category)} />
            </div>
          )}
          <div className="checkin-result-seal" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M6.5 12.6l3.4 3.4L17.5 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="checkin-result-title">ได้แสตมป์แล้ว!</div>
          <div className="checkin-result-desc">
            {poi ? poi.name : "จุดนี้"} ถูกบันทึกในสมุดแสตมป์ของคุณแล้ว
          </div>
          <Link to="/stamps" className="btn-pill btn-pill-gold">
            ดูสมุดแสตมป์
          </Link>
          <Link to="/map" className="checkin-result-link">
            ไปจุดถัดไป
          </Link>
        </div>
      </main>
    );
  }

  if (status === "invalid") {
    return (
      <main className="page-inner">
        <div className="checkin-result error">
          <div className="checkin-result-title">QR code นี้ใช้ไม่ได้</div>
          <div className="checkin-result-desc">
            {poi
              ? `นี่คือ ${poi.name} — แต่ลิงก์นี้ไม่ถูกต้องหรือหมดอายุ ลองสแกนป้าย QR ที่จุดนี้อีกครั้ง`
              : "ลิงก์นี้ไม่ถูกต้องหรือหมดอายุ ลองสแกนป้าย QR อีกครั้ง"}
          </div>
          <Link to="/map" className="btn-pill btn-pill-green">
            กลับไปที่แผนที่
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-inner">
      <div className="checkin-result error">
        <div className="checkin-result-title">เชื่อมต่อไม่สำเร็จ</div>
        <div className="checkin-result-desc">
          สัญญาณอาจไม่เสถียร ลองใหม่อีกครั้งในอีกสักครู่
        </div>
        <Link to="/map" className="btn-pill btn-pill-green">
          กลับไปที่แผนที่
        </Link>
      </div>
    </main>
  );
}

interface RegisterFormProps {
  submitting: boolean;
  error: boolean;
  onSubmit: (name: string, phone: string) => void;
}

// Asked once per visitor, on their first scan of the day — not repeated at
// every checkpoint. getVisitorId() ties this to the same anonymous id already
// used for stamps, so it's never asked again on this device.
function RegisterForm({ submitting, error, onSubmit }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const canSubmit = name.trim().length > 0 && phone.trim().length > 0 && !submitting;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(name.trim(), phone.trim());
  }

  return (
    <form className="checkin-register" onSubmit={handleSubmit}>
      <div className="checkin-register-title">ก่อนเริ่มเก็บแสตมป์</div>
      <div className="checkin-register-desc">
        ขอชื่อและเบอร์โทรของคุณ เพื่อใช้ติดต่อตอนรับรางวัลที่ตู้ภาพ กรอกครั้งเดียว ใช้ได้ตลอดทั้ง 7 จุด
      </div>

      <label className="checkin-register-label" htmlFor="visitor-name">
        ชื่อ
      </label>
      <input
        id="visitor-name"
        className="checkin-register-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ชื่อของคุณ"
        autoComplete="name"
      />

      <label className="checkin-register-label" htmlFor="visitor-phone">
        เบอร์โทร
      </label>
      <input
        id="visitor-phone"
        className="checkin-register-input"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="0812345678"
        autoComplete="tel"
      />

      {error && (
        <div className="checkin-register-error">ส่งไม่สำเร็จ ลองใหม่อีกครั้ง</div>
      )}

      <button type="submit" className="btn-pill btn-pill-gold" disabled={!canSubmit}>
        {submitting ? "กำลังบันทึก..." : "เริ่มเก็บแสตมป์"}
      </button>
    </form>
  );
}

export default CheckIn;
