import Image from 'next/image';

function Hero() {
  return (
    <div
      className="bg-cover bg-center h-[400px] flex justify-end items-end p-5 w-full"
      style={{
        backgroundImage:
          "url('https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/login%2F25ed78196394243.661f445a902c1.jpg?alt=media&token=468b8e6e-7fd0-47e1-a16e-1e79b301787c')",
      }}
    >
      <div className="">
        <h1 className="font-bold tracking-tight text-zinc-200 text-xs italic">
          Get Your Tickets ON
        </h1>
        <Image
          src={`https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/tadakirnet-clone%20logo2.png?alt=media&token=1518680c-5586-4e8f-a44a-d8fb1aadf408`}
          width={100}
          height={100}
          alt="logo"
          className="invert float-right"
        />
      </div>
    </div>
  );
}

export default Hero;
