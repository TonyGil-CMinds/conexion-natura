import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { confirmationTemplateData } from '../src/features/registration/lib/confirmation-email';
import { inviteTemplateData } from '../src/features/registration/lib/invite-email';
import { eventEmailDetails } from '../src/features/registration/lib/event-email-details';
import { sendTemplate, type TemplateName } from '../src/lib/resend';
async function main() {
 const to = 'bryan@cminds.co';
 process.env.CEIBA_EMAIL_ALLOWLIST = to;
 const confirmation = confirmationTemplateData({name:'Bryan',surname:'(PRUEBA)',events:['NIGHT'],origin:'quito'});
 const invitation = inviteTemplateData({host:'Equipo CEIBA (PRUEBA)',guest:'Bryan (PRUEBA)',token:'prueba-sin-registro-real',locale:'es'});
 if (confirmation.missing.length || invitation.missing.length) throw new Error('Missing template data');
 const {details} = eventEmailDetails('quito');
 const waitlist = {username:'Bryan (PRUEBA)',con_acompanante:'',natura_date:details.natura_date,natura_time:details.natura_time,natura_venue:details.natura_venue,agenda_url:details.agenda_url,sitio_web_url:details.sitio_web_url,n500_url:details.n500_url};
 const jobs: {template:TemplateName;data:Record<string,string>}[] = [{template:'waitlistEs',data:waitlist},{template:'confirmation',data:confirmation.data},{template:'invite',data:invitation.data}];
 const results=[];
 for (const job of jobs) {
  const result=await sendTemplate({to,...job});
  results.push({template:job.template,...result});
  writeFileSync('tmp/bryan-test-email-results.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify({template:job.template,...result}));
  await new Promise(resolve=>setTimeout(resolve,1100));
 }
}
main().catch(()=>{console.error('Test send failed');process.exitCode=1;});
