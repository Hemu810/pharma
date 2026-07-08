import { ICONS } from '../data/icons.jsx';

export default function Toast({ message }) {
  return (
    <div className={`toast ${message ? 'show' : ''}`}>
      <ICONS.check />
      {message}
    </div>
  );
}
