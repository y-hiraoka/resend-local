import cssModules from "./loading-indicator.module.css";

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="h-0.5 w-full overflow-hidden">
      <span className={cssModules.progress} />
    </div>
  );
};
