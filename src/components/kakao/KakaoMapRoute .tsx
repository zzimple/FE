// components/kakao/KakaoMapRoute.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { publicApi } from "@/lib/axios";  // 인증 필요 없는 API

declare global {
  interface Window { kakao: any; }
}

interface KakaoMapRouteProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  onStats?: (durationSec: number, distanceM: number) => void;  // ← 추가
}

export default function KakaoMapRoute({ from, to, onStats }: KakaoMapRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1) 카카오 SDK 로드
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao || !mapRef.current) return;
      window.kakao.maps.load(async () => {
        const kakao = window.kakao;
        // 2) 지도 생성 (시작 지점은 from)
        const map = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(from.y, from.x),
          level: 6,
        });

        try {
          const res = await publicApi.post<{
            data: {
              routePoints: Array<{ x: number; y: number }>;
              marks: Array<{ x: number; y: number; type: string }>;
              duration: number;  // ← API에서 넘겨주는 총 시간(초)
              distance: number;  // ← API에서 넘겨주는 총 거리(m)
            }
          }>("/kakao-navi/route", {
            origin: `${from.x},${from.y}`,
            destination: `${to.x},${to.y}`,
          });

          const { routePoints, marks, duration, distance } = res.data.data;

          // 부모에게 통계 전달
          onStats?.(duration, distance);

          // 4) Polyline 그리기
          const path = routePoints.map(pt => new kakao.maps.LatLng(pt.y, pt.x));
          new kakao.maps.Polyline({
            map,
            path,
            strokeWeight: 4,
            strokeColor: "#3B82F6",
            strokeOpacity: 0.8,
          });

          // 5) 마커 찍기
          marks.forEach(m => {
            new kakao.maps.Marker({
              map,
              position: new kakao.maps.LatLng(m.y, m.x),
              title: m.type,
            });
          });

          // 6) bounds 최적화
          const bounds = new kakao.maps.LatLngBounds();
          path.forEach(p => bounds.extend(p));
          map.setBounds(bounds);

        } catch (e) {
          console.error("❌ Kakao route error", e);
        }
      });
    };
    document.head.appendChild(script);
  }, [from, to]);

  return <div ref={mapRef} style={{ width: "100%", height: "300px" }} />;
}
