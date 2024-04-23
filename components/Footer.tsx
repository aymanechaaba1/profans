import { Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  AiFillGithub,
  AiFillYoutube,
  AiFillTwitterCircle,
} from 'react-icons/ai';
import {
  FaGooglePlay,
  FaAppStore,
  FaTwitch,
  FaTwitter,
  FaInstagram,
  FaHeadset,
  FaStripe,
  FaPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaApplePay,
} from 'react-icons/fa';
import { Separator } from './ui/separator';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { IoIosMail } from 'react-icons/io';
import { SiShadcnui, SiFifa } from 'react-icons/si';
import { IoLogoVercel } from 'react-icons/io5';
import { CgAdidas } from 'react-icons/cg';
import ContactUsForm from './ContactUsForm';

type Social = {
  icon: JSX.Element;
  link: string;
};
const socials: Social[] = [
  {
    icon: <AiFillGithub size={18} />,
    link: 'https://github.com/aymanechaaba1/tadakirnet-clone',
  },
  {
    icon: <AiFillYoutube size={18} />,
    link: '',
  },
  {
    icon: <FaTwitter size={18} />,
    link: '',
  },
  {
    icon: <FaTwitch />,
    link: '',
  },
  {
    icon: <FaInstagram />,
    link: '',
  },
] as const;

function Footer() {
  let today = new Date();

  return (
    <div className="grid grid-cols-1 gap-y-3 container py-5 border-t">
      <div className="flex items-start justify-between">
        <div>
          <Image
            src={`https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/tadakirnet-clone%20logo2.png?alt=media&token=1518680c-5586-4e8f-a44a-d8fb1aadf408`}
            height={100}
            width={100}
            alt="logo"
            className="object-cover dark:invert"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-x-5">
            <p className="text-xs italic tracking-tight text-muted-foreground">
              Let&apos;s connect:
            </p>
            <div className="flex items-center gap-x-2">
              {socials.map((social, i) => (
                <Link key={i} href={social.link}>
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-5">
            <p className="text-xs tracking-tight scroll-m-20 leading-0 italic text-muted-foreground">
              Download our app:
            </p>
            <div className="flex items-center gap-x-2">
              <Link href={''}>
                <FaGooglePlay />
              </Link>
              <Link href={''}>
                <FaAppStore />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Separator />
      <div className="grid grid-cols-2">
        <div>
          <h3 className="font-semibold tracking-tight scroll-m-20">
            Resources
          </h3>
          <div className="flex flex-col mt-[5px]">
            <Link href={''} className="profans-link">
              Privacy Policy
            </Link>
            <Link href={''} className="profans-link">
              Terms
            </Link>
            <Link href={''} className="profans-link">
              Code of Conduct
            </Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold tracking-tight scroll-m-20 text-right">
            Support
          </h3>
          <div className="flex flex-col mt-[5px] space-y-2">
            <ContactUsForm />
            <div className="flex items-center flex-row-reverse gap-x-2 justify-start ">
              <FaHeadset className="text-foreground/60" />
              <p className="text-foreground/60">+1 567 478 5890</p>
            </div>
            <div className="flex items-center flex-row-reverse gap-x-2 justify-start">
              <IoIosMail className="text-foreground/60" size={18} />
              <p className="text-foreground/60">support@profans.com</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold tracking-tight scroll-m-20">Partners</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-x-2">
              <FaStripe className="text-foreground/60" size={30} />
              <FaPaypal className="text-foreground/60" size={15} />
              <FaApplePay className="text-foreground/60" size={30} />
              <SiShadcnui className="text-foreground/60" size={11} />
              <IoLogoVercel className="text-foreground/60" size={11} />
              <CgAdidas className="text-foreground/60" size={15} />
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <p className="italic text-center tracking-tight text-muted-foreground text-xs">
        Profans LLC &#169; {today.getFullYear()}
      </p>
    </div>
  );
}

export default Footer;
