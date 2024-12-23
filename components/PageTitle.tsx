export interface PageTitleProps {
  children: React.ReactNode;
}
export default function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="text-4xl font-bold mb-8 text-center text-primary">
      {children}
    </h1>
  );
}
