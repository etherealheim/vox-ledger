"use client"

const Logo = () => {
  return (

    <div className="flex items-center p-4">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hover:fill-gray-500"
      >
        <path
          d="M12 22L0 2H24L12 22Z"
          fill="white"
        />
      </svg>
      <p className="font-bold ml-2">Vox Observer</p>
    </div>
  );
};

export default Logo;
