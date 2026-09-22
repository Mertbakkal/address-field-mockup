export default function PhoneFrame({ children }) {
  return (
    <div className="iphone-stage">
      <div className="iphone-18" aria-label="iPhone 18">
        <div className="iphone-18__silence" aria-hidden />
        <div className="iphone-18__action" aria-hidden />
        <div className="iphone-18__vol-up" aria-hidden />
        <div className="iphone-18__vol-down" aria-hidden />
        <div className="iphone-18__power" aria-hidden />

        <div className="iphone-18__frame">
          <div className="iphone-18__glass">
            <div className="iphone-18__screen">{children}</div>
            <div className="iphone-18__island" aria-hidden>
              <div className="iphone-18__island-cam" />
              <div className="iphone-18__island-sensor" />
            </div>
            <div className="iphone-18__home-indicator" aria-hidden />
          </div>
        </div>
      </div>
      <p className="iphone-caption">iPhone 18</p>
    </div>
  );
}
