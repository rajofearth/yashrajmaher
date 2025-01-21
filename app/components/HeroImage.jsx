'use client'
import Image from 'next/image';

const HeroImage = () => {
  return (
    <div className="group perspective-1000" 
    onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      e.currentTarget.style.transform = `
        rotateY(${x * -10}deg)
        rotateX(${y * 10}deg)
        translateZ(20px)
      `;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
    }}>
      <Image
        src="/my.png"
        alt="My Image"
        className="rounded-2xl shadow-lg transition-transform duration-300"
        width={150}
        height={150}
      />
    </div>
  );
}

export default HeroImage;