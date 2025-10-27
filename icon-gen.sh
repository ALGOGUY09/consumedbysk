#!/bin/bash
# Create simple placeholder icons
echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E88E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1565C0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="38" fill="url(#grad)"/>
  <circle cx="96" cy="80" r="35" fill="white" opacity="0.9"/>
  <rect x="61" y="100" width="70" height="50" rx="8" fill="white" opacity="0.9"/>
  <rect x="66" y="110" width="8" height="8" fill="#1E88E5"/>
  <rect x="78" y="110" width="8" height="8" fill="#1E88E5"/>
  <rect x="90" y="110" width="8" height="8" fill="#1E88E5"/>
  <rect x="102" y="110" width="8" height="8" fill="#1E88E5"/>
  <rect x="114" y="110" width="8" height="8" fill="#1E88E5"/>
  <rect x="66" y="135" width="8" height="8" fill="#1E88E5"/>
  <rect x="78" y="135" width="8" height="8" fill="#1E88E5"/>
  <rect x="90" y="135" width="8" height="8" fill="#1E88E5"/>
  <rect x="102" y="135" width="8" height="8" fill="#1E88E5"/>
  <rect x="114" y="135" width="8" height="8" fill="#1E88E5"/>
</svg>' > icon-192.svg

echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E88E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1565C0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="102" fill="url(#grad)"/>
  <circle cx="256" cy="210" r="90" fill="white" opacity="0.9"/>
  <rect x="161" y="270" width="190" height="130" rx="20" fill="white" opacity="0.9"/>
  <rect x="175" y="295" width="20" height="20" fill="#1E88E5"/>
  <rect x="210" y="295" width="20" height="20" fill="#1E88E5"/>
  <rect x="245" y="295" width="20" height="20" fill="#1E88E5"/>
  <rect x="280" y="295" width="20" height="20" fill="#1E88E5"/>
  <rect x="315" y="295" width="20" height="20" fill="#1E88E5"/>
  <rect x="175" y="360" width="20" height="20" fill="#1E88E5"/>
  <rect x="210" y="360" width="20" height="20" fill="#1E88E5"/>
  <rect x="245" y="360" width="20" height="20" fill="#1E88E5"/>
  <rect x="280" y="360" width="20" height="20" fill="#1E88E5"/>
  <rect x="315" y="360" width="20" height="20" fill="#1E88E5"/>
</svg>' > icon-512.svg
