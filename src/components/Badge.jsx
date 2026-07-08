import { classifyBadge } from '../utils/classify';

export default function Badge({ value }) {
  return <span className={`badge ${classifyBadge(value)}`}>{value}</span>;
}
