import Image from 'next/image';

export default function ThankYouSection() {
  return (
    <div
      role="complementary"
      aria-label="Thank you message"
      className="w-full h-[600px] flex items-center justify-center"
      style={{
        backgroundColor: '#C1A2CC'
      }}
    >
      <div className="sr-only">
        Thank you for browsing our silver collection
      </div>
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Image
          src="/images/thankyou.png"
          alt="Thank you from Aayush Handicrafts"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 256px, 320px"
        />
      </div>
    </div>
  );
}
