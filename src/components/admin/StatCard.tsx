import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  colorClass?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  colorClass = "cyan",
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <h2 className="stat-value">{value}</h2>
        {subtitle && <small className="stat-subtitle">{subtitle}</small>}
      </div>

      <div className={`stat-decoration ${colorClass}`}></div>
    </div>
  );
}