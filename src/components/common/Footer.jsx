import React from 'react';
import { Link } from 'react-router-dom';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { FaInstagram } from 'react-icons/fa';
import { SiYoutubeshorts } from 'react-icons/si';
import { PiPhoneFill } from 'react-icons/pi';
import { FiMail } from 'react-icons/fi';
import { BsHouseDoorFill } from 'react-icons/bs';

const test = () => {
  return (
    <footer className="footer-wrapper bg-[#82b16c] text-whit">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
          {/* FIT문구 */}
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[#a0e881] mb-2 md:mb-4">
              Fit Harmony
            </h2>
            <p className="text-emerald-100 mb-3 md:mb-6 leading-relaxed text-sm md:text-base">
              건강한 라이프스타일을 위한 완벽한 파트너. 함께 더 나은 당신을
              만들어가세요.
            </p>
            <div className="flex justify-center md:justify-start space-x-3 md:space-x-4 text-2xl md:text-3xl text-green-100">
              <p className="hover:text-green-300">
                <FaInstagram />
              </p>
              <p className="hover:text-green-300">
                <FaSquareXTwitter />
              </p>
              <p className="hover:text-green-300">
                <SiYoutubeshorts />
              </p>
            </div>
          </div>

          {/* 서비스스 구분 */}
          <div className="text-emerald-100 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[#a0e881] mb-2 md:mb-4">
              {' '}
              서비스
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-sm md:text-base">
              <div>
                <Link to="/schedule">캘린더</Link>
              </div>
              <div>
                <Link to="/inbody">인바디</Link>
              </div>
              <div>
                <Link to="/community">커뮤니티</Link>
              </div>
              <div>
                <Link to="/trainer">강사찾기</Link>
              </div>
            </div>
          </div>
          {/* 연락처 */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[#a0e881] mb-2 md:mb-4">
              연락처
            </h3>
            <div className="space-y-1 md:space-y-3 mb-3 md:mb-6">
              <div className="flex items-center justify-center md:justify-start space-x-2 md:space-x-3">
                <p className="text-xl md:text-2xl text-emerald-100">
                  <PiPhoneFill />
                </p>
                <span className="text-emerald-100 text-sm md:text-base">
                  1588-4444
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2 md:space-x-3">
                <p className="text-xl md:text-2xl text-emerald-100">
                  <FiMail />
                </p>
                <span className="text-emerald-100 text-sm md:text-base">
                  hello@fitharmony.kr
                </span>
              </div>
              <div className="flex items-start justify-center md:justify-start space-x-2 md:space-x-3">
                <p className="text-xl md:text-2xl text-emerald-100">
                  <BsHouseDoorFill />
                </p>
                <span className="text-emerald-100 text-sm md:text-base">
                  가산디지털단지 200
                  <br />
                  가산 123
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* 하단 저작권 */}
        <div className="border-t mt-4 md:mt-10 border-emerald-200">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0 text-center md:text-left">
              <div className="text-white text-xs md:text-sm">
                © 2025 Fit Harmony. All rights reserved.
              </div>
              <div className="flex space-x-3 md:space-x-6 text-xs md:text-sm">
                <a
                  href="#"
                  className="text-white hover:text-emerald-300 transition-colors duration-300"
                >
                  개인정보처리방침
                </a>
                <a
                  href="#"
                  className="text-white hover:text-emerald-300 transition-colors duration-300"
                >
                  이용약관
                </a>
                <a
                  href="#"
                  className="text-white hover:text-emerald-300 transition-colors duration-300"
                >
                  쿠키 정책
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default test;
