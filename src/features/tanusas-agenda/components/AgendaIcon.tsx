import { ArrowLeft } from 'pixelarticons/react/ArrowLeft.js';
import { ArrowRight } from 'pixelarticons/react/ArrowRight.js';
import { Bell } from 'pixelarticons/react/Bell.js';
import { Bookmark } from 'pixelarticons/react/Bookmark.js';
import { Calendar } from 'pixelarticons/react/Calendar.js';
import { Check } from 'pixelarticons/react/Check.js';
import { Clock } from 'pixelarticons/react/Clock.js';
import { Close } from 'pixelarticons/react/Close.js';
import { Coffee } from 'pixelarticons/react/Coffee.js';
import { Compass } from 'pixelarticons/react/Compass.js';
import { Download } from 'pixelarticons/react/Download.js';
import { Fire } from 'pixelarticons/react/Fire.js';
import { Leaf } from 'pixelarticons/react/Leaf.js';
import { Link } from 'pixelarticons/react/Link.js';
import { MapPin } from 'pixelarticons/react/MapPin.js';
import { Sliders } from 'pixelarticons/react/Sliders.js';
import { Sun } from 'pixelarticons/react/Sun.js';
import { Switch } from 'pixelarticons/react/Switch.js';

const icons = {
  agenda: Calendar,
  leaf: Leaf,
  compass: Compass,
  bell: Bell,
  settings: Sliders,
  arrow: ArrowRight,
  back: ArrowLeft,
  close: Close,
  clock: Clock,
  pin: MapPin,
  save: Bookmark,
  check: Check,
  download: Download,
  link: Link,
  sun: Sun,
  fire: Fire,
  coffee: Coffee,
  move: Switch,
};

export type AgendaIconName = keyof typeof icons;

export function AgendaIcon({ name, className }: { name: AgendaIconName; className?: string }) {
  const Icon = icons[name];

  return <Icon className={className} width={24} height={24} aria-hidden="true" focusable="false" />;
}
