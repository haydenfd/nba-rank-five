import { CircularImagePropsInterface } from "./Types";

export const CircularImage: React.FC<CircularImagePropsInterface> = ({ src, alt, size = "w-24 h-24", fit = "contain" }) => {
  return (
    <div className={`${size} rounded-full overflow-hidden flex items-center justify-center bg-white ml-4`}>
      <div className="w-full h-full flex items-center justify-center">
        <img src={src} alt={alt} className={`max-w-full max-h-full object-${fit}`} />
      </div>
    </div>
  );
};
