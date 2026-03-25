import { Spin } from "antd";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <Spin description="Loading..." size="large" />
    </div>
  );
};

export default Loader;