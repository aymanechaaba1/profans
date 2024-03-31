import { getFirstLetters } from '@/utils/helpers';

function Avatar({
  firstname,
  lastname,
}: {
  firstname: string;
  lastname: string;
}) {
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-center bg-purple-500 text-white cursor-pointer">
      {getFirstLetters(firstname, lastname)}
    </div>
  );
}

export default Avatar;
