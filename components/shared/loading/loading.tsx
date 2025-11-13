export const Loading = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};
