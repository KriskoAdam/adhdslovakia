"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type AnimatedStatProps = {
  num: string;
  label: string;
  loopDelay?: number;
  scanSpeed?: number;
};

export default function DataScannerStat({
  num,
  label,
  loopDelay = 10000,
  scanSpeed = 300,
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(num);
  const [isScanning, setIsScanning] = useState(false);
  const loopRef = useRef<NodeJS.Timeout | null>(null);
  
  const chars = "0123456789%#@$";
  const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

  useEffect(() => {
    let iteration = 0;
    let interval: ReturnType<typeof setInterval>;

    const startScan = () => {
      setIsScanning(true);
      iteration = 0;

      interval = setInterval(() => {
        setDisplayValue(
          num.split("").map((_, index) => {
            if (index < iteration) return num[index];
            return getRandomChar();
          }).join("")
        );

        iteration += 0.5;

        if (iteration >= num.length) {
          clearInterval(interval);
          setDisplayValue(num);
          setIsScanning(false);
          loopRef.current = setTimeout(startScan, loopDelay);
        }
      }, scanSpeed);
    };

    loopRef.current = setTimeout(startScan, 1000);
    return () => {
      if (loopRef.current) clearTimeout(loopRef.current);
      clearInterval(interval);
    };
  }, [num, loopDelay, scanSpeed]);

  return (
    <div className="relative flex flex-col p-2">
      {/* Hlavný displej s pôvodným fontom a farbou */}
      <motion.div 
        animate={isScanning ? { x: [-1, 1, -1, 0] } : {}}
        transition={{ duration: 0.1, repeat: isScanning ? Infinity : 0 }}
        className={`relative inline-block font-display text-3xl font-extrabold tabular-nums transition-colors duration-300 ${
          isScanning ? "text-white" : "text-green-400"
        }`}
      >
        {/* Glitch efekt (zelený odtieň) */}
        {isScanning && (
          <motion.span
            className="absolute top-0 left-0 -z-10 text-green-500 opacity-50 blur-[1px]"
            animate={{ x: [-2, 2, 0] }}
          >
            {displayValue}
          </motion.span>
        )}
        
        {displayValue}

        {/* Scan-line efekt */}
        {isScanning && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-transparent"
            initial={{ top: "-100%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>

      {/* Label - pôvodný štýl */}
      <motion.div 
        className="text-[12px] text-[#555] mt-0.5 font-light"
        animate={{ opacity: isScanning ? [0.4, 0.8, 0.4] : 1 }}
        transition={{ duration: 0.8, repeat: isScanning ? Infinity : 0 }}
      >
        {label}
      </motion.div>
    </div>
  );
}
