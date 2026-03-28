import { Spin } from "antd";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Spin tip="Loading..." size="large" />
    </div>
  );
};

export default Loader;