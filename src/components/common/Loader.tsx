import './loader.css'

export interface LoaderProps {
  fullPage?: boolean
  width?: string
  height?: string
  borderClassColor?: string
}

const Loader = ({ fullPage, width, height, borderClassColor }: LoaderProps) => {
  const loaderClass = fullPage
    ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    : "flex justify-center items-center";
  return (
    <>
      {fullPage && (
        <div className="fixed top-0 left-0 z-40 w-full h-full bg-black opacity-40" />
      )}
      <div className={`${loaderClass}`}>
        <div
          style={{ borderTopColor: "transparent" }}
          aria-label="loading"
          className={`${width ? width : "w-10"} ${height ? height : "h-10"} ${borderClassColor ? borderClassColor : " border-primary"} border-4 border-solid rounded-full animate-spin`}
        />
      </div>
    </>
  );
};

export { Loader };
export default Loader;

