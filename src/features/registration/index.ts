export { RegistrationFlow } from './components/RegistrationFlow';
export { JoinScreen } from './components/JoinScreen';
export { EventChoiceScreen } from './components/EventChoiceScreen';
export { DetailsScreen } from './components/DetailsScreen';
export { PhotoScreen } from './components/PhotoScreen';
export { WelcomeScreen } from './components/WelcomeScreen';
export { Registration } from './components/Registration';
export { RegistrationCta } from './components/RegistrationCta';
export { AttendanceProvider, useAttendance } from './context/attendance';
export type { Attendee } from './context/attendance';
/** La sube el navegador con una URL firmada. La usa también el retiro. */
export { uploadPhoto } from './lib/upload-photo';
/**
 * La credencial: el retiro la compone con su propio arte, y el registro de
 * empresas de Ecuador con el de la noche, que es `CEIBA_BADGE`.
 */
export { renderBadge, downloadBadge, shareBadge, CEIBA_BADGE, type BadgeArt } from './lib/badge';
export { addToCalendar, type CalendarTarget, type CalendarWhen } from './lib/calendar';
export { ProfileCard } from './components/ProfileCard';
export { readJoinDraft, saveJoinDraft, clearJoinDraft } from './lib/join-draft';
export type { JoinDraft, PersonDraft } from './lib/join-draft';
