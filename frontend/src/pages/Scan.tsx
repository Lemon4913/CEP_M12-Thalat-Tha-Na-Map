import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import { resolveCheckInPath } from "../lib/qrLink";

type ScanState = "starting" | "scanning" | "denied" | "unsupported" | "not-found";

// Opens the phone camera in-app and decodes a checkpoint's QR sign directly,
// so a visitor never has to leave the app for their phone's own camera app.
// A match reuses the existing /checkin/:poiId route — this page never talks
// to the API itself, it only figures out where to navigate.
function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [state, setState] = useState<ScanState>("starting");
  const [showMiss, setShowMiss] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId = 0;
    let missTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function stopCamera() {
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((track) => track.stop());
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(frame.data, frame.width, frame.height);

      if (result) {
        const dest = resolveCheckInPath(result.data);
        if (dest) {
          stopCamera();
          navigate(dest);
          return;
        }
        // Scanned something real, just not one of our signs — flash a hint
        // without interrupting the loop, it might be a shaky partial read.
        setShowMiss(true);
        clearTimeout(missTimer);
        missTimer = setTimeout(() => setShowMiss(false), 2000);
      }

      rafId = requestAnimationFrame(tick);
    }

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState("unsupported");
        return;
      }
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      } catch {
        setState("denied");
        return;
      }
      if (cancelled || !videoRef.current) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }
      stream = mediaStream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setState("scanning");
      tick();
    }

    start();
    return () => {
      cancelled = true;
      clearTimeout(missTimer);
      stopCamera();
    };
  }, [navigate]);

  return (
    <main className="scan-page">
      <video ref={videoRef} className="scan-video" muted playsInline />
      <canvas ref={canvasRef} className="scan-canvas" />

      {state === "scanning" && (
        <div className="scan-overlay">
          <div className="scan-frame" aria-hidden="true" />
          <p className="scan-hint">{showMiss ? "ไม่พบสแตมป์ในรหัสนี้ ลองอีกครั้ง" : "เล็ง QR code ที่จุดตรวจให้อยู่ในกรอบ"}</p>
        </div>
      )}

      {state === "starting" && (
        <div className="scan-state">
          <div className="checkin-spinner" aria-hidden="true" />
          <div className="scan-state-title">กำลังเปิดกล้อง...</div>
        </div>
      )}

      {state === "denied" && (
        <div className="scan-state">
          <div className="scan-state-title">เข้าถึงกล้องไม่ได้</div>
          <p className="scan-state-desc">
            กรุณาอนุญาตให้เว็บไซต์นี้ใช้กล้องในตั้งค่าเบราว์เซอร์ของคุณ แล้วลองใหม่
          </p>
        </div>
      )}

      {state === "unsupported" && (
        <div className="scan-state">
          <div className="scan-state-title">อุปกรณ์นี้ไม่รองรับ</div>
          <p className="scan-state-desc">
            เบราว์เซอร์นี้ใช้กล้องสแกนในหน้านี้ไม่ได้ ใช้กล้องมือถือของคุณสแกนป้าย QR ที่จุดตรวจแทน
          </p>
        </div>
      )}
    </main>
  );
}

export default Scan;
