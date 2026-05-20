import './employment.css';

export default function EmploymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="employment-root">{children}</div>;
}
