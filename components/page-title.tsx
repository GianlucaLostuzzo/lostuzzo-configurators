export interface PageTitleProps {
  children: React.ReactNode;
}
export default function PageTitle({ children }: PageTitleProps) {
  return (
    //dark:text-white
    <h1 className="text-4xl font-bold mb-8 text-center text-black">
      {children}
    </h1>
  );
}
